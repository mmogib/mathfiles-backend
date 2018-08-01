const { getAllRanks } = require('./app/files/ranks')
const {
  saveFaculty,
  saveFacultyPics,
  getCourseFiles,
  getActiveFaculty
} = require('./app/files/faculty')
const {
  getFacultyPublications,
  saveFacultyPublications,
  savePublicationsYears,
  savePublications,
  saveAllOtherAuthors
} = require('./app/files/publications')

const { saveFacultySchedules } = require('./app/files/schedules')

//saveFacultySchedules()
//getCourseFiles()

saveFaculty()
//saveFacultyPics()
//saveFacultyPublications()

//getAllRanks()

//savePublicationsYears()
//savePublications()
//saveAllOtherAuthors()
