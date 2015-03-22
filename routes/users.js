var express = require('express');
var passport = require('passport');
var pass = require('../config/passport')
var router = express.Router();
var jwt = require('jsonwebtoken');

var user;
/* GET users listing. */
router.get('/', pass.ensureAuthenticated, function(req, res, next) {
	
		res.render('user', {username:req.user});
 });

router.get('/login', function(req, res, next) {
		res.cookie('token', jwt.sign({'user':'test'}, 'omg' ,{ expiresInMinutes: 60*5 })) //for testing
		//console.log('Decodificacion: '+jwt.decode(token).name);
		res.render('sign-in', {});
 });


router.post('/login', function(req,res,next){
user = req.session;
user.name=req.body.name;
user.password=req.body.password;

res.json({token: token});

});


router.get('/sign-up', function(req,res,next){
res.render('sign-up',{});
});

router.post('/sign-up', function(req,res,next){
	
});





router.get('/logout',function(req,res){
req.session.destroy(function(err){
if(err){
console.log(err);
}
else
{
res.redirect('/users');
}
});
});

module.exports = router;
