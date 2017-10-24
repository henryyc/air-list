/* graphs all listings with markers onto google maps */
//module.exports = function() {

var map;
//this.initMap = function() {
function initMap() {
  /*map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(37.7749, 122.4194),
  });*/

  var latlng = new google.maps.LatLng(37.7749, 122.4194);
  var myOptions = {
    zoom: 15,
    center: latlng,
  };
  var map = new google.maps.Map(document.getElementById("map"),
    myOptions);//elementbyid map is null
}

this.graph = function(listing) {

  console.log(listing);

  //AW-lat, AX-long
  var lat = listing[49];
  var long = listing[50];
  var latLng = new google.maps.LatLng(lat, long);

  geocoder.geocode({
    'address': childData.Location
  }, function(results, status) {
    if (status === 'OK') {
      var latlong = results[0].geometry.location;
      var marker = new google.maps.Marker({
        map: map,
        position: latlong
      });
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {

          infowindowContent = '<h4>' + childData.Event + ' with ' + childData.Company + '</h4>' +
            '<p>' + childData.Time + ' at ' + childData.Location + '</p><p><i>' + childData.Tags + '</i></p>';
          infowindow.setContent(infowindowContent);
          infowindow.open(map, this);
        }
      })(marker, i))
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//}
