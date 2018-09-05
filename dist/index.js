// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"app\\files\\logger.js":[function(require,module,exports) {
const winston = require('winston');
const loggingFile = `${process.env.JSON_FILES_PRODUCTION}/logs`;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
  //
  // - Write to all logs with level `info` and below to `combined.log`
  // - Write all logs error (and below) to `error.log`.
  //
  new winston.transports.File({
    filename: `${loggingFile}/error.log`,
    level: 'error'
  }), new winston.transports.File({
    filename: `${loggingFile}/combined.log`
  }), new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info'
  })]
});

module.exports = logger;
},{}],"app\\models\\Base.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize(process.env.MATHFILES_DB, process.env.MATHFILES_USER, process.env.MATHFILES_PW, {
  host: process.env.MATHFILES_HOST,
  dialect: 'mssql',
  operatorsAliases: Op,
  logging: false
  /*
  pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
  },
  */
});

module.exports = sequelize;
},{}],"app\\models\\Rank.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');

const Rank = sequelize.define('Rank', {
  RAN_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  RAN_CODE: Sequelize.STRING,
  RAN_FULL: Sequelize.STRING,
  RAN_RANK: Sequelize.STRING
}, {
  tableName: 'Ranks',
  updatedAt: false,
  createdAt: false
});

module.exports = Rank;
},{"./Base":"app\\models\\Base.js"}],"app\\models\\FacultyCourseFile.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const FacultyCourseFile = sequelize.define('FacultyCourseFile', {
  CFF_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  CFF_Atid: Sequelize.STRING,
  CFF_Course: Sequelize.STRING,
  CFF_Semes: Sequelize.STRING,
  CFF_Section: Sequelize.STRING,
  CFF_Linksec: Sequelize.STRING,
  CFF_Notes: Sequelize.STRING,
  CFF_Files: Sequelize.STRING
}, {
  tableName: 'CFFiles',
  updatedAt: false,
  createdAt: false
});

module.exports = FacultyCourseFile;
},{"./Base":"app\\models\\Base.js"}],"app\\models\\Personal.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Rank = require('./Rank');
const FacultyCourseFile = require('./FacultyCourseFile');
const Personal = sequelize.define('Personal', {
  Per_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  Per_DCODE: Sequelize.STRING,
  Per_ATID: Sequelize.STRING,
  Per_Status: Sequelize.STRING,
  Per_Rank: Sequelize.STRING,
  Per_Dgroup: Sequelize.STRING,
  Per_EMAIL: Sequelize.STRING,
  Per_FullNameX: Sequelize.STRING,
  Per_Title: Sequelize.STRING,
  Per_OTEL: Sequelize.STRING,
  Per_OffBldg: Sequelize.STRING,
  Per_OffRoom: Sequelize.STRING,
  Per_Box: Sequelize.STRING,
  Per_WebLoc: Sequelize.STRING,
  Per_RankCode: Sequelize.STRING
}, {
  tableName: 'Personal',
  updatedAt: false,
  createdAt: false
});

Personal.belongsTo(Rank, {
  foreignKey: 'Per_Rank',
  targetKey: 'RAN_RANK'
});

Rank.belongsTo(Personal, {
  foreignKey: 'RAN_RANK',
  targetKey: 'Per_Rank'
});

Personal.belongsTo(FacultyCourseFile, {
  foreignKey: 'Per_ATID',
  targetKey: 'CFF_Atid'
});

module.exports = Personal;
},{"./Base":"app\\models\\Base.js","./Rank":"app\\models\\Rank.js","./FacultyCourseFile":"app\\models\\FacultyCourseFile.js"}],"app\\files\\general.js":[function(require,module,exports) {
const fs = require('fs');
const logger = require('./logger');

module.exports = {
  getCourseLinks(term, course, section, docsString) {
    ////172/coursefile_data/MATH102_172_41_Q1.pdf
    let temp1 = [],
        pdfs = [],
        msdocs = [];
    temp1 = docsString.split('p');
    if (temp1.length == 0) {
      temp1 = [docsString];
    }
    temp1.forEach(temp => {
      const dcs = temp.split('d');
      if (dcs.length > 1) {
        msdocs = [...msdocs, ...dcs.slice(0, dcs.length - 1)];
      } else {
        pdfs.push(temp);
      }
    });
    pdfs = pdfs.slice(0, pdfs.length - 1);
    let docs = [];
    if (pdfs.length > 0) {
      pdfs.map(value => {
        docs.push({
          name: value,
          link: `${course}_${term}_${section}_${value}.pdf`
        });
      });
    }
    if (msdocs.length > 0) {
      msdocs.map(value => {
        docs.push({
          name: value,
          link: `${course}_${term}_${section}_${value}.doc`
        });
      });
    }
    docs = docs.sort((a, b) => a.name >= b.name);
    return docs;
  },
  getCurrentSemester() {
    const now = new Date();
    const timeNow = now.getTime();
    let year = parseInt(now.getFullYear().toString().substr(-2));
    const nextFallStart = new Date(`9/1/${year}`).getTime();
    const prevSummerStart = new Date(`6/1/${year}`).getTime();
    const prevSpringStart = new Date(`2/1/${year}`).getTime();
    const prevFallStart = new Date(`9/1/${year - 1}`).getTime();
    let term = '';
    if (timeNow >= prevFallStart && timeNow < prevSpringStart) {
      term = `${year - 1}1`;
    } else if (timeNow >= prevSpringStart && timeNow < prevSummerStart) {
      term = `${year - 1}2`;
    } else if (timeNow >= prevSummerStart && timeNow < nextFallStart) {
      term = `${year - 1}3`;
    } else {
      term = `${year}1`;
    }

    return term;
  },

  async saveFiles(base, folder, data) {
    const file = `${base}.json`;
    const productionFolder = `${process.env.JSON_FILES_PRODUCTION}/${folder}`;
    const devFolder = `${process.env.JSON_FILES_DEV}/${folder}`;
    if (process.env.NODE_ENV !== 'production') {
      const devExist = await _createFolder(devFolder);
      if (devExist) {
        fs.writeFile(`${devFolder}/${file}`, data, err => {
          if (err) logger.log('error', err);
          logger.log('info', `${devFolder}/${file} saved...`);
        });
      } else {
        logger.log('error', `${devFolder} was not created ..`);
      }
    }
    const productionExist = await _createFolder(productionFolder);
    if (productionExist) {
      fs.writeFile(`${productionFolder}/${file}`, data, err => {
        if (err) logger.log('error', err);
        logger.log('info', `${productionFolder}/${file} saved...`);
      });
    } else {
      logger.log('error', `${productionFolder} was not created ..`);
    }
  },
  createFolder(path) {
    _createFolder(path);
  }
};

const _createFolder = path => {
  return new Promise(resolve => {
    fs.exists(path, exists => {
      if (exists) {
        resolve(true);
      } else {
        fs.mkdir(path, err => {
          if (err) resolve(false);
          resolve(true);
        });
      }
    });
  });
};
},{"./logger":"app\\files\\logger.js"}],"app\\files\\ranks.js":[function(require,module,exports) {
const fs = require('fs');
const Personal = require('../models/Personal');
const Rank = require('../models/Rank');
const { saveFiles } = require('./general');

module.exports = {
  saveAllRanks() {
    return new Promise((resolve, reject) => {
      Rank.findAll({
        distinct: true,
        attributes: ['RAN_RANK', 'RAN_FULL'],
        include: [{
          model: Personal,

          attributes: [],
          where: {
            Per_Status: 'Active',
            Per_Dgroup: 'Faculty'
          }
        }]
      }).then(ranksArr => {
        const ranks = {};
        ranksArr.forEach(rank => {
          const { RAN_RANK, RAN_FULL } = rank;
          ranks[RAN_RANK] = RAN_FULL;
        });
        let ranksArray = [];
        Object.values(ranks).forEach(value => ranksArray.push(value));
        const data = JSON.stringify(ranksArray);
        saveFiles('ranks', 'faculty', data);
        resolve(true);
      }).catch(err => reject(false));
    });
  }
};
},{"../models/Personal":"app\\models\\Personal.js","../models/Rank":"app\\models\\Rank.js","./general":"app\\files\\general.js"}],"app\\models\\Schedule.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Personal = require('./Personal');
const Schedule = sequelize.define('Schedule', {
  SCH_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  SCH_ATID: Sequelize.STRING,
  SCH_COURSE: Sequelize.STRING,
  SCH_SEMES: Sequelize.STRING,
  SCH_SECTION: Sequelize.INTEGER,
  SCH_SHOUR: Sequelize.STRING,
  SCH_SMIN: Sequelize.STRING,
  SCH_EHOUR: Sequelize.STRING,
  SCH_EMIN: Sequelize.STRING,
  SCH_PLACE: Sequelize.STRING,
  SCH_DAYS: Sequelize.STRING,
  SCH_TYPE: Sequelize.STRING,
  SCH_NOTES: Sequelize.STRING
}, {
  tableName: 'Schedule',
  updatedAt: false,
  createdAt: false
});

Schedule.belongsTo(Personal, {
  foreignKey: 'SCH_ATID',
  targetKey: 'Per_ATID'
});

Personal.hasMany(Schedule, {
  foreignKey: 'SCH_ATID',
  sourceKey: 'Per_ATID'
});
module.exports = Schedule;
},{"./Base":"app\\models\\Base.js","./Personal":"app\\models\\Personal.js"}],"app\\models\\OfficeHour.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Personal = require('./Personal');
const OfficeHour = sequelize.define('OfficeHour', {
  OFF_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  OFF_ATID: Sequelize.STRING,
  OFF_SEMES: Sequelize.STRING,
  OFF_LOC: Sequelize.STRING,
  OFF_TEL: Sequelize.STRING,
  OFF_S1: Sequelize.STRING,
  OFF_S2: Sequelize.STRING,
  OFF_S3: Sequelize.STRING,
  OFF_S4: Sequelize.STRING,
  OFF_S5: Sequelize.STRING,
  OFF_S6: Sequelize.STRING,
  OFF_S7: Sequelize.STRING,
  OFF_S8: Sequelize.STRING,
  OFF_U1: Sequelize.STRING,
  OFF_U2: Sequelize.STRING,
  OFF_U3: Sequelize.STRING,
  OFF_U4: Sequelize.STRING,
  OFF_U5: Sequelize.STRING,
  OFF_U6: Sequelize.STRING,
  OFF_U7: Sequelize.STRING,
  OFF_U8: Sequelize.STRING,
  OFF_M1: Sequelize.STRING,
  OFF_M2: Sequelize.STRING,
  OFF_M3: Sequelize.STRING,
  OFF_M4: Sequelize.STRING,
  OFF_M5: Sequelize.STRING,
  OFF_M6: Sequelize.STRING,
  OFF_M7: Sequelize.STRING,
  OFF_M8: Sequelize.STRING,
  OFF_T1: Sequelize.STRING,
  OFF_T2: Sequelize.STRING,
  OFF_T3: Sequelize.STRING,
  OFF_T4: Sequelize.STRING,
  OFF_T5: Sequelize.STRING,
  OFF_T6: Sequelize.STRING,
  OFF_T7: Sequelize.STRING,
  OFF_T8: Sequelize.STRING,
  OFF_W1: Sequelize.STRING,
  OFF_W2: Sequelize.STRING,
  OFF_W3: Sequelize.STRING,
  OFF_W4: Sequelize.STRING,
  OFF_W5: Sequelize.STRING,
  OFF_W6: Sequelize.STRING,
  OFF_W7: Sequelize.STRING,
  OFF_W8: Sequelize.STRING,
  OFF_R1: Sequelize.STRING,
  OFF_R2: Sequelize.STRING,
  OFF_R3: Sequelize.STRING,
  OFF_R4: Sequelize.STRING,
  OFF_R5: Sequelize.STRING,
  OFF_R6: Sequelize.STRING,
  OFF_R7: Sequelize.STRING,
  OFF_R8: Sequelize.STRING,
  OFF_Notes: Sequelize.STRING,
  OFF_FLAG: Sequelize.STRING
}, {
  tableName: 'OfficeHours',
  updatedAt: false,
  createdAt: false
});

OfficeHour.belongsTo(Personal, {
  foreignKey: 'OFF_ATID',
  targetKey: 'Per_ATID'
});

Personal.hasMany(OfficeHour, {
  foreignKey: 'OFF_ATID',
  sourceKey: 'Per_ATID'
});
module.exports = OfficeHour;
},{"./Base":"app\\models\\Base.js","./Personal":"app\\models\\Personal.js"}],"app\\models\\Ressami.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Ressami = sequelize.define('Ressami', {
  SAMI_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  SAMI_ATID: Sequelize.STRING,
  SAMI_TITLE: Sequelize.STRING
}, {
  tableName: 'Ressami',
  updatedAt: false,
  createdAt: false
});

module.exports = Ressami;
},{"./Base":"app\\models\\Base.js"}],"app\\files\\faculty.js":[function(require,module,exports) {
const { Op } = require('sequelize');
const fs = require('fs');
const axios = require('axios');
const Personal = require('../models/Personal');
const Schedule = require('../models/Schedule');
const OfficeHour = require('../models/OfficeHour');
const Rank = require('../models/Rank');
const FacultyCourseFile = require('../models/FacultyCourseFile');
const Ressami = require('../models/Ressami');
const {
  getCurrentSemester,
  saveFiles,
  getCourseLinks
} = require('./general.js');
const logger = require('./logger');
const term = getCurrentSemester();
module.exports = {
  getActiveFaculty(limit = null) {
    return _getActiveFaculty(limit);
  },
  saveFacultyCourseFiles() {
    let courseFileList = {};
    Personal.findAll({
      order: [[FacultyCourseFile, 'CFF_Semes', 'DESC'], [FacultyCourseFile, 'CFF_Course'], [FacultyCourseFile, 'CFF_Section']],
      include: [{
        model: FacultyCourseFile,
        where: {
          CFF_Files: { [Op.ne]: '' }
        }
      }],
      where: {
        Per_Status: 'Active',
        Per_Dgroup: 'Faculty'
      }
    }).then(cf => cf).then(cfiles => {
      cfiles.forEach(cf => {
        const { Per_ATID: username, FacultyCourseFile: courseFiles } = cf;
        const {
          CFF_Course: course,
          CFF_Semes: term,
          CFF_Files: docString,
          CFF_Section: section,
          CFF_Linksec: link,
          CFF_Notes: notes
        } = courseFiles;
        if (courseFileList[username]) {
          const docs = getCourseLinks(term, course, section, docString);
          courseFileList[username].push({
            username,
            course,
            term,
            section,
            link,
            notes,
            docs
          });
        } else {
          courseFileList[username] = [];
        }
      });
      saveFiles('faculty_course_files', 'faculty', JSON.stringify(courseFileList));
    }).catch(error => logger.log('error', error));
  },
  async saveFacultyPics() {
    _getActiveFaculty().then(cnt => cnt).then(all => {
      all.forEach(faculty => {
        const { Per_ATID: username } = faculty;
        const url = `${process.env.FACULTY_IMAGES_DOWNLOAD_URL}/${username}.jpg`;
        const image_production = `${process.env.FACULTY_IMAGES_UPLOAD_URL_PRODUCTION}/${username}.jpg`;
        const image_dev = `${process.env.FACULTY_IMAGES_UPLOAD_URL_DEV}/${username}.jpg`;
        axios({
          method: 'GET',
          url: url,
          responseType: 'stream'
        }).then(response => {
          response.data.pipe(fs.createWriteStream(image_production));
          if (process.NODE_ENV !== 'production') {
            response.data.pipe(fs.createWriteStream(image_dev));
          }

          // return a promise and resolve when download finishes
          response.data.on('end', () => logger.log('info', `${username} saved`));
          response.data.on('error', () => logger.log('error', `${username} not saved`));
        });
      });
    });
  },
  saveFaculty() {
    let facultyList = [];
    _getActiveFaculty().then(cnt => cnt).then(all => {
      all.forEach(faculty => {
        const {
          Rank,
          Per_Rank: shortRank,
          Per_ATID: username,
          Per_FullNameX: fullname,
          Per_EMAIL: email,
          Per_Title: title,
          Per_OTEL: officetel,
          Per_OffBldg: officebldg,
          Per_OffRoom: officeroom,
          Per_Box: postbox,
          Per_WebLoc: website,
          Schedules: tempSchedule,
          OfficeHours: tempOh
        } = faculty;
        const schedule = _formatSchedule(tempSchedule);
        const officehours = _formatOfficeHour(tempOh);
        const { RAN_FULL: rank } = Rank;
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
          rank,
          shortRank,
          schedule,
          officehours,
          researchinterests: [],
          publications: []
        };
        facultyList.push(tempObj);
      });
      let proms = [];
      facultyList.forEach(faculty => {
        proms.push(new Promise((resolve, reject) => {
          Ressami.findAll({
            where: { SAMI_ATID: faculty.username }
          }).then(riArr => {
            riArr.forEach(ri => {
              const { SAMI_TITLE } = ri;
              faculty.researchinterests.push(SAMI_TITLE);
            });
            const tempRIARR = faculty.researchinterests.filter((value, index, self) => {
              return self.indexOf(value) === index;
            });
            faculty.researchinterests = tempRIARR;
            resolve(faculty);
          });
        }));
      });
      Promise.all(proms).then(array => {
        let list = [];
        array.forEach(ri => {
          list.push(ri);
        });

        saveFiles('faculty', 'faculty', JSON.stringify(list));
      }).catch(error => logger.log('error', error));
      /* 
      }) */
    });
  }
};

const _getActiveFaculty = (limit = null) => {
  return Personal.findAll({
    limit,
    include: [{
      model: Rank
    }, {
      model: Schedule,
      where: {
        SCH_SEMES: term
      },
      required: false
    }, {
      model: OfficeHour,
      where: {
        OFF_SEMES: term
      },
      required: false
    }],
    where: {
      Per_Status: 'Active',
      Per_Dgroup: 'Faculty'
    }
  });
};

const _formatSchedule = schedule => {
  const am = new RegExp(/AM/, 'i');
  const pm = new RegExp(/PM/, 'i');
  let temp = [];
  Object.values(schedule).forEach(row => {
    const start_hour = row['SCH_SHOUR'].match(am) ? row['SCH_SHOUR'].replace(am, '').trim() : row['SCH_SHOUR'].replace(pm, '').trim();
    const start_ampm = row['SCH_SHOUR'].match(am) ? 'AM' : 'PM';
    const end_hour = row['SCH_EHOUR'].match(am) ? row['SCH_EHOUR'].replace(am, '').trim() : row['SCH_EHOUR'].replace(pm, '').trim();
    const end_ampm = row['SCH_EHOUR'].match(am) ? 'AM' : 'PM';
    const {
      SCH_ATID: username,
      SCH_COURSE: course,
      SCH_SEMES: term,
      SCH_SECTION: section,
      SCH_SMIN: start_minutes,
      SCH_EMIN: end_minutes,
      SCH_PLACE: place,
      SCH_DAYS: days,
      SCH_TYPE: type,
      SCH_NOTES: note
    } = row;
    temp.push({
      username,
      course,
      term,
      section,
      start_hour,
      start_minutes,
      start_ampm,
      end_hour,
      end_minutes,
      end_ampm,
      days,
      place,
      type,
      note
    });
  });
  return temp;
};

const _formatOfficeHour = officehours => {
  if (!officehours[0]) return null;
  let sun = [],
      mon = [],
      tue = [],
      wed = [],
      thu = [];
  const {
    OFF_ATID: username,
    OFF_SEMES: term,
    OFF_LOC: office_location,
    OFF_TEL: phone,
    OFF_Notes: note,
    OFF_S1,
    OFF_S2,
    OFF_S3,
    OFF_S4,
    OFF_S5,
    OFF_S6,
    OFF_S7,
    OFF_S8,
    OFF_U1,
    OFF_U2,
    OFF_U3,
    OFF_U4,
    OFF_U5,
    OFF_U6,
    OFF_U7,
    OFF_U8,
    OFF_M1,
    OFF_M2,
    OFF_M3,
    OFF_M4,
    OFF_M5,
    OFF_M6,
    OFF_M7,
    OFF_M8,
    OFF_T1,
    OFF_T2,
    OFF_T3,
    OFF_T4,
    OFF_T5,
    OFF_T6,
    OFF_T7,
    OFF_T8,
    OFF_W1,
    OFF_W2,
    OFF_W3,
    OFF_W4,
    OFF_W5,
    OFF_W6,
    OFF_W7,
    OFF_W8,
    OFF_R1,
    OFF_R2,
    OFF_R3,
    OFF_R4,
    OFF_R5,
    OFF_R6,
    OFF_R7,
    OFF_R8
  } = officehours[0];

  if (OFF_S1.length > 0) sun.push(`${OFF_S1}:${OFF_S2}-${OFF_S3}:${OFF_S4}`);
  if (OFF_S5.length > 0) sun.push(`${OFF_S5}:${OFF_S6}-${OFF_S7}:${OFF_S8}`);
  if (OFF_U1.length > 0) mon.push(`${OFF_U1}:${OFF_U2}-${OFF_U3}:${OFF_U4}`);
  if (OFF_U5.length > 0) mon.push(`${OFF_U5}:${OFF_U6}-${OFF_U7}:${OFF_U8}`);
  if (OFF_M1.length > 0) tue.push(`${OFF_M1}:${OFF_M2}-${OFF_M3}:${OFF_M4}`);
  if (OFF_M5.length > 0) tue.push(`${OFF_M5}:${OFF_M6}-${OFF_M7}:${OFF_M8}`);
  if (OFF_T1.length > 0) wed.push(`${OFF_T1}:${OFF_T2}-${OFF_T3}:${OFF_T4}`);
  if (OFF_T5.length > 0) wed.push(`${OFF_T5}:${OFF_T6}-${OFF_T7}:${OFF_T8}`);
  if (OFF_W1.length > 0) thu.push(`${OFF_W1}:${OFF_W2}-${OFF_W3}:${OFF_W4}`);
  if (OFF_W5.length > 0) thu.push(`${OFF_W5}:${OFF_W6}-${OFF_W7}:${OFF_W8}`);

  return {
    username,
    term,
    office_location,
    phone,
    note,
    sun,
    mon,
    tue,
    wed,
    thu
  };
};
},{"../models/Personal":"app\\models\\Personal.js","../models/Schedule":"app\\models\\Schedule.js","../models/OfficeHour":"app\\models\\OfficeHour.js","../models/Rank":"app\\models\\Rank.js","../models/FacultyCourseFile":"app\\models\\FacultyCourseFile.js","../models/Ressami":"app\\models\\Ressami.js","./general.js":"app\\files\\general.js","./logger":"app\\files\\logger.js"}],"app\\models\\Author.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Author = sequelize.define('PubAuthors', {
  AUT_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  AUT_PubCode: Sequelize.INTEGER,
  AUT_ATID: {
    type: Sequelize.STRING,
    allowNull: true
  },
  AUT_NAME: Sequelize.STRING
}, {
  tableName: 'PubAuthors',
  updatedAt: false,
  createdAt: false
});

module.exports = Author;
},{"./Base":"app\\models\\Base.js"}],"app\\models\\Publication.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Author = require('../models/Author');

const Publication = sequelize.define('PubWork', {
  Pub_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  PUB_CODE: Sequelize.INTEGER,
  PUB_Year: Sequelize.INTEGER,
  PUB_IEEE: Sequelize.STRING
}, {
  tableName: 'PubWork',
  updatedAt: false,
  createdAt: false
});

Publication.belongsTo(Author, {
  foreignKey: 'PUB_CODE',
  targetKey: 'AUT_PubCode',
  as: 'authors'
});
module.exports = Publication;
},{"./Base":"app\\models\\Base.js","../models/Author":"app\\models\\Author.js"}],"app\\files\\publications.js":[function(require,module,exports) {
const fs = require('fs');
const logger = require('./logger');
const sequelize = require('../models/Base');
const Publication = require('../models/Publication');
const Author = require('../models/Author');
const { getActiveFaculty } = require('./faculty.js');
const { createFolder, saveFiles } = require('./general.js');
module.exports = {
  async saveAllOtherAuthors() {
    const others = await _getAllOtherAuthors();
    let authors = {};
    others.forEach(author => {
      const { AUT_PubCode, AUT_NAME } = author;
      if (!authors[AUT_PubCode]) {
        authors[AUT_PubCode] = [];
      }
      authors[AUT_PubCode].push(AUT_NAME);
    });
    saveFiles('other_authors', 'publications', JSON.stringify(authors));
  },
  async savePublications() {
    const years = await _getPublicationsArray().catch(err => logger.log('error', err));
    years.forEach(year => {
      _savePublications(year);
    });
  },
  async savePublicationsYears() {
    const years = await _getPublicationsYears().catch(err => logger.log('error', err));
    let yearsArr = [];
    years.forEach(yearObj => {
      const { PUB_Year: year } = yearObj;
      yearsArr.push(year);
    });
    saveFiles('years', 'publications', JSON.stringify(yearsArr));
  },
  async getFacultyPublications(username) {
    return _getFacultyPublications(username);
  },
  async saveFacultyPublications() {
    const facultyArr = await getActiveFaculty().catch(err => logger.log('error', err));
    facultyArr.forEach(async faculty => {
      const { Per_ATID: username } = faculty;
      const pubs = await _getFacultyPublications(username).catch(error => reject(error));
      _saveFacultyPublications(username, pubs);
    });
  }
};

const _getFacultyArticles = username => {
  return new Promise((resolve, reject) => {
    Publication.findAll({
      order: [['PUB_Year', 'DESC']],
      include: [{
        model: Author,
        where: {
          AUT_ATID: username
        },
        as: 'authors'
      }]
    }).then(array => {
      let listOFCodes = [];
      array.forEach(one => {
        const { PUB_Year, PUB_IEEE, PUB_CODE } = one;
        const tempObj = {
          year: PUB_Year,
          title: PUB_IEEE,
          code: PUB_CODE,
          authors: []
        };
        listOFCodes.push(tempObj);
      });
      resolve(listOFCodes);
    }).catch(error => reject(error));
  });
};

const _getAllOtherAuthors = code => {
  return sequelize.query(`select AUT_PubCode, AUT_NAME from PubAuthors`, {
    model: Author
  });
};

const _getOtherAuthorsOfArticle = code => {
  return sequelize.query(`select AUT_NAME from PubAuthors where AUT_PubCode=${code}`, {
    model: Author
  });
};

const _updateArticleWithOtherAuthors = async articles => {
  return new Promise((res, rej) => {
    let proms = [];
    articles.forEach(async article => {
      proms.push(new Promise(async (resolve, reject) => {
        const others = await _getOtherAuthorsOfArticle(article.code).catch(error => reject(error));
        resolve({
          article,
          others
        });
      }));
    });
    Promise.all(proms).then(array => {
      let list = [];
      array.forEach(item => {
        const { article, others } = item;
        others.forEach(author => {
          article.authors.push(author.get('AUT_NAME'));
        });
        list.push(article);
      });
      res(list);
    }).catch(err => rej(err));
  });
};

const _getFacultyPublications = async username => {
  return new Promise(async (resolve, reject) => {
    const articles = await _getFacultyArticles(username).catch(error => reject(error));
    const list = await _updateArticleWithOtherAuthors(articles).catch(error => reject(error));
    resolve(list);
  });
};

const _saveFacultyPublications = async (username, list) => {
  const data = JSON.stringify(list);
  saveFiles(username, 'faculty/publications', data);
};

const _getPublicationsYears = () => {
  return sequelize.query("select distinct PUB_Year from PubWork where PUB_Year<>'' order by PUB_Year", {
    model: Publication
  });
};
const _getPublicationsArray = async () => {
  const years = await _getPublicationsYears().catch(err => logger.log('error', err));
  let array = [];
  years.forEach(year => {
    const { PUB_Year } = year;
    array.push(PUB_Year);
  });
  return array;
};

const _getPublications = (year = null) => {
  const where = {};
  if (year) {
    where.PUB_Year = year;
  }
  return Publication.findAll({
    where
  });
};

const _savePublications = async (year = null) => {
  const articles = await _getPublications(year).catch(err => logger.log('error', err));
  let array = [];
  let promises = [];
  articles.forEach(async article => {
    const { PUB_IEEE: title, PUB_CODE: code } = article;
    //promises.push(_getArticleWithAuthors(year, title, code))
    promises.push({ year, title, code });
  });
  Promise.all(promises).then(tempArray => {
    tempArray.forEach(art => array.push(art));
    saveFiles(year, 'publications', JSON.stringify(array));
  }).catch(err => logger.log('error', err));
};

const _getArticleWithAuthors = async (year, title, code) => {
  return new Promise(async (resolve, reject) => {
    const others = await _getOtherAuthorsOfArticle(code).catch(err => {
      logger.log('error', err);
      reject('something went wrong ...');
    });
    const temp = {
      title,
      code,
      year,
      authors: []
    };
    if (others) {
      others.forEach(author => {
        temp.authors.push(author.get('AUT_NAME'));
      });
    }
    resolve(temp);
  });
};
},{"./logger":"app\\files\\logger.js","../models/Base":"app\\models\\Base.js","../models/Publication":"app\\models\\Publication.js","../models/Author":"app\\models\\Author.js","./faculty.js":"app\\files\\faculty.js","./general.js":"app\\files\\general.js"}],"app\\models\\CourseFile.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const CourseFile = sequelize.define('CourseFile', {
  OFF_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  OFF_SEMESTER: Sequelize.STRING,
  OFF_COURSE: Sequelize.STRING,
  OFF_EXAM: Sequelize.STRING,
  OFF_TYPE: Sequelize.STRING,
  OFF_SECTION: Sequelize.STRING
}, {
  tableName: 'CFF_CourseOffered',
  updatedAt: false,
  createdAt: false
});

module.exports = CourseFile;
},{"./Base":"app\\models\\Base.js"}],"app\\files\\course_files.js":[function(require,module,exports) {
const CourseFile = require('../models/CourseFile');
const { saveFiles } = require('./general');
const logger = require('./logger');

module.exports = {
  getAllCourseFiles() {
    return _getAllCourseFiles();
  },
  async saveAllCourseFiles() {
    const list = await _getAllCourseFiles();
    if (list != null) {
      saveFiles('course_files', 'courseFiles', JSON.stringify(list));
    } else {
      logger.log('error', 'No course files were retrieved and no files were saved ..');
    }
  }
};

const _CoursesIncludeCourse = (courses, course) => {
  return courses.findIndex(value => value.course == course);
};

const _getAllCourseFiles = () => {
  return new Promise(resolve => {
    CourseFile.findAll().then(rows => {
      let list = [];
      rows.forEach(row => {
        const {
          OFF_SEMESTER: term,
          OFF_COURSE: course,
          OFF_SECTION: section,
          OFF_EXAM: exam,
          OFF_TYPE: type
        } = row;
        const foundTermIndex = list.findIndex(value => value.term == term);
        const file = {
          name: exam,
          link: `${course}_${term}_${section}_${exam}.${type}`
        };
        if (foundTermIndex < 0) {
          list.push({
            term,
            courses: [{ course, exams: [file] }]
          });
        } else {
          const courseIndex = _CoursesIncludeCourse(list[foundTermIndex].courses, course);
          if (courseIndex < 0) {
            list[foundTermIndex].courses.push({
              course,
              exams: [file]
            });
          } else {
            list[foundTermIndex].courses[courseIndex]['exams'].push(file);
          }
        }
      });
      resolve(list);
    }).catch(() => resolve(null));
  });
};
},{"../models/CourseFile":"app\\models\\CourseFile.js","./general":"app\\files\\general.js","./logger":"app\\files\\logger.js"}],"app\\models\\Course.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Course = sequelize.define('Course', {
  ALC_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  ALC_COURSE: Sequelize.STRING,
  ALC_TITLE: Sequelize.STRING
}, {
  tableName: 'ALLCOURSES',
  updatedAt: false,
  createdAt: false
});

module.exports = Course;
},{"./Base":"app\\models\\Base.js"}],"app\\models\\Syllabus.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const Course = require('./Course');
const Syllabus = sequelize.define('Syllabus', {
  SYL_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  SYL_COURSE: Sequelize.STRING,
  SYL_SEMES: Sequelize.STRING
}, {
  tableName: 'Syllabus',
  updatedAt: false,
  createdAt: false
});

Syllabus.belongsTo(Course, {
  foreignKey: 'SYL_COURSE',
  targetKey: 'ALC_COURSE'
});
module.exports = Syllabus;
},{"./Base":"app\\models\\Base.js","./Course":"app\\models\\Course.js"}],"app\\files\\syllabi.js":[function(require,module,exports) {
const Course = require('../models/Course');
const Syllabus = require('../models/Syllabus');
const { saveFiles } = require('./general');
module.exports = {
  saveSyllabi() {
    Syllabus.findAll({
      include: [{
        model: Course
      }]
    }).then(rows => {
      let list = [],
          terms = [];
      rows.forEach(row => {
        const { SYL_COURSE: course, SYL_SEMES: term, Course: courseObj } = row;
        if (courseObj) {
          const { ALC_TITLE: title } = courseObj;
          !terms.includes(term) && terms.push(term);
          list.push({ term, course, title });
        }
      });
      terms.sort((a, b) => {
        return parseInt(a) <= parseInt(b) ? 1 : -1;
      });
      saveFiles('syllabus_terms', 'syllabi', JSON.stringify(terms));
      saveFiles('syllabus_links', 'syllabi', JSON.stringify(list));
    });
  }
};
},{"../models/Course":"app\\models\\Course.js","../models/Syllabus":"app\\models\\Syllabus.js","./general":"app\\files\\general.js"}],"app\\models\\TechnicalReport.js":[function(require,module,exports) {
const Sequelize = require('sequelize');
const sequelize = require('./Base');
const TechnicalReport = sequelize.define('TechnicalReport', {
  Tech_SNO: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  Tech_CODE: Sequelize.INTEGER,
  Tech_DCODE: Sequelize.STRING,
  Tech_Title: Sequelize.STRING,
  Tech_Authors: Sequelize.STRING,
  Tech_Year: Sequelize.INTEGER
}, {
  tableName: 'Tech_reports',
  updatedAt: false,
  createdAt: false
});

module.exports = TechnicalReport;
},{"./Base":"app\\models\\Base.js"}],"app\\files\\technical_reports.js":[function(require,module,exports) {
const TechnicalReport = require('../models/TechnicalReport');
const { saveFiles } = require('./general');

module.exports = {
  saveTechnicalReports() {
    TechnicalReport.findAll({
      order: [['Tech_Year', 'DESC'], ['Tech_Authors', 'ASC'], ['Tech_Title', 'ASC']],
      where: {
        Tech_DCODE: 'MATH'
      }
    }).then(rows => {
      let list = [];
      rows.forEach(row => {
        const {
          Tech_CODE: code,
          Tech_Title: title,
          Tech_Authors: authors,
          Tech_Year: year
        } = row;

        list.push({
          code,
          title,
          authors,
          year
        });
      });
      saveFiles('technical_reports', 'TechnicalReports', JSON.stringify(list));
    });
  }
};
},{"../models/TechnicalReport":"app\\models\\TechnicalReport.js","./general":"app\\files\\general.js"}],"index.js":[function(require,module,exports) {
require('dotenv').config();
const cron = require('node-cron');
const logger = require('./app/files/logger');
const { saveAllRanks } = require('./app/files/ranks');
const {
  saveFaculty,
  saveFacultyPics,
  saveFacultyCourseFiles
} = require('./app/files/faculty');
const {
  saveFacultyPublications,
  savePublicationsYears,
  savePublications,
  saveAllOtherAuthors
} = require('./app/files/publications');
const { saveAllCourseFiles } = require('./app/files/course_files');
const { saveSyllabi } = require('./app/files/syllabi');
const { saveTechnicalReports } = require('./app/files/technical_reports');
//saveAllCourseFiles()

logger.log('info', 'Started running ... ' + new Date().toLocaleString());
/*
Time to execute 
*/

const h = 0,
      m = 5,
      s = 0,
      increment_minutes = 5;

// 1)
//save list of active faculty in files/faculty/faculty.json
// every day at 12:05:00 AM
let minutes = m + increment_minutes;
cron.schedule(s + ' ' + minutes + ' ' + h + ' * * *', function () {
  const date = new Date().toLocaleString();
  logger.log('info', `start saving active faculty in files at ${date}`);
  saveFaculty();
  logger.log('info', `start saving list of faculty ranks at ${date}`);
  saveAllRanks();
  logger.log('info', `start saving active faculty course files at ${date}`);
  saveFacultyCourseFiles();
  logger.log('info', `start saving active faculty publications at ${date}`);
  saveFacultyPublications();
  /*
  logger.log(
    'info',
    `start saving active faculty pictures in images at ${date}`
  )
  saveFacultyPics()
  */
});

// 2)
// save list of years in files/publications/years.json
// every day at 12:25:00 AM
minutes = minutes + increment_minutes;
cron.schedule(s + ' ' + minutes + ' ' + h + ' * * *', function () {
  const date = new Date().toLocaleString();
  logger.log('info', `start saving list of years at ${date}`);
  savePublicationsYears();
  logger.log('info', `start saving publications year by year at ${date}`);
  savePublications();
  logger.log('info', `start saving other authors at ${date}`);
  saveAllOtherAuthors();
  logger.log('info', `start saving syllabi at ${date}`);
  saveSyllabi();
});

// 3)
// save list of all course files in files/courseFiles/course_files.json
// every day at 12:45:00 AM
minutes = minutes + increment_minutes;
cron.schedule(s + ' ' + minutes + ' ' + h + ' * * *', function () {
  const date = new Date().toLocaleString();
  logger.log('info', `start saving list of all course files at ${date}`);
  saveAllCourseFiles();
  logger.log('info', `start saving list of all technical reports at ${date}`);
  saveTechnicalReports();
});
},{"./app/files/logger":"app\\files\\logger.js","./app/files/ranks":"app\\files\\ranks.js","./app/files/faculty":"app\\files\\faculty.js","./app/files/publications":"app\\files\\publications.js","./app/files/course_files":"app\\files\\course_files.js","./app/files/syllabi":"app\\files\\syllabi.js","./app/files/technical_reports":"app\\files\\technical_reports.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.map