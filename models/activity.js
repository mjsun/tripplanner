var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
	name: String,
	place: [{type: mongoose.Schema.ObjectId, ref: 'Place'}],
	age_rang: String
});

var Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;