var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Event = require('./Event.js');

var transactionSchema = new mongoose.Schema({
  amount: Number,
  comment: String,
  event: Event.eventSchema
});

transactionSchema.pre('save', function(next) {
  var transaction = this;
  return next();
});

var Event = mongoose.model('Transaction', transactionSchema);

module.exports = Event;
