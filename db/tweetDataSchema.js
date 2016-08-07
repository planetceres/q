var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
 twitter_post_id: Number,
 twitter_user_id: Number,
 twitter_external_url: String,
 twitter_url: String,
 twitter_text: String,
 twitter_media_url: String,
 twitter_created_at: Date, 
 searched_term: String,
 date_called: Date
});

module.exports = dataSchema;