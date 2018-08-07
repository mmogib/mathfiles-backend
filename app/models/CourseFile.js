const Sequelize = require('sequelize')
const sequelize = require('./Base')
const CourseFile = sequelize.define(
  'CourseFile',
  {
    OFF_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    OFF_SEMESTER: Sequelize.STRING,
    OFF_COURSE: Sequelize.STRING,
    OFF_EXAM: Sequelize.STRING,
    OFF_TYPE: Sequelize.STRING,
    OFF_SECTION: Sequelize.STRING
  },
  {
    tableName: 'CFF_CourseOffered',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = CourseFile
