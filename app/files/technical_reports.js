const TechnicalReport = require('../models/TechnicalReport')
const { saveFiles } = require('./general')

module.exports = {
  saveTechnicalReports() {
    TechnicalReport.findAll({
      order: [
        ['Tech_Year', 'DESC'],
        ['Tech_Authors', 'ASC'],
        ['Tech_Title', 'ASC']
      ],
      where: {
        Tech_DCODE: 'MATH'
      }
    }).then(rows => {
      let list = []
      rows.forEach(row => {
        const {
          Tech_CODE: code,
          Tech_Title: title,
          Tech_Authors: authors,
          Tech_Year: year
        } = row

        list.push({
          code,
          title,
          authors,
          year
        })
      })
      saveFiles('technical_reports', 'TechnicalReports', JSON.stringify(list))
    })
  }
}
