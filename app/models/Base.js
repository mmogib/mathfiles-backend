const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = new Sequelize(
  process.env.MATHFILES_DB,
  process.env.MATHFILES_USER,
  process.env.MATHFILES_PW,
  {
    host: process.env.MATHFILES_HOST,
    dialect: 'mssql',
    operatorsAliases: Op,
    logging: false
    /*
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
*/
  }
)

module.exports = sequelize
