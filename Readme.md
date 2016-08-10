##Q - The most interesting bot in the world
Q is a text-based virtual personality that provides relevant and interesting content through a natural language interface. In other words, Q is your know-it-all friend in the cloud.

Unlike Siri or Alexa which are voice-controlled, you interact with Q through the text messenger of your choice.  

When Q finds something that you might find interesting, you'll see a link, along with a "Rise Index" which is an algorithmic approximation of how a particular result is trending socially. It's sort of a weighted measure of novelty, popularity, and relevance to a topic.

## What can I ask Q?

Anything you want. Results primarily focus on current events and trending topics.

Here are a few examples taken from actual conversations:

![Screenshot 0](/assets/screen0.png?raw=true "Screenshot 0")
![Screenshot 1](/assets/screen4.png?raw=true "Screenshot 1")
![Screenshot 2](/assets/screen5.png?raw=true "Screenshot 2")
![Screenshot 3](/assets/screen6.png?raw=true "Screenshot 3")
![Screenshot 4](/assets/screen1.png?raw=true "Screenshot 4")
![Screenshot 5](/assets/screen2.png?raw=true "Screenshot 5")
![Screenshot 6](/assets/screen3.png?raw=true "Screenshot 6")

## Demo

You can talk to Q via Google Hangouts at Qlabs.beta [at] gmail.com. The SMS demo is currently disabled.


## Built on

- Node.js
- Express
- Superscript.js
- MongoDB
- Twilio API (or Bandwidth.com API)
- Twitter API
- Digital Ocean Droplet
- Google Hangouts
- forecast.io API
- Open Weather Map API
- Google geocoding for location
- Wikipedia API for entity lookup
- Google Trends for trending topics


## Installation

Please reference Superscript.js for more detailed installation/customization instructions. https://github.com/superscriptjs/superscript/wiki

1. Install Node and NPM
2. Install MongoDB
3. Clone this repo and navigate to directory
4. Run 'npm install'
5. Set up services listed in './config/config.js'
6. Modify './config/config.js' to include your keys and secrets
7. Start mongoDB on port 27017
8. Fetch Google Trends and save them to database with 'node ./bin/fetchGoogleTrends'
9. Run `./node_modules/superscript/bin/cleanup.js --mongo qalpha` ('qalpha' should be the name of your database if it is different)
10. Set your environment with "export NODE_ENV=development" (or production)
11. Start with "npm forever start qbot.js" or simply "node qbot.js"


#### Troubleshooting

Due to security settings, Google will not let you connect automatically with your bot, unless you change your security settings to allow "less secure apps" to access your account.



#### Features in development:

- try setting up an SMS relay and adding SMTP server for incoming messages to circumvent Twilio charges OR add Bandwidth.com support (lower cost)
- Improve search results with FAROO or Webhose.io
- Allow Q to send messages unprompted through automation to simulate realistic conversation intervals
- Better info capture for user's interests and preferences to help provide better relevance in results
- Add integration for other messengers

#### Known issues/limitations
- Images do not show up in Hangouts, only MMS. This is not really an "issue" so much as a current limitation.



## Production Version

You'll need to set an automated task to pull google trends and keep them current. You can use './bin/fetchGoogleTrends'


## License

This software is provided as is, and you alone are liable for any consequences resulting from its use, intended or unintended. Use Q however you like in a way that positively benefits humanity, and with proper attribution to this repository. 

Questions, comments, inquiries, and proposals can be sent to matt [at] discovermatt.com

## Credits

Thanks to Rob Ellis for his work on Superscript.js.  







