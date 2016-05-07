var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  name: String,
  start_date: Date,
  owner_email: { type: String, unique: true }
});

eventSchema.pre('save', function(next) {
  var event = this;
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
