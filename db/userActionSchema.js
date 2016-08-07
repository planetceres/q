var mongoose = require('mongoose');

var userActionSchema = mongoose.Schema({
 action_called: String,
 date_called: Date
});

module.exports = userActionSchema;