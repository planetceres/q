var twitter         = require('../controllers/twitter');
var webhose         = require('../controllers/webhose');
var utils         	= require('../controllers/utils');
var UserController  = require('../controllers/userController');
var request 		= require("request");
var Config          = require('../config/config.js')
  , config          = new Config();
var moment 			= require('moment');


// get 5-day weather forecast from Open Weather API
exports.getWeatherForecast = function(query, cb) {
	var location = query;
	if ((location != "undefined" )&&(location != "")){
		var uid = this.user.id;
	    request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + config.google.geocode, function(err, res, data) {
			if (err){
				console.log("error fetching weather")
				return cb(null, "I can't find the weather for "+location+" right now.");
			}
			console.log("Geocode:")

			// this is necessary due to a bug in superscript https://github.com/silentrob/superscript/issues/262 that passes a function instead of string for Superscript to parse
			try {
				var geo = JSON.parse(data);
				var lat = geo.results[0]['geometry']['location']['lat']
				var lng = geo.results[0]['geometry']['location']['lng']
				console.log("Lat: " + lat + "Long: " + lng)
			} catch(err) {
				console.error("error parsing geo data: " + err)				
				// Leave Superscript to tell the user the search wasn't completed
				UserController.findUser(uid, function(attributes, done){
					return utils.sendTextVia(attributes.last_action, "Sorry, I didn't understand.");
				});
				return console.error(err)
			}
	      
	  	    request.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lng + "&APPID="+config.weather.appid+"&type=like&units=imperial&cnt=5&mode=json", function(err, res, body) {  
	  	      if (err){
		      	console.log("error fetching weather")
		      	return cb(null, "I can't find the weather forecast for "+location+" right now.");
		      }

		      var results = JSON.parse(body);
		      if (results.list.length != 0) {
		      	var city_name = results.city['name']
		      	var time0 = moment().add(0, 'days').format("dddd")
		      	var time1 = moment().add(1, 'days').format("dddd")
		      	var time2 = moment().add(2, 'days').format("dddd")
		      	var time3 = moment().add(3, 'days').format("dddd")
		      	var time4 = moment().add(4, 'days').format("dddd")

				// convert float temperature into whole number
		      	var n = function(value){
		      		return value | 0
		      	}

		      	var forecast0 = time0 + ": " + n(results.list[0]['temp']['day']) + "°F and " + results.list[0]['weather'][0]['description'].toLowerCase()
		      	var forecast1 = time1 + ": " + n(results.list[1]['temp']['day']) + "°F and " + results.list[1]['weather'][0]['description'].toLowerCase()
		      	var forecast2 = time2 + ": " + n(results.list[2]['temp']['day']) + "°F and " + results.list[2]['weather'][0]['description'].toLowerCase()
		      	var forecast3 = time3 + ": " + n(results.list[3]['temp']['day']) + "°F and " + results.list[3]['weather'][0]['description'].toLowerCase()
		      	var forecast4 = time4 + ": " + n(results.list[4]['temp']['day']) + "°F and " + results.list[4]['weather'][0]['description'].toLowerCase()

		      	var fiveDay = forecast0 + "\n" + forecast1 + "\n" + forecast2 + "\n" + forecast3 + "\n" + forecast4

		      	UserController.writeLocationData(uid, location, "weather", lng, lat);

		        cb(null, results.city['name'] + "\n\n" + fiveDay +"\n\n ^topicRedirect(accuracy_check, satisfied)");  

		      } else {
		        cb(null, "I can't find the weather for "+location+" right now.");
		      }
		    });
	    });
	} else {
		return cb(null, "^topicRedirect(weather_daily, daily)")
	}
}

// get current weather from forecast.io api 
exports.getWeather = function(query, cb) {
		console.log("Current Topic: " + this.user.currentTopic)
	console.log("message IN SEARCH FUNCTION: " + JSON.stringify(this.message))
	console.log("nouns IN SEARCH FUNCTION: " + JSON.stringify(this.message.nouns))
	console.log("cNouns IN SEARCH FUNCTION: " + JSON.stringify(this.message.cNouns))
	console.log("names IN SEARCH FUNCTION: " + JSON.stringify(this.message.names))
	console.log("verbs IN SEARCH FUNCTION: " + JSON.stringify(this.message.verbs))
	var location = query;
	if ((location != "undefined" )&&(location != "")){	
		console.log("Query: " + location)
		var uid = this.user.id;
	    request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + config.google.geocode, function(err, res, data) {
			if (err){
				console.log("error fetching weather")
				return cb(null, "I can't find the weather for "+location+" right now.");
			}
			console.log("Geocode:")

			// this is necessary due to a bug in superscript https://github.com/silentrob/superscript/issues/262 that passes a function instead of string for Superscript to parse
			try {
			var geo = JSON.parse(data);
			var lat = geo.results[0]['geometry']['location']['lat']
			var lng = geo.results[0]['geometry']['location']['lng']
			console.log("Lat: " + lat + "Long: " + lng)
			} catch(err) {
				console.error("error parsing geo data: " + err)
				// Leave Superscript to tell the user the search wasn't completed
				UserController.findUser(uid, function(attributes, done){
					return utils.sendTextVia(attributes.last_action, "Sorry, I didn't understand.");
				});
				return console.error(err)
			}
  		    request.get("https://api.forecast.io/forecast/" + config.forecast.key + "/" + lat + "," + lng, function(err, res, body) {

		      if (err){
		      	console.log("error fetching weather")
		      	return cb(null, "I can't find the weather for "+location+" right now.");
		      }
		      var results = JSON.parse(body);
		      if (results.length != 0) {

		      	// convert float temperature into whole number
		      	var n = function(value){
		      		return value | 0
		      	}

		      	UserController.writeLocationData(uid, location, "weather", lng, lat);
		        cb(null, "Right now in " + location + " its currently " + n(results.currently['temperature']) + "°F and " + results.currently['summary'].toLowerCase() +". \n\n ^topicRedirect(accuracy_check, satisfied)");  
		      } else {
		        cb(null, "I can't find the weather for "+location+" right now.");
		      }
		    });
	    });
	} else {
		return cb(null, "^topicRedirect(weather_daily, daily)")
	}
}

// To do: build out Forecast.io extended forecast
exports.getWeatherForecastIO = function(query, cb) {
	var location = query;
	if ((location != "undefined" )&&(location != "")){
		var uid = this.user.id;
	    request.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + config.google.geocode, function(err, res, data) {
			if (err){
				console.log("error fetching weather")
				return cb(null, "I can't find the weather for "+location+" right now.");
			}
			console.log("Geocode:")

			// this is necessary due to a bug in superscript https://github.com/silentrob/superscript/issues/262 that passes a function instead of string for Superscript to parse
			try {
				var geo = JSON.parse(data);

				var lat = geo.results[0]['geometry']['location']['lat']
				var lng = geo.results[0]['geometry']['location']['lng']
				console.log("Lat: " + lat + "Long: " + lng)

			} catch(err) {
				console.error("error parsing geo data: " + err)
				// Leave Superscript to tell the user the search wasn't completed
				UserController.findUser(uid, function(attributes, done){
					return utils.sendTextVia(attributes.last_action, "Sorry, I didn't understand.");
				});
				return console.error(err)
			}
	      
	  	    request.get("http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lng + "&APPID="+config.weather.appid+"&type=like&units=imperial&cnt=5&mode=json", function(err, res, body) {  
	  	      if (err){
		      	console.log("error fetching weather")
		      	return cb(null, "I can't find the weather forecast for "+location+" right now.");
		      }

		      var results = JSON.parse(body);
		      if (results.list.length != 0) {
		      	var city_name = results.city['name']
		      	var time0 = moment().add(0, 'days').format("dddd")
		      	var time1 = moment().add(1, 'days').format("dddd")
		      	var time2 = moment().add(2, 'days').format("dddd")
		      	var time3 = moment().add(3, 'days').format("dddd")
		      	var time4 = moment().add(4, 'days').format("dddd")

				// convert float temperature into whole number
		      	var n = function(value){
		      		return value | 0
		      	}

		      	var forecast0 = time0 + ": " + n(results.list[0]['temp']['day']) + "°F and " + results.list[0]['weather'][0]['description'].toLowerCase()
		      	var forecast1 = time1 + ": " + n(results.list[1]['temp']['day']) + "°F and " + results.list[1]['weather'][0]['description'].toLowerCase()
		      	var forecast2 = time2 + ": " + n(results.list[2]['temp']['day']) + "°F and " + results.list[2]['weather'][0]['description'].toLowerCase()
		      	var forecast3 = time3 + ": " + n(results.list[3]['temp']['day']) + "°F and " + results.list[3]['weather'][0]['description'].toLowerCase()
		      	var forecast4 = time4 + ": " + n(results.list[4]['temp']['day']) + "°F and " + results.list[4]['weather'][0]['description'].toLowerCase()

		      	var fiveDay = forecast0 + "\n" + forecast1 + "\n" + forecast2 + "\n" + forecast3 + "\n" + forecast4

		      	UserController.writeLocationData(uid, location, "weather", lng, lat);

		        cb(null, results.city['name'] + "\n\n" + fiveDay + "\n\n ^topicRedirect(accuracy_check, satisfied)");  
		      } else {
		        cb(null, "I can't find the weather for "+location+" right now.");
		      }
		    });
	    });
	} else {
		return cb(null, "^topicRedirect(weather_daily, daily)")
	}
}

exports.getWeatherForecastHourly = function(query, cb) {
	var location = query;
	    request.get("http://api.openweathermap.org/data/2.5/forecast?q="+location+"&APPID="+config.weather.appid+"&type=like&units=imperial&cnt=5&mode=json", function(err, res, body) {
	      var results = JSON.parse(body);
	      if (results.list.length != 0) {
	      	var city_name = results.city['name']
	      	var time0 = moment(results.list[0]['dt_txt']).format("dddd")
	      	var time1 = moment(results.list[1]['dt_txt']).format("dddd")
	      	var time2 = moment(results.list[2]['dt_txt']).format("dddd")
	      	var time3 = moment(results.list[3]['dt_txt']).format("dddd")
	      	var time4 = moment(results.list[4]['dt_txt']).format("dddd")
	      	console.log("Times " + time0 + " " + time1 + " " + time2 + " " + time3 + " " + time4 + " " )

	      	// convert float temperature into whole number
	      	var n = function(value){
	      		return value | 0
	      	}

	      	var forecast0 = n(results.list[0]['main']['temp']['day']) + "°F and " + results.list[0]['weather'][0]['description'].toLowerCase()
	      	var forecast1 = n(results.list[1]['main']['temp']['day']) + "°F and " + results.list[1]['weather'][0]['description'].toLowerCase()
	      	var forecast2 = n(results.list[2]['main']['temp']['day']) + "°F and " + results.list[2]['weather'][0]['description'].toLowerCase()
	      	var forecast3 = n(results.list[3]['main']['temp']['day']) + "°F and " + results.list[3]['weather'][0]['description'].toLowerCase()
	      	var forecast4 = n(results.list[4]['main']['temp']['day']) + "°F and " + results.list[4]['weather'][0]['description'].toLowerCase()
	      	console.log(forecast0)
	      	console.log(forecast1)
	      	console.log(forecast2)
	      	console.log(forecast3)
	      	console.log(forecast4)



	        cb(null, results.city['name'] + "\n\n" + results.list[0]['dt_txt'] + ": " + results.list[0]['main']['temp']['day'] + "°F and " + results.list[0]['weather'][0]['description'].toLowerCase());  
	      } else {
	        cb(null, "I can't find the weather for "+location+" right now.");
	      }
	    });
}

exports.getGoogleTrends = function(cb) {
	console.log("Current Topic: " + this.user.currentTopic)
	console.log("message IN SEARCH FUNCTION: " + JSON.stringify(this.message))
	var uid = this.user.id;
	
	// Leave Superscript to get search results
	UserController.findUser(uid, function(attributes, done){
		return utils.fetchGoogleTrends(attributes.last_action)
	})
	//cb(null);
	return
}


// To Do: Build out this function so as to not rely so heavily on twitter
exports.getArticles = function(query, cb) {
	//console.log("USER IN SEARCH FUNCTION: " + this.user)
	console.log("Current Topic: " + this.user.currentTopic)
	console.log("message IN SEARCH FUNCTION: " + JSON.stringify(this.message))
	//console.log("Current Topic: " + this.message)
	var uid = this.user.id;
	
	// Leave Superscript to get search results
	UserController.findUser(uid, function(attributes, done){
		return webhose.initiateSearch(attributes, query)
	})
	//cb(null);
	return
}

exports.getCatchAll = function(query, cb) {

	var names = this.message.names
	var nouns = this.message.nouns
	var adj = this.message.adjectives
	var terms = [];
	// pull out any names to search. If not, pull out nouns.
	// TO DO: use both, but remove duplicate words
	if (names.length >= 1){
		//terms = names;
		terms.push.apply(terms, names)
	}

	if (nouns.length >= 1){
		terms.push.apply(terms, nouns)
		//terms = nouns;
	} else {
		//terms = []
		return cb(null, "I don't know what you're talking about.")
	}

	// add any adjectives 
	if ((terms.length >= 1) && (adj.length >= 1)) {
		terms.push.apply(terms, adj)
	}

	// remove duplicates
	terms = terms.filter(function(item, pos){
		return terms.indexOf(item) == pos;
	})

	for (var i = terms.length-1; i >= 0; i--) {
		if (terms[i] === "i") {
			terms.splice(i, 1);
		}
	}

	if(terms.length >= 1){
		terms = utils.filterBlacklist(terms)
		if(terms.length >= 1){
			var t = terms.join(" ")
			var uid = this.user.id;
		
			// Leave Superscript to get search results
			UserController.findUser(uid, function(attributes, done){
				return twitter.initiateSearch(attributes, t)
			//return webhose.initiateSearch(attributes, query)
			// cb(null, "search " + terms)
			})
		} else {
		 return cb(null, "Let's try to have a civilized conversation.")
		}
	} else {
		 return cb(null, "I don't know what you're talking about.")
	}
}

exports.getCatchAllCommand = function(query, cb) {

	var names = this.message.names
	var nouns = this.message.nouns
	var adj = this.message.adjectives
	var terms = [];
	// pull out any names to search. If not, pull out nouns.
	// TO DO: use both, but remove duplicate words
	if (names.length >= 1){
		//terms = names;
		terms.push.apply(terms, names)
	}

	if (nouns.length >= 1){
		terms.push.apply(terms, nouns)
		//terms = nouns;
	} else {
		//terms = []
		return cb(null, "I don't know what you're talking about.")
	}

	// add any adjectives 
	if ((terms.length >= 1) && (adj.length >= 1)) {
		terms.push.apply(terms, adj)
	}

	// remove duplicates
	terms = terms.filter(function(item, pos){
		return terms.indexOf(item) == pos;
	})

	for (var i = terms.length-1; i >= 0; i--) {
		if (terms[i] === "i") {
			terms.splice(i, 1);
		}
	}

	if(terms.length >= 1){
		terms = utils.filterBlacklist(terms)
		if(terms.length >= 1){
			var t = terms.join(" ")
			var uid = this.user.id;
		
			// Leave Superscript to get search results
			UserController.findUser(uid, function(attributes, done){
				return twitter.initiateSearch(attributes, t)
			//return webhose.initiateSearch(attributes, query)
			// cb(null, "search " + terms)
			})
		} else {
		 return cb(null, "Let's try to have a civilized conversation.")
		}
	} else {
		 return cb(null, "I don't know what you're talking about.")
	}
}


exports.getWikiNameSearch = function(query, cb) {

	var names = this.message.names
	var terms = [];
	var uid = this.user.id;
	// pull out any names to search
	if (names.length >= 1){
		terms.push.apply(terms, names)
	}	

	if(terms.length >= 1){
		terms = utils.filterBlacklist(terms)
		if(terms.length >= 1){
			var name = terms.join(" ")
			
			// Leave Superscript to get search results
			UserController.findUser(uid, function(attributes, done){
    
			    request.get("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info%7Cextracts&titles=" + name + "&inprop=url%7Cdisplaytitle&exchars=140&exintro=1&explaintext=1", function(err, res, data) {
					if (err){
						console.log("error fetching wiki")
						return cb(null, "I don't know who " + name + " is.");
					}
					console.log("name:")

					// this is necessary due to a bug in superscript https://github.com/silentrob/superscript/issues/262 that passes a function instead of string for Superscript to parse
					try {
						var wiki = JSON.parse(data);
						console.log("Wiki data")
						console.log(wiki.query['pages'])

						// need the key from the wikipedia article page
						var k = Object.keys(wiki.query.pages)
						var bio = wiki['query']['pages'][k]['extract']
						var url = wiki['query']['pages'][k]['canonicalurl']
						var text = bio + " " + url
						UserController.findUser(uid, function(attributes, done){
							return utils.sendTextVia(attributes.last_action, text);
						});

					} catch(err) {
						console.error("error parsing wiki data: " + err)
						// Leave Superscript to tell the user the search wasn't completed
						UserController.findUser(uid, function(attributes, done){
							return utils.sendTextVia(attributes.last_action, "Sorry, I didn't understand.");
						});
						return console.error(err)
					}
			    });
			})
		} else {
		 return cb(null, "Let's try to have a civilized conversation.")
		}
	} else {
		 return cb(null, "I don't know what you're talking about.")
	}






}

exports.getSearchTerms = function(query, query2, cb) {

	var terms = query + " " + query2
	terms = terms.split(" ")
	console.log(terms)

	// remove duplicates
	terms = terms.filter(function(item, pos){
		return terms.indexOf(item) == pos;
	})

	console.log(terms)

	// remove first person "i" from terms
	for (var i = terms.length-1; i >= 0; i--) {
		if (terms[i] === "i") {
			terms.splice(i, 1);
		}
	}

	if(terms.length >= 1){
		terms = utils.filterBlacklist(terms)
		if(terms.length >= 1){
			var t = terms.join(" ")
			var uid = this.user.id;
		
			// Leave Superscript to get search results
			UserController.findUser(uid, function(attributes, done){
				return twitter.initiateSearch(attributes, t)
			})
		} else {
		 return cb(null, "Let's try to have a civilized conversation.")
		}
	} else {
		 return cb(null, "I don't know what you're talking about.")
	}
}

exports.getSearchResult = function(query, cb) {
	var uid = this.user.id;
	
	// Leave Superscript to get search results
	UserController.findUser(uid, function(attributes, done){
		return twitter.initiateSearch(attributes, query)
	})
	//cb(null);
	return
}


// To Do: Build out more functions to give Q a concept of time relevance, and time of last interaction. (i.e. "What have I missed, Q?")

exports.getSearchTimeResult = function(query, cb) {
	cb(null, "Eh. You haven't missed much " + query);
}

exports.getSearchTimeNoneResult = function(cb) {
	cb(null, "Nothing, really.");
}

exports.getPhone = function(cb) {
	console.log(this.user.id)
	cb(null, "I got it " + this.user.id);
}


//generic write data function
//exports.attrWrite = function(option, value, cb){

//}

exports.hasFirstName = function(bool, cb) {
	console.log("Get First Name")
	console.log("BOOL: " + bool)

  this.user.getVar('firstName', function(e,name){
    if (name != null) {
    	console.log("Name: Not Null")
      cb(null, (bool == "true") ? true : false )
    } else {
    	console.log("Name: Yes null")
      // We have no name
      cb(null, (bool == "false") ? true : false )
    }
  });
}

exports.checkEmo = function(bool, cb) {

  if (this.message.word != "emohello") {
		console.log("Name: Not emohello")
      cb(null, false )
    } else {
    	console.log("Name: Yes emohello")
      // We have no name
      cb(null, true )
    }
}

exports.hasUserPhone = function(bool, cb) {

  this.user.getVar('userPhone', function(e,name){
    if (name !== null) {
    	console.log("Not Null")
      cb(null, true)
    } else {
    	console.log("Yes null")
      // We have no name
      cb(null, false)
    }
  });
}