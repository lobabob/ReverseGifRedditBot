'use strict';

const request = require('request');
const config = require('config').imgur;

function imgur (imgStream) {
  return new Promise((resolve, reject) => {
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
}

module.exports = imgur;
