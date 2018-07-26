const Sequelize = require('sequelize')
const sequelize = require('./Base')

const Rank = sequelize.define(
  'Rank',
  {
    RAN_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    RAN_CODE: Sequelize.STRING,
    RAN_FULL: Sequelize.STRING
  },
  {
    tableName: 'Ranks',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = Rank
