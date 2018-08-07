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
const { saveAllCourseFiles } = require('./app/files/course_files.js')

logger.log('info', 'Started running ... ' + new Date().toLocaleString())

// 1)
//save list of active faculty in files/faculty/faculty.json
// every day at 12:05:00 AM
cron.schedule('0 5 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving active faculty in files at ${date}`)
  saveFaculty()
})
// 2)
//save images of active faculty in images/
// every day at 12:10:00 AM
cron.schedule('0 10 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log(
    'info',
    `start saving active faculty pictures in images at ${date}`
  )
  saveFacultyPics()
})
// 3)
// save course files of active faculty in files/faculty/course_files.json
// every day at 12:15:00 AM
cron.schedule('0 15 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving active faculty course files at ${date}`)
  saveFacultyCourseFiles()
})
// 4)
// save publications of active faculty in files/faculty/publications/username.json
// every day at 12:20:00 AM
cron.schedule('0 20 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving active faculty publications at ${date}`)
  saveFacultyPublications()
})
// 5)
// save list of years in files/publications/years.json
// every day at 12:25:00 AM
cron.schedule('0 25 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving list of years at ${date}`)
  savePublicationsYears()
})
// 6)
// save list of years in files/publications/[2001].json
// every day at 12:30:00 AM
cron.schedule('0 30 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving publications year by year at ${date}`)
  savePublications()
})
// 7)
// // save list of years in files/publications/other_authors.json
// every day at 12:35:00 AM
cron.schedule('0 35 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving other authors at ${date}`)
  saveAllOtherAuthors()
})
// 8)
// // save list faculty ranks in files/faculty/ranks.json
// every day at 12:40:00 AM
cron.schedule('0 40 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving list of faculty ranks at ${date}`)
  saveAllRanks()
})
// 9)
// save list of all course files in files/courseFiles/course_files.json
// every day at 12:45:00 AM
cron.schedule('0 45 0 * * *', function() {
  const date = new Date().toLocaleString()
  logger.log('info', `start saving list of all course files at ${date}`)
  saveAllRanks()
})

//

//saveAllCourseFiles() //
