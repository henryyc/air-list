/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var listingsMap;
  var geocoder;
  var currAxis = 0;

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
  this.graphPopularity = function(neighbourhoods, numListings, numBooked) {

    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawSeriesChart);

    var completeData = [];
    var formatted = [];
    var formattedFlipped = [];
    formatted.push(['ID', 'Listings', '% Booked', 'District', 'Number of Booked Listings']);
    formattedFlipped.push(['ID', '% Booked', 'Listings', 'District', 'Number of Booked Listings']);

    for (var i = 0; i < neighbourhoods.length; i++)
      formatted.push([neighbourhoods[i].substring(0, 3).toUpperCase(), numListings[i], (numBooked[i] / (90 * numListings[i])),
        neighbourhoods[i], numBooked[i]
      ]);
    for (var i = 0; i < neighbourhoods.length; i++)
      formattedFlipped.push([neighbourhoods[i].substring(0, 3).toUpperCase(), (numBooked[i] / (90 * numListings[i])), numListings[i],
        neighbourhoods[i], numBooked[i]
      ]);

    completeData.push(formatted);
    completeData.push(formattedFlipped);

    var allOptions = [];
    var options = {
      title: 'Correlation between number of listings in a district, percent of booked listings ' +
        'and number of booked listings (2017)',
      titleTextStyle: {
        color: 'white',
        fontName: 'sans-serif'
      },
      hAxis: {
        title: 'Total Amount of Listings',
        textStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        titleTextStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        gridlines: {
          color: 'white',
          fontName: 'sans-serif'
        },
        baselineColor: 'white'
      },
      vAxis: {
        title: 'Percent of Booked Listings',
        textStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        titleTextStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        gridlines: {
          color: 'white',
          fontName: 'sans-serif'
        },
        baselineColor: 'white'
      },
      bubble: {
        textStyle: {
          color: 'white',
          fontSize: 18
        },
        titleTextStyle: {
          color: 'white',
          fontName: 'sans-serif'
        }
      },
      legend: {
        textStyle: {
          color: 'white',
          fontName: 'sans-serif'
        }
      },
      backgroundColor: '#b74e91',
      is3D: true,
      animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
      }
    };
    var optionsFlipped = {
      title: 'Correlation between number of listings in a district, percent of booked listings ' +
        'and number of booked listings (2017)',
      titleTextStyle: {
        color: 'white',
        fontName: 'sans-serif'
      },
      vAxis: {
        title: 'Total Amount of Listings',
        textStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        titleTextStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        gridlines: {
          color: 'white',
          fontName: 'sans-serif'
        },
        baselineColor: 'white'
      },
      hAxis: {
        title: 'Percent of Booked Listings',
        textStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        titleTextStyle: {
          color: 'white',
          fontName: 'sans-serif'
        },
        gridlines: {
          color: 'white',
          fontName: 'sans-serif'
        },
        baselineColor: 'white'
      },
      bubble: {
        textStyle: {
          color: 'white',
          fontSize: 18
        },
        titleTextStyle: {
          color: 'white',
          fontName: 'sans-serif'
        }
      },
      legend: {
        textStyle: {
          color: 'white',
          fontName: 'sans-serif'
        }
      },
      backgroundColor: '#b74e91',
      is3D: true,
      animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
      }
    };
    allOptions.push(options);
    allOptions.push(optionsFlipped);

    function drawSeriesChart() {

      var button = document.getElementById('b1');
      var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
      var data = google.visualization.arrayToDataTable(completeData[currAxis]);

      button.disabled = true;
      google.visualization.events.addListener(chart, 'ready',
        function() {
          button.disabled = false;
        });

      button.onclick = function() {
        currAxis = 1 - currAxis; //flip from 0 to 1 and vice versa
        drawSeriesChart();
      }

      chart.draw(data, allOptions[currAxis]);
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
