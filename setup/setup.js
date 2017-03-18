'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const ask = require('./prompt').ask;

const config = {};

ask('Enter Reddit Client Id: ', (err, text) => {
  config.client_id = text;
});

ask('Enter Reddit Client Secret: ', (err, text) => {
  config.client_secret = text;
});

ask('Enter Reddit Refresh Token: ', (err, text) => {
  config.refresh_token = text;
});

ask('Enter User Agent (default works): ', (err, text) => {
  config.user_agent = text;
  saveConfig();
});

function saveConfig () {
  mkdirp('lib/config/', err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    fs.writeFile('lib/config/settings.json', JSON.stringify(config), err => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      console.log('Configurations saved');
      process.exit();
    });
  });
}
