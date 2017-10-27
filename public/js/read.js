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
    calendar = body;
    lists(calendar);
  }
});

function lists(calendar) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/listings.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      listings = body;

      //var GoogleMapsAPI = require('googlemaps');
      require('./graphs.js')();
      initMap();

      //go through the csv line by line to graph the markers one by one
      var csv = require("fast-csv");
      var heatmapData = [];

      var CSV_STRING = body;

      csv
        .fromString(CSV_STRING, {
          headers: true
        })
        .on("data", function(data) {
          var lat = data["latitude"];
          var long = data["longitude"];
          var price = data["price"];
        /*  var weight = google.maps.visualization.WeightedLocation(new google.maps.LatLng(lat, long), price);
          heatmapData.push(weight);*/

          addHeat(lat, long, price, heatmapData, false)
          addMarker(lat, long)
        })
        .on("end", function() {
          //addHeat(heatmapData);
          addHeat(0, 0, 0, heatmapData, true);
          console.log("listing data finished being sent");
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
