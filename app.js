var http = require('http');
var sockjs = require('sockjs');
var net = require('net');
var mysql = require('mysql');

var MS_HOST = '127.0.0.1';
var MS_PORT = 8888;

var SJS_HOST = '0.0.0.0';
var SJS_PORT = 9999;

var connections = [];
var chat = sockjs.createServer();
chat.on('connection', function (conn) {
    connections.push(conn);
    var number = connections.length;
    conn.write("Welcome, User " + number);
    conn.on('data', function (message) {
        for (var ii = 0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " says: " + message);
        }
    });
    conn.on('close', function () {
        for (var ii = 0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " has disconnected");
        }
    });
});
var server = http.createServer();
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

var orders = 0;
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'multiship',
    password: 'multiship',
    database: 'multiship'
});
connection.connect();
var query = connection.query('SELECT * FROM sender_orders');
query
    .on('error', function (err) {
        console.log('Error');
        // Handle error, an 'end' event will be emitted after this as well
    })
    .on('fields', function (fields) {
        console.log('Fields');
        // the field packets for the rows to follow
    })
    .on('result', function (row) {
        orders++;
        // Pausing the connnection is useful if your processing involves I/O
        console.log('Result')
    })
    .on('end', function () {
        console.log('End', orders)
    });
connection.end();
