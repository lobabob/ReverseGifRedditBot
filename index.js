'use strict';

const SnooStream = require('snoostream');
const imgur = require('lib/imgur');
const request = require('request');
const gifify = require('gifify');
const log = require('lib/logger');
const config = require('config');

const snooStream = SnooStream(config.snoowrap);

// const commentStream = snooStream.commentStream('all', { regex: config.format });
const commentStream = snooStream.commentStream('testingReverseGifBot', { regex: config.format });

commentStream.on('post', (d, p) => {
  const url = p[1];
  const gifOpts = {
    reverse: true,
    from: p[2],
    to: p[3]
  };

  const img = gifify(request(url), gifOpts);
  imgur(img).then(body => d.reply(`[Processed Gif](${body.url})`)).catch(log.error);
});
