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

To set up the configuration for the repo, you will need to make a copy of `config.example.js` and name it `config.js`. Then just fill out all the blank fields.

The bot can be started by running

```bash
npm start
```
