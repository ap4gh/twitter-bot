const twit = require('twit');
const rss_parser = require('rss-parser');

const API_KEYS = require('./api_keys.json');

const bot = new twit({
  consumer_key: API_KEYS['consumer_key'],
  consumer_secret: API_KEYS['consumer_secret'],
  access_token: API_KEYS['access_token'],
  access_token_secret: API_KEYS['access_token_secret'],
  timeout_ms: 6 * 1000,
  strictSSL: false
});

const parser = new rss_parser();

const new_tweet_content = [];
const old_tweet_content = [];

const topics = [
  'javascript',
  'reactjs',
  'nodejs',
  'linux',
  'webdev',
  'python',
  'golang',
  'devops',
  'css',
  'c'
];

const send = async () => {
  const t = new_tweet_content.shift();
  old_tweet_content.push(t);
  bot.post('statuses/update', { status: t }, function(err, data, response) {
    if (err) console.log(err.message);
    console.log(
      `${new Date(data.created_at).toString()} Tweet Sent: ${data.id}\n`
    );
  });
};

const add_tweet = async () => {
  await topics.forEach(async topic => {
    let feed = await parser.parseURL(`https://hnrss.org/newest?q=${topic}`);
    for (i = 0; i < 2; i++) {
      const c =
        feed['items'][i]['title'] +
        ' ' +
        feed['items'][i]['link'] +
        ` #${topic}`;
      if (!new_tweet_content.includes(c) && !old_tweet_content.includes(c)) {
        new_tweet_content.push(c);
      }
    }
  });
};

add_tweet();
setInterval(add_tweet, 19 * 60 * 1000);
setInterval(send, 10 * 60 * 1000);
