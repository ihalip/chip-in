var express = require('express');
var app = express();
var Waterline = require('waterline');
var sailsMemoryAdapter = require('sails-memory');
var models = require('./app/models.js');

var waterline = new Waterline();
waterline.loadCollection(models.userCollection);
waterline.loadCollection(models.eventCollection);
waterline.loadCollection(models.transactionCollection);

var config = {
    adapters: {
        'memory': sailsMemoryAdapter
    },
    connections: {
        default: {
            adapter: 'memory'
        }
    }
};

waterline.initialize(config, function (err, ontology) {
    if (err) {
        return console.error(err);
    }
    var User = ontology.collections.user;
    var Event = ontology.collections.event;
    var Transaction = ontology.collections.event;
});

User.create({username: 'ilie', password: 'test', })

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use('/public', express.static(__dirname + '/public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
