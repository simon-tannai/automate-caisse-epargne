/**
 * Example router
 * @author Simon Tannai <tannai.simon@gmail.com>
 * @todo: Nothing
 */

'use strict';

const express     = require('express');
const router      = express.Router();
const bodyParser  = require('body-parser');

const logger            = require(__dirname+'/../logger/logger.js');
const caisseEpargneAutomateController = require(__dirname+'/caisseEpargneAutomateController.js');

/**
 * Get accounts balance
 * URI: GET /getAccountsBalance
 */
router.get('/getAccountsBalance', (req, res) => {
  caisseEpargneAutomateController.getAccountsBalance()
  .then(
    (solde) => {
      return res.status(200).send(solde);
    },
    (error) => {
      return res.status(400).send(error.message);
    }
  )
  .catch((error) => {
    return res.status(400).send(error.message);
  });
});

/**
 * Export router
 * @type {Object}
 */
module.exports = router;
