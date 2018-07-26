const fs = require('fs')
const path = require('path')
const Personal = require('../models/Personal')
const Rank = require('../models/Rank')
const Ressami = require('../models/Ressami')
module.exports = () => {
  let facultyList = []
  const file =
    process.env.NODE_ENV === 'production'
      ? '//196.15.32.100/home$/mathfiler/files/faculty2.json'
      : path.join(__dirname, '../data/faculty3.json')
  //const file = '//196.15.32.100/home$/mathfiler/files/faculty2.json'
  Personal.findAll({
    include: [
      {
        model: Rank
      }
    ],
    where: {
      Per_Status: 'Active',
      Per_Dgroup: 'Faculty'
    }
  })
    .then(cnt => cnt)
    .then(all => {
      all.forEach(faculty => {
        const {
          Rank,
          Per_ATID: username,
          Per_FullNameX: fullname,
          Per_EMAIL: email,
          Per_Title: title,
          Per_OTEL: officetel,
          Per_OffBldg: officebldg,
          Per_OffRoom: officeroom,
          Per_Box: postbox,
          Per_WebLoc: website
        } = faculty

        const { RAN_FULL: rank } = Rank
        const tempObj = {
          username,
          title,
          fullname,
          email,
          officetel,
          officebldg,
          officeroom,
          postbox,
          website,
          researchinterests: []
        }
        facultyList.push(tempObj)
      })
      let proms = []
      facultyList.forEach(faculty => {
        proms.push(
          new Promise((resolve, reject) => {
            Ressami.findAll({
              where: { SAMI_ATID: faculty.username }
            }).then(riArr => {
              riArr.forEach(ri => {
                const { SAMI_TITLE } = ri
                faculty.researchinterests.push(SAMI_TITLE)
              })
              resolve(faculty)
            })
          })
        )
      })
      Promise.all(proms)
        .then(array => {
          array.forEach(ri => {
            console.log(ri)
          })
        })
        .catch(error => console.log('error', error))
      /* fs.writeFile(file, JSON.stringify(facultyList), err => {
        if (err) throw err
        console.log(`${file} saved`)
      }) */
    })
}
