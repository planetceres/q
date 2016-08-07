var Config          = require('../config/config.js')
  , config          = new Config();
var UserController  = require('../controllers/userController');
var request         = require("request");
var moment          = require('moment');

// For building queries outside the scope of npm APIs use https://webhose.io/api

exports.initiateSearch = function(attributes, query) {

	var e;
	var exclude = "-" + "(site%3A" + e + ")"
	//spam threshold 0-1, 1 is most spammy content, 0 is none
	var spam_score = 0.8;
	var lang = "english"
  	request.get("https://webhose.io/search?token=" + config.webhose.key + "&format=json&q=" + query + "%20language%3A(" + lang + ")&site_type=news", function(err, res, body) {

      if (err){
      	console.log("error fetching content")
      	//return cb(null, "I can't find much right now.");
      }
      console.log("results")


      var results = JSON.parse(body);
      console.log(results)
      if (results.length != 0) {

      	// convert float temperature into whole number
      	var n = function(value){
      		return value | 0
      	}
      } else {
      }
    });

}