'use strict';
var mongoose = require('mongoose');


module.exports= function() {

var db =mongoose.createConnection('localhost','prueba5'); 


return db;

}