'use strict';

// chat controller for chat model require by sockets
var chat= require('../models/chats')();
exports.databaseSave = function (req){

var incomingChat = new chat({ from: req.from,msg:req.msg });
	if(req.to) incomingChat.to=req.to;
 	incomingChat.save();
};

//Admin Function --- in dev ---
exports.chatFindOne = function (){

	chat.findOne({ from: 'nombre' },'from msg' ,function (err, chat) {
	  if (err) return handleError(err);
	  console.log('%s %s.', chat.from, chat.msg) 
	})
}

exports.chatShow= function (){

	chat.find({},{},{limit:10}, function (err, chats){
	  if (err) return handleError(err);

		console.log(chats);
});

}
