'use strict';

const log4js      = require('log4js');

let logger;

// If production, write logs into file
if(process.env.NODE_ENV === 'production') {
  log4js.configure(__dirname+'/../../config/log4js.json');
  logger = log4js.getLogger('log');
}
// Else, log into terminal
else {
  logger = log4js.getLogger();
}

module.exports = logger;
