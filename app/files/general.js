const fs = require('fs')

module.exports = {
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
    const roductionExist = await _createFolder(productionFolder)
    const devExist = await _createFolder(devFolder)
    if (!roductionExist) {
      console.log(`${productionFolder} was not created ..`)
      return
    }

    if (!devExist) {
      console.log(`${devFolder} was not created ..`)
      return
    }

    fs.writeFile(`${productionFolder}/${file}`, data, err => {
      if (err) throw err
      console.log(`${productionFolder}/${file} saved...`)
    })
    fs.writeFile(`${devFolder}/${file}`, data, err => {
      if (err) throw err
      console.log(`${devFolder}/${file} saved...`)
    })
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
