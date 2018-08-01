const fs = require('fs')
const Personal = require('../models/Personal')
const Rank = require('../models/Rank')

const file = 'ranks.json'
const FILE_LOC_PRODUCTION = process.env.JSON_FILES_PRODUCTION + '/' + file
const FILE_LOC_DEV = process.env.JSON_FILES_DEV + '/' + file

module.exports = {
  getAllRanks() {
    return new Promise((resolve, reject) => {
      Rank.findAll({
        distinct: true,
        attributes: ['RAN_RANK', 'RAN_FULL'],
        include: [
          {
            model: Personal,

            attributes: [],
            where: {
              Per_Status: 'Active',
              Per_Dgroup: 'Faculty'
            }
          }
        ]
      })
        .then(ranksArr => {
          const ranks = {}
          ranksArr.forEach(rank => {
            const { RAN_RANK, RAN_FULL } = rank
            ranks[RAN_RANK] = RAN_FULL
          })
          let ranksArray = []
          Object.values(ranks).forEach(value => ranksArray.push(value))
          const data = JSON.stringify(ranksArray)
          fs.writeFile(FILE_LOC_PRODUCTION, data, err => {
            if (err) reject(err)
            console.log(`${FILE_LOC_PRODUCTION} saved ..`)
          })
          fs.writeFile(FILE_LOC_DEV, data, err => {
            if (err) reject(err)
            console.log(`${FILE_LOC_DEV} saved ..`)
          })
          resolve(true)
        })
        .catch(err => reject(false))
    })
  }
}
