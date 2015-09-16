var mongoose = require('mongoose');

var daySchema = mongoose.Schema({
	hotel: [require('./hotel').schema],
	restaurant: [require('./restaurant').schema],
	activity: [require('./activity').schema]
});

var Day = mongoose.model('Day', daySchema);

module.exports = Day;