const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Author = sequelize.define(
  'PubAuthors',
  {
    AUT_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    AUT_PubCode: Sequelize.INTEGER,
    AUT_ATID: {
      type: Sequelize.STRING,
      allowNull: true
    },
    AUT_NAME: Sequelize.STRING
  },
  {
    tableName: 'PubAuthors',
    updatedAt: false,
    createdAt: false
  }
)

module.exports = Author
