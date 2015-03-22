'use strict'

var jwt = require('jsonwebtoken');
var cookie= require('cookie');
var chatController=require('../controllers/chat.js');
//var userController=require('../controllers/user.js');
module.exports = function (io) { 

var users= {};
var userCount=0;
var fileValidTypes = /(image|audio)/;
var chat = io
.of('/chat')
// Socket Auth
.use(function (socket,next){
	 var auth = cookie.parse(socket.handshake.headers.cookie);
	 var decoded = false
	 try {
	   decoded = jwt.verify(auth.token, 'omg');
	 } catch(err) {
	  console.log('Token invalido');
	  //userCount=userCount-1;
	  //socket.disconnect();
	 }
	 finally {	
	 	if(decoded !==false){
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

// socket data received validate
	socket.on('file validate', function(file){
		socket.fileValidate = {};
		socket.fileValidate.type = file.type;
		socket.fileValidate.dataBase64Key= file.dataBase64Key;
		socket.fileValidate.length = file.length;
		console.log(file);
	});


  socket.on('chat message', function(msg){
  	if( typeof socket.username !== 'undefined'){
  		if  (typeof msg.image !=='undefined'){
  			var fileApprove = false	
  			if (msg.image.match(fileValidTypes)){
  				if (msg.image.indexOf(socket.fileValidate.dataBase64Key) !== -1){
  				 fileApprove = true	;
  				}
  			}
  		}
 		if (fileApprove !== true){
 			delete msg.image;
 			// event socket on error file
 		}

  		chat.emit('chat message',{
  		msg:msg.body,
  		image: msg.image,
  		username:socket.username
  		});
        console.log(socket.username+' Envio un mensaje el '+new Date());
        chatController.databaseSave(socket.username,msg.text);
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

});

 socket.on('private message', function (from,to,msg) {
    console.log('mensaje privado');
  });

});


};

