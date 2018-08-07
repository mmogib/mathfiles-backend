const CourseFile = require('../models/CourseFile')
const { saveFiles } = require('./general.js')
module.exports = {
  saveAllCourseFiles() {
    CourseFile.findAll().then(rows => {
      let list = []
      rows.forEach(row => {
        const {
          OFF_SEMESTER: term,
          OFF_COURSE: course,
          OFF_SECTION: section,
          OFF_EXAM: exam,
          OFF_TYPE: type
        } = row
        const foundTermIndex = list.findIndex(value => value.term == term)
        const file = {
          name: exam,
          link: `${course}_${term}_${section}_${exam}.${type}`
        }
        if (foundTermIndex < 0) {
          list.push({
            term,
            courses: [{ course, exams: [file] }]
          })
        } else {
          const courseIndex = _CoursesIncludeCourse(
            list[foundTermIndex].courses,
            course
          )
          if (courseIndex < 0) {
            list[foundTermIndex].courses.push({
              course,
              exams: [file]
            })
          } else {
            list[foundTermIndex].courses[courseIndex]['exams'].push(file)
          }
        }
      })
      saveFiles('course_files', 'courseFiles', JSON.stringify(list))
    })
  }
}

const _CoursesIncludeCourse = (courses, course) => {
  return courses.findIndex(value => value.course == course)
}
