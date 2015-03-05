var path = require('path');
var express = require('express');
var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);

var com = require("./lib/common");
var PORT = com.PORT;
var lib_chat = require("./lib/lib_chat")

var onlineUser = new lib_chat.SimpleMap();

app.get('/', function(req, res){

  //res.writeHead(302, {'Location': 'http://192.155.85.76:2013#tyson'});
  //res.end();

  res.sendFile(__dirname + '/web/chatroom.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var message = new lib_chat.Message();
    message.onLogout(socket, io, onlineUser);
  });

  socket.on('login', function(msg){
    var message = new lib_chat.Message();
    message.onLogin(socket, msg, onlineUser);
  });
  socket.on('speak', function(msg){
    var message = new lib_chat.Message();
    message.onSpeak(socket, msg, onlineUser);
  });

  socket.on('listUser', function(msg){
    var message = new lib_chat.Message();
    message.onListUser(io, onlineUser);
  });


});


   
app.use(express.static(path.join(__dirname, 'web')));
app.use(express.static(path.join(__dirname, 'lib')));

http.listen(PORT, function(){
  console.log('listening on port: '+ PORT);
});





