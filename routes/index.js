var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({secret: 'ssshhh32323hh',  resave: true,
    saveUninitialized: true}));

router.use(function(req,res,next){
var sess = req.session;
  if (sess.views) {
    sess.views++;
  } else {
    sess.views = 1;
  }
  console.log(sess.views);
  next();
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat IO', ip:process.env.IP, port:process.env.PORT });
});

module.exports = router;
