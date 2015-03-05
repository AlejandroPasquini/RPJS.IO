'use strict';
module.exports = function (io) { 

var chatMongo= require('../models/chats')();

function databaseSave(username,msg){
var incomingChat = new chatMongo({ username: username,msg:msg, });
 	incomingChat.save();
}


var num=0 ;//for testing
var chat = io
.of('/chat')
.on('connection', function(socket){
      var address = socket.handshake.address;

	// Asing username Space testing
	  num=num+1;
	  var username='User ';
	  console.log(address+': '+username+num+' Contectado');

	 //login
	 socket.on('login',function(name){
	 console.log(username+num+' como '+name);
	 username=name;
	 });


	socket.on('disconnect', function(){
    console.log(username+' Desconectado');
  });



  socket.on('chat message', function(msg){
  	if(username!=='User '){
  		chat.emit('chat message',{
  		msg:msg,
  		username:username
  		});
        console.log(username+' Envio un mensaje el '+new Date());
        databaseSave(username,msg);


  }
  else {
		socket.emit('chat message', {
			msg:'Debes ingresar un nombre',
			username:'SISTEMA'
			}
			);
		//socket.disconnect();

}
});

});
};

