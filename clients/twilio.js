var twilio = require('twilio');
var Config = require('../config/config.js'),
	config = new Config();

var accountSid = process.env.TWILIO_SID || config.twilio.account;
var authToken = process.env.TWILIO_AUTH || config.twilio.token;
var twilioNum = process.env.NUM || config.twilio.number;

exports.client = twilio(accountSid, authToken);
exports.handler = twilio;
exports.authToken = authToken;
exports.num = twilioNum;