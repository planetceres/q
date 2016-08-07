var mongoose = require('mongoose');

var tweetDataSchema = require('./tweetDataSchema');
var userSchema = require('./attributesSchema');
var userSearchSchema = require('./userSearchSchema');
var userActionSchema = require('./userActionSchema');
var userLocationSchema = require('./userLocationSchema');
var trendsSchema = require('./trendsSchema');

exports.TweetData = mongoose.model('TweetData', tweetDataSchema);
exports.UserAttributes = mongoose.model('Attributes', userSchema);
exports.UserSearch = mongoose.model('UserSearch', userSearchSchema);
exports.UserAction = mongoose.model('UserAction', userActionSchema);
exports.UserLocation = mongoose.model('UserLocation', userLocationSchema);
exports.Trends = mongoose.model('Trends', trendsSchema);