/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var listingsMap;
  var geocoder;

  //create a default cost map and listings map
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

  //create heatmap layer for cost map
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
      //FIX WEIGHT bruh
      //var weight = new google.maps.visualization.WeightedLocation(new google.maps.LatLng(lat, long), +price);
      var weight = new google.maps.LatLng(lat, long);
      heatmapData.push(weight);
    }
  }

  //add a marker to listing map
  this.addMarker = function(lat, long) {

    //console.log(listing);
    geocoder = new google.maps.Geocoder();

    var contentString = "banana";
    var infowindow = new google.maps.InfoWindow({
      content: contentString//this shit dont work
    });

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: listingsMap,
      title: 'Fruit'
    });
    marker.addListener('click', function() {
      infowindow.open(listingsMap, marker);
    });
  }

}
