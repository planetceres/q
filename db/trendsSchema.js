var mongoose = require('mongoose');

var trendsSchema = mongoose.Schema({
 trends_list: String,
 date_called: Date
});

module.exports = trendsSchema;