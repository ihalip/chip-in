var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    name: String,
    end_date: Date,
    owner_email: String,
    recommended_amount: Number,
    goal: Number,
    description: String,
    fee: Number,
    cashout: Boolean,
    id: { type: String, unique: true }
});

eventSchema.pre('save', function(next) {
    var event = this;

    var data = event.name + new Date().toString();
    var hash = crypto.createHash('MD4');
    hash.update(data);

    event.id = hash.digest('hex');

    return next();
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
