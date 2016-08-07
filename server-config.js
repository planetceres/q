var express = require('express');
var app = express();
var Config = require('./config/config.js'),
	config = new Config();
var db = require('./db/database');

// LOAD MIDDLEWARE
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');


// CONFIGURE EXPRESS SERVER INSTANCE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'spectre',
    resave: true, 
    saveUninitialized: false, 
    store: new MongoStore({mongooseConnection: db })
}));

module.exports = app;