var mysql = require('mysql');
var config = require('../config/params');

var Multiship = function () {
    this.connection = mysql.createConnection(config);
    this.open();
};

Multiship.prototype = {};

Multiship.prototype.orders = function () {
    return this.connection.query('SELECT * FROM sender_orders so WHERE so.real = 1')
        .on('error', function (err) {
            console.error('Error', err);
            // Handle error, an 'end' event will be emitted after this as well
        })
        .on('fields', function (fields) {
            console.log('Fields', fields);
        });
};

Multiship.prototype.open = function () {
    this.connection.connect();
};

Multiship.prototype.close = function () {
    this.connection.end();
};

module.exports = new Multiship();

