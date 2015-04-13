'use strict';
var user= require('../models/users')();

exports.tokenValidate =function(callback){

user.findOne({username:'admin'},'username token', function(err,result){
if (err) { return handleError(err)}

callback(result.username);
});


return 0;
} 
