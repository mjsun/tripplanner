var mongoose = require("mongoose");

var placeSchema = mongoose.Schema({
	address: String,
	city: String,
	state: String,
	phone: String,
	location: [Number]
});

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;