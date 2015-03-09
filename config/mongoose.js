'use strict';
var mongoose = require('mongoose');


module.exports= function() {

var connection =mongoose.createConnection('localhost','prueba5'); 


return {connection:connection, mongoose:mongoose};

}