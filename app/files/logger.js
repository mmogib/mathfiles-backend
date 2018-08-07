const winston = require('winston')
const loggingFile = `${process.env.JSON_FILES_PRODUCTION}/logs`

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
    }),

    new winston.transports.File({
      filename: `${loggingFile}/combined.log`
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: 'info'
    })
  ]
})

module.exports = logger
