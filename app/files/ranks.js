const fs = require('fs')
const Personal = require('../models/Personal')
const Rank = require('../models/Rank')
const { saveFiles } = require('./general')

module.exports = {
  saveAllRanks() {
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
          saveFiles('ranks', 'faculty', data)
          resolve(true)
        })
        .catch(err => reject(false))
    })
  }
}
