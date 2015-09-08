var mongoose = require('mongoose');

var host = "mongodb://localhost/";
var db = "tripplanner";

mongoose.connect(host+db);


module.exports = {
	Activity: require('./activity'),
	Hotel: require('./hotel'),
	Place: require('./place'),
	Restaurant: require('./restaurant')
}