const { Op } = require('sequelize')
const fs = require('fs')
const axios = require('axios')
const Personal = require('../models/Personal')
const Schedule = require('../models/Schedule')
const OfficeHour = require('../models/OfficeHour')
const Rank = require('../models/Rank')
const FacultyCourseFile = require('../models/FacultyCourseFile')
const Ressami = require('../models/Ressami')
const {
  getCurrentSemester,
  saveFiles,
  getCourseLinks
} = require('./general.js')
const logger = require('./logger')
const term = getCurrentSemester()
module.exports = {
  getActiveFaculty(limit = null) {
    return _getActiveFaculty(limit)
  },
  saveFacultyCourseFiles() {
    let courseFileList = {}
    Personal.findAll({
      include: [
        {
          model: FacultyCourseFile,
          where: {
            CFF_Files: { [Op.ne]: '' }
          }
        }
      ],
      where: {
        Per_Status: 'Active',
        Per_Dgroup: 'Faculty'
      }
    })
      .then(cf => cf)
      .then(cfiles => {
        cfiles.forEach(cf => {
          const { Per_ATID: username, CourseFile: courseFiles } = cf
          const {
            CFF_Course: course,
            CFF_Semes: term,
            CFF_Files: docString,
            CFF_Section: section,
            CFF_Linksec: link,
            CFF_Notes: notes
          } = courseFiles
          if (courseFileList[username]) {
            const docs = getCourseLinks(term, course, section, docString)
            courseFileList[username].push({
              username,
              course,
              term,
              section,
              link,
              notes,
              docs
            })
          } else {
            courseFileList[username] = []
          }
        })

        saveFiles('course_files', 'faculty', JSON.stringify(courseFileList))
      })
      .catch(error => logger.log('error', error))
  },
  async saveFacultyPics() {
    _getActiveFaculty()
      .then(cnt => cnt)
      .then(all => {
        all.forEach(faculty => {
          const { Per_ATID: username } = faculty
          const url = `${
            process.env.FACULTY_IMAGES_DOWNLOAD_URL
          }/${username}.jpg`
          const image_production = `${
            process.env.FACULTY_IMAGES_UPLOAD_URL_PRODUCTION
          }/${username}.jpg`
          const image_dev = `${
            process.env.FACULTY_IMAGES_UPLOAD_URL_DEV
          }/${username}.jpg`
          axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
          }).then(response => {
            response.data.pipe(fs.createWriteStream(image_production))
            if (process.NODE_ENV !== 'production') {
              response.data.pipe(fs.createWriteStream(image_dev))
            }

            // return a promise and resolve when download finishes
            response.data.on('end', () =>
              logger.log('info', `${username} saved`)
            )
            response.data.on('error', () =>
              logger.log('error', `${username} not saved`)
            )
          })
        })
      })
  },
  saveFaculty() {
    let facultyList = []
    _getActiveFaculty()
      .then(cnt => cnt)
      .then(all => {
        all.forEach(faculty => {
          const {
            Rank,
            Per_Rank: shortRank,
            Per_ATID: username,
            Per_FullNameX: fullname,
            Per_EMAIL: email,
            Per_Title: title,
            Per_OTEL: officetel,
            Per_OffBldg: officebldg,
            Per_OffRoom: officeroom,
            Per_Box: postbox,
            Per_WebLoc: website,
            Schedules: tempSchedule,
            OfficeHours: tempOh
          } = faculty
          const schedule = _formatSchedule(tempSchedule)
          const officehours = _formatOfficeHour(tempOh)
          const { RAN_FULL: rank } = Rank
          const tempObj = {
            username,
            title,
            fullname,
            email,
            officetel,
            officebldg,
            officeroom,
            postbox,
            website,
            rank,
            shortRank,
            schedule,
            officehours,
            researchinterests: [],
            publications: []
          }
          facultyList.push(tempObj)
        })
        let proms = []
        facultyList.forEach(faculty => {
          proms.push(
            new Promise((resolve, reject) => {
              Ressami.findAll({
                where: { SAMI_ATID: faculty.username }
              }).then(riArr => {
                riArr.forEach(ri => {
                  const { SAMI_TITLE } = ri
                  faculty.researchinterests.push(SAMI_TITLE)
                })
                const tempRIARR = faculty.researchinterests.filter(
                  (value, index, self) => {
                    return self.indexOf(value) === index
                  }
                )
                faculty.researchinterests = tempRIARR
                resolve(faculty)
              })
            })
          )
        })
        Promise.all(proms)
          .then(array => {
            let list = []
            array.forEach(ri => {
              list.push(ri)
            })

            saveFiles('faculty', 'faculty', JSON.stringify(list))
          })
          .catch(error => logger.log('error', error))
        /* 
      }) */
      })
  }
}

const _getActiveFaculty = (limit = null) => {
  return Personal.findAll({
    limit,
    include: [
      {
        model: Rank
      },
      {
        model: Schedule,
        where: {
          SCH_SEMES: term
        },
        required: false
      },
      {
        model: OfficeHour,
        where: {
          OFF_SEMES: term
        },
        required: false
      }
    ],
    where: {
      Per_Status: 'Active',
      Per_Dgroup: 'Faculty'
    }
  })
}

const _formatSchedule = schedule => {
  const am = new RegExp(/AM/, 'i')
  const pm = new RegExp(/PM/, 'i')
  let temp = []
  Object.values(schedule).forEach(row => {
    const start_hour = row['SCH_SHOUR'].match(am)
      ? row['SCH_SHOUR'].replace(am, '').trim()
      : row['SCH_SHOUR'].replace(pm, '').trim()
    const start_ampm = row['SCH_SHOUR'].match(am) ? 'AM' : 'PM'
    const end_hour = row['SCH_EHOUR'].match(am)
      ? row['SCH_EHOUR'].replace(am, '').trim()
      : row['SCH_EHOUR'].replace(pm, '').trim()
    const end_ampm = row['SCH_EHOUR'].match(am) ? 'AM' : 'PM'
    const {
      SCH_ATID: username,
      SCH_COURSE: course,
      SCH_SEMES: term,
      SCH_SECTION: section,
      SCH_SMIN: start_minutes,
      SCH_EMIN: end_minutes,
      SCH_PLACE: place,
      SCH_DAYS: days,
      SCH_TYPE: type,
      SCH_NOTES: note
    } = row
    temp.push({
      username,
      course,
      term,
      section,
      start_hour,
      start_minutes,
      start_ampm,
      end_hour,
      end_minutes,
      end_ampm,
      days,
      place,
      type,
      note
    })
  })
  return temp
}

const _formatOfficeHour = officehours => {
  if (!officehours[0]) return null
  let sun = [],
    mon = [],
    tue = [],
    wed = [],
    thu = []
  const {
    OFF_ATID: username,
    OFF_SEMES: term,
    OFF_LOC: office_location,
    OFF_TEL: phone,
    OFF_Notes: note,
    OFF_S1,
    OFF_S2,
    OFF_S3,
    OFF_S4,
    OFF_S5,
    OFF_S6,
    OFF_S7,
    OFF_S8,
    OFF_U1,
    OFF_U2,
    OFF_U3,
    OFF_U4,
    OFF_U5,
    OFF_U6,
    OFF_U7,
    OFF_U8,
    OFF_M1,
    OFF_M2,
    OFF_M3,
    OFF_M4,
    OFF_M5,
    OFF_M6,
    OFF_M7,
    OFF_M8,
    OFF_T1,
    OFF_T2,
    OFF_T3,
    OFF_T4,
    OFF_T5,
    OFF_T6,
    OFF_T7,
    OFF_T8,
    OFF_W1,
    OFF_W2,
    OFF_W3,
    OFF_W4,
    OFF_W5,
    OFF_W6,
    OFF_W7,
    OFF_W8,
    OFF_R1,
    OFF_R2,
    OFF_R3,
    OFF_R4,
    OFF_R5,
    OFF_R6,
    OFF_R7,
    OFF_R8
  } = officehours[0]

  if (OFF_S1.length > 0) sun.push(`${OFF_S1}:${OFF_S2}-${OFF_S3}:${OFF_S4}`)
  if (OFF_S5.length > 0) sun.push(`${OFF_S5}:${OFF_S6}-${OFF_S7}:${OFF_S8}`)
  if (OFF_U1.length > 0) mon.push(`${OFF_U1}:${OFF_U2}-${OFF_U3}:${OFF_U4}`)
  if (OFF_U5.length > 0) mon.push(`${OFF_U5}:${OFF_U6}-${OFF_U7}:${OFF_U8}`)
  if (OFF_M1.length > 0) tue.push(`${OFF_M1}:${OFF_M2}-${OFF_M3}:${OFF_M4}`)
  if (OFF_M5.length > 0) tue.push(`${OFF_M5}:${OFF_M6}-${OFF_M7}:${OFF_M8}`)
  if (OFF_T1.length > 0) wed.push(`${OFF_T1}:${OFF_T2}-${OFF_T3}:${OFF_T4}`)
  if (OFF_T5.length > 0) wed.push(`${OFF_T5}:${OFF_T6}-${OFF_T7}:${OFF_T8}`)
  if (OFF_W1.length > 0) thu.push(`${OFF_W1}:${OFF_W2}-${OFF_W3}:${OFF_W4}`)
  if (OFF_W5.length > 0) thu.push(`${OFF_W5}:${OFF_W6}-${OFF_W7}:${OFF_W8}`)

  return {
    username,
    term,
    office_location,
    phone,
    note,
    sun,
    mon,
    tue,
    wed,
    thu
  }
}
