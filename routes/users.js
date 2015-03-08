var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var user;
/* GET users listing. */
router.get('/', function(req, res, next) {
	
	user = req.session;
	res.render('user', {username:user.name});
 });


router.post('/login', function(req,res,next){
user = req.session;
user.name=req.body.name;
user.password=req.body.password;

var token = jwt.sign(user, 'omg' ,{ expiresInMinutes: 60*5 });

res.json({token: token});
console.log('Decodificacion: '+jwt.decode(token).name);

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
