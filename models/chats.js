'use strict'
var mongoose = require('mongoose');
var db= require('../config/mongoose')();

module.exports = function (){
var Schema = mongoose.Schema;
var chatSchema = new Schema({ 
	username: String, 
	msg: String,
	date: { type: Date, default: Date.now}

 }, {/*opt*/});

 return db.model('Chat', chatSchema);

}
