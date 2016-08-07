var UserAttributes  = require('../db/models').UserAttributes;
var UserLocation  = require('../db/models').UserLocation;

exports.findUser = function (uid, callback) {
  UserAttributes.findOne({id: uid}, function(err, doc) {
    if (err) {
      console.log("ERROR FINDING USER: " + err)
      return callback(err, null);
    }  
    return doc ? callback(doc) : callback(null);
  })
};

exports.findUserGmail = function (email, callback) {
  UserAttributes.findOneAndUpdate({gmail: email}, {last_action: email}, function(err, doc) {
    if (err) {
      console.log("ERROR FINDING USER: " + err)
      return callback(err, null);
    }  
    return doc ? callback(doc) : callback(null);
  })
};

// helper function to find a user or create one if they doesn't exist yet
exports.findOrCreateUserGmail = function (profile, callback) {

  exports.findUserGmail(profile, function(exists) {
    if (exists) return callback(null, exists);

    var email = profile;
    var options = {
      id: email,
      language: 'en',
      email: email,
      gmail: email,
      last_action: email
    };

    var newUserAttributes = new UserAttributes(options);

    newUserAttributes.save(function(err) {
      if (err) return callback(err, null);
      callback(null, newUserAttributes);
    });
    
  });

}

exports.findUserSMS = function (phoneNumber, callback) {
  UserAttributes.findOneAndUpdate({phone_number: phoneNumber}, {last_action: phoneNumber}, function(err, doc) {
    if (err) {
      console.log("ERROR FINDING USER: " + err)
      return callback(err, null);
    }  
    return doc ? callback(doc) : callback(null);
  })
};

// helper function to find a user or create one if they doesn't exist yet
exports.findOrCreateUserSMS = function (phoneNumber, callback) {

  exports.findUserSMS(phoneNumber, function(exists) {
    if (exists) return callback(null, exists);

    var id = phoneNumber;
    var phone_number = phoneNumber;
    var options = {
      language: 'en',
      id: id,
      phone_number: phone_number,
      last_action: phone_number
    };

    var newUserAttributes = new UserAttributes(options);

    newUserAttributes.save(function(err) {
      if (err) return callback(err, null);
      callback(null, newUserAttributes);
    });
    
  });

}

// writes location to the DB
exports.writeLocationData = function(uid, query, via, lng, lat) {

  UserAttributes.findOne({id: uid}, function(err, doc) {
    if (err) {
      console.log("ERROR FINDING USER: " + err)
      return callback(err, null);
    }  
    var newLocationData = {
      search_term: query,
      search_via: via,
      loc: [ lng, lat ],
      date_called: new Date()
    };

    doc.locations.push(newLocationData);

    doc.save(function(err) {
      if (err) return console.error(err);
      console.log("Location data saved successfully");
    });
    return
  });

};