
var user= require('../models/users');

exports.tokenValidate =function(){
user.FindOne({},'');	
} 

exports.userSave= function(){
	var user =new user({});
	user.save();
}
