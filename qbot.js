var xmpp            = require('simple-xmpp');
var twilio          = require('./clients/twilio');
var twitter         = require('./controllers/twitter');
var Config          = require('./config/config.js')
  , config          = new Config();
var net             = require("net");
var UserAttributes  = require('./db/models').UserAttributes;
var UserController  = require('./controllers/userController');
var utils           = require('./controllers/utils')
var superscript     = require("superscript");
var mongoose        = require("mongoose");

var db              = require('./db/database');
var app             = require('./server-config');
var port            = process.env.PORT || 3000;

// START SERVER
var server = app.listen(port, '0.0.0.0', function(err) {
  if (err) return err
  console.log('Listening on:' + port);
});


var options = {};
options['mongoose'] = mongoose;

app.get('/', function(req, res){
  res.send("Online")
})

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.sendXMPPMedia = function(handle, text, media){
  xmpp.send(handle, text);
  xmpp.send(handle, media);
}

exports.sendXMPP = function(handle, text){
  xmpp.send(handle, text);
}

//GOOGLE HANGOUTS
var botHandle = function(err, bot) {

  app.post('/api/messages', function(req, res) {
    if (twilio.handler.validateExpressRequest(req, twilio.authToken)) {
      UserController.findOrCreateUserSMS(req.body.From, function(err, user) {
        if (err) return err
        smsHandle(user, req.body.Body, req.body.From, twilio.num, bot);
      });
    } else {
      res.set('Content-Type', 'text/xml').status(403).send("Error handling text messsage. Check your request params");
    }
   
  });

  xmpp.connect({
      //jid                 : 'EMAIL ADRESS',
      //password            : 'PASSWORD',
      jid                 : config.gmail.email,
      password            : config.gmail.password,
      host                : 'talk.google.com',
      port                : 5222,
      reconnect           : true
  });

  xmpp.on('online', function(data) {
      console.log('Connected with JID: ' + data.jid.user);
      console.log('Yes, I\'m connected!');
      console.log(process.memoryUsage())
  });

  xmpp.on('chat', function(from, message) {
    console.log("Username: " + from)
    var u = UserController.findOrCreateUserGmail(from, function(err, user) {
      if (err) return err
        xmppHandle(user, from, bot, message);
    });
    u = null;
  });

  xmpp.on('error', function(err) {
      console.error(err);
  });
};

var xmppHandle = function(user, from, bot, data) {

    // Handle incoming messages.
    var message = "" + data;

    message = message.replace(/[\x0D\x0A]/g, "");
    var term = message.trim();

    bot.reply(user.id, message.trim(), function(err, reply){
        xmpp.send(from, reply.string);
    });
};

var smsHandle = function(user, data, phoneNumber, twilioNumber, bot) {
    // Handle incoming messages.
    var message = "" + data;

    message = message.replace(/[\x0D\x0A]/g, "");
    bot.reply(user.id, message.trim(), function(err, reply){
        console.log(reply.debug)
        utils.sendSMS(phoneNumber, twilioNumber, reply.string);
    });
};

// Main entry point
new superscript(options, function(err, botInstance){
  botHandle(null, botInstance);
});
