var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
  amount: Number,
  sender: String,
  event_id: String
});

transactionSchema.pre('save', function(next) {
  var transaction = this;
  return next();
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
