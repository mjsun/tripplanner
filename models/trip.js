var mongoose = require('mongoose');

var tripSchema = mongoose.Schema({trip: [require('./day').schema]});

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;