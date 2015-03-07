var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat IO', ip:process.env.IP, port:process.env.PORT });
});

module.exports = router;
