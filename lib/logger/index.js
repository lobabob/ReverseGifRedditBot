'use strict';

const bunyan = require('bunyan');
const fs = require('fs');

const logPath = 'logs/';
fs.mkdirSync(logPath);

module.exports = bunyan.createLogger({
  name: 'Reverse Gif Reddit Bot',
  streams: [
    {
      level: 'info',
      stream: process.stdout,  // log INFO and above to stdout
    }, {
      level: 'warn',
      path: `${logPath}warnings.log`,  // log WARNING and above to a file
    }, {
      level: 'error',
      path: `${logPath}errors.log`,  // log ERROR and above to a file
    },
  ],
  serializers: {
    err: bunyan.stdSerializers.err,
  },
});
