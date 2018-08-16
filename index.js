'use strict';

const SnooStream = require('snoostream');
// const imgur = require('lib/imgur');
const fs = require('fs');
const request = require('request');
const gifify = require('gifify');
const log = require('./lib/logger');
const config = require('./config');

const snooStream = SnooStream(config.snoowrap);

const commentStream = snooStream.commentStream('all', { regex: config.format });
// const commentStream = snooStream.commentStream('testingReverseGifBot', { regex: config.keyword });

function parseArgs(body) {
  const parsed = {};
  const args = body.split(/\s/).filter(arg => !!arg);
  [parsed.url, parsed.from, parsed.to] = args;

  return parsed;
}

/*
 * Validates a provided URL based on file-size. Returns a promise.
 */
function validUrl(url) {
  return new Promise((resolve, reject) => {
    request.head(url, (err) => {
      if (err) return reject(false);
      return resolve(url);
    });
  });
}

function limitSize(imgStream) {
  imgStream.on('data', (chunk) => {
    if (!imgStream.dataSoFar) imgStream.dataSoFar = 0;
    imgStream.dataSoFar += chunk.length;

    if (imgStream.dataSoFar > config.maxImgSize) {
      imgStream.destroy();
    }
  });

  return imgStream;
}

commentStream.on('post', (d, p) => {
  const args = parseArgs(p[1]);

  // Will reverse a an image stream (a gif in this case) with gifify
  function reverse(imgStream) {
    return gifify(imgStream, {
      reverse: true,
      from: args.from,
      to: args.to,
    });
  }


  const saveToDisk = fs.createWriteStream('blah.mp4');

  // validUrl(args.url).then(request).then(limitSize).then(reverse).then(imgur).then(console.log).catch(log.error);
  validUrl(args.url)
    .then(request)
    .then(limitSize)
    .then(reverse)
    .then(fileStream => fileStream.pipe(saveToDisk))
    .then(console.log)
    .catch(log.error);
  // validUrl(args.url).then(request).then(limitSize).then(fileStream => fileStream.pipe(saveToDisk))
  // .then(console.log).catch(log.error);

  // const img = gifify(request(args.url), gifOpts);
  // imgur(img).then(body => d.reply(`[Processed Gif](${body.url})`)).catch(log.error);
});
