'use strict'


var mongodb= 
{
host: process.env.IP || process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',  
port: process.env.PORT || process.env.OPENSHIFT_MONGODB_DB_PORT || '27017',
dbUrl: process.env.OPENSHIFT_MONGODB_DB_URL || 'localhost',
dbName:  process.env.MONGODB_DB_NAME || 'chatio'
};
/*
process.env.OPENSHIFT_MONGODB_DB_USERNAME
process.env.OPENSHIFT_MONGODB_DB_PASSWORD
process.env.OPENSHIFT_MONGODB_DB_URL
process.env.OPENSHIFT_MONGODB_DB_LOG_DIR
*/

module.exports= mongodb;