var mongoose = require('mongoose');

var restaurantSchema = mongoose.Schema({
	name: String,
	place: [require('./place').schema],
	cuisines: String,
	price: Number
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;