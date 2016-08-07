var db = require('../db/database');
var superscript     = require("superscript");
var mongoose        = require("mongoose");
var facts           = require("sfacts");
var factSystem      = facts.create('qalpha');

console.log("loadTopicSystem")


var options = {};

options['factSystem'] = factSystem;
options['mongoose'] = mongoose;

var TopicSystem = require("superscript/lib/topics/index")(mongoose, factSystem);

topics = TopicSystem.importerFile('./data.json')
