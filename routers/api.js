var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var models = require('../models/index');



router.get('/all', function(req, res){
    
    Promise.all([models.Hotel.find(), models.Restaurant.find(), models.Activity.find()])
    .then(function(all){
        res.json({hotels: all[0], restaurants: all[1], activities: all[2]});
    })
    .catch(function(err){
        console.log(err);
    })
});

router.get('/hotel/:id', function(req, res){
    
    models.Hotel.findOne({_id: req.params.id})
    .then(function(doc){
    	res.json(doc);
    })
    .catch(function(err){
    	console.log(err);
    })
    
});

router.get('/restaurant/:id', function(req, res){
    
    models.Restaurant.findOne({_id: req.params.id})
    .then(function(doc){
    	res.json(doc);
    })
    .catch(function(err){
    	console.log(err);
    })
    
});


router.get('/activity/:id', function(req, res){
    
    models.Activity.findOne({_id: req.params.id})
    .then(function(doc){
    	res.json(doc);
    })
    .catch(function(err){
    	console.log(err);
    })
    
});

router.post('/saveit', function(req, res){
    var days = JSON.parse(req.body.send);
    
    var modifiedDays = [];
    days.forEach(function(day){
        day.hotel = [day.hotel];
        day.restaurant = day.restaurants;
        day.activity = day.activities;
        modifiedDays.push(new models.Day(day));
    });

    var trip = new models.Trip({trip: modifiedDays});
    trip.save(function(){
        res.json('saved');
    })

});

module.exports = router;