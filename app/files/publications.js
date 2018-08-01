const fs = require('fs')
const sequelize = require('../models/Base')
const Publication = require('../models/Publication')
const Author = require('../models/Author')
const { getActiveFaculty } = require('./faculty.js')
const { createFolder, saveFiles } = require('./general.js')
module.exports = {
  async saveAllOtherAuthors() {
    const others = await _getAllOtherAuthors()
    let authors = {}
    others.forEach(author => {
      const { AUT_PubCode, AUT_NAME } = author
      if (!authors[AUT_PubCode]) {
        authors[AUT_PubCode] = []
      }
      authors[AUT_PubCode].push(AUT_NAME)
    })
    saveFiles('other_authors', 'publications', JSON.stringify(authors))
  },
  async savePublications() {
    const years = await _getPublicationsArray().catch(err => console.log(err))
    years.forEach(year => {
      _savePublications(year)
    })
  },
  async savePublicationsYears() {
    const years = await _getPublicationsYears().catch(err => console.log(err))
    let yearsArr = []
    years.forEach(yearObj => {
      const { PUB_Year: year } = yearObj
      yearsArr.push(year)
    })
    saveFiles('years', 'publications', JSON.stringify(yearsArr))
  },
  async getFacultyPublications(username) {
    return _getFacultyPublications(username)
  },
  async saveFacultyPublications() {
    const facultyArr = await getActiveFaculty().catch(err => console.log(err))
    facultyArr.forEach(async faculty => {
      const { Per_ATID: username } = faculty
      const pubs = await _getFacultyPublications(username).catch(error =>
        reject(error)
      )
      _saveFacultyPublications(username, pubs)
    })
  }
}

const _getFacultyArticles = username => {
  return new Promise((resolve, reject) => {
    Publication.findAll({
      order: [['PUB_Year', 'DESC']],
      include: [
        {
          model: Author,
          where: {
            AUT_ATID: username
          },
          as: 'authors'
        }
      ]
    })
      .then(array => {
        let listOFCodes = []
        array.forEach(one => {
          const { PUB_Year, PUB_IEEE, PUB_CODE } = one
          const tempObj = {
            year: PUB_Year,
            title: PUB_IEEE,
            code: PUB_CODE,
            authors: []
          }
          listOFCodes.push(tempObj)
        })
        resolve(listOFCodes)
      })
      .catch(error => reject(error))
  })
}

const _getAllOtherAuthors = code => {
  return sequelize.query(`select AUT_PubCode, AUT_NAME from PubAuthors`, {
    model: Author
  })
}

const _getOtherAuthorsOfArticle = code => {
  return sequelize.query(
    `select AUT_NAME from PubAuthors where AUT_PubCode=${code}`,
    {
      model: Author
    }
  )
}

const _updateArticleWithOtherAuthors = async articles => {
  return new Promise((res, rej) => {
    let proms = []
    articles.forEach(async article => {
      proms.push(
        new Promise(async (resolve, reject) => {
          const others = await _getOtherAuthorsOfArticle(article.code).catch(
            error => reject(error)
          )
          resolve({
            article,
            others
          })
        })
      )
    })
    Promise.all(proms)
      .then(array => {
        let list = []
        array.forEach(item => {
          const { article, others } = item
          others.forEach(author => {
            article.authors.push(author.get('AUT_NAME'))
          })
          list.push(article)
        })
        res(list)
      })
      .catch(err => rej(err))
  })
}

const _getFacultyPublications = async username => {
  return new Promise(async (resolve, reject) => {
    const articles = await _getFacultyArticles(username).catch(error =>
      reject(error)
    )
    const list = await _updateArticleWithOtherAuthors(articles).catch(error =>
      reject(error)
    )
    resolve(list)
  })
}

const _saveFacultyPublications = async (username, list) => {
  const file = `${username}.json`
  const folder = 'facultypublications'
  const facPubListProductionFolder = `${
    process.env.JSON_FILES_PRODUCTION
  }/${folder}`
  const facPubListDevFolder = `${process.env.JSON_FILES_DEV}/${folder}`

  const folderProductionExist = await createFolder(facPubListProductionFolder)
  const folderDevExist = await createFolder(facPubListDevFolder)
  if (!folderDevExist || !folderProductionExist) {
    console.log(`${file} was not saved ..`)
    return
  }

  const data = JSON.stringify(list)
  fs.writeFile(`${facPubListProductionFolder}/${file}`, data, err => {
    if (err) throw err
    console.log(`${facPubListProductionFolder}/${file} saved...`)
  })
  fs.writeFile(`${facPubListDevFolder}/${file}`, data, err => {
    if (err) throw err
    console.log(`${facPubListDevFolder}/${file} saved...`)
  })
}

const _getPublicationsYears = () => {
  return sequelize.query(
    "select distinct PUB_Year from PubWork where PUB_Year<>'' order by PUB_Year",
    {
      model: Publication
    }
  )
}
const _getPublicationsArray = async () => {
  const years = await _getPublicationsYears().catch(err => console.log(err))
  let array = []
  years.forEach(year => {
    const { PUB_Year } = year
    array.push(PUB_Year)
  })
  return array
}

const _getPublications = (year = null) => {
  const where = {}
  if (year) {
    where.PUB_Year = year
  }
  return Publication.findAll({
    where
  })
}

const _savePublications = async (year = null) => {
  const articles = await _getPublications(year).catch(err => console.log(err))
  let array = []
  let promises = []
  articles.forEach(async article => {
    const { PUB_IEEE: title, PUB_CODE: code } = article
    //promises.push(_getArticleWithAuthors(year, title, code))
    promises.push({ year, title, code })
  })
  Promise.all(promises)
    .then(tempArray => {
      tempArray.forEach(art => array.push(art))
      //console.log(array)
      saveFiles(year, 'publications', JSON.stringify(array))
    })
    .catch(err => console.log(err))
}

const _getArticleWithAuthors = async (year, title, code) => {
  return new Promise(async (resolve, reject) => {
    const others = await _getOtherAuthorsOfArticle(code).catch(err => {
      console.log(err)
      reject('something went wrong ...')
    })
    const temp = {
      title,
      code,
      year,
      authors: []
    }
    if (others) {
      others.forEach(author => {
        temp.authors.push(author.get('AUT_NAME'))
      })
    }
    resolve(temp)
  })
}
