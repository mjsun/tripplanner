var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var swig = require('swig');
var morgan = require('morgan');
var sass = require('node-sass-middleware');
var Promise = require('bluebird');
var models = require('./models/index');
// var Hotel = require('./models/hotel');
// var Restaurant = require('./models/restaurant');
// var Activity = require('./models/activity');
swig.setDefaults({
	cache: false
});

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use( morgan('dev') );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(
  sass({
    src: __dirname + '/assets', //where the sass files are 
    dest: __dirname + '/public', //where css should go
    debug: true
  })
);

app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(express.static(path.join(__dirname, 'public')));

var db = require("./config/db");
db.connect()
.then(function(data){
	console.log("You are connected to "+data);
})
.catch(function(err){
	console.log(err);
})


app.get('/', function(req, res){
	
	Promise.all([models.Hotel.find(), models.Restaurant.find(), models.Activity.find()])
	.then(function(all){
		res.render('index', {hotels: all[0], restaurants: all[1], activities: all[2], googleMapKey: 'AIzaSyA9f5Bx1718-esNIGD_w9QG1sK2Uxu1YNA'});
	})
	.catch(function(err){
		console.log(err);
	})
	
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle all errors (anything passed into `next()`)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log({error: err});
    res.send(err);
    // res.render(
    //     // ... fill in this part
    // );
});

app.listen(3000, function(){
	console.log('Listening to the port 3000');
})