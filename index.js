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

io.on('connection', function(socket){
    socket.on('createAccount', function(msg){
        var sql = "INSERT INTO Account (Username, Password) VALUES ('"+msg['username']+"', '"+msg['password']+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted, createaccount");
          });
    });

    socket.on('loginClicked', function(msg){
        var sql = "SELECT * FROM Account WHERE Username='"+msg['username']+"' AND Password='"+msg['password']+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            else{
                if (result === undefined || result.length == 0){
                    console.log("ACCOUNT WAS NOT FOUND");
                }else{
                    console.log("ACCOUNT WAS FOUND");
                }
            }
        });
    })
});
