const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Course = require('./Course')
const Syllabus = sequelize.define(
  'Syllabus',
  {
    SYL_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    SYL_COURSE: Sequelize.STRING,
    SYL_SEMES: Sequelize.STRING
  },
  {
    tableName: 'Syllabus',
    updatedAt: false,
    createdAt: false
  }
)

Syllabus.belongsTo(Course, {
  foreignKey: 'SYL_COURSE',
  targetKey: 'ALC_COURSE'
})
module.exports = Syllabus
