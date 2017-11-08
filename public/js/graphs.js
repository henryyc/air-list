/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var geocoder;
  var currAxisPopular = 0;
  var currAxisInvest = 0;
  var buttonsCreated = false;

  //create a default cost map and listings map
  this.initMap = function() {

    costMap = new google.maps.Map(document.getElementById('cost_map'), {
      zoom: 12,
      center: new google.maps.LatLng(37.7749, -122.4194),
    });

    console.log("cost map created");
    document.getElementById('loadPercent').innerHTML = 'Almost done...';
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
      hAxis: {
        title: 'Total Amount of Listings'
      },
      vAxis: {
        title: 'Percent of Booked Listings'
      },
      bubble: {
        textStyle: {
          fontSize: 18
        }
      },
      is3D: true,
      animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
      }
    };
    var optionsFlipped = options;
    optionsFlipped['hAxis'] = options['vAxis'];
    optionsFlipped['vAxis'] = options['hAxis'];
    allOptions.push(options);
    allOptions.push(optionsFlipped);

    function drawSeriesChart() {

      var button = document.getElementById('b1');
      var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
      var data = google.visualization.arrayToDataTable(completeData[currAxisPopular]);

      button.disabled = true;
      google.visualization.events.addListener(chart, 'ready',
        function() {
          button.disabled = false;
        });

      button.onclick = function() {
        currAxisPopular = 1 - currAxisPopular; //flip from 0 to 1 and vice versa
        drawSeriesChart();
      }

      chart.draw(data, allOptions[currAxisPopular]);
    }

    console.log("popularity graph created");
  }

  //create investment graph
  this.graphInvestment = function(neighbourhoods, lats, longs, prices, availability, districtListings) {
    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    var allOptions = [];
    var allButtons = [];

    var options = {
      title: 'Long Term AirBnB Investment in ',
      hAxis: {
        title: 'Year',
        titleTextStyle: {
          color: '#333'
        }
      },
      vAxis: {
        title: 'Projected Earnings',
        minValue: 0
      },
      is3D: true,
      animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
      }
    };
    for (var i = 0; i < neighbourhoods.length; i++) {
      options['title'] = 'Long Term AirBnB Investment in ' + neighbourhoods[i];
      allOptions.push(options);
    }

    var completeData = [];
    //used TrustedChoice example of a P-to-R ratio of 16.7 (purchasing price to annual rent)
    for (var j = 0; j < lats.length; j++) {

      //help
      if (districtListings[i] == neighbourhoods[i]) {

      }
    }

    function drawChart() {

      //make buttons for every district
      if (!buttonsCreated) {

        //button 'i' relates to neighbourhood 'i', who's data is stored in completeData's 'i'
        for (var i = 0; i < neighbourhoods.length; i++) {
          var btn = document.createElement('button');
          btn.className = 'button small';
          var label = document.createTextNode(neighbourhoods[i].substring(0, 8)); //lucky 8
          btn.appendChild(label);
          document.getElementById('buttons').appendChild(btn);

          allButtons.push(btn);
        }

        buttonsCreated = true;
      }

      var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
      /*var data = google.visualization.arrayToDataTable(completeData[currAxisInvest]);

      for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].onclick = function() {
          drawSeriesChart();
        }
      }

      chart.draw(data, allOptions[currAxisInvest]);*/

      var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2013', 1000, 400],
        ['2014', 1170, 460],
        ['2015', 660, 1120],
        ['2016', 1030, 540]
      ]);

      chart.draw(data, options);
    }
  }
}
