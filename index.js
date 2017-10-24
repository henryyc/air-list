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
var $ = jQuery = require('jquery');

require('./public/js/jquery.csv.js');

request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/calendar.csv', function(error, response, body) {
  if (!error && response.statusCode == 200) {
    calendar = body;
    lists(calendar);
  }
});

function lists(calendar) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/listings.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      listings = body;

      require('./public/js/graphs.js')();

      //go through the csv line by line to graph the markers one by one
      var csv = require("fast-csv");

      var CSV_STRING = body;

      csv
        .fromString(CSV_STRING, {
          headers: true
        })
        .on("data", function(data) {
          //console.log(data);
          graph(data);
        })
        .on("end", function() {
          console.log("done");
        });

      neighbours(calendar, listings);
    }
  });
}

function neighbours(calendar, listings) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/neighbourhoods.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      neighbourhoods = body;
      finalFile(calendar, listings, neighbourhoods);
    }
  });
}

function finalFile(calendar, listings, neighbourhoods) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/reviews.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      reviews = body;
    }
  });
}
/*
var csv = require('csv-stream'),
var request = require('request');

// All of these arguments are optional.
var options = {
  delimiter: '\t', // default is ,
  endLine: '\n', // default is \n,
  columns: ['columnName1', 'columnName2'] // by default read the first line and use values found as columns
  escapeChar: '"', // default is an empty string
  enclosedChar: '"' // default is an empty string
}

var csvStream = csv.createStream(options);
request('http://mycsv.com/file.csv').pipe(csvStream)
  .on('error', function(err) {
    console.error(err);
  })
  .on('data', function(data) {
    // outputs an object containing a set of key/value pair representing a line found in the csv file.
    console.log(data);
  })
  .on('column', function(key, value) {
    // outputs the column name associated with the value found
    console.log('#' + key ' = ' + value);
  })*/
