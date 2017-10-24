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
