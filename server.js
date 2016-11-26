/**
 * Node.js boilerplate server
 * @author: Simon Nowis <tannai.simon@gmail.com>
 * @license: MIT
 * @todo: Production, Units tests.
 */

'use strict';

const express     = require('express');
const helmet      = require('helmet');
const bodyParser  = require('body-parser');
const cors        = require('cors');

const log4js      = require('log4js');
const morgan      = require('morgan');
const logger      = require(__dirname+'/bundles/logger/logger.js');

const fs          = require('fs');
const path        = require('path');

const app         = express();
const port        = 8080;

// Use helmet for security
app.use(helmet());

// Use bodyParser for get POST params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use CORS to enable Cross Domaine requests
app.use(cors());

// Define static foler who will contains the Webapp, like Angular.js
app.use(express.static(__dirname + '/webapp'));

/* =================================================================== *\
 *  LOG HTTP
\* =================================================================== */
if(process.env.NODE_ENV === 'production') {
  const fileStreamRotator = require('file-stream-rotator');

  let logDirectory = path.join(__dirname, 'logs');

  // ensure log directory exists
  if(!fs.existsSync(logDirectory)){
    fs.mkdirSync(logDirectory);
  }

  // create a rotating write stream
  let accessLogStream = fileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
  });

  // setup the logger
  app.use(morgan('combined', {stream: accessLogStream}));
}
else {
  app.use(morgan('combined'));
}
/* =================================================================== *\
 *  END OF LOG HTTP
\* =================================================================== */

app.get('/', (req, res) => {
  res.status(200).send('May the force be with you.');
});

/* =================================================================== *\
 *  ROUTES
\* =================================================================== */
// Import example router module
let caisseEpargneAutomateRouter = require(__dirname+'/bundles/caisse-epargne-automate/caisseEpargneAutomateRouter.js');

// Use example router
// All routes in example router will start by '/example'
app.use('/caisse-epargne', caisseEpargneAutomateRouter);
/* =================================================================== *\
 *  END OF ROUTES
\* =================================================================== */

/* =================================================================== *\
 *
 *  AMAZING CODE HERE
 *
\* =================================================================== */

let srv = app.listen(port, () => {
  logger.info('Server run on port', port, 'in', process.env.NODE_ENV, 'mode');
});

// Export server. He will be used by tests unit.
module.exports = srv;
