require('dotenv').config()
const DB = require('../app/models/Base')
const { getAllCourseFiles } = require('../app/files/course_files')

describe('tests course-files.js', () => {
  beforeAll(() => {
    expect.assertions(2)
    return DB.query('select 1+1 as count', {
      type: DB.QueryTypes.SELECT
    }).then(result => expect(result[0].count).toEqual(2))
  })

  test('getting all course files', async () => {
    expect.assertions(2)
    const list = await getAllCourseFiles()
    expect(list[0]).toEqual(
      expect.objectContaining({
        term: expect.any(String)
      })
    )
  })
})
