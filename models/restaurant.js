var mongoose = require('mongoose');

var restaurantSchema = mongoose.Schema({
	name: String,
	place: [{type: mongoose.Schema.Types.ObjectId, ref: 'place'}],
	cuisines: String,
	price: Number
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;