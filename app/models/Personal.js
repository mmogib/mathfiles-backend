const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Rank = require('./Rank')
const FacultyCourseFile = require('./FacultyCourseFile')
const Personal = sequelize.define(
  'Personal',
  {
    Per_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    Per_DCODE: Sequelize.STRING,
    Per_ATID: Sequelize.STRING,
    Per_Status: Sequelize.STRING,
    Per_Rank: Sequelize.STRING,
    Per_Dgroup: Sequelize.STRING,
    Per_EMAIL: Sequelize.STRING,
    Per_FullNameX: Sequelize.STRING,
    Per_Title: Sequelize.STRING,
    Per_OTEL: Sequelize.STRING,
    Per_OffBldg: Sequelize.STRING,
    Per_OffRoom: Sequelize.STRING,
    Per_Box: Sequelize.STRING,
    Per_WebLoc: Sequelize.STRING,
    Per_RankCode: Sequelize.STRING
  },
  {
    tableName: 'Personal',
    updatedAt: false,
    createdAt: false
  }
)

Personal.belongsTo(Rank, {
  foreignKey: 'Per_Rank',
  targetKey: 'RAN_RANK'
})

Rank.belongsTo(Personal, {
  foreignKey: 'RAN_RANK',
  targetKey: 'Per_Rank'
})

Personal.belongsTo(FacultyCourseFile, {
  foreignKey: 'Per_ATID',
  targetKey: 'CFF_Atid'
})

module.exports = Personal
