'use strict'
var mongoose= require('../config/mongoose')();

module.exports = function (){
var Schema = mongoose.Schema;
var chatSchema = new Schema({ 
	username: String, 
	msg: String,
	date: { type: Date, default: Date.now}

 }, {/*opt*/});

 return mongoose.model('Chat', chatSchema);

}
