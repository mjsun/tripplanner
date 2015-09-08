var mongoose = require('mongoose');
var Promise = require('bluebird');

var host = "mongodb://localhost/";
var db = "tripplanner";

module.exports = {
	connect: connect,
	disconnect: disconnect
}

function connect(){
	return new Promise(function(resolve, reject){
		mongoose.createConnection(host+db, function(err){
			if(err){
				console.log(err);
				reject(err);
			}
			resolve(mongoose.connection.name);
		});
	});
}

function disconnect(){
  return new Promise(function(resolve, reject){
    mongoose.disconnect(function(){
      resolve();
    });
  });
}