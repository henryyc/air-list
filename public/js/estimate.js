var autocomplete;
var latLong;
var geocoder;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown save it
  autocomplete.addListener('place_changed', calculateCost);
}

function calculateCost() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  latLong = [place.geometry.location.lat(), place.geometry.location.lng()];
  alert(latLong);

  var cost = 0;

  document.getElementById("tablePrice").innerHTML = '$' + parseFloat(Math.round(cost * 100) / 100).toFixed(2);
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
