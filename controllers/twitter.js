var TweetData       = require('../db/models').TweetData;
var UserAttributes  = require('../db/models').UserAttributes;
var UserController  = require('../controllers/userController');
var Trends          = require('../db/models').Trends;
var Config          = require('../config/config.js')
  , config          = new Config();
var Twit            = require('twit')
  , config1         = config.twitter;
var bot             = new Twit(config1);
var wordfilter      = require('wordfilter');
var db              = require('../db/database');

var searchController = require('../plugins/search')
var utils           = require('../controllers/utils')

var Promise         = require('bluebird');

P_WEIGHT = 2;
F_WEIGHT = 1;
U_WEIGHT = 1.25;
U_BIAS = 17.5;

exports.searchTwitter = function(data){

	var params = {
        q: data
      , since: exports.dateString
      , result_type: 'popular'
      , count: 50
      , lang: 'en'
      //, lang: user_attributes.language
    };
	var t = bot.get('search/tweets', params)
	.then(function(tweets){
		console.log("RESULTS LENGTH: " + tweets.data.statuses.length)
	  var tweets = tweets.data.statuses
	  var tarray = [];
      for(var k = 0; k < tweets.length; k++) {
        var tweet = tweets[k];
        console.log(k + ": " + tweet.text)
        tarray.push(tweet.text)
      };
      return tarray
	});
	params = null;
	t = null;
};



//get date string for today's date (e.g. '2011-01-01')
exports.dateString = function () {
  //var d = new Date(Date.now() - 5*60*60*1000);  //est timezone
  // var d = new Date(Date.now() - 8*60*60*1000);
  var d = new Date(Date.now() - 32*60*60*1000);
  console.log("date:" + " " + d)
  console.log(d.getUTCFullYear()   + '-' +  (d.getUTCMonth() + 1) + '-' +   d.getDate())
  return d.getUTCFullYear()   + '-'
     +  (d.getUTCMonth() + 1) + '-'
     +   d.getDate();
};

exports.fetchApiTrendData = function(){
      var params = {
          id: 23424977 // WOEID for USA 
        , exclude: 'hashtags'
      };

      // call the bot to get results of the search
      var t = bot.get('trends/place', params, function (err, reply) {
        if(err) return handleError(err);

        var t = reply[0];
        var trendsList = [];
        for (var i = 0; i < t.trends.length; i++){
          var trend = t.trends[i];
          trendsList.push(trend.name);
        }
        var numbered = [];
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

        var newTrends = new Trends(options);

        newTrends.save(function(err) {
          if (err){
            console.log("ERROR SAVING TRENDS: " + err)
          }
          console.log("Trends Saved")
        });
      });
      t = null;
}

exports.initiateSearch = function(attributes, query){

      try {
        var language = attributes.language || 'en'
      } catch(e) {
        var language = 'en'
      }
      var date = exports.dateString()
      var params = {
          q: query
        , since: date
        , result_type: 'popular'
        , count: 50
        , lang: language
      };

     return exports.searchRetrieval(attributes, query, params)

}

  exports.searchRetrieval = function(attributes, query, params, callback){

    var searchResult;

    // first try a popular search on Twitter
    bot.get('search/tweets', params, function(err, data, response){
      if (err) return console.error(err);
      if (!data) {
        utils.sendTextVia(attributes.last_action, "Sorry, it appears that someone's server is down. I'm not getting any responses from my friends on the web. Try again in a few minutes.");
        return console.log("Timeout - no data")
      }

      var tweets = exports.filterRetweets(data.statuses) || [];

      // Put tweets through a blacklist filter 
      tweets = exports.filterBlacklist(tweets);
      if (tweets.length > 0){
        var seenRequest = exports.checkSeenRequest(attributes.tweetdata, tweets) || [];
        var resultsNew = exports.resultsNew(tweets, seenRequest);
      } else {
        var resultsNew = false;
      }
      

      // Branch 2: If there are no results in the first query change result_type to 'recent' and search again
      if ((resultsNew == false) && (params.result_type == 'popular')){
        return exports.expandSearch(attributes, query)
      // Branch 3: If there were no results in the second search either
      } else if ((resultsNew == false) && (params.result_type == 'recent')){
        var text = "Sorry, I'm not finding much about that right now. Can I look for anything else?"

        return utils.sendTextVia(attributes.last_action, text)
      };

      if (tweets != undefined){
        var resultAttr = exports.sortResults(tweets, attributes);
        var tweet = resultAttr[0]
          , text = resultAttr[1]
          , author = resultAttr[2]
          , rIndex = resultAttr[3]
          , media = resultAttr[4]
          , url = resultAttr[5];

        // Now that we have results, send message. If there is media, send a MMS message, if not send SMS.
        // to do: check whether user accepts MMS
        if (author != ""){
          text = text + "\n\n" + rIndex + "%" + " (via " + author + ")";
        } else {
          text = text + "\n\n" + rIndex + "%";
        }
        if (url != ""){
          text = text + "\n" + url
        }
        if (media != "") {
          console.log("Media Message")
          console.log(text)
          console.log(media)
          console.log(process.memoryUsage())
          utils.sendMediaVia(attributes.last_action, text, media);
          exports.writeTwitterData(attributes, tweet, query);
          return resultAttr

        } else {
          console.log("SMS Message")
          console.log(text)
          console.log(process.memoryUsage())
          utils.sendTextVia(attributes.last_action, text);
          exports.writeTwitterData(attributes, tweet, query);
          return resultAttr
        }
      } 
    }, function (err, response){
      return callback(err, response)
    })


}, function(err, callback){
  return callback
};

exports.expandSearch = function(attributes, query){
  try {
    var language = attributes.language || 'en'
  } catch(e) {
    var language = 'en'
  }
  var date = exports.dateString()

  var params = {
      q: query
    , since: date
    , result_type: 'recent'
    , count: 50
    , lang: language
  };
 return exports.searchRetrieval(attributes, query, params)
}

// Find the most relevant result based on secret algorithm 
exports.sortResults = function(tweets, attributes){
  var i = tweets.length
  , max = 0
  , popular
  , author
  , media;

  // Since we determined that there are results the user hasn't seen, let's set the first one to the result to be returned
  var searchResult = exports.firstUnseen(attributes.tweetdata, tweets)
  
  var popular = searchResult.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    , author = exports.findAuthor(searchResult)
    , urls = exports.findUrls(searchResult)
    , moreUrl = exports.setUrl(urls, searchResult)
    , media = exports.findMedia(searchResult)
    , pfScore = exports.calculatePfScore(searchResult)
    , rIndex = exports.calculateRiseIndex(pfScore);


  var resultAttr = [searchResult, popular, author, rIndex, media, moreUrl]

  // see how popular each result is, and set it as the result to be returned
  while(i--) {
    var tweet = tweets[i];

    var pfScore = exports.calculatePfScore(tweet);

    var seenRequest = exports.checkSeenRequest(attributes.tweetdata, tweets) || [];
    // check previously retreived tweets and add them to an array
    for(var j = 0; j < attributes.tweetdata.length; j++) {
      if(attributes.tweetdata[j].twitter_post_id == tweet.id){
        seenRequest.push(tweet.id);
      } 
    }

    // Get the result that is has the highest pfScore and has not been previously seen
    if((pfScore > max) && (seenRequest.indexOf(tweet.id) < 0 )) {

      max = pfScore;
      popular = tweet.text;
      searchResult = tweet;
      author = exports.findAuthor(tweet);
      // check for media in tweets and save the url if it is there
      media = exports.findMedia(tweet);
      urls = exports.findUrls(tweet)
      moreUrl = exports.setUrl(urls, tweet);

      // Calculate rise index from pfScore (for now)
      var rIndex = exports.calculateRiseIndex(pfScore);


      // remove hyperlinks from text
      var popular = popular.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

      resultAttr = [searchResult, popular, author, rIndex, media, moreUrl]

    } 
  }
  return resultAttr


};

// calculate pfScore to prioritize search result delivery
exports.calculatePfScore = function(tweet){
    var popularity = tweet.retweet_count
      , favorited = tweet.favorite_count
      , followers = tweet.user.followers_count
      , pweight = P_WEIGHT
      , fweight = F_WEIGHT
      , uweight = U_WEIGHT
      , ubias = U_BIAS;

    // secret algorithm
    if (followers < 100){
      ubias = ubias - 2.5 
    }
    var userRatio = ubias + (followers * uweight) * 25 / 1000000

    if (((popularity + favorited) > 0) && (followers > 25) ){
      var pfScore = (((popularity*pweight) + (favorited*fweight)) / followers) * userRatio
      return pfScore
    } else {
      var pfScore = 0;
      console.log("ZERO VALUE PRESENT: pfScore = " + pfScore)
      return pfScore
    }
};

// calculate the rise Index as a measure of trending vs relevance
exports.calculateRiseIndex = function(pfScore){
  // Calculate rise index from pfScore (for now)
  if (pfScore >= 1){
    var r = 100;
  } else {
    var r = (pfScore*100);
  }
  if (r < 10){
    var rIndex = r.toFixed(1);
  } else {
    var rIndex = r.toFixed(0);
  }
  return rIndex
};

// Send message via last route (Phone, Hangout, etc.)
exports.sendVia = function(attributes, message, media){

};

// Check results for tweets that are already seen. For those that are, push them to an array.
exports.checkSeenRequest = function(history, tweets) {
  var m = tweets.length;
  var seenRequest = [];
  while(m--) {
    var tweet = tweets[m]
    for(var j = 0; j < history.length; j++) {
      if (history[j].twitter_post_id == tweet.id) {
        seenRequest.push(tweet.id);
      } 
    }
  };

  return seenRequest
};

// Are any of the results new? If not, set resultsNew to false
exports.resultsNew = function(tweets, seenRequest) {
  if (seenRequest.length >= tweets.length){
    return false
  } else {
    return true
  };
};

// Remove Retweets from results
exports.filterRetweets = function(tweets){
  var i = tweets.length;
  var filterRetweets = [];

  while(i--) {
    var message = tweets[i].text;

    if (message) {
      var m = message;
      var userCommand = m.trim(); 
      var w = userCommand.substr(0, userCommand.indexOf(' '));

      // If the returned phrase starts with "RT", it is a retweet
      if (w === "RT") {

      // if tweet is new, push it to the new array
      } else {
        filterRetweets.push(tweets[i])
      };
    };

  };
  return filterRetweets
};

// Filter potentially offensive content
exports.filterBlacklist = function(tweets){
  var p = tweets.length;
  var filterBlacklist = [];

  // if using custom blacklist, use the following
  // var b = black;
  // 
  // console.log(b)

  for(var x = 0; x < p; x++) {
    var w = tweets[x].text.toLowerCase();

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
        filterBlacklist.push(tweets[x])
      } else {
        console.log("Wordfilter BLACKLISTED: " +  listed)
        console.log(w)
      }
    };
  };
  return filterBlacklist
}


// Find the author of the result
exports.findAuthor = function(searchResult){
  try{
    author = searchResult.user.name;
    return author
  } catch(e) {
    console.log("Error getting Author: ", e)
    author = "";
    return author
  };
}

// check for media in tweets and save the url if it is there
exports.findMedia = function(tweet) {
  try { 
    tweet.entities.media[0].media_url
    media = tweet.entities.media[0].media_url
    return media
  } catch(e) {
    console.log("no media found", e)
    media = ""
    return media
  };
};

// Find Urls
exports.findUrls = function(tweet){
  try {
    var urlArray = [];
    console.log("Urls count: " + tweet.entities.urls.length)
    for (var i = tweet.entities.urls.length - 1; i >= 0; i--) {
      if (tweet.entities.urls.length > 0){
        if (tweet.entities.urls[i].url){
          urlArray[0] = tweet.entities.urls[i].url;
        } else {
          urlArray[0] = "";
        };
        if (tweet.entities.urls[i].expanded_url){
          urlArray[1] = tweet.entities.urls[i].expanded_url;
        } else {
          urlArray[1] = "";
        };
        if (tweet.entities.urls[i].display_url){
          urlArray[2] = tweet.entities.urls[i].display_url;
        } else { 
          urlArray[2] = "";
        };
      } else {
        urlArray = ["","",""];
      };
    };
    return urlArray
  } catch(e) {
    console.log("Error getting entities", e)
    var urlArray = "";
    return urlArray
  }
};


// returns the first unseen search result in the user's language 
exports.firstUnseen = function(userResults, tweets){
  var n = tweets.length;
  var len = userResults.length;

  while(n--) {


    if (len > 0){
      // check previously retreived tweets and return the first that is unseen by the user
      for(var j = 0; j < len; j++) {
        if (userResults[j].twitter_post_id == tweets[n].id) {
          console.log("Marked as seen: " + userResults[j].twitter_post_id)
        } else {
          return tweets[n];
        }
      }
    } else {
      return tweets[n];
    }
  };
};

// Make a twitter link from ID 
exports.linkTwitterId = function(tweet){
  if (tweet.user.screen_name){
    var linkTwitter = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str
  } else {
    var linkTwitter = "";
  }
  return linkTwitter
};

exports.setUrl = function(urls, tweet){
  var tweet = tweet;
  if (urls != ""){
    // use urls[2] to leave links like youtu.be/[id] bloom.bg/[id] bit.ly/[id]
    var moreUrl = urls[1];

    // if a link is more than 24 characters, use the t.co link until we have our own link shortener
    // by using the long link with the 'http://' it tells twilio to use it's own link shortener
    if (moreUrl.length > 24){
      moreUrl = urls[1]
    }
    return moreUrl
  } else {
    var moreUrl = exports.linkTwitterId(tweet);
    return moreUrl
  }
}

// writes the twitter search result to the DB
exports.writeTwitterData = function(attributes, twitterResult, term) {
  var newTwitterData = {
    twitter_post_id: twitterResult.id,
    twitter_user_id: twitterResult.user.id,
    twitter_created_at: twitterResult.created_at,
    searched_term: term,
    date_called: new Date()
  };

  attributes.tweetdata.push(newTwitterData);

  attributes.save(function(err) {
    if (err) return console.error(err);
    console.log("Twitter data saved successfully");
  });
};