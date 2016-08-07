var mongoose = require('mongoose');
var tweetDataSchema = require('./tweetDataSchema');
var userSearchSchema = require('./userSearchSchema');
var userActionSchema = require('./userActionSchema');
var userLocationSchema = require('./userLocationSchema');

var attributesSchema = mongoose.Schema({
	id: String,
	googleid: Number,
	name: String,
	last_name: String,
	first_name: String,
	phone_number: String,
	avatar_image: String,
	gender: String,
	language: String,
	email: String,
	gmail: String,
	daily_text: { type: Boolean, default: true },
	tweetdata: [tweetDataSchema],
	searches: [userSearchSchema],
	actions: [userActionSchema],
	locations: [userLocationSchema],
	last_action: String
});


module.exports = attributesSchema;