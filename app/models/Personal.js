const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Rank = require('./Rank')
const Ressami = require('./Ressami')
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
  foreignKey: 'Per_RankCode',
  targetKey: 'RAN_CODE'
})

module.exports = Personal