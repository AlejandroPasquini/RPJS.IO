'use strict'
var db= require('../../config/mongoose')();

module.exports = function (){
var Schema = db.mongoose.Schema;
var userSchema = new Schema({ 
		username: {type:String,unique:true,required:'El usuario es requerido'},
		email: {type:String,unique:true,required:"El email es requerido"}, 
		password: {type: String, required:'La contraseña es requerida'},
		admin: {type:Boolean},
		token: {type:String},
		date: { type: Date, default: Date.now}

 }, {/*opt*/});

 return  db.connection.model('User', userSchema);
}