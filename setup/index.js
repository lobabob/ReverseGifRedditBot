#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ask } = require('./prompt');
const config = fs.existsSync(path.join(__dirname, '../config.js')) ||
  fs.existsSync(path.join(__dirname, '../config.json')) ? require('../config') : require('../config.example');

/**
 * First field is the prompt itself. The second field is the default value in the config file for that prompt.
 */
const prompts = [
  ['Reddit Client Id', 'snoowrap.clientId'],
  ['Reddit Client Secret', 'snoowrap.clientSecret'],
  ['User Agent', 'snoowrap.userAgent'],
];

prompts.forEach((prompt, i) => {
  const fields = prompt[1].split('.');
  const field = fields.pop();
  const defaultObj = fields.reduce((obj, key) => obj[key], config);   // defaultObj.field is the default value
  const formattedPrompt = `${prompt[0]}${defaultObj[field] ? ` (${defaultObj[field]})` : ''}: `;

  ask(formattedPrompt, (err, text) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    defaultObj[field] = text || defaultObj[field];

    if (prompts.length - 1 === i) {
      fs.writeFileSync('config.json', JSON.stringify(config, false, 2));
      console.log('Configurations Saved!');
      process.exit();
    }
  });
});
