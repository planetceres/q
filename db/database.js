var mongoose        = require("mongoose");
var autoIncrement 	= require('mongoose-auto-increment');

mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/qalpha';
console.log("MONGO URI (Server)")
console.log(mongoURI)
mongoose.connect(mongoURI);
var db = mongoose.connection

autoIncrement.initialize(db);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 console.log('Mongodb connection open');
});
console.log(process.memoryUsage())

module.exports = db;