'use strict'

var jwt = require('jsonwebtoken');
var cookie= require('cookie');
var chatController=require('../controllers/chat.js');
//var userController=require('../controllers/user.js');
module.exports = function (io) { 


var userCount=0;
var users= {};
var chat = io
.of('/chat')
// Socket Auth
.use(function (socket,next){
	 var auth = cookie.parse(socket.handshake.headers.cookie);
	 try {
	  var decoded = jwt.verify(auth.token, 'omg');
	 } catch(err) {
	  console.log('Token invalido');
	  //userCount=userCount-1;
	  //socket.disconnect();
	 }
	 finally {	
	 	if(decoded){
	 	console.log('Token Valido')	
	 	}
	 	else
	 	{

	 	}
	 	next();
	 }
	
})
.on('connection', function(socket){
     // On conection
      var address = socket.handshake.address;
      userCount=userCount+1;
	  console.log(address+': '+socket.id+' Contectado');
	  console.log(userCount+' Usuarios conectados');

	 // On socket login
	 socket.on('login',function(name){
	 socket.username=name;
	 
	 if (!users[name]){
		 users[name]= {socket:socket};
		 console.log(socket.id+' como '+name);
	 }

	else {	
	 	socket.emit('chat message', {
	 	username:'SISTEMA',
	 	msg:'Nombre en uso. Por favor recargue la pagina y ingrese otro nombre'
	 	});
	 	socket.disconnect()
	}		 
	 });


	socket.on('disconnect', function(){
	userCount=userCount-1;
	 console.log(( socket.username || socket.id +' Usuario sin identificar.')
	 +' Desconectado');
	 console.log(userCount+' Usuarios conectados');
	 if (socket.username) {
	 	delete users[socket.username];
	 }
  });

  socket.on('chat message', function(msg){
  	if( typeof socket.username !== 'undefined'){
  		chat.emit('chat message',{
  		msg:msg,
  		username:socket.username
  		});
        console.log(socket.username+' Envio un mensaje el '+new Date());
        chatController.databaseSave(socket.username,msg);
       // chatController.chatShow();

  }
  else {
		socket.emit('chat message', {
			msg:'Debes ingresar un nombre',
			username:'SISTEMA'
			}
			);
		//socket.disconnect();

}


  socket.on('private message', function (from,to,msg) {
    console.log('mensaje privado');
  });



});

});


};

