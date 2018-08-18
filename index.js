'use strict';

const SnooStream = require('snoostream');
// const imgur = require('lib/imgur');
const Gfycat = require('gfycat-sdk');
const fs = require('fs');
const request = require('request');
const requestp = require('request-promise-native');
// const log = require('./lib/logger');
const config = require('./config');

const snooStream = SnooStream(config.snoowrap);
const gfycat = new Gfycat({ clientId: config.gfycat.clientId, clientSecret: config.gfycat.clientSecret });

// const commentStream = snooStream.commentStream('all', { regex: config.format });
const commentStream = snooStream.commentStream('testingReverseGifBot', { regex: config.format });

/**
 * Converts any imgur, giphy, or gfycat urls to urls that point to the actual resource.
 * Also resolves any redirections caused by shortened urls and validates that the URL is reachable with a 200 response.
 *
 * Parsing URL example:
 * https://imgur.com/r/gifs/mm9WW6k -------> https://i.imgur.com/mm9WW6k.mp4
 * https://gph.is/1SPmL69 -----------------> https://media1.giphy.com/media/3oEjHO6kED0gWOSpCU/giphy.mp4
 *
 * Supported URL Formats
 * Imgur:
 * https://imgur.com/gallery/{gif_id}
 * https://imgur.com/r/gifs/{gif_id}
 * https://imgur.com/{gif_id}
 *
 * Giphy:
 * https://giphy.com/gifs/{gif_id}
 * https://giphy.com/gifs/{gif_id}/html5
 * https://giphy.com/embed/{gif_id}
 * https://giphy.com/gifs/random-words-here-{gif_id}
 *
 * Gfycat:
 * https://gfycat.com/{gif_id}
 * https://gfycat.com/ifr/{gif_id}
 * https://gfycat.com/gifs/detail/{gif_id}
 * @param {String} url Url that may or may not point to an actual resource (mp4|webm|gif file).
 * @returns {Promise} Processed URL that points to an actual resource (mp4|webm|gif file).
 */
async function processUrl(url) {
  /* eslint-disable no-param-reassign */
  const meta = await requestp.head(url, { resolveWithFullResponse: true });
  url = meta.request.href;    // Will resolve any redirects that may exist due to shortened urls or the like
  /* eslint-enable no-param-reassign */

  // Don't process if url points to an actual resource already
  if (url.test(/\.(mp4|webm|gif|gifv)$/)) {
    if (/media\.giphy\.com(.+)\.gif$/.test(url)) {
      return url.replace(/\.gif$/, '.mp4'); // Only use .mp4s for Giphy since .gifs would just be converted anyways
    }
    return url.replace(/\.gifv$/, '.mp4');  // .gifv is just an html wrapper for .mp4 files. We need the actual .mp4
  }

  const imgurUrl = url.match(/imgur\.com\/(?:r\/gifs\/|gallery\/)?(.+)/);
  if (imgurUrl) {
    return `https://i.imgur.com/${imgurUrl[1]}.mp4`;
  }

  const giphyUrl = url.match(/giphy\.com\/(?:gifs|embed)\/([^/\n]+)/);
  if (giphyUrl) {
    // Giphy is stupid, so the gif id can be in a weird format (cute-puppy-9rjTSraURqKPmL2Dgt), hence the split below
    return `https://media.giphy.com/media/${giphyUrl[1].split('-').slice(-1)}/giphy.mp4`;
  }

  const gfycatUrl = url.match(/gfycat\.com\/(?:ifr\/|gifs\/detail\/)?(.+)/);
  if (gfycatUrl) {
    return (await gfycat.getGifDetails({ gfyId: gfycatUrl[1] })).gfyItem.mp4Url; // gfyItem.mobileUrl for smaller file
  }

  throw new Error('Unsupported URL');
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

commentStream.on('post', (post, match) => {
  const [, url, from, to] = match;     // Skip first match since that's the entire matched string.
  // const saveToDisk = fs.createWriteStream('blah.mp4');

  // validUrl(args.url).then(request).then(limitSize).then(reverse).then(imgur).then(console.log).catch(log.error);
  return processUrl(url)
    .then((processedUrl) => {
      request.get(processedUrl)
        .on('error', console.error)
        .pipe(fs.createWriteStream('test.mp4'));
    });
  // .then(() => request(url))
  // .then(limitSize)
  // .then(imgStream => gifify(imgStream, { reverse: true, from, to }))
  // .then(fileStream => fileStream.pipe(saveToDisk))
  // .then(console.log)
  // .catch(console.error);

  // imgur(img).then(body => post.reply(`[Processed Gif](${body.url})`)).catch(log.error);
});

// requestp({ url: 'https://i.imgur.com/mm9WW6k.mp4', method: 'GET', simple: false, followRedirect: false })
//   .then((data) => {
//     const buffer = Buffer.from(data, 'utf8');
//     fs.writeFileSync('test.mp4', buffer);
//     console.log('done');
//   })
//   .catch(console.error);
