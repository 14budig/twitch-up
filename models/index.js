var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/twitch-up");

module.exports.Event = require('./event.js');
module.exports.User = require('./user.js');
