/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var listingsMap;
  var geocoder;

  //create a default cost map and listings map
  this.initMap = function() {

    costMap = new google.maps.Map(document.getElementById('cost_map'), {
      zoom: 12,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    listingsMap = new google.maps.Map(document.getElementById('listings_map'), {
      zoom: 15,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    console.log("cost map created");
    document.getElementById('loadPercent').innerHTML = 'Almost done...';
  }

  //create interactive graph
  this.graphPopularity = function(neighbourhoods, numListings, percentBooked) {

    google.charts.load('current', {
      'packages': ['bar']
    });
    google.charts.setOnLoadCallback(drawChart);

    var formatted = [];
    formatted.push(['Neighbourhood', 'Total Number of Listings', 'Percent of Listings Booked']);

    for(var i = 0; i < neighbourhoods.length; i++)
      formatted.push([neighbourhoods[i], numListings[i], percentBooked[i]]);

    function drawChart() {

      /*var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350]
      ]);*/

      console.log(formatted);
      var data = google.visualization.arrayToDataTable(formatted);

      var options = {
        chart: {
          title: 'District Popularity',
          subtitle: 'Data Taken in September',
        },
        bars: 'horizontal' // Required for Material Bar Charts.
      };

      var chart = new google.charts.Bar(document.getElementById('barchart_material'));

      chart.draw(data, google.charts.Bar.convertOptions(options));
    }

    console.log("popularity graph created");
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
      document.getElementById('loadPercent').innerHTML = 'Press &#39Learn more&#39 to get started.';
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
  this.addMarker = function(lat, long, name, url) {
    var contentString = '<div id="content">' +
      '<p style="color:black"><b>' + name + '</b><br />' +
      '<p style="color:black"><i>More info: ' + url + '</i></p>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: '<p style="color:black;">' + contentString + '</p>'
    });

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: listingsMap,
      title: name
    });

    marker.addListener('click', function() {
      infowindow.open(listingsMap, marker);
    });
  }
}
