var twit = require('twit');

var twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY ||  require('../config/config.js').twitter.consumer_key;
var twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET ||  require('../config/config.js').twitter.consumer_secret;
var twitter_access_token = process.env.TWITTER_ACCESS_TOKEN ||  require('../config/config.js').twitter.access_token;
var twitter_access_secret = process.env.TWITTER_ACCESS_SECRET ||  require('../config/config.js').twitter.access_secret;
var twitter_username = process.env.TWITTER_USERNAME ||  require('../config/config.js').twitter.username;

exports.twitter_client = twit(twitter_consumer_key, twitter_consumer_secret, twitter_access_token, twitter_access_secret, twitter_username);
exports.handler = twilio;
exports.authToken = authToken;
exports.num = twilioNum;