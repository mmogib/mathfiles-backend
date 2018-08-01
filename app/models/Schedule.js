const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Personal = require('./Personal')
const Schedule = sequelize.define(
  'Schedule',
  {
    SCH_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    SCH_ATID: Sequelize.STRING,
    SCH_COURSE: Sequelize.STRING,
    SCH_SEMES: Sequelize.STRING,
    SCH_SECTION: Sequelize.INTEGER,
    SCH_SHOUR: Sequelize.STRING,
    SCH_SMIN: Sequelize.STRING,
    SCH_EHOUR: Sequelize.STRING,
    SCH_EMIN: Sequelize.STRING,
    SCH_PLACE: Sequelize.STRING,
    SCH_DAYS: Sequelize.STRING,
    SCH_TYPE: Sequelize.STRING,
    SCH_NOTES: Sequelize.STRING
  },
  {
    tableName: 'Schedule',
    updatedAt: false,
    createdAt: false
  }
)

Schedule.belongsTo(Personal, {
  foreignKey: 'SCH_ATID',
  targetKey: 'Per_ATID'
})

Personal.hasMany(Schedule, {
  foreignKey: 'SCH_ATID',
  sourceKey: 'Per_ATID'
})
module.exports = Schedule
