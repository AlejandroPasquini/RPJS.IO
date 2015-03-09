'use strict';

// chat controller for chat model require by sockets
var chat= require('../models/chats')();
exports.databaseSave = function (username,msg){
var incomingChat = new chat({ username: username,msg:msg, });
 	incomingChat.save();
};

//Admin Function --- in dev ---
exports.chatFindOne = function (){

	chat.findOne({ username: 'nombre' },'username msg' ,function (err, chat) {
	  if (err) return handleError(err);
	  console.log('%s %s.', chat.username, chat.msg) 
	})
}

exports.chatShow= function (){

	chat.find({},{},{limit:10}, function (err, chats){
	  if (err) return handleError(err);

		console.log(chats);
});

}
