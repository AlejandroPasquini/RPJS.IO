'use strict';

var jwt = require('jsonwebtoken');
var cookie= require('cookie');
var chatController=require('./controllers/chat.js');
var validate = require('./lib/validate.js');
var userController=require('./controllers/user.js');

module.exports = function (io) { 

var users= new userController.usersServerTemplateSystem();
var userCount=0;
var socketCount=0;

var chat = io
.of('/chat')
// Socket Auth
.use(function (socket,next){
	setTimeout(function(){
		//For Test change this funciton
	 users.init(socket);
	 var auth = cookie.parse(socket.handshake.headers.cookie);
	 var decoded = false
	 try {
	   decoded = jwt.verify(auth.token, 'omg');
	 } catch(err) {
	  console.log('Token invalido');
	  console.log('probando con cockie de session');
	  if (auth.rapidLogin){
	  users.assign(auth.rapidLogin,socket);
	  socket.emit('login finish',{username: socket.user.name, id:users.getUserID(socket.user.name)});
	  console.log('AutoLogin con cookie: '+socket.user.name)
	  }
	  else {
	  console.log('la cookie no existe, esperando login....')
	  }
	 }
	 finally {	
	 	if(decoded !==false){
	 	console.log('Token Valido');
	 	userController.tokenValidate(decoded.username,function(name){
	 	users.assign(name,socket);
	 	console.log('automatic login for token: '+name);
	 	socket.emit('login finish',{username: socket.user.name, id:users.getUserID(socket.user.name)});
		userCount+=1
		console.log('usuario conectados'+ userCount)
	 	});	
	 	}
	 	else
	 	{

	 	}
	 	next();
	 }
	},5000)	
})
.on('connection', function(socket){
     // On conection
      var address = socket.handshake.address;
	  console.log(address+': '+socket.id+' Contectado');
	  socketCount=socketCount+1;
	  console.log(socketCount+' WebSockets conectados');
	  socket.on('request users list',function(){
	  socket.emit('response users list',{usersOnLine:Object.keys(users.online)});
	  });
	 // On socket login
	 socket.on('login',function(name){
	 //		  console.log(chat.connected[socket.id]);

	 try {
	 	validate.name(name);
	 }

	 catch(err) {
 		console.log(err);
	 	socket.emit('chat message', {
	 	username:'SISTEMA',
	 	msg:'Nombre no permitido, por favor recargue la pagina y ingrese otro nombre.'
	 	});
	 	socket.disconnect();
		return -1;	
	 }
	 
	 if (/*!users.online[name] && !socket.user.name*/true){
	 	if (!socket.user.name) {socket.user.name=name} //for devs
		 users.assign(name,socket);
		 userCount=userCount+1;
		 console.log(userCount+' Usuarios conectados');
		 console.log(socket.id+' como '+name);
		 socket.emit('login finish',{username:name,id:users.getUserID(name)});
		 chat.emit('users public connects',users.getUserID(name));
	 }

	else {	
	 	socket.emit('chat message', {
	 	username:'SISTEMA',
	 	msg:'Nombre en uso. Por favor recargue la pagina y ingrese otro nombre'
	 	});
	 	socket.disconnect();
	}		 
	 });


	socket.on('disconnect', function(){
	socketCount=socketCount-1;
	 console.log(( socket.user.name || socket.id +' Usuario sin identificar.')
	 +' Desconectado');
	 console.log(socketCount+' WebSockets conectados');
	 if (socket.user.name) {
	 	users.del(socket);
	 }
  });

// socket data received validate
	socket.on('file validate', function(file){
		socket.user.StreamB64file.validate = {};
		socket.user.StreamB64file.validate.type = file.type;
		socket.user.StreamB64file.validate.dataBase64Key= file.dataBase64Key;
		socket.user.StreamB64file.validate.length = file.length;
		console.log(file);
		validate.file(socket.user.StreamB64file.validate);
		if (validate.next){
		socket.emit('file validate',{next:validate.next});
		}
		else {
		socket.emit('file validate',{err:validate.err});
		}
	
	});

	socket.on('file upload',function(base64){
	if (typeof socket.user.name !== 'undefined'){	

	socket.user.StreamB64file.file = validate.upload(base64.file,socket.user.StreamB64file.validate);

	socket.emit('file validate',{uploadComplete:'true'});
	}
	else {
		socket.emit('file validate', {err:'Method not allowed'});
	}
     //event error here

	});

  socket.on('chat message', function(msg){
  	var image;
  	if( typeof socket.user.name !== 'undefined'){
  		
 		if (socket.user.StreamB64file.file !== false){
 			 image=socket.user.StreamB64file.file;
 			 delete socket.user.StreamB64file.file;
 			 delete socket.user.StreamB64file.validate;
 		}
  		chat.emit('chat message',{
  		msg:msg.body,
  		image: image,
  		username:socket.user.name,
  		id:socket.user.id
  		});
        console.log(socket.user.name+' Envio un mensaje el '+new Date());
        chatController.databaseSave({from:socket.user.name,msg:msg.body});
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
//for testing
setInterval(function(){
console.log(users.online)
},15000)

};