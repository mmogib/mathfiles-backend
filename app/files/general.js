const fs = require('fs')
const logger = require('./logger')

module.exports = {
  getCourseLinks(term, course, section, docsString) {
    ////172/coursefile_data/MATH102_172_41_Q1.pdf
    let temp1 = [],
      pdfs = [],
      msdocs = []
    temp1 = docsString.split('p')
    if (temp1.length == 0) {
      temp1 = [docsString]
    }
    temp1.forEach(temp => {
      const dcs = temp.split('d')
      if (dcs.length > 1) {
        msdocs = [...msdocs, ...dcs.slice(0, dcs.length - 1)]
      } else {
        pdfs.push(temp)
      }
    })
    pdfs = pdfs.slice(0, pdfs.length - 1)
    let docs = []
    if (pdfs.length > 0) {
      pdfs.map(value => {
        docs.push({
          name: value,
          link: `${course}_${term}_${section}_${value}.pdf`
        })
      })
    }
    if (msdocs.length > 0) {
      msdocs.map(value => {
        docs.push({
          name: value,
          link: `${course}_${term}_${section}_${value}.doc`
        })
      })
    }
    docs = docs.sort((a, b) => a.name >= b.name)
    return docs
  },
  getCurrentSemester() {
    const now = new Date()
    const timeNow = now.getTime()
    let year = parseInt(
      now
        .getFullYear()
        .toString()
        .substr(-2)
    )
    const nextFallStart = new Date(`9/1/${year}`).getTime()
    const prevSummerStart = new Date(`6/1/${year}`).getTime()
    const prevSpringStart = new Date(`2/1/${year}`).getTime()
    const prevFallStart = new Date(`9/1/${year - 1}`).getTime()
    let term = ''
    if (timeNow >= prevFallStart && timeNow < prevSpringStart) {
      term = `${year - 1}1`
    } else if (timeNow >= prevSpringStart && timeNow < prevSummerStart) {
      term = `${year - 1}2`
    } else if (timeNow >= prevSummerStart && timeNow < nextFallStart) {
      term = `${year - 1}3`
    } else {
      term = `${year}1`
    }

    return term
  },

  async saveFiles(base, folder, data) {
    const file = `${base}.json`
    const productionFolder = `${process.env.JSON_FILES_PRODUCTION}/${folder}`
    const devFolder = `${process.env.JSON_FILES_DEV}/${folder}`
    if (process.env.NODE_ENV !== 'production') {
      const devExist = await _createFolder(devFolder)
      if (devExist) {
        fs.writeFile(`${devFolder}/${file}`, data, err => {
          if (err) logger.log('error', err)
          logger.log('info', `${devFolder}/${file} saved...`)
        })
      } else {
        logger.log('error', `${devFolder} was not created ..`)
      }
    }
    const productionExist = await _createFolder(productionFolder)
    if (productionExist) {
      fs.writeFile(`${productionFolder}/${file}`, data, err => {
        if (err) logger.log('error', err)
        logger.log('info', `${productionFolder}/${file} saved...`)
      })
    } else {
      logger.log('error', `${productionFolder} was not created ..`)
    }
  },
  createFolder(path) {
    _createFolder(path)
  }
}

const _createFolder = path => {
  return new Promise(resolve => {
    fs.exists(path, exists => {
      if (exists) {
        resolve(true)
      } else {
        fs.mkdir(path, err => {
          if (err) resolve(false)
          resolve(true)
        })
      }
    })
  })
}
