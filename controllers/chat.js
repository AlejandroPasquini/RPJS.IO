// chat controller for chat model require by sockets
var chat= require('../models/chats')();
exports.databaseSave = function (username,msg){
var incomingChat = new chat({ username: username,msg:msg, });
 	incomingChat.save();
};

/*chatMongo.find({},{},{limit:6, sort:{date:-1 }}, function(err,chats){
	if(err){
		console.log(err);
	}
	else
		console.log(chats)
});
*/