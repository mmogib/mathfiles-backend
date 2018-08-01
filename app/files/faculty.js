const { Op } = require('sequelize')
const fs = require('fs')
const axios = require('axios')
const Personal = require('../models/Personal')
const Schedule = require('../models/Schedule')
const OfficeHour = require('../models/OfficeHour')
const Rank = require('../models/Rank')
const CourseFile = require('../models/CourseFile')
const Ressami = require('../models/Ressami')
const { getCurrentSemester } = require('./general.js')
const term = getCurrentSemester()
module.exports = {
  getActiveFaculty(limit = null) {
    return _getActiveFaculty(limit)
  },
  getCourseFiles() {
    let courseFileList = {}
    Personal.findAll({
      include: [
        {
          model: CourseFile,
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
            CFF_Files: docs
          } = courseFiles
          if (courseFileList[username]) {
            courseFileList[username].push({ username, course, docs, term })
          } else {
            courseFileList[username] = []
          }
          //console.log(username, course, docs, term)
        })
        let list = []
        Object.keys(courseFileList).forEach(username => {
          const temp = {}
          temp[username] = courseFileList[username]
          list.push(temp)
        })
        console.log(list)
      })
  },
  async saveFacultyPics() {
    _getActiveFaculty()
      .then(cnt => cnt)
      .then(all => {
        all.forEach(faculty => {
          const { Per_ATID: username } = faculty
          console.log(username)
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
            response.data.pipe(fs.createWriteStream(image_dev))

            // return a promise and resolve when download finishes
            response.data.on('end', () => console.log(`save ${username}`))
            response.data.on('error', () => console.log(`error in ${username}`))
          })
        })
      })
  },
  saveFaculty() {
    let facultyList = []
    const file_production = `${process.env.JSON_FILES_PRODUCTION}/faculty.json`
    const file_dev = `${process.env.JSON_FILES_DEV}/faculty.json`
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
            Schedules: schedule,
            OfficeHours: officehours
          } = faculty

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
                /*FacultyPublications(faculty.username).then(list => {
                  faculty.publications = list
                  resolve(faculty)
                })*/
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
            fs.writeFile(file_production, JSON.stringify(list), err => {
              if (err) throw err
              console.log(`${file_production} saved for production`)
            })
            fs.writeFile(file_dev, JSON.stringify(list), err => {
              if (err) throw err
              console.log(`${file_dev} saved for dev`)
            })
          })
          .catch(error => console.log('error', error))
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
          SCH_SEMES: '092'
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
