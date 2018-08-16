[![Build Status](https://travis-ci.org/lobabob/ReverseGifRedditBot.svg?branch=master)](https://travis-ci.org/lobabob/ReverseGifRedditBot)
# ReverseGifRedditBot

A Reddit bot that reverses gif/gifv links

## How to setup the bot/repo

These steps will get the code for the repo set up with any required dependencies.

```bash
git clone <repo url>
cd <repo directory>
NODE_ENV=production     # Only necessary if you are not doing any dev work
npm install
```

Follow these steps to setup the configuration for the bot.

```bash
npm run setup
```

If you need to modify existing configuration, you can rerun that step or you can directly modify the `repo/config.js` file.

The bot can be started by running

```bash
npm start
```
