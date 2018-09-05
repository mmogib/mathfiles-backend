require('dotenv').config()
const cron = require('node-cron')
const logger = require('./app/files/logger')
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
const { saveAllCourseFiles } = require('./app/files/course_files')
const { saveSyllabi } = require('./app/files/syllabi')
const { saveTechnicalReports } = require('./app/files/technical_reports')

logger.log('info', 'Started running ... ' + new Date().toLocaleString())
/*
Time to execute 
*/

const h = 0,
  m = 5,
  s = 0,
  increment_minutes = 5

// 1)
//save list of active faculty in files/faculty/faculty.json
// every day at 12:05:00 AM
let minutes = m + increment_minutes
cron.schedule(s + ' ' + minutes + ' ' + h + ' * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving active faculty in files at ${date}`)
  saveFaculty()
  logger.log('info', `start saving list of faculty ranks at ${date}`)
  saveAllRanks()
  logger.log('info', `start saving active faculty course files at ${date}`)
  saveFacultyCourseFiles()
  logger.log('info', `start saving active faculty publications at ${date}`)
  saveFacultyPublications()
  /*
  logger.log(
    'info',
    `start saving active faculty pictures in images at ${date}`
  )
  saveFacultyPics()
  */
})

// 2)
// save list of years in files/publications/years.json
// every day at 12:25:00 AM
minutes = minutes + increment_minutes
cron.schedule(s + ' ' + minutes + ' ' + h + ' * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving list of years at ${date}`)
  savePublicationsYears()
  logger.log('info', `start saving publications year by year at ${date}`)
  savePublications()
  logger.log('info', `start saving other authors at ${date}`)
  saveAllOtherAuthors()
  logger.log('info', `start saving syllabi at ${date}`)
  saveSyllabi()
})

// 3)
// save list of all course files in files/courseFiles/course_files.json
// every day at 12:45:00 AM
minutes = minutes + increment_minutes
cron.schedule(s + ' ' + minutes + ' ' + h + ' * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving list of all course files at ${date}`)
  saveAllCourseFiles()
  logger.log('info', `start saving list of all technical reports at ${date}`)
  saveTechnicalReports()
})
