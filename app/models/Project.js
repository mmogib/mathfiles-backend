const Sequelize = require('sequelize')
const sequelize = require('./Base')

const Project = sequelize.define(
  'FRProjects',
  {
    FRP_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    FRP_REF: Sequelize.STRING,
    FRP_Sponsor: Sequelize.STRING,
    FRP_Grant: Sequelize.STRING,
    FRP_TITLE: Sequelize.STRING,
    FRP_Duration: Sequelize.STRING,
    FRP_FMonth: Sequelize.STRING,
    FRP_FYear: Sequelize.STRING,
    FRP_TMonth: Sequelize.STRING,
    FRP_TYear: Sequelize.STRING,
    FRP_Status: Sequelize.STRING,
    FRP_Uatid: Sequelize.STRING
  },
  {
    tableName: 'FRProjects',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = Project
