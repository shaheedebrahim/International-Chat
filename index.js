var msgStore = [];
var msgCount =0;
var mapping = {};
var colors = {};
var clientCount = 0;
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'internationalchat.cxusurzid2yd.us-east-2.rds.amazonaws.com',
    user: 'chatAdmin',
    password: 'internationaladmin',
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

let chatHistory = {};

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){

    var username = "empty";
    var chatRoomCode = "";
    let userID = 0;
    let profilePicPath = "";

    socket.on('chat', function( msg){
        msgCount++;
        var time = new Date();
        var chatUsr = mapping[socket.id];
        var msgObj = {time_id:time, body:msg, username:username, color:colors[socket.id], pic:profilePicPath};
        if (chatHistory[chatRoomCode]){
            chatHistory[chatRoomCode].push(msgObj);
        }else{
            chatHistory[chatRoomCode] = [msgObj];
        }
        io.to('room'+chatRoomCode).emit('chat', msgObj);
        msgStore.push(msgObj);
        if (msgCount>=201){
            msgStore.shift();
        }
    });

    socket.on('disconnect', function (socket) {
        if (chatRoomCode !== ""){
            var sql = "SELECT * FROM ChatRooms WHERE id='"+chatRoomCode+"'";
            con.query(sql, function(err, result){
                if (err) throw err;
                let userList = result[0].Users;
                let regex = new RegExp(userID+",", "g");
                userList = userList.replace(regex, "");

                var updateRoomSql = "UPDATE ChatRooms SET Users='"+userList+"' WHERE id='"+chatRoomCode+"'";
                con.query(updateRoomSql, function(err2, result2){
                    if (err2) throw err2;
                    userList = userList.slice(0,-1);
                    if (userList !== ""){
                        var sqlUsers = "SELECT * FROM Account WHERE id IN ("+userList+")";
                        con.query(sqlUsers, function(err3, result3){
                            if (err3) throw err3;
                            listOfUsers = [];
                            for (user of result3){
                                listOfUsers.push({username: user['Username'], profile: user['Picture']});
                            }
                            io.to('room'+chatRoomCode).emit("userList", listOfUsers)
                        });
                    }
                });
            });
        }
    });

    socket.on("leaveChatRoom", function(msg){
        if (chatRoomCode !== ""){
            var sql = "SELECT * FROM ChatRooms WHERE id='"+chatRoomCode+"'";
            con.query(sql, function(err, result){
                if (err) throw err;
                let userList = result[0].Users;
                let regex = new RegExp(userID+",", "g");
                userList = userList.replace(regex, "");

                var updateRoomSql = "UPDATE ChatRooms SET Users='"+userList+"' WHERE id='"+chatRoomCode+"'";
                con.query(updateRoomSql, function(err2, result2){
                    if (err2) throw err2;
                    userList = userList.slice(0,-1);
                    if (userList !== ""){
                        var sqlUsers = "SELECT * FROM Account WHERE id IN ("+userList+")";
                        con.query(sqlUsers, function(err3, result3){
                            if (err3) throw err3;
                            listOfUsers = [];
                            for (user of result3){
                                listOfUsers.push({username: user['Username'], profile: user['Picture']});
                            }
                            io.to('room'+chatRoomCode).emit("userList", listOfUsers)
                            socket.leave('room'+chatRoomCode);
                            chatRoomCode = "";
                            socket.emit("moveBackToDashboard");
                        });
                    }else{
                        socket.leave("room"+chatRoomCode);
                        chatRoomCode = "";   
                        socket.emit("moveBackToDashboard");                 
                    }
                });
            });
        }
    });

    socket.on('selectedLanguages', function(msg){
        var languages = "";
        for (language of msg['languages']){
            languages = languages + language +",";
        }
        var sql = "UPDATE Account SET LanguagesKnown='"+languages+"' WHERE Username='"+msg['username']+"'";
        con.query(sql, function(err, result){
            if (result === undefined || result.length == 0){
                if (err) throw err;
                else{
                }
            }
        });
    });

    socket.on('createAccount', function(msg){
        // First check whether the username is unique
        var sql = "SELECT * FROM Account WHERE Username='"+msg['username']+"'";

        con.query(sql, function(err,result){
            if (err) throw err;
            else{
                if (result === undefined || result.length == 0){
                    // If the username is unique try to insert into table
                    var sql = "INSERT INTO Account (Username, Password) VALUES ('"+msg['username']+"', '"+msg['password']+"')";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        socket.emit("createAccountSuccess", msg['username']);
                    });
                }else {
                    socket.emit("usernameNotUnique");
                };
            }
        });
    });

    socket.on('requestDefaultRoom', function(room){
       var sql = "SELECT * FROM ChatRooms WHERE id='"+room[0]+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            else{
                let allUsers = result[0].Users + userID;
                var sqlInsertUser = "UPDATE ChatRooms SET Users = '"+allUsers+",' where id="+result[0].id;
                con.query(sqlInsertUser, function(err2, result2){
                    if (err2) throw err2;
                });
                chatRoomCode = room[0];
                socket.join('room'+chatRoomCode);
                socket.emit("joinRoomSuccess", {username:username, chatHistory:result[0]['chatHistory'], roomName:result[0]['Name']});
                // Need a timeout so that we can wait for the page to load
                if (result[0]['Users'] !== null && result[0]['Users'].length !== 0){
                    setTimeout(function(){
                        var sqlUsers = "SELECT * FROM Account WHERE id IN ("+allUsers+")";
                        con.query(sqlUsers, function(err3, result3){
                            if (err3) throw err3;
                            listOfUsers = [];
                            for (user of result3){
                                listOfUsers.push({username: user['Username'], profile: user['Picture']});
                            }
                            io.to('room'+chatRoomCode).emit("userList", listOfUsers)
                            socket.emit("wel", chatHistory[chatRoomCode]);
                        });
                    }, 500);
                }else{
                    setTimeout(function(){
                        let sqlPic = "SELECT * FROM Account WHERE Username='"+username+"'";
                        con.query(sqlPic, function(err3, result3){
                            if (err3) throw err3;
                            let totalUsers = result[0].Users + result3[0].id;
                            var sqlInsertUser = "UPDATE ChatRooms SET Users = '"+totalUsers+",' where id="+result[0].id;
                            con.query(sqlInsertUser, function(err4, result4){
                                io.to('room'+chatRoomCode).emit("userList", [{username: result3[0].Username, profile: result3[0].Picture}]);
                                socket.emit("wel", chatHistory[chatRoomCode]);
                            });
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
                    socket.emit("accountNotFound");
                }else{
                    userID = result[0].id;
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
                    langPeopleArray.push({id:rows[i].id, username: rows[i].Username});
                }
               
            }      
        }); 
    });
    socket.on('createGroup', function(msg){
     
        var sqlcreateGroup = "INSERT INTO ChatRooms (Name, Users)  VALUES ('"+ msg.chatRoomName+ "','"+msg.user+",')";
        con.query(sqlcreateGroup, function(err, result){
            if (err) {throw err; console.log(err);}
            else{
                socket.emit('createGroup', 1);
                chatRoomCode = result.insertId;
                socket.join('room'+chatRoomCode);
                var sqlFindInfo = "SELECT * FROM Account WHERE id='"+msg.user+"';";
                con.query(sqlFindInfo, function(err2, result2){
                    // Wait till page loads!
                    socket.emit("joinRoomSuccess", {username:result2[0].Username, chatHistory:[], roomName:msg.chatRoomName+" Group Code:"+chatRoomCode});
                    setTimeout(function(){
                        io.to('room'+chatRoomCode).emit("userList", [{username:result2[0].Username, profile:result2[0].Picture}]);
                    },500);
                });
            }
        }); 

    });

    function createGroup(msg){
        var sqlcreateGroup = "INSERT INTO ChatRooms (Name, Users)  VALUES ('"+ msg.chatRoomName+ "','"+msg.user+",')";
        con.query(sqlcreateGroup, function(err, result){
            if (err) {throw err; console.log(err);}
            else{
                socket.emit('createGroup', 1);
                chatRoomCode = result.insertId;
                socket.join('room'+chatRoomCode);
                var sqlFindInfo = "SELECT * FROM Account WHERE id='"+msg.user+"';";
                con.query(sqlFindInfo, function(err2, result2){
                    // Wait till page loads!
                    socket.emit("joinRoomSuccess", {username:result2[0].Username, chatHistory:[], roomName:msg.chatRoomName+" Group Code:"+chatRoomCode});
                    setTimeout(function(){
                        io.to('room'+chatRoomCode).emit("userList", [{username:result2[0].Username, profile:result2[0].Picture}]);
                    },500);
                });
            }
        });
    }

    socket.on("joinGroup", function(msg){
        var sqlGetGroups = "SELECT * from ChatRooms where id='"+msg.groupCode+"'";
        con.query(sqlGetGroups, function(err, result){
            if (err) throw err;
            if (result.length !== 0){
                let allUsers = result[0].Users + msg.user;
                chatRoomCode = msg.groupCode;
                socket.join('room'+chatRoomCode);
                
                let sqlInsertUser = "UPDATE ChatRooms SET Users = '"+allUsers+",' where id="+msg.groupCode;
                console.log(sqlInsertUser);
                con.query(sqlInsertUser, function(err2, result2){
                
                    socket.emit("joinRoomSuccess", {username:msg.username, roomName:result[0].Name+" Group Code:"+chatRoomCode});
                    
                    setTimeout(function(){
                        var sqlUsers = "SELECT * FROM Account WHERE id IN ("+allUsers+")";

                        con.query(sqlUsers, function(err3, result3){
                            if (err3) throw err3;
                            listOfUsers = [];
                            for (user of result3){
                                listOfUsers.push({username: user['Username'], profile: user['Picture']});
                            }
                            io.to('room'+chatRoomCode).emit("userList", listOfUsers)
                            socket.emit("wel", chatHistory[chatRoomCode]);
                        });
                    },500);
                });
            }else{
                // That group code was not found / does not exist
                socket.emit("groupNotFound");

            }
        });
    });

    function joinGroup(msg, otherSocket){
        let actualSocket = socket;
        if (otherSocket){
            actualSocket = otherSocket;
        }
        var sqlGetGroups = "SELECT * from ChatRooms where id='"+msg.groupCode+"'";
        con.query(sqlGetGroups, function(err, result){
            if (err) throw err;
            if (result.length !== 0){
                let allUsers = result[0].Users + msg.user;
                chatRoomCode = msg.groupCode;
                actualSocket.join('room'+chatRoomCode);
                
                let sqlInsertUser = "UPDATE ChatRooms SET Users = '"+allUsers+",' where id="+msg.groupCode;
                console.log(sqlInsertUser);
                con.query(sqlInsertUser, function(err2, result2){
                
                    actualSocket.emit("joinRoomSuccess", {username:msg.username, roomName:result[0].Name+" Group Code:"+chatRoomCode});
                    
                    setTimeout(function(){
                        var sqlUsers = "SELECT * FROM Account WHERE id IN ("+allUsers+")";

                        con.query(sqlUsers, function(err3, result3){
                            if (err3) throw err3;
                            listOfUsers = [];
                            for (user of result3){
                                listOfUsers.push({username: user['Username'], profile: user['Picture']});
                            }
                            io.to('room'+chatRoomCode).emit("userList", listOfUsers)
                            socket.emit("wel", chatHistory[chatRoomCode]);
                        });
                    },500);
                });
            }else{
                // That group code was not found / does not exist
                actualSocket.emit("groupNotFound");
            }
        });
    }

    socket.on("getProfilePic", function(msg){
        var sql = "SELECT * FROM Account WHERE Username='"+msg+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            profilePicPath = result[0].Picture;
            socket.emit("profilePic", result[0].Picture);
        });
    });

    socket.on("setProfileImage", function(msg){
        var sql = "UPDATE Account SET Picture='"+msg.path+"' WHERE Username='"+msg.username+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            profilePicPath = msg.path;
            socket.emit("profilePicChanged", msg.path);
        });
    });

    socket.on("enterMatchLobby", function(msg){
        socket.username = msg.username;
        socket.find = msg.find[0];
        socket.userID = msg.userID;

        //https://stackoverflow.com/questions/18093638/socket-io-rooms-get-list-of-clients-in-specific-room
        if (io.sockets.adapter.rooms['matchLobby']){
            var clients = io.sockets.adapter.rooms['matchLobby'].sockets;   
            for (var clientId in clients ) {
                
                var clientSocket = io.sockets.connected[clientId];

                if (clientSocket.find === socket.find){
                    clientSocket.leave('matchLobby');
                    
                    // First create a group and send the last person to initiate a request in there
                    createGroup({chatRoomName:"Match Friend Room!", user:msg.userID});
                    // Ensure that there has been enough time for everything else to finish
                    setTimeout(function(){
                        clientSocket.emit("changeRoomCode", chatRoomCode);
                        joinGroup({user:clientSocket.userID, groupCode:chatRoomCode, username:clientSocket.username}, clientSocket);
                    }, 1000);
                    break;
                }else{
                    socket.join('matchLobby');
                }
            }
        }else {socket.join('matchLobby');}
    });

    socket.on("roomCode", function(msg){
        chatRoomCode = msg;
    });
});
