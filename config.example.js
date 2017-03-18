'use strict';

module.exports = {
  // Used by SnooStream/Snoowrap
  // Can be modified if you want to use different methods of authentication with snoowrap
  snoowrap: {
    userAgent: 'Reverse Gif Bot',
    clientId: '',
    clientSecret: '',
    username: '',
    password: ''
  },
  // Regex to use when parsing for trigger keyword and arguments
  format: /Trigger Word (.+)?/gi,
  imgur: {
    api: 'https://api.imgur.com/3',
    dailyRate: 1250,
    clientId: '',
    clientSecret: ''
  }
};