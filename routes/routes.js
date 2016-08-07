var twilio = require('../clients/twilio');

module.exports = function(app) {

  // TWILIO ROUTES
  app.post('/api/messages', function(req, res) {
    if (twilio.handler.validateExpressRequest(req, twilio.authToken)) {

    } else {
      res.set('Content-Type', 'text/xml').status(403).send("Error handling text messsage. Check your request params");
    }
   
  });


};