'use strict'
var db= require('../../config/mongoose')();

module.exports = function (){
var Schema = db.mongoose.Schema;
var chatSchema = new Schema({ 
	from: String,
	to: {type:String, default:'public'}, 
	msg: String,
	date: { type: Date, default: Date.now}

 }, {/*opt*/});

 return db.connection.model('Chat', chatSchema);

}
