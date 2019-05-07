const fs = require('fs');
const RssParser = require('rss-parser');
const bot = require('./bot');

const parser = new RssParser();
const tweetsJSON = fs.readFileSync('tweets.json');
const oldTweets = JSON.parse(tweetsJSON)['tweets'];

let lastTweetTopic = '';

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
  let t;

  const topic = topics[Math.floor(Math.random() * topics.length)];

  if (lastTweetTopic === topic) return randomContent();
  lastTweetTopic = topic;

  let feed = await parser.parseURL(`https://hnrss.org/newest?q=${topic}`);

  for (let i = 0; i < 10; i++) {
    t = `${feed['items'][i]['title']} ${feed['items'][i]['link']}\n\n#${topic}`;
    if (!oldTweets.includes(t)) break;
  }

  if (oldTweets.includes(t)) return randomContent();
  return t;
};

const send = async () => {
  const tweet = await randomContent();
  oldTweets.push(tweet);

  bot.post('statuses/update', { status: tweet }, function(err, data, response) {
    if (err) return process.stdout.write(`${err.message}\n`);
    fs.writeFileSync('tweets.json', JSON.stringify({ tweets: oldTweets }));
    process.stdout.write(
      `${new Date(data.created_at).toTimeString()} Tweet Sent: ${data.id}\n`
    );
  });
};

process.stdout.write('Process started ...\n');
const sendingIntervalId = setInterval(send, interval * 60 * 1000);

