var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users')();
var authStrategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/users/login')
}


// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
  console.log(req.user);
  if(req.user && req.user.admin === true)
      next();
  else
      res.send(403);
}

exports.signUp = function (req,res,next){
var username = req.body.username;  
var email= req.body.email;
var password =req.body.password;

var newUser= new User({username:username,email:email,password:password});
newUser.save(function(err){
if(err){ return handleError(err)} 
});

res.send(200);

}