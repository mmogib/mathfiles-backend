const Sequelize = require('sequelize')
const sequelize = require('./Base')
const TechnicalReport = sequelize.define(
  'TechnicalReport',
  {
    Tech_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    Tech_CODE: Sequelize.INTEGER,
    Tech_DCODE: Sequelize.STRING,
    Tech_Title: Sequelize.STRING,
    Tech_Authors: Sequelize.STRING,
    Tech_Year: Sequelize.INTEGER
  },
  {
    tableName: 'Tech_reports',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = TechnicalReport
