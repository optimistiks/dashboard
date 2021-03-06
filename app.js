var http = require('http');
var sockjs = require('sockjs');
var net = require('net');
var mysql = require('mysql');
var orderQtyDaily = require('./js/order-qty-daily/index');
var orderQtyMonthly = require('./js/order-qty-monthly/index');

var MS_HOST = '127.0.0.1';
var MS_PORT = 8888;

var SJS_HOST = '0.0.0.0';
var SJS_PORT = 9999;

var connections = [];
var chat = sockjs.createServer();
var server = http.createServer();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'multiship',
    password: 'multiship',
    database: 'multiship'
});

connection.connect();
var query = connection.query('SELECT * FROM sender_orders so WHERE so.real = 1');
console.log('Loading started');
query
    .on('error', function (err) {
        console.error('Error', err);
        // Handle error, an 'end' event will be emitted after this as well
    })
    //.on('fields', function (fields) {
        //console.log('Fields', fields);
        // the field packets for the rows to follow
    //})
    .on('result', function (row) {
        orderQtyDaily.recalculate(row);
        orderQtyMonthly.recalculate(row);
        // Pausing the connection is useful if your processing involves I/O
    })
    .on('end', function () {
        console.log('Loading finished');
        console.log('Orders daily:', orderQtyDaily.getValue());
        console.log('Orders monthly:', orderQtyMonthly.getValue());
        chat.on('connection', function (conn) {
            connections.push(conn);
            conn.write("Orders daily " + orderQtyDaily.getValue());
            conn.write("Orders monthly " + orderQtyMonthly.getValue());
            conn.on('data', function (message) {

            });
            conn.on('close', function () {

            });
        });
        chat.installHandlers(server);
        server.listen(SJS_PORT, SJS_HOST);
        console.log('SockJS on ' + SJS_HOST + ':' + SJS_PORT);

        // Create a server instance, and chain the listen function to it
        // The function passed to net.createServer() becomes the event handler for the 'connection' event
        // The sock object the callback function receives UNIQUE for each connection
        net.createServer(function (sock) {
            // We have a connection - a socket object is assigned to the connection automatically
            console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
            // Add a 'data' event handler to this instance of socket
            sock.on('data', function (data) {
                console.log('DATA:', data.toString());
                for (var ii = 0; ii < connections.length; ii++) {
                    connections[ii].write("MS says: " + data);
                }
            });
            // Add a 'close' event handler to this instance of socket
            sock.on('close', function (data) {
                console.log('CLOSED:', data);
            });
            //just added
            sock.on('error', function (err) {
                console.log('ERROR:', err);
            });
        }).listen(MS_PORT, MS_HOST);
        console.log('Listening on ' + MS_HOST + ':' + MS_PORT);
    });
connection.end();

