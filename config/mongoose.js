'use strict';
var mongoose = require('mongoose');
var config =require('./config');

module.exports= function() {

var connection =mongoose.createConnection(config.host,config.dbName,config.opt); 

return {connection:connection, mongoose:mongoose};

}