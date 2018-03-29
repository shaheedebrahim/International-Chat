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

let chatHistory = [];
let onlineUsers = [];
let usedNames = [];
// listen to 'chat' messages
io.on('connection', function(socket){
    socket.emit('initialize');
    let color = "black";
    let sillyName = "";
    socket.on('initialize', function(cookie){
        if (cookie.indexOf("name") >= 0){
            let name = cookie.replace(/(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if (onlineUsers.indexOf(name) >=0){
                socket.emit('chat', "ERROR: You are already connected");
                socket.emit('forceDisconnect');
            }
            sillyName = name;
        }else{
            sillyName = generateName();
            while (usedNames.indexOf(sillyName) !== -1){
                console.log(usedNames.indexOf(sillyName));
                sillyName = generateName();
            }
            usedNames.push(sillyName);
        }
        onlineUsers.push(sillyName);
        socket.emit('setUsername', sillyName);
        socket.emit('chatHistory', chatHistory);
        io.emit('connectedDisconnected', onlineUsers); 
    });

    socket.on('changeColor', function(newColor){
        color = "#"+newColor;
        socket.emit('chat', "Color succesfully changed");
    });
    socket.on('changeName', function(list){
        let newName = list['newName'];
        if (usedNames.indexOf(newName) !== -1){
            socket.emit('chat', "Error name already taken");
        }
        else {
            let currentName = list['currentName'];
            let indexCurrent = onlineUsers.indexOf(currentName);
            let indexCurrent2 = usedNames.indexOf(currentName);
            console.log(onlineUsers);
            console.log(currentName);
            if (indexCurrent === -1){
                socket.emit('chat', "Error occured");
            }else{
                onlineUsers.splice(indexCurrent, 1);
                usedNames.splice(indexCurrent2, 1);
                socket.emit('setUsername', newName);
                onlineUsers.push(newName);
                usedNames.push(newName);
                sillyName = newName;
                io.emit('connectedDisconnected', onlineUsers);
                socket.emit('chat', "Username successfully changed");
            }
        }
    });
    socket.on('chat', function(msg){
        var d = '['+new Date().toLocaleString('en-US',{hour: 'numeric', minute:'numeric', hour12: false})+']';
        var time = d; 
        msg = time +  " " + "<span style='color:"+color+"'>"+sillyName+"</span>" +" : "+msg;
        chatHistory.push(msg);
	socket.broadcast.emit('chat', msg);
        msg = "<b>"+msg+"</b>";
        socket.emit('chat', msg);
    });
    
    socket.on('disconnect', function(){
        var index = onlineUsers.indexOf(sillyName);
        console.log(onlineUsers);
        onlineUsers.splice(index, 1);
        io.emit('connectedDisconnected', onlineUsers);
    });
});
