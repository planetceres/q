var mongoose = require('mongoose');

var userLocationSchema = mongoose.Schema({
 search_term: String, // the string the user searched for in a location query
 search_via: String, // source, i.e. 'weather' if the user was looking for weather data
 date_called: Date,
 geo: {
 	type: [Number], // [<longitude>, <latitude>]
 	index: '2d'
 }
});

module.exports = userLocationSchema;