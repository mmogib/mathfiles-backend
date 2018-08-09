const Course = require('../models/Course')
const Syllabus = require('../models/Syllabus')
const { saveFiles } = require('./general')
module.exports = {
  saveSyllabi() {
    Syllabus.findAll({
      include: [
        {
          model: Course
        }
      ]
    }).then(rows => {
      let list = [],
        terms = []
      rows.forEach(row => {
        const { SYL_COURSE: course, SYL_SEMES: term, Course: courseObj } = row
        if (courseObj) {
          const { ALC_TITLE: title } = courseObj
          !terms.includes(term) && terms.push(term)
          list.push({ term, course, title })
        }
      })
      terms.sort((a, b) => {
        return parseInt(a) <= parseInt(b) ? 1 : -1
      })
      saveFiles('syllabus_terms', 'syllabi', JSON.stringify(terms))
      saveFiles('syllabus_links', 'syllabi', JSON.stringify(list))
    })
  }
}
