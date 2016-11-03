var mongoose = require("mongoose");
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/twitch-up");


module.exports.Event = require('./event.js');
module.exports.User = require('./user.js');
