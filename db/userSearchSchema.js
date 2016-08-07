var mongoose = require('mongoose');

var userSearchSchema = mongoose.Schema({
 search_term: String,
 date_called: Date
});

module.exports = userSearchSchema;