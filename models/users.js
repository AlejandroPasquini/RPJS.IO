'use strict'
var mongoose = require('mongoose');
var db= require('../config/mongoose')();

module.exports = function (){
var Schema = mongoose.Schema;
var userSchema = new Schema({ 
	username: {type:String,unique:true,required:'El usuario es requerido'}, 
	password: {type: String, required:'La contraseña es requerida'},
	token: {type:String, unique:true},
	date: { type: Date, default: Date.now}

 }, {/*opt*/});

 return  db.model('User', userSchema);

}
