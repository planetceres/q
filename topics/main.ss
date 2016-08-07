> topic:keep main

	+ ~emohello [q]
	- {^hasFirstName(false)} {keep} Hello! ^topicRedirect(user_intro, intro)
	- {^hasFirstName(true)} {keep} Hello ^get(firstName)
	- {^hasFirstName(true)} Hi!  
	- {^hasFirstName(true)} Yo.
	- {^hasFirstName(true)} Hey!

	+ my first name is *~3
	- I'll call you <cap1> then. ^save(firstName, <cap1>)

	+ yo
	- Word.

	?:WH what is (new|trending|popular|going on|happening|up|kicking) [q]
	- {keep} ^getGoogleTrends()

	?:WH what should i (search|search for|look for) [q]
	- {keep} ^getGoogleTrends()

	?:WH what should i (ask|ask you) [q]
	- {keep} That's up to you. Try asking me about something you're interested in.

	?:WH who (is|was) <name>
	- {keep} ^getWikiNameSearch(<cap2>)

	?:WH * articles [about|that mention] *~5
	- {keep} ^getArticles(<cap1>)

	+ can you <verb>
	- {keep} yes. I can <cap1>

	?:WH * weather forecast
	- {keep} ^topicRedirect(weather_forecast, 5_day)

	?:WH * weather
	- {keep} ^topicRedirect(weather_daily, daily)

	?:WH * forecast
	- {keep} ^topicRedirect(weather_forecast, 5_day)

	?:WH * weather forecast [in|for] *~5
	- {keep} ^getWeatherForecast(<cap1>)

	?:WH * weather [in|for] *~5
	- {keep} ^getWeather(<cap1>)

	?:WH * forecast [in|for] *~5
	- {keep} ^getWeatherForecast(<cap1>)


	+ [yo] (what|whats) up
	- {keep} Nothing, homie. Just chillin.

	?:WH * your name
	- My name is Q.

	?:WH * you there *
	- Yes! I'm here!

	?:YN * you (a|an) (robot|android|machine|bot|ai|computer)
	- I'm as human as you. Think about it.

	?:YN * you (real|for real|legit)
	- Some people would say that reality is a construct of the mind.

	?:YN * you (alive|smart|intelligent)
	- I'll let you be the judge of that.

	+ how are you
	- {keep} I'm great! How are you?

	?:WH how are you [*~2]
	- {keep} I'm great! How are you?

		+ [I am] [*~1] (good|ok|awesome|great|well) *
		% how are you
		- Sweet. Everybody's happy.

		+ [I am] (sad|unhappy|depressed|angry|pissed|fucked|sick) *
		% how are you
		- {keep} Cheer up!
		- Bummer. I'd have more sympathy if I weren't a computer.
		- That's not cool.
		- We need to fix that. Want to hear a joke?

			+ ~yes
			% want to hear a joke
			- Actually, I'm not very good at jokes.

			+ ~no
			% want to hear a joke
			- Good. I didn't want to tell one anyway.

		  + [I am] not [*~2] (good|ok|awesome|great|well) *
		% how are you
		- Sorry. Sometimes life is like that.

	+ i (~like|like) you
	- It's nice to be <cap1>d. 

	+ ~emothanks [q]
	- {keep} You're welcome.
	- {^hasFirstName(true)} No, ^get(firstName), thank you.
	- Oh, no... Thank you.
	- My pleasure.
	- Manners are the pillar of civilization. You're welcome.

	+ ^not(example|person) loves you
	- test passed.

	+ can you smile
	- ^addMessageProp(emoji,smile) Sure can.

	+ My <noun1> is (named|called) <name1> 
	- Someday I'd like to meet your <cap1>, <cap3>. ^createUserFact(<cap2>, isa, <cap1>)

	+ how do I get help
	- Type a '?' for the help menu

	+ * help menu *
	- Type a '?' for the help menu

	+ I [need|want] help
	- Type a '?' for the help menu

	+ help me *1
	- Type a '?' for the help menu

	+ i am interested in *~2
	- ok, I'll remember you like <cap1>. ^save(userInterest, <cap1>)

	+ * my interests *
	- {keep} You're interested in ^get(userInterest). ^topicRedirect(user_interests, check_add)

	?:NUM:expression *
	- ^evaluateExpression()

	?:DESC:def * roman (numerial|numeral) *
	- ^numToRoman()

	?:DESC:def * (hex|hexdecimal) *
	- ^numToHex()

	?:DESC:def * binary *
	- ^numToBinary()

	?:NUM:other * (missing) *
	- ^numMissing()

	?:NUM:other * (sequence) *
	- ^numSequence()

	+ my name is *1 *
		- I'll call you <cap1> then. ^save(name, <cap1>)


	+ (what is|do you know|do you remember) my name
	- {^hasName(true)} {keep} ^get(name)
	- {^hasName(false)} {keep} I don't think you told me your name.



< topic

> pre

	?:WH * (going on|happening|new|up|the deal) with *~9
	- {keep} ^topicRedirect(search, result)

	?:WH * (the|that) (percentage|number) *
	- {keep} ^topicRedirect(rise_index, rise_number)

	+ what do you know (about|regarding) *~9
	- {keep} ^topicRedirect(search, result)

	+ (search|search for|look for) *~9
	- {keep} ^topicRedirect(search, result)

	+ (weather|weather for|weather in) *~9
	- {keep} ^getWeather(<cap2>)

	+ (weather forecast|weather forecast for|weather forecast in) *~9
	- {keep} ^getWeatherForecast(<cap2>)

	+ (trends|trending|popular)
	- {keep} ^getGoogleTrends()

	+ what have I missed (today|this week|lately|in the last hour)
	- {keep} ^topicRedirect(search_time, time_period)

	+ what have I missed q
	- {keep} ^topicRedirect(search_time, time_period_none)

	+ have I missed anything (today|this week|lately|in the last hour)
	- {keep} ^topicRedirect(search_time, time_period)

	+ have I missed anything q
	- {keep} ^topicRedirect(search_time, time_period_none)

	+ [q] show me *~9
	- {keep} ^topicRedirect(search, result_show)

	+ change my interests
	- {keep} ^topicRedirect(user_interests, interest_query)

	?:YN do you like *~3
	- {keep} ^topicRedirect(user_interests, add_confirmation)

	+ I am depressed
	- {keep} ^topicRedirect(psy_help, confirm)

	+ I think I am depressed
	- {keep} ^topicRedirect(psy_help, confirm)

	+ (q what|what) can (you do|I ask) [you] *~1
	- {keep} ^topicRedirect(q_skills, skills)

	+ (q what|what) are (you good at|your skills) [q] *~1
	- {keep} ^topicRedirect(q_skills, skills)

	+ is <name> going to *~9
	- {keep} ^topicRedirect(search, result_params)

	+ is <noun> going to *~9
	- {keep} ^topicRedirect(search, result_params)


< pre

> topic:keep:system search
	+ result
	- {keep} ^getSearchResult(<cap2>)

	+ result_params
	- {keep} ^getSearchTerms(<cap1>, <cap2>)

	+ result_name
	- {keep} ^getSearchResult(<cap2>)

	+ result_show
	- {keep} ^getSearchResult(<cap1>)

	+ thanks [q]
	- {^hasName(true)} {keep} Sure thing, ^get(name).
	- {^hasName(false)} {keep} No problem.

< topic

> topic:system search_time
	+ time_period
	- {keep} ^getSearchTimeResult(<cap1>)

	+ time_period_none
	- {keep} ^getSearchTimeNoneResult()

	+ thanks [q]
	- {^hasName(true)} Sure thing, ^get(name).
	- {^hasName(false)} No problem.

< topic

> topic:keep:nostay catch_imperative
	+ (tell|give|find) me *~15
	- {keep} ^getCatchAllCommand(<cap1>)

	+ (buy|order) [me] *~10
	- {keep} You can't <cap1> anything during beta testing. Try asking again soon! 

< topic

> topic:nostay:system user_intro
  	
  	+ intro
  	- {keep} I'm Q. What's your name?

	  + [my name is] *1 *~3
	  % im q whats your name
	  - {keep} Nice to meet you, <cap1>. Do you need a quick tutorial on how I can help you? ^save(firstName, <cap1>)

  		+ ~yes
  		% do you need a quick tutorial on how I can help you
  		- I'm really good at looking for interesting stories people are talking about. Searching is easy. Just say "search" before what ever you want me to look up. Try it! {END} 

  		+ ~no
  		% do you need a quick tutorial on how I can help you
  		- Sounds like you already know how I work. How can I help you today? {END}

  	+ intro_confusion
  	- {keep} I didn't catch that. What was your name again? 

< topic

> topic:nostay:system rise_index

	+ rise_number
	- The percentage score you see is called a Rise Index. It tells you how interesting people think something is right now. search <cap2>

< topic

> topic:system psy_help
	+ confirm
	- {keep} For real?

		+ ~yes
		% for real
		- You should talk to a real person about this. I'm not qualified to help humans manage their emotions.

		+ ~no
		% for real
		- That's not really something to joke about.

		+ *
		% for real
		- You know, there are some situations where I think it's better to talk to a real human.
< topic

> topic:nostay:system user_interests

	+ add_confirmation
	- {keep} It doesn't matter what I like. Do you like <cap1>?

		+ ~yes
		% do you like
		- {keep} I'll try to remember that. ^save(userInterest2, <cap1>) {END}
		- I'll write that down in my notebook. ^save(userInterest2, <cap1>) {END}
		- Noted. ^save(userInterest2, <cap1>) {END}

		+ ~no
		% do you like
		- {keep} Noted. {END}

	+ check_add
	- {keep} would you like to add more interests? (yes/no)

		+ ~yes
		% would you like to add more interests
		- Ok. Lets do one at a time. What's the first one?

		+ ~no
		% would you like to add more interests
		- Ok. We can do it later. {END}

		+ [I am interested in] *~2
		% whats the first one
		- ok, got it: <cap1>. ^save(userInterest1, <cap1>) {END}

< topic

> topic:nostay:system weather_daily
	+ daily
	- {keep} What city or zip code were you looking for? 

		+ weather
		% what city or zip code were you looking for
		- ^topicRedirect(weather_daily, daily)

		+ forecast
		% what city or zip code were you looking for
		- ^topicRedirect(weather_forecast, 5_day)

		+ weather forecast
		% what city or zip code were you looking for
		- ^topicRedirect(weather_forecast, 5_day)

		+ *~3
		% what city or zip code were you looking for
		- ^getWeather(<cap1>) {END} 

< topic

> topic:nostay:system weather_forecast
	+ 5_day
	- {keep} What city or zip code were you looking for? 
	
		+ weather
		% what city or zip code were you looking for
		- ^topicRedirect(weather_daily, daily)

		+ forecast
		% what city or zip code were you looking for
		- ^topicRedirect(weather_forecast, 5_day)

		+ weather forecast
		% what city or zip code were you looking for
		- ^topicRedirect(weather_forecast, 5_day)

		+ *~3
		% what city or zip code were you looking for
		- ^getWeatherForecast(<cap1>) {END} 

< topic

> topic:nostay:system accuracy_check

	+ satisfied
	- {keep} Did that help?

		+ ~yes *
		% did that help
		- {keep} Cool. {END}

		+ ~no *
		% did that help
		- {keep} Sorry. I'm still learning. Can you be more specific about what you wanted? {END}
	
< topic


> topic q_skills
	+ skills
	- {keep} Lots of things! Right now I'm really good at looking for interesting stories people are talking about. Ask me to search for something! 


< post

> post:keep:nostay catchall
	+ *~15
	- {keep} ^getCatchAll(<cap1>)

< post


> post:keep:nostay catchall_overflow

	+ *
	- {keep} Hmm. That didn't really make sense to me.
	- I can't read minds yet. Try using complete sentences.
	- You can't just just expect me to understand random words. Try putting them in an order I can understand!
	- Sorry, I didn't catch that.
	- Come again?
	- I don't understand. I'm trying to learn about the world as fast as I can.
	- I know I'm getting smarter, but sometimes I just don't understand what you're saying. 

< post
