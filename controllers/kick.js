var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Event = require('../models/Event');

exports.index = function(req, res) {
    Event.find({ }, function(err, events) {
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

exports.getNew = function(req, res) {
    res.render('kick/new', {
        title: 'New'
    });
};

exports.postNew = function(req, res) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('end-date', 'End date cannot be blank').notEmpty();
    
    console.log(req);
    console.log(req.body);
    
    var event = new Event({
        name: req.body.name,
        end_date: req.body.end_date,
        owner_email: req.user.email
    });
    
    Event.findOne({ name: req.body.name, owner_email: req.user.email }, function(err, existingEvent) {
        console.log(existingEvent);
        if (existingEvent) {
            req.flash('errors', { msg: 'An event with that name already exists!' });
            return res.redirect('/kick/new');
        }
        event.save(function(err) {
            console.log(err);
            if (err) {
                return next(err);
            }
            return res.redirect('/kick');
        });
    });
};