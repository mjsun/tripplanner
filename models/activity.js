var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
	name: String,
	place: [require('./place').schema],
	age_rang: String
});

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;