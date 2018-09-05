const CourseFile = require('../models/CourseFile')
const { saveFiles } = require('./general')
const logger = require('./logger')

module.exports = {
  getAllCourseFiles() {
    return _getAllCourseFiles()
  },
  async saveAllCourseFiles() {
    const list = await _getAllCourseFiles()
    if (list != null) {
      saveFiles('course_files', 'courseFiles', JSON.stringify(list))
    } else {
      logger.log(
        'error',
        'No course files were retrieved and no files were saved ..'
      )
    }
  }
}

const _CoursesIncludeCourse = (courses, course) => {
  return courses.findIndex(value => value.course == course)
}

const _getAllCourseFiles = () => {
  return new Promise(resolve => {
    CourseFile.findAll()
      .then(rows => {
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
        resolve(list)
      })
      .catch(() => resolve(null))
  })
}
