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

    var username = "empty";
    var chatRoomCode = "";

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
        io.to('room'+chatRoomCode).emit('chat', msgObj);
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
                        socket.emit("createAccountSuccess", msg['username']);
                    });
                }else {
                    socket.emit("usernameNotUnique");
                    console.log("Username not unique");
                };
            }
        });
    });

    socket.on('requestDefaultRoom', function(room){
       var sql = "SELECT * FROM ChatRooms WHERE id='"+room[0]+"'";
       // var sql = "SELECT * FROM ChatRooms WHERE id=12";
        console.log(room[0]);
        con.query(sql, function(err, result){
            if (err) throw err;
            else{
                chatRoomCode = room[0];
                socket.join("room"+chatRoomCode);
               socket.emit("joinRoomSuccess", {username:username, chatHistory:result[0]['chatHistory'], roomName:result[0]['Name']});
                //socket.emit("joinRoomSuccess", {username:username, chatHistory:"hello", roomName:"English"});
           
                // Need a timeout so that we can wait for the page to load
                if (result[0]['Users'].length !== 0){
                    setTimeout(function(){
                        var sqlUsers = "SELECT * FROM Account WHERE id IN ("+result[0]['Users']+")";
                        con.query(sqlUsers, function(err2, result2){
                            listOfUsers = [];
                            for (user of result2){
                                listOfUsers.push(user['Username']);
                            }
                            socket.emit("userList", listOfUsers);
                            io.to('room'+chatRoomCode).emit("userList", listOfUsers)
                        });
                    }, 500);
                }
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
                    username = result[0]['Username'];
                    socket.emit("allowLogin", {id:result[0].id, username:username});
                }
            }
        }); 
    });
    socket.on('langLookUp', function(msg){
        var langPeopleArray = [];
        var sqlLangKnown = "SELECT * from Account where LanguagesKnown like '%3%';";//+msg['languageDesire'];
        con.query(sqlLangKnown, function(err, rows){
            if (err) throw err;
            else{
                for (var i in rows) {
                    console.log(rows[i].id, rows[i].Username);
                    langPeopleArray.push({id:rows[i].id, username: rows[i].Username});
                }
               
            }      
        }); 
    });
    socket.on('createGroup', function(msg){
     
        var sqlcreateGroup = "INSERT INTO chatrooms (Name, Users)  VALUES ('"+ msg.chatRoomName+ "','"+msg.user+"');";
        con.query(sqlcreateGroup, function(err){
            if (err) {throw err; console.log(err);}
            else{
                socket.emit('createGroup', 1);
            }
        }); 

    });

    
    socket.on('joinGroup', function(msg){
      
        var result = "";
        console.log("groupCode ",msg.groupCode,msg.user);
        var sqljoinUpdate = "";
        var sqljoinGrp = "SELECT  * from chatrooms where id="+msg.groupCode;
        con.query(sqljoinGrp, function(err, rows){
           console.log("rows",rows);
            if (err) throw err;
            else{
                if (rows.length !== 0){
                    result = rows[0].Users;
                   if (result==null){result="";}
                    sqlJoinUpdate = "UPDATE chatrooms SET Users = '"+result+msg.user+",' where id="+msg.groupCode+";";
                    con.query(sqlJoinUpdate, function(err,rows2){ if (err) throw err;
                    socket.emit('joinGroup',{roomName:rows[0].Name, username:username});
                });
                    console.log(sqlJoinUpdate);
                }
                else{
                    console.log("doesnt exist");
                }
                
            }      
        }); 
    });

    socket.on("getProfilePic", function(msg){
        var sql = "SELECT * FROM ACCOUNT WHERE Username='"+msg+"'";
        console.log(sql)
        con.query(sql, function(err, result){
            if (err) throw err;

            socket.emit("profilePic", result[0].Picture);
        });
    });

    socket.on("setProfileImage", function(msg){
        var sql = "UPDATE Account SET Picture='"+msg.path+"' WHERE Username='"+msg.username+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            socket.emit("profilePicChanged");
        });
    });
    

  
   
});
