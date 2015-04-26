'use strict';
var user= require('../models/users')();

exports.tokenValidate =function(username,callback){

user.findOne({username: username},'username token', function(err,result){
if (err) { return handleError(err)}

callback(result.username);
});

return 0;
}

var crypto = require('crypto');
function encrypt(text) {
 var algorithm = 'aes-256-ctr';
 var password = 'd9qwd5j5pILUJH6wefSQ';
 var cipher = crypto.createCipher(algorithm,password)
 var crypted = cipher.update(text,'utf8','hex')
 crypted += cipher.final('hex');
 return crypted;
}

function decrypt(text){
  var algorithm = 'aes-256-ctr';
  var password = 'd9qwd5j5pILUJH6wefSQ';	
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.usersServerTemplateSystem = function(){
/*jshint validthis: true */
this.online={}
this.roots = 'root';

var keysUsers = {}

this.init = function (socket){
socket.user = {};
}

this.getUserID = function(name){
return keysUsers[name]
}


this.assign = function (name,socket){
	if(!keysUsers[name]){
	this.online[socket.id]={SocketIDs:[socket.id]}
	socket.user={id:socket.id,name:name,StreamB64file:{}};
	socket.user.indexID = this.online[socket.user.id].SocketIDs.length-1;
	keysUsers[name]=socket.id;
	socket.user.clientID= encrypt(keysUsers[name]);
	this.online[socket.id].clientID = socket.user.clientID;
	//crear objeto socket.user
	}
	else {
	this.online[keysUsers[name]].SocketIDs.push(socket.id);	
	socket.user={id:keysUsers[name],name:name,StreamB64file:{}};
	socket.user.indexID = this.online[socket.user.id].SocketIDs.length-1;
	socket.user.clientID= encrypt(keysUsers[name]);
	}
	console.log(keysUsers);
	console.log(this.online);

}
this.del = function (socket){

	if (this.online[socket.user.id].SocketIDs.length>1){
		var i = this.online[socket.user.id].SocketIDs.indexOf(socket.id);
		this.online[socket.user.id].SocketIDs.splice(i,1);
		console.log('canditad de sockets conectado al mismo usuario '+this.online[socket.user.id].SocketIDs.length+' '+socket.user.indexID);

	}	
	else {
	console.log('Usuario Completamente eliminado de memoria')
	delete keysUsers[socket.user.name];
	delete this.online[socket.user.id];
	}
}
}
