var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    database: 'internationalChat'

});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var generateName = require('sillyname');

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));
