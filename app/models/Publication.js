const Sequelize = require('sequelize')
const sequelize = require('./Base')
const Author = require('../models/Author')

const Publication = sequelize.define(
  'PubWork',
  {
    Pub_SNO: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    PUB_CODE: Sequelize.INTEGER,
    PUB_Year: Sequelize.INTEGER,
    PUB_IEEE: Sequelize.STRING
  },
  {
    tableName: 'PubWork',
    updatedAt: false,
    createdAt: false
  }
)

Publication.belongsTo(Author, {
  foreignKey: 'PUB_CODE',
  targetKey: 'AUT_PubCode',
  as: 'authors'
})
module.exports = Publication
