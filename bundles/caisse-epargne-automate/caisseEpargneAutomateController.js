/**
 * Caisse d'Epargne automate controller
 * @author Simon Tannai <tannai.simon@gmail.com>
 * @todo: Nothing
 */

'use strict';

/**
 * Horseman - PhantomJS client
 * @type {Object}
 */
const Horseman = require('node-horseman');

/**
 * Cheerio - jQuery Core for Node.js
 * @type {Object}
 */
const cheerio  = require('cheerio');

/**
 * Create client and return HTML dashboard
 * @return {[type]} [description]
 */
let _createClientConnexion = () => {
  // Init Horseman
  const horseman = new Horseman({
    loadImages: false,
    injectJquery: false,
    webSecurity: true,
    ignoreSSLErrors: true
  });

  return new Promise((resolve, reject) => {
    // Get account configuration
    let config = require(__dirname + '/config.json');

    if(!config) {
      return reject(new Error('Cannot get config !'));
    }

    horseman
    // Set user agent

    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')

    // Go to the page
    .open('https://www.caisse-epargne.fr/particuliers')

    // Click on login button
    .click('p.account-link a.icon-bpce-profil')

    // Wait 500 ms, during the small fadeIn animation
    .wait(1000)

    // Write the account id into the fied
    .type('input#idClient', config.account_id)

    // Make a screenshot
    .screenshot(__dirname + '/screens/idclient.png')

    // Click on validation button
    .click('.identification-form button[type="submit"]')

    // Wait 500 ms, during JS interaction
    .wait(1000)

    // Then ...
    .then(() => {

      // For each number of account password
      for(let i in config.account_password) {
        // Click on the button of current number
        horseman.click('li[data-passkey="'+config.account_password[i]+'"]');
      }

      // Return true to continue
      return true;
    })

    // Take a screenshot
    .screenshot(__dirname + '/screens/password.png')

    // Click on submit button to send form
    .click('.password-form button[type="submit"]')

    // Wait for the next page. Will finish when the next page will be loaded
    .waitForNextPage()

    // Take a screenshot
    .screenshot(__dirname + '/screens/final.png')

    // Get the HTML body
    .html('body')

    // Then ...
    .then(
      (html) => {
        // Return the body
        return resolve(html);
      }
    )
    .close();
  });
};

/**
 * Get accounts balance
 * @return {String}   Accounts balance
 */
let getAccountsBalance = () => {
  return new Promise((resolve, reject) => {
    // Create the client
    _createClientConnexion()
    .then(
      (clientPage) => {
        // Init Cheerio
        let $ = cheerio.load(clientPage);
        // Find each account balance into the HTML
        // returned in clientPage
        let solde = $('.accompte .somme p').text();

        // Return the result
        return resolve(solde);
      },
      (error) => {
        return reject(error);
      }
    )
    .catch((error) => {
      return reject(error);
    });
  });
};

/**
 * Export module with functions
 * @type {Object}
 */
module.exports = {
  'getAccountsBalance': getAccountsBalance
};
