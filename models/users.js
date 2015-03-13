'use strict'
var db= require('../config/mongoose')();
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR=10;

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



// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};




 return  db.connection.model('User', userSchema);

}
