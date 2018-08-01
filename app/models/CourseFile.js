const Sequelize = require('sequelize')
const sequelize = require('./Base')
const CourseFile = sequelize.define(
  'CourseFiles',
  {
    CFF_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    CFF_Atid: Sequelize.STRING,
    CFF_Course: Sequelize.STRING,
    CFF_Semes: Sequelize.STRING,
    CFF_Files: Sequelize.STRING
  },
  {
    tableName: 'CFFiles',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = CourseFile
