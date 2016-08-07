// Run this and then telnet to localhost:2000 and chat with the bot
var heapdump = require('heapdump');
console.log("INITIAL: ")
console.log(process.memoryUsage())

var net             = require("net");
var superscript     = require("superscript");
var mongoose        = require("mongoose");
var facts           = require("sfacts");
var factSystem      = facts.create('telnetFacts');
mongoose.connect('mongodb://localhost/telnetbot');
var User = require('superscript/lib/users');
console.log("BEFORE OPTIONS: ")
console.log(process.memoryUsage())

var options = {};
var sockets = [];

options['factSystem'] = factSystem;
options['mongoose'] = mongoose;
console.log("AFTER OPTIONS: ")
console.log(process.memoryUsage())

var botHandle = function(err, bot) {
    
  var receiveData = function(socket, bot, data) {
    // Handle incoming messages.
    var message = "" + data;
    console.log("SOCKET+++")
    console.log(socket.name)
    console.log("DATA ++")
    console.log(data)

    message = message.replace(/[\x0D\x0A]/g, "");

    console.log("DATA ++")
    console.log(process.memoryUsage())
    console.log(message)

    if (message.indexOf("/quit") === 0 || data.toString('hex',0,data.length) === "fff4fffd06") {
      socket.end("Good-bye!\n");
      return;
    }

    // Use the remoteIP as the name since the PORT changes on ever new connection.
    bot.reply(socket.remoteAddress, message.trim(), function(err, reply){
      console.log("REPLY")
      console.log(process.memoryUsage())
      console.log(reply)
      // Find the right socket
      var i = sockets.indexOf(socket);
      var soc = sockets[i];

      soc.write("\nBot> " + reply.string + "\n");
      soc.write("You> ");

    }).then(function(reply){
      console.log("After Reply")
    });
  };

  var closeSocket = function(socket, bot) {
    var i = sockets.indexOf(socket);
    var soc = sockets[i];

    console.log("User '" + soc.name + "' has disconnected.\n");

    if (i != -1) {
      sockets.splice(i, 1);
    }
  };

  var newSocket = function (socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log("User '" + socket.name + "' has connected.\n");

    sockets.push(socket);
    
    // Send a welcome message.
    socket.write('Welcome to the Telnet server!\n');
    socket.write("Hello " + socket.name + "! " + "Type /quit to disconnect.\n\n");


    // Send their prompt.
    socket.write("You> ");

    socket.on('data', function(data) {
      console.log("ON DATA: ")
      console.log(process.memoryUsage())
      receiveData(socket, bot, data);
    });

    // Handle disconnects.
    socket.on('end', function() {
      console.log(process.memoryUsage())
      closeSocket(socket, bot);
    });

  };

  // Start the TCP server.
  var server = net.createServer(newSocket);

  server.listen(2000);
  console.log("TCP server running on port 2000.\n");
};


// Main entry point
new superscript(options, function(err, botInstance){

  //console.log(botInstance.users.db.base.models.User)
  botHandle(null, botInstance);
});
