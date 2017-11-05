var calendar;
var listings;
var neighbourhoods;
var reviews;

var request = require('request');
var $ = jQuery = require('jquery');

global.setImmediate = require('timers').setImmediate;

require('./jquery.csv.js');

request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/calendar.csv', function(error, response, body) {
  if (!error && response.statusCode == 200) {
    neighbours();
  }
});

function neighbours() {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/neighbourhoods.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {

      var csv = require("fast-csv");
      var heatmapData = [];

      var CSV_STRING = body;
      var xAxis = [];
      var i = 0;

      csv
        .fromString(CSV_STRING, {
          headers: true
        })
        .on("data", function(data) {
          xAxis.push(data["neighbourhood"]);
          xAxis[i] = [];
          i++;
        })
        .on("end", function() {

          console.log("calendar data finished being sent");
          listingsPrice(xAxis);
        });
    }
  });
}

function listingsPrice(xAxis) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/lat_long_price.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {

      require('./graphs.js')();
      initMap();

      var csv = require("fast-csv");
      var heatmapData = [];
      var priceData = new Array(xAxis.length); //keep track of price for each neighbourhood
      var priceFreq = new Array(xAxis.length); //keep track of number of listings in each neighbourhood
      for (var i = 0; i < priceData.length; i++) {
        priceData[i] = 0;
        priceFreq[i] = 0;
      }

      var CSV_STRING = body;

      console.log("start reading listings");

      csv
        .fromString(CSV_STRING, {
          headers: true
        })
        .on("data", function(data) {
          var lat = data["latitude"];
          var long = data["longitude"];
          var temp = data["price"];

          //get rid of any dollar signs, commas, or extra spaces
          var price = Number(temp.replace(/[^0-9\.-]+/g, ""));

          //add to basic price statistics
          //  var neighbourhood = data["host_neighbourhood"];

          addHeat(lat, long, price, heatmapData, false);
          //addMarker(data);
        })
        .on("end", function() {
          graphPrices(xAxis, priceData, priceFreq);
          addHeat(0, 0, 0, heatmapData, true);

          console.log("listing and price data finished being sent");
        });

      listingsInfo(listings, neighbourhoods);
    }
  });
}

function listingsInfo(calendar, listings, neighbourhoods) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/lat_long_info.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {

      //go through the csv line by line to graph the markers one by one
      var csv = require("fast-csv");
      var CSV_STRING = body;

      csv
        .fromString(CSV_STRING, {
          headers: true
        })
        .on("data", function(data) {
          console.log("banana");
          addMarker(data);
        })
        .on("end", function() {
          console.log("finished");
        });
    }
  });
}
