var mongoose = require('mongoose');

var hotelSchema = mongoose.Schema({
	name: String,
	place: [{type: mongoose.Schema.ObjectId, ref: 'place'}],
	num_stars: Number,
	amentities: String
});

var Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
