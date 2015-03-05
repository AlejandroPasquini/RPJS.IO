'use strict';
var mongoose = require('mongoose');


module.exports= function() {

var db =mongoose.connect('mongodb://localhost/prueba5'); 


return db;

}