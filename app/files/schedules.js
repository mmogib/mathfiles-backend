const Schedule = require('../models/Schedule')
const Personal = require('../models/Personal')
const { getCurrentSemester } = require('./general.js')
const term = getCurrentSemester()
module.exports = {
  saveFacultySchedules() {
    Personal.find({
      where: {
        Per_ATID: 'mshahrani'
      },
      include: [
        {
          model: Schedule,
          where: {
            SCH_SEMES: term
          },
          required: false
        }
      ]
    }).then(faculty => {
      console.log(faculty.toJSON())
    })
    /* Schedule.findAll({
      include: [
        {
          model: Personal
        }
      ],
      where: {
        SCH_SEMES: '082'
      }
    }).then(rows => {
      rows.forEach(row => {
        console.log(row.toJSON())
      })
    }) */
  }
}
