'use strict';

var chatController=require('../controllers/chat.js')



module.exports = function (io) { 




var userCount=0;
var users= new Object();
var chat = io
.of('/chat')
.on('connection', function(socket){
     // On conection
      var address = socket.handshake.address;
	  userCount=userCount+1;
	  var username=null;
	  console.log(address+': '+socket.id+' Contectado');
	  console.log(userCount+' Usuarios conectados');


	 // On socket login
	 socket.on('login',function(name){
	 console.log(socket.id+' como '+name);
	 username=name;

	 users[socket.id]=username;
	 console.log(users);
	 
	 });


	socket.on('disconnect', function(){
	userCount=userCount-1;
	 delete users[socket.id];
	 console.log(username+' Desconectado');
	 console.log(userCount+' Usuarios conectados');
	 console.log(users);
  });





  socket.on('chat message', function(msg){
  	if(username!==null){
  		chat.emit('chat message',{
  		msg:msg,
  		username:username
  		});
        console.log(username+' Envio un mensaje el '+new Date());
        chatController.databaseSave(username,msg);


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

