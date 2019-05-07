const twit = require('twit');

const API_KEYS = require('./api_keys.json');

const bot = new twit({
  consumer_key: API_KEYS['consumer_key'],
  consumer_secret: API_KEYS['consumer_secret'],
  access_token: API_KEYS['access_token'],
  access_token_secret: API_KEYS['access_token_secret'],
  timeout_ms: 6 * 1000,
  strictSSL: false
});

module.exports = bot;
