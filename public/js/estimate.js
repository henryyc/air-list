var autocomplete;

var otherLats = [];
var otherLongs = [];
var otherPrices = [];
var otherAvailability = [];
var R = 6371; //radius of earth in km

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /* @type {!HTMLInputElement} */
    (document.getElementById('autocomplete')), {
      types: ['geocode']
    });

  // When the user selects an address from the dropdown save it
  autocomplete.addListener('place_changed', calculateCost);
  console.log("autocomplete added");
}

function initData(lats, longs, prices, availability) {
  otherLats = lats;
  otherLongs = longs;
  otherPrices = prices;
  otherAvailability = availability;
}

function calculateCost() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  var myLat = place.geometry.location.lat();
  var myLong = place.geometry.location.lng();

  var weeklyRevenue = 0;

  var averagePriceRate = 0;
  var numListings = 0;

  for (var i = 0; i < otherLats.length; i++) {

    /* Haversine formula; https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula */

    //convert lat long to radian
    var degreeLat = (otherLats[i] - myLat) * (Math.PI / 180);
    var degreeLong = (otherLongs[i] - myLong) * (Math.PI / 180);
    var a =
      Math.sin(degreeLat / 2) * Math.sin(degreeLat / 2) +
      Math.cos((myLat) * (Math.PI / 180)) * Math.cos((otherLats[i]) * (Math.PI / 180)) *
      Math.sin(degreeLong / 2) * Math.sin(degreeLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;

    //consider a listing a competitor if it is within 1 km
    if (distance <= 1) {

      //calculate amount of money made by listing in the next 3 months
      var numberOfBookedDays = 90 - otherAvailability[i];
      var profitMade = numberOfBookedDays * otherPrices[i];
      var averageProfitPerDay = profitMade / 90;

      //sum up how much each listing makes in a week, then at the end, average it for all listings
      //airbnb charges a 3% host service fee per booking
      //from skimming the data, I just estimated an average of around a week per booking, so .97^1 = .97; http://rentingyourplace.com/airbnb-101/pricing/to-fee-or-not-to-fee/
      weeklyRevenue += (averageProfitPerDay * 7) * 0.97;

      numListings++;

      averagePriceRate += otherPrices[i];
    }
  }

  weeklyRevenue /= numListings;
  averagePriceRate = averagePriceRate / numListings * .9; //to maximize profit from daily rent: rent 10% less than average

  document.getElementById("tablePrice").innerHTML = '$' + parseFloat(Math.round(averagePriceRate * 100) / 100).toFixed(2);
  document.getElementById("tablePriceTwo").innerHTML = '$' + parseFloat(Math.round(weeklyRevenue * 100) / 100).toFixed(2);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
