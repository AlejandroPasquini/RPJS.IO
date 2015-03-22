'use strict';
var mongoose = require('mongoose');
var config =require('./config');

module.exports= function() {

var connection =mongoose.createConnection(config.dbUrl,config.dbName,config.opt); 

return {connection:connection, mongoose:mongoose};

}