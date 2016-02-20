var express = require('express');
var monk = require('monk');
var app = express();
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var db = monk('localhost:27017/demo2');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req,res,next) {
    req.db = db;
    next();
});

app.get('/', function(req,res) {
    res.render('layout');
});
app.get('/about', function(req,res) {
    res.render('about');
});
app.post('/add', function(req,res) {
    var db = req.db;
    var name = req.body.name;
    var age = req.body.age;
    var collection = db.get('index');
    collection.insert({
        name : name,
        age : age 
    }, function(err, result) {
        if(err) {
            res.send("Error...");
        }
        else {
            res.redirect('index');
        }
    });
});
app.get('/index', function(req,res) {
    var db = req.db;
    var collection = db.get('index');
    collection.find({}, {}, function(err, doc) {
        res.render('partials/index', {
            'index' : doc
        });
    });
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log("Running on port 5000...");
});
