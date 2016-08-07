var twilio          = require('../clients/twilio');
var xmpp            = require('simple-xmpp');
var qbot 		        = require("../qbot")
var Config          = require('../config/config.js')
  , config          = new Config();
var wordfilter      = require('wordfilter');
var Trends          = require('../db/models').Trends;
//var net             = require("net");

// Send Twilio text message
exports.sendSMS = function (recipient, sender, message) {
  twilio.client.messages.create({ 
      to: recipient, 
      from: sender, 
      body: message, 
  }, function(err, result) { 
      if (!err) {
        console.log('Success! The SID for this message is: ')
        console.log(result.sid);
        console.log('Message sent on')
        console.log(result.dateCreated)
      } else {
        console.log("Error sending message");
      } 
  });
};

// Send Twilio MMS message
exports.sendMMS = function (recipient, sender, message, mediaUrl) {
  twilio.client.messages.create({ 
      to: recipient, 
      from: sender, 
      body: message,
      mediaUrl: mediaUrl, 
  }, function(err, result) { 
      if (!err) {
        console.log('Success! The SID for this message is: ')
        console.log(result.sid);
        console.log('Message sent on')
        console.log(result.dateCreated)
      } else {
        console.log("Error sending message");
      } 
  });
};

exports.sendTextVia = function(handle, text){
	if (handle.substring(0, 1) == "+"){
		console.log("TWILIO handle");
		exports.sendSMS(handle, twilio.num, text);
	} else {
		console.log("xmpp handle")
		//console.log(JSON.stringify(xmpp)
		qbot.sendXMPP(handle, text);
	};
};

exports.sendMediaVia = function(handle, text, media){
	if (handle.substring(0, 1) == "+"){
		console.log("TWILIO handle")
		exports.sendMMS(handle, twilio.num, text, media);
	} else {
		console.log("xmpp handle")
		//console.log(JSON.stringify(xmpp)
		qbot.sendXMPPMedia(handle, text, media);
	};
};

// Filter potentially offensive content inbound to search
exports.filterBlacklist = function(query){
  var p = query.length;
  var filterBlacklist = [];

  // if using custom blacklist, use the following
  // var b = black;
  // 
  // console.log(b)

  for(var x = 0; x < p; x++) {
    var w = query[x];

    if (w) {
      var words = w.trim(); 
      var m = words.split(" ");

      var listed = wordfilter.blacklisted(words)

      // this call the custom blacklist instead of the wordlist module
      //var listed = b.some(function(v) {
          //return m.indexOf(v) >= 0;
        //});
      // console.log("BLACKLISTED: " +  listed)
      //console.log(w)

      if (listed != true ){
        // console.log("Not Blacklisted: " + m)
        filterBlacklist.push(query[x])
      } else {
        console.log("Wordfilter BLACKLISTED: " +  listed)
        console.log(w)
      }
    };
  };
  return filterBlacklist
}

exports.fetchGoogleTrends = function(attributes) {

      // Query the database for trends that have been pulled from twitter with exports.fetchApiTrendData
      Trends.findOne().sort({created_at: 'asc', _id: -1}).limit(1)
        .then(function(trends){
          var trendsList = trends.trends_list.split(',');
          var numbered = [];
          for (i = 0; i < trendsList.length; i++){
            var num = i + 1
            numbered.push(num + ". " + trendsList[i]);
          }
          var numLimit = numbered.slice(0,8)
          var rList = numLimit.join("\n")
          console.log(rList)

          exports.sendTextVia(attributes, "Rising:\n\n" + rList);
          callback(null, user_attributes);
        })
}
