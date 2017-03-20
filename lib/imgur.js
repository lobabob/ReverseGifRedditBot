'use strict';

const request = require('request');
const RateLimiter = require('limiter').RateLimiter;
const log = require('lib/logger');
const config = require('config').imgur;

const limiters = [];
config.creds.forEach(() => limiters.push(new RateLimiter(config.dailyRate, 'day')));

// Will attempt to remove tokens from other limiters if one gets used up
function removeTokens (tokens) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < limiters.length; ++i) {
      if (limiters[i].tryRemoveTokens(tokens)) {
        return resolve(config.creds[i]);
      }
    }

    return reject(new Error('All Imgur accounts have reached their daily upload limit!'));
  });
}

function upload (cred, imgStream) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${config.api}/image`,
      headers: {
        Authorization: `Client-ID ${cred.clientId}`
      },
      formData: {
        image: imgStream
      }
    }, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

function imgur (imgStream) {
  removeTokens(1).then(cred => upload(cred, imgStream)).catch(log.error);
}

module.exports = imgur;
