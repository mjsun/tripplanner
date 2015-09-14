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

module.exports = router;