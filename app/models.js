var Waterline = require('waterline');

var userCollection = Waterline.Collection.extend({
    identity: 'user',
    connection: 'default',
    attributes: {
        username: 'string',
        password: 'string',
        events: {
            collection: 'event',
            via: 'owner'
        }
    }
});

var eventCollection = Waterline.Collection.extend({
    identity: 'event',
    connection: 'default',
    attributes: {
        name: 'string',
        end_date: 'date',
        owner: {
            model: 'user'
        },
        transactions: {
            collection: 'transaction',
            via: 'owner'
        }
    }
});

var transactionCollection = Waterline.Collection.extend({
    identity: 'transaction',
    connection: 'default',
    attributes: {
        amount: 'integer',
        comment: 'string',
        owner: {
            model: 'event'
        }
    }
});

module.exports = {
    userCollection: userCollection,
    eventCollection: eventCollection,
    transactionCollection: transactionCollection
};
