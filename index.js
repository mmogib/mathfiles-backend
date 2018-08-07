const cron = require('node-cron')
const { saveAllRanks } = require('./app/files/ranks')
const {
  saveFaculty,
  saveFacultyPics,
  saveFacultyCourseFiles
} = require('./app/files/faculty')
const {
  saveFacultyPublications,
  savePublicationsYears,
  savePublications,
  saveAllOtherAuthors
} = require('./app/files/publications')

const { saveAllCourseFiles } = require('./app/files/course_files.js')
//saveFaculty() // save list of active faculty in files/faculty/faculty.json
//saveFacultyCourseFiles() // save course files of active faculty in files/faculty/course_files.json
//saveFacultyPublications() // save publications of active faculty in files/faculty/publications/username.json
//savePublicationsYears() // save list of years in files/publications/years.json
//savePublications()// save list of years in files/publications/[2001].json
//saveAllOtherAuthors() // save list of years in files/publications/other_years.json

//cron.schedule('15 58 10 * * *', savePublicationsYears) // every day at 10:58:15
//saveAllRanks()

saveAllCourseFiles() // save list of years in files/courseFiles/course_files.json
