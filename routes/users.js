var express = require('express');
var passport = require('passport');
var pass = require('../config/passport')
var router = express.Router();
var userController = require('../controllers/user')
var user;
/* GET users listing. */
router.get('/', pass.ensureAuthenticated, function(req, res, next) {
		res.render('user', {user:req.user});
 });

router.get('/login', function(req, res, next) {
		res.render('sign-in', {});
 });


router.post('/login', function(req,res,next){

userController.postlogin(req,res,next);

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
