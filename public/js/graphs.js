/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var listingsMap;
  var geocoder;
  this.initMap = function() {

    costMap = new google.maps.Map(document.getElementById('cost_map'), {
      zoom: 15,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    listingsMap = new google.maps.Map(document.getElementById('listings_map'), {
      zoom: 15,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    console.log("initial maps created");
  }

  this.addHeat = function(lat, long, price, heatmapData, complete) {

    //if dataset is complete
    if (complete) {

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      })

      heatmap.setMap(costMap);
      console.log("heat costs layered");
    }

    //continue adding to dataset
    else {
      //FIX WEIGHT LATER
      //var weight = new google.maps.visualization.WeightedLocation(new google.maps.LatLng(lat, long), +price);
      var weight = new google.maps.LatLng(lat, long);
      heatmapData.push(weight);
    }
  }

  this.addMarker = function(lat, long) {

    //console.log(listing);
    geocoder = new google.maps.Geocoder();

    var contentString = "banana";
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: listingsMap,
      title: 'Fruit'
    });
    marker.addListener('click', function() {
      infowindow.open(listingsMap, marker);
    });


    /*geocoder.geocode({
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
    });*/
  }

}
