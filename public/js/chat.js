/*

Name:       Debbie Macrohon
UCID:       10121170
Description:Client side code for chat application. One of the code snippets 
    (for clearing the cookies) is taken from  
    https://www.sitepoint.com/community/t/clear-all-cookies-from-a-website/224983/2

*/

//alert(document.cookie);
$(function() {
    var socket = io();
    var userNickSt=  $('#userNick').value;
    var color= "";
    if (document.cookie=="" ){socket.emit('init'); }
    else{socket.emit('rec', document.cookie); }
   
    $('form').submit(function(){
        var message = $('#m').val();
        var mess_args = message.split(" ");
        if (mess_args.length==2 && mess_args[0]=="/nick")
        {
            socket.emit('nick', mess_args[1]);
        }
        else if (mess_args.length==2 && mess_args[0]=="/nickcolor") {
            console.log("nick color invoked");
            socket.emit('nickcolor', mess_args[1]);
            color = mess_args[1];
        }
        else{
            socket.emit('chat',message );
        }
        $('#m').val('');
    
        return false;
    });
    socket.on('chat', function(msg){
        doChat(msg);
     });

    socket.on('nick', function(nick){
        
        if (nick!=-1){
            $('#userNick').text(nick);
            userNickSt =  $('#userNick').text();      
            if (userNickSt !=""){
               
                clearListCookies();
                document.cookie = "name="+ nick;
            }
        }
        else{alert("nickname is in use!");}
    });
    
    //the following function was taken from 
    //https://www.sitepoint.com/community/t/clear-all-cookies-from-a-website/224983/2
    function clearListCookies()
    {   
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++)
        {   
            var spcook =  cookies[i].split("=");
            deleteCookie(spcook[0]);
        }
        function deleteCookie(cookiename)
        {
            var d = new Date();
            d.setDate(d.getDate() - 1);
            var expires = ";expires="+d;
            var name=cookiename;
            var value="";
            document.cookie = name + "=" + value + expires ;                    
        }   
    }
    socket.on('wel', function(wel){
        for ( var i=0; i< wel.length;i++)
        {   doChat(wel[i]);   }
    });
    socket.on('userList', function(list){
        $('#userList').empty();
        for ( var i=0; i< list.length;i++)
        {
             $('#userList').prepend($('<li>')
            .append($('<img>').attr("src", "img/bit.png").addClass("profile"))
            .append($('<p>').text(list[i]))
            );
        }
         
    });
    function doChat(msg){
        var time = new Date(msg.time_id);
        var body = msg.body;
        var toPutIn = $('<li>');
        var divMessage = document.createElement("div");
           
        
         if (userNickSt==msg.clientId){
            $(toPutIn).addClass("me");
            $(toPutIn).append($('<img>').attr("src", "img/about.jpg"));
            $(toPutIn).append($('<p>').text(msg.body));   
          }
          else{ 
            $(toPutIn).addClass("you");
           //   $('li div img').attr("src", "../img/bit.png");
            }
         $('#messages').prepend(toPutIn);
        $('#messages').stop().animate({scrollTop:($('#messages')[0].scrollHeight)},500);
    }

    
});