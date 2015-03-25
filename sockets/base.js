'use strict'

var jwt = require('jsonwebtoken');
var cookie= require('cookie');
var chatController=require('../controllers/chat.js');
//var userController=require('../controllers/user.js');

function validate() {
/*jshint validthis: true */
var fileValidTypes = /(image|audio)/;
var pass= {};

this.file= function (validate){
	if (validate.type.match(fileValidTypes)) {
				this.next='archivo verificado';		
			}
			else {
			    this.err='Archivo invalido';
		}

}
this.upload= function (upload,validate){
	if (validate.type.match(fileValidTypes)){
		if(validate.lenght===upload.lenght){
			if (upload.indexOf(validate.dataBase64Key)!== -1){
				return upload;
			}
		}
	}
	else {

		}

}
	
}

module.exports = function (io) { 

var users= {};
var userCount=0;
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
      socket.StreamB64file = {};
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
		socket.StreamB64file.validate = {};
		socket.StreamB64file.validate.type = file.type;
		socket.StreamB64file.validate.dataBase64Key= file.dataBase64Key;
		socket.StreamB64file.validate.length = file.length;
		console.log(file);
		var pass = new validate();
		pass.file(socket.StreamB64file.validate);
		if (pass.next){
		socket.emit('file validate',{next:pass.next});
		}
		else {
		socket.emit('file validate',{err:pass.err});
		}
	
	});

	socket.on('file upload',function(base64){
	var pass = new validate();

	socket.StreamB64file.file = pass.upload(base64.file,socket.StreamB64file.validate);

	socket.emit('file validate',{uploadComplete:'true'});
	})

  socket.on('chat message', function(msg){
  	if( typeof socket.username !== 'undefined'){
  		
  		/*
  		if  (typeof msg.image !=='undefined'){
  			var fileApprove = false	
  			if (msg.image.match(fileValidTypes)){
  				if (msg.image.indexOf(socket.StreamB64file.validate.dataBase64Key) !== -1){
  				 fileApprove = true	;
  				}
  			}
  		}
 		if (fileApprove !== true){
 			delete msg.image;
 			// event socket on error file
 		}
 		*/
 		if (typeof socket.StreamB64file.file !== 'undefined'){
 			 var image=socket.StreamB64file.file;
 			 delete socket.StreamB64file.file;
 			 delete socket.StreamB64file.validate;
 		}

  		chat.emit('chat message',{
  		msg:msg.body,
  		image: image,
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

