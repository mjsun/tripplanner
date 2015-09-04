var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var swig = require('swig');
var morgan = require('morgan');
var sass = require('node-sass-middleware');

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

app.get('/', function(req, res){
	res.send('Welcome!');
})

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle all errors (anything passed into `next()`)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log({error: err});
    res.render(
        // ... fill in this part
    );
});

app.listen(3000, function(){
	console.log('Listening to the port 3000');
})