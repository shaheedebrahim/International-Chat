var msgStore = [];
var msgCount =0;
var mapping = {};
var colors = {};
var clientCount = 0;
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
    reSendActiveList(io);
       
    socket.on('init', function(){
        io.to(socket.id).emit('wel',msgStore);
        var nick = "User"+clientCount++;
        if (socket.id in mapping){  
            console.log("already exists");} else{
            mapping[socket.id] = nick;
            io.to(socket.id).emit('nick', nick);
        }
        reSendActiveList(io);
    });
            
    socket.on('chat', function( msg){
        msgCount++;
        var time = new Date();
        var chatUsr = mapping[socket.id];
        var msgObj = {time_id:time, body:msg,clientId:chatUsr,color:colors[socket.id]};
        io.emit('chat',msgObj );
        msgStore.push(msgObj);
        if (msgCount>=201){
            msgStore.shift();
        }
    });
    
    socket.on('nick', function(nick){
        if (Object.values(mapping).includes(nick))
        {
            io.to(socket.id).emit('nick', -1);
        }
        else{
            console.log("nick is granted");
            mapping[socket.id] = nick;
            io.to(socket.id).emit('nick', nick);
        }
        reSendActiveList(io);
    });
       
    socket.on('disconnect', function (socket) {
        reSendActiveList(io);
    });
    
    socket.on('rec', function (nick) {
        var sameNick  = nick.split("=")[1];
        if( Object.values(mapping).includes(sameNick))
        {
            delete mapping[n];
        }
        mapping[socket.id] = sameNick;
        io.to(socket.id).emit('nick', sameNick);
        io.to(socket.id).emit('wel',msgStore);
        reSendActiveList(io);
    });
        
    socket.on('nickcolor', function (color) {
        colors[socket.id] = color;
    });
    
    function reSendActiveList(io){
        let c = io.clients().sockets;
        let activeClients = [];
        for (n in c)
        { activeClients.push(mapping[n]);}
        io.emit('userList', activeClients);
    }

    socket.on('selectedLanguages', function(msg){
        var languages = "";
        for (language of msg['languages']){
            languages = languages + language +",";
        }
        console.log(languages);
        var sql = "UPDATE Account SET LanguagesKnown='"+languages+"' WHERE Username='"+msg['username']+"'";
        con.query(sql, function(err, result){
            if (result === undefined || result.length == 0){
                if (err) throw err;
                else{
                    console.log(result);
                }
            }
        });
        console.log(sql);
    });

    socket.on('createAccount', function(msg){
        // First check whether the username is unique
        var sql = "SELECT * FROM Account WHERE Username='"+msg['username']+"'";
        console.log(msg['username']);

        con.query(sql, function(err,result){
            if (err) throw err;
            else{
                if (result === undefined || result.length == 0){
                    // If the username is unique try to insert into table
                    var sql = "INSERT INTO Account (Username, Password) VALUES ('"+msg['username']+"', '"+msg['password']+"')";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted, createaccount");
                        socket.emit("createAccountSuccess");
                    });
                }else {
                    socket.emit("usernameNotUnique");
                    console.log("Username not unique");
                };
            }
        });
    });

    socket.on('loginClicked', function(msg){
        var sql = "SELECT * FROM Account WHERE Username='"+msg['username']+"' AND Password='"+msg['password']+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            else{
                if (result === undefined || result.length == 0){
                    console.log("ACCOUNT WAS NOT FOUND");
                    socket.emit("accountNotFound");
                }else{
                    console.log("ACCOUNT WAS FOUND");
                    socket.emit("allowLogin")
                }
            }
        });
    });
});
 

