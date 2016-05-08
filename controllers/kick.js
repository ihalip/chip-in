var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Event = require('../models/Event');
var Transaction = require('../models/Transaction');

var stripe = require('stripe')(process.env.STRIPE_SKEY);

exports.index = function (req, res) {
    if (!req.user) {
        req.flash('errors', { msg: 'You need to be logged in to perform this action.' });
        return res.redirect('/login');
    }
    
    Event.find({}, function (err, events) {
        if (err) {
            return next(err);
        }

        console.log(events);

        res.render('kick/home', {
            title: 'Home',
            events: events
        });
    });
};

exports.getStatus = function (req, res) {
    if (!req.user) {
        req.flash('errors', { msg: 'You need to be logged in to perform this action.' });
        return res.redirect('/login');
    }

    res.render('kick/status', {
        title: 'Status'
    });
};

exports.getNew = function (req, res) {
    if (!req.user) {
        req.flash('errors', { msg: 'You need to be logged in to perform this action.' });
        return res.redirect('/login');
    }
    
    res.render('kick/new', {
        title: 'New'
    });
};

exports.getPay = function (req, res) {
    Event.findOne({ id: req.params.id }, function (err, event) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.render('kick/get', {
            event: event,
            publishableKey: process.env.STRIPE_PKEY
        });
    });
};

exports.postPay = function (req, res) {
    var stripeToken = req.body.stripeToken;
    var stripeEmail = req.body.stripeEmail;
    stripe.charges.create({
        amount: 1000,
        currency: 'usd',
        source: stripeToken,
        description: stripeEmail
    }, function (err, charge) {
        console.log(charge);
        if (err && err.type === 'StripeCardError') {
            req.flash('errors', { msg: 'Your card has been declined. Please try again.' });
        }
        
        var transaction = new Transaction({
            amount: charge.amount / 100,
            sender: charge.source.name,
            event_id: req.body.id
        });
        transaction.save(function (err) {
            console.log(err);
        });

        req.flash('success', { msg: 'Your card has been charged successfully. Thank you!' });
        
        Event.findOne({ id: req.body.id }, function (err, event) {
            if (err) {
                console.log(err);
                return next(err);
            }
            
            res.render('kick/get', {
                event: event
            });
        });
    });
};

exports.getView = function (req, res) {
    if (!req.user) {
        req.flash('errors', { msg: 'You need to be logged in to perform this action.' });
        return res.redirect('/login');
    }
    
    console.log(req.params.id);
    Event.findOne({ id: req.params.id }, function (err, event) {
        if (err) {
            console.log(err);
            return next(err);
        }
        
        Transaction.find({ event_id: req.params.id }, function(err, transactions) {
            res.render('kick/view', {
                event: event,
                transactions: transactions
            });
        });
    });
};

exports.postView = function (req, res) {
    if (!req.user) {
        req.flash('errors', { msg: 'You need to be logged in to perform this action.' });
        return res.redirect('/login');
    }
    
    Event.findOne({ id: req.params.id }, function (err, event) {
        if (err) {
            console.log(err);
            return next(err);
        }
        
        event.cashout = true;
        event.save(function(err, event) {
            Transaction.find({ event_id: req.params.id }, function(err, transactions) {
                var total = 0;
                transactions.forEach(function(element) {
                    total += element.amount
                }, this);
                
                res.render('kick/view', {
                    event: event,
                    transactions: transactions,
                    total: total
                });
            });
        });
    });
};

exports.postNew = function (req, res) {
    if (!req.user) {
        req.flash('errors', { msg: 'You need to be logged in to perform this action.' });
        return res.redirect('/login');
    }
    
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('end-date', 'End date cannot be blank').notEmpty();

    console.log(req.body);

    var event = new Event({
        name: req.body.name,
        end_date: req.body.end_date,
        owner_email: req.user.email,
        description: req.body.description,
        recommended_amount: req.body.recommended_amount,
        goal: req.body.goal,
        fee: 5,
        cashout: false
    });

    Event.findOne({ name: req.body.name, owner_email: req.user.email }, function (err, existingEvent) {
        console.log(existingEvent);
        if (existingEvent) {
            req.flash('errors', { msg: 'An event with that name already exists!' });
            return res.redirect('/kick/new');
        }
        event.save(function (err) {
            console.log(err);
            if (err) {
                return next(err);
            }
            return res.redirect('/kick');
        });
    });
};