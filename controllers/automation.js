
var request			= require("request");
var Trends          = require('../db/models').Trends;
var mongoose 		= require("mongoose");
var db 				= require('../db/database');

exports.fetchGoogleTrendData = function(){
  console.log("Load Google Trends")

  request.get("http://hawttrends.appspot.com/api/terms/", function(err, res, data) {

	// call the bot to get results of the search
    if(err) return console.error(err);
    var results = JSON.parse(data);

    var t = results;
    var trendsList = [];
    console.log("TRENDS: " + t['1'].length)
    for (var i = 0; i < t['1'].length; i++){
      var trend = t['1'][i];
      trendsList.push(trend);
    }
    console.log(trendsList)
    var numbered = [];
    //var limitResults = 7;
    for (var i = 0; i < trendsList.length; i++){
      var num = i + 1
      numbered.push(num + ". " + trendsList[i]);
    }
    var numLimit = numbered.slice(0,8)
    var rList = numLimit.join("\n")

    var options = {
      trends_list: trendsList,
      date_called: new Date()
    };

    //console.log("Trends" + JSON.stringify(options))
    var newTrends = new Trends(options);

	console.log("save trends")

    newTrends.save(function(err) {
      //if (err) return callback(err, null);
      if (err){
        console.log("ERROR SAVING TRENDS: " + err)
      }
      console.log("Trends Saved")
      return
      //callback(null, newUser);
    });

	  t = null;
  })
}