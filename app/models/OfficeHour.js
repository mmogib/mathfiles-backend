const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Personal = require('./Personal')
const OfficeHour = sequelize.define(
  'OfficeHour',
  {
    OFF_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    OFF_ATID: Sequelize.STRING,
    OFF_SEMES: Sequelize.STRING,
    OFF_LOC: Sequelize.STRING,
    OFF_TEL: Sequelize.STRING,
    OFF_S1: Sequelize.STRING,
    OFF_S2: Sequelize.STRING,
    OFF_S3: Sequelize.STRING,
    OFF_S4: Sequelize.STRING,
    OFF_S5: Sequelize.STRING,
    OFF_S6: Sequelize.STRING,
    OFF_S7: Sequelize.STRING,
    OFF_S8: Sequelize.STRING,
    OFF_U1: Sequelize.STRING,
    OFF_U2: Sequelize.STRING,
    OFF_U3: Sequelize.STRING,
    OFF_U4: Sequelize.STRING,
    OFF_U5: Sequelize.STRING,
    OFF_U6: Sequelize.STRING,
    OFF_U7: Sequelize.STRING,
    OFF_U8: Sequelize.STRING,
    OFF_M1: Sequelize.STRING,
    OFF_M2: Sequelize.STRING,
    OFF_M3: Sequelize.STRING,
    OFF_M4: Sequelize.STRING,
    OFF_M5: Sequelize.STRING,
    OFF_M6: Sequelize.STRING,
    OFF_M7: Sequelize.STRING,
    OFF_M8: Sequelize.STRING,
    OFF_T1: Sequelize.STRING,
    OFF_T2: Sequelize.STRING,
    OFF_T3: Sequelize.STRING,
    OFF_T4: Sequelize.STRING,
    OFF_T5: Sequelize.STRING,
    OFF_T6: Sequelize.STRING,
    OFF_T7: Sequelize.STRING,
    OFF_T8: Sequelize.STRING,
    OFF_W1: Sequelize.STRING,
    OFF_W2: Sequelize.STRING,
    OFF_W3: Sequelize.STRING,
    OFF_W4: Sequelize.STRING,
    OFF_W5: Sequelize.STRING,
    OFF_W6: Sequelize.STRING,
    OFF_W7: Sequelize.STRING,
    OFF_W8: Sequelize.STRING,
    OFF_R1: Sequelize.STRING,
    OFF_R2: Sequelize.STRING,
    OFF_R3: Sequelize.STRING,
    OFF_R4: Sequelize.STRING,
    OFF_R5: Sequelize.STRING,
    OFF_R6: Sequelize.STRING,
    OFF_R7: Sequelize.STRING,
    OFF_R8: Sequelize.STRING,
    OFF_Notes: Sequelize.STRING,
    OFF_FLAG: Sequelize.STRING
  },
  {
    tableName: 'OfficeHours',
    updatedAt: false,
    createdAt: false
  }
)

OfficeHour.belongsTo(Personal, {
  foreignKey: 'OFF_ATID',
  targetKey: 'Per_ATID'
})

Personal.hasMany(OfficeHour, {
  foreignKey: 'OFF_ATID',
  sourceKey: 'Per_ATID'
})
module.exports = OfficeHour
