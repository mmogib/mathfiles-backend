const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Course = sequelize.define(
  'Course',
  {
    ALC_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    ALC_COURSE: Sequelize.STRING,
    ALC_TITLE: Sequelize.STRING
  },
  {
    tableName: 'ALLCOURSES',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = Course
