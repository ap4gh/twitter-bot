const fs = require('fs');
const twit = require('twit');
const rss_parser = require('rss-parser');

const API_KEYS = require('./api_keys.json');
const tweets = fs.readFileSync('tweets.json');
const old_tweets = JSON.parse(tweets)['tweets'];
let last_tweet_topic = '';
const interval = 35;

const bot = new twit({
  consumer_key: API_KEYS['consumer_key'],
  consumer_secret: API_KEYS['consumer_secret'],
  access_token: API_KEYS['access_token'],
  access_token_secret: API_KEYS['access_token_secret'],
  timeout_ms: 6 * 1000,
  strictSSL: false
});

const interval = 45;

const topics = [
  'javascript',
  'reactjs',
  'nodejs',
  'webdev',
  'python',
  'golang',
  'mongodb',
  'webdesign'
];

const randomContent = async () => {
  let tweet;
  const topic = topics[Math.floor(Math.random() * topics.length)];
  if (last_tweet_topic === topic) return randomContent();
  last_tweet_topic = topic;
  let feed = await parser.parseURL(`https://hnrss.org/newest?q=${topic}`);
  for (let i = 0; i < 4; i++) {
    tweet = `${feed['items'][i]['title']} ${
      feed['items'][i]['link']
    }\n\n#${topic}`;
    if (!old_tweets.includes(tweet)) break;
  }
  if (old_tweets.includes(tweet)) return randomContent();
  return tweet;
};

const send = async () => {
  const t = await randomContent();
  old_tweets.push(t);
  bot.post('statuses/update', { status: t }, function(err, data, response) {
    if (err) console.log(err.message);
    const tweets_data = JSON.stringify({ tweets: old_tweets });
    fs.writeFileSync('tweets.json', tweets_data);
    console.log(
      `${new Date(data.created_at).toTimeString()} Tweet Sent: ${data.id}`
    );
  });
};

process.stdout.write('Process started ...\n');
setInterval(send, interval * 60 * 1000);
