var calendar;
var listings;
var neighbourhoods;
var reviews;

var request = require('request');
var $ = jQuery = require('jquery');

global.setImmediate = require('timers').setImmediate;

require('./jquery.csv.js');

request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/neighbourhoods.csv', function(error, response, body) {
  if (!error && response.statusCode == 200) {

    var csv = require("fast-csv");
    var heatmapData = [];

    var CSV_STRING = body;
    var xAxis = [];
    var i = 0;

    console.log("neighbourhod data start");
    csv
      .fromString(CSV_STRING, {
        headers: true
      })
      .on("data", function(data) {
        xAxis.push(data["neighbourhood"]);
      })
      .on("end", function() {

        console.log("neighbourhod data sent");
        listingsPrice(xAxis);
      });
  }
});

function listingsPrice(xAxis) {
  request.get('https://raw.githubusercontent.com/henryyc/air-list/master/data/listing_info_split.csv', function(error, response, body) {
    if (!error && response.statusCode == 200) {

      require('./calculations.js')();
      require('./graphs.js')();
      initMap();

      var csv = require("fast-csv");
      var heatmapData = [];

      var lats = [];
      var longs = [];
      var prices = [];
      var availability = [];

      var districtListings = [];

      var numListings = [];
      var numBooked = [];
      for (var i = 0; i < xAxis.length; i++) {
        numListings.push(0);
        numBooked.push(0);
      }

      var CSV_STRING = body;

      console.log("price data start");

      csv
        .fromString(CSV_STRING, {
          headers: true
        })
        .on("data", function(data) {
          var lat = data["latitude"];
          var long = data["longitude"];
          var temp = data["price"];
          var ava = data["availability_90"];
          var district = data["neighbourhood_cleansed"];

          //get rid of any dollar signs, commas, or extra spaces
          var price = Number(temp.replace(/[^0-9\.-]+/g, ""));

          //add to basic price statistics for cost estimation
          lats.push(lat);
          longs.push(long);
          prices.push(price);
          availability.push(ava);

          //find neighbourhoods
          for (var i = 0; i < xAxis.length; i++) {

            if (district == xAxis[i]) {

              numBooked[i] += 90 - ava;
              numListings[i]++;

              i = xAxis.length;
            }
          }

          districtListings.push(district);
          addHeat(lat, long, price, heatmapData, false);
        })
        .on("end", function() {
          addHeat(0, 0, 0, heatmapData, true);

          initCalculate(lats, longs, prices, availability);

          graphPopularity(xAxis, numListings, numBooked);

          graphInvestment(xAxis, prices, availability, districtListings);

          console.log("price data sent");
        });
    }
  });
}
