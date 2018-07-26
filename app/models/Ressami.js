const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Ressami = sequelize.define(
  'Ressami',
  {
    SAMI_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    SAMI_ATID: Sequelize.STRING,
    SAMI_TITLE: Sequelize.STRING
  },
  {
    tableName: 'Ressami',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = Ressami
