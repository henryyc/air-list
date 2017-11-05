/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var listingsMap;
  var geocoder;

  //create a default cost map and listings map
  this.initMap = function() {

    costMap = new google.maps.Map(document.getElementById('cost_map'), {
      zoom: 14,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    listingsMap = new google.maps.Map(document.getElementById('listings_map'), {
      zoom: 15,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    console.log("initial maps created");
  }

  //create interactive graph
  this.graphPrices = function(horiAxis, priceData, priceFreq) {

    var freq = new Array(horiAxis.length);
    for (var i = 0; i < freq.length; i++){
       freq[i] = priceData[i]/priceFreq[i];
       console.log(freq[i]);
    }

    //insert d3 graph

    console.log("cost graph created");
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
      document.getElementById('loadPercent').innerHTML = 'Almost done...';
      //document.getElementById('loadPercent').innerHTML = 'Press &#39Learn more&#39 to get started.';
    }

    //continue adding to dataset
    else {
      var weight = {
        location: new google.maps.LatLng(lat, long),
        weight: parseFloat(price)
      };
      heatmapData.push(weight);
    }
  }

  //add a marker to listing map
  this.addMarker = function(data) {

    var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading" style="color:black">' + data["name"] + '</h1>' +
      '<div id="bodyContent">' +

      '<p style="color:black">' + data["summary"]

      '<br />More info: ' + data["listing_url"] + '</p>' +

      '</div>' +
      '</div>';


    var infowindow = new google.maps.InfoWindow({
      content: '<p style="color:black;">' + contentString + '</p>'
    });

    var markerImage = "https://raw.githubusercontent.com/henryyc/air-list/master/images/green_dot.png";

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data["latitude"], data["longitude"]),
      map: listingsMap,
      title: data["name"],
      icon: markerImage//green for available, red for unavaiable, yellow for available soon
    });

    marker.addListener('click', function() {
      infowindow.open(listingsMap, marker);
    });
  }
}
