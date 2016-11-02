var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: String,
  description: String,
  game: String,
  creator: String,
  participants: [String],
  time: Date,
  imgUrl: String
});

var Event = mongoose.model('Event', EventSchema);

module.exports = Event;
