/**
 * Caisse d'Epargne automate controller
 * @author Simon Tannai <tannai.simon@gmail.com>
 * @todo: Add comments, improve performances
 */

'use strict';

const Horseman = require('node-horseman');
const cheerio  = require('cheerio');

const horseman = new Horseman({
  loadImages: false,
  injectJquery: false,
  webSecurity: true,
  ignoreSSLErrors: true
});

let _createClientConnexion = () => {
  return new Promise((resolve, reject) => {
    let config = require(__dirname + '/config.json');

    if(!config) {
      return reject(new Error('Cannot get config !'));
    }

    horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('https://www.caisse-epargne.fr/particuliers')
    .click('p.account-link a.icon-bpce-profil')
    .wait(2000)
    .type('input#idClient', config.account_id)
    .screenshot(__dirname + '/screens/idclient.png')
    .click('.identification-form button[type="submit"]')
    .wait(2000)
    .then(() => {
      for(let i in config.account_password) {
        horseman.click('li[data-passkey="'+config.account_password[i]+'"]');
        console.log('Clicked on li[data-passkey="'+config.account_password[i]+'"]');
      }

      return true;
    })
    .screenshot(__dirname + '/screens/password.png')
    .click('.password-form button[type="submit"]')
    .wait(2000)
    .screenshot(__dirname + '/screens/final.png')
    .html('body')
    .then(
      (html) => {
        return resolve(html);
      }
    )
    .close();
  });
};

let getSolde = () => {
  return new Promise((resolve, reject) => {
    _createClientConnexion()
    .then(
      (clientPage) => {
        let $ = cheerio.load(clientPage);

        let solde = $('.accompte .somme p').text();
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
  'getSolde': getSolde
};
