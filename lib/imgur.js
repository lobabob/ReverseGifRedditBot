'use strict';

const request = require('request');
const RateLimiter = require('limiter').RateLimiter;
const config = require('config').imgur;

const limiter = new RateLimiter(config.dailyRate, 'day');

function imgur (imgStream) {
  return new Promise((resolve, reject) => {
    limiter.removeTokens(1, err => {
      if (err) return reject('Hit Imgur daily upload limit!');

      request.post({
        url: `${config.api}/image`,
        headers: {
          Authorization: `Client-ID ${config.clientId}`
        },
        formData: {
          image: imgStream
        }
      }, (err, res, body) => {
        if (err) return reject(err);
        resolve(body);
      });
    });
  });
}

module.exports = imgur;
