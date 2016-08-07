/*
STEPS:

1. Add your keys
2. Rename file to config.js

*/
module.exports = function(){ 
  console.log("NODE_ENV")
  console.log(process.env.NODE_ENV)
  switch(process.env.NODE_ENV){

    case 'development': 
      return {
        google: {
          clientID: "[YOUR_CLIENT_ID]",
          clientSecret: "[YOUR_CLIENT_SECRET]",
          geocode: "[YOUR_GEOCODE_API_KEY]"
        },
        twilio: {
          account: "[YOUR_TWILIO_ID]",
          token: "[YOUR_TWILIO_TOKEN]",
          number: "[YOUR_TWILIO_NUMBER]"
        },
        twitter: {
          consumer_key: "[YOUR_TWITTER_KEY]",
          consumer_secret: "[YOUR_TWITTER_SECRET]",
          app_only_auth: true
        },
        test: {
          name: "Batman", // Name for testing
          googleid: "[YOUR_GOOGLE_ID]", // this should be a Number, not a String
          number: "[YOUR_PHONE_NUMBER]", // for testing DB writes/deletes/updates
        },
        gmail: {
          email: "[GMAIL_USERNAME_FOR_BOT]@gmail.com", // this is the test bot for Hangouts
          password: "[PASSWORD_FOR_GMAIL_BOT_ACCOUNT]" 
        },
        forecast: {
          key: "[YOUR_FORECAST.IO_API_KEY]",
        },
        weather: {
          appid: "[YOUR_OPEN_WEATHER_API_KEY]",
        }
      };
    case 'production':
      return {
        google: {
          clientID: "[YOUR_CLIENT_ID]",
          clientSecret: "[YOUR_CLIENT_SECRET]",
          geocode: "[YOUR_GEOCODE_API_KEY]"
        },
        twilio: {
          account: "[YOUR_TWILIO_ID]",
          token: "[YOUR_TWILIO_TOKEN]",
          number: "[YOUR_TWILIO_ID]"
        },
        twitter: {
          consumer_key: "[YOUR_TWITTER_KEY]",
          consumer_secret: "[YOUR_TWITTER_SECRET]",
          app_only_auth: true
        },
        gmail: { 
          email: "[GMAIL_USERNAME_FOR_BOT]@gmail.com", // this is the production bot for Hangouts
          password: "[PASSWORD_FOR_GMAIL_BOT_ACCOUNT]"
        },
        forecast: {
          key: "[YOUR_FORECAST.IO_API_KEY]",
        },
        weather: {
          appid: "[YOUR_OPEN_WEATHER_API_KEY]",
        }
      };
  }
};