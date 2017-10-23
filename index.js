var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var calendar;
var listings;
var neighbourhoods;
var reviews;

var request = require('request');
request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/calendar.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        calendar = body;
    }
});

request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/calendar.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        listings = body;
    }
});

request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/calendar.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        neighbourhoods = body;
    }
});

request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/calendar.csv', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        reviews = body;
    }
});
