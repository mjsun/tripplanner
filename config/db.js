var mongoose = require('mongoose');
var Promise = require('bluebird');

var host = "mongodb://localhost/";
var db = "tripplanner";

module.exports = {
	connect: connect
}

function connect(){
	return new Promise(function(resolve, reject){
		mongoose.connect(host+db, function(err){
			if(err){
				reject(err);
			}
			resolve(mongoose.connection.name);
		});
	});
}