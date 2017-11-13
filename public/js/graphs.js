/* graphs all listings with markers onto google maps */
module.exports = function() {

  var costMap;
  var geocoder;
  var currAxisPopular = 0;
  var currNeighbourhoodInvest = 0;
  var numYears = 40;
  var startingInvestmentCash = 100000000; //100 mil

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
      formatted.push([neighbourhoods[i].substring(0, 3).toUpperCase(), numListings[i], (numBooked[i] / (90 * numListings[i])) * 100,
        neighbourhoods[i], numBooked[i]
      ]);
    for (var i = 0; i < neighbourhoods.length; i++)
      formattedFlipped.push([neighbourhoods[i].substring(0, 3).toUpperCase(), (numBooked[i] / (90 * numListings[i])) * 100, numListings[i],
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
  this.graphInvestment = function(neighbourhoods, prices, availabilityNextNinetyDays, districtListings) {
    google.charts.load('current', {
      'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    var options = {
      title: 'Long Term AirBnB Investment in ' + neighbourhoods[currNeighbourhoodInvest],
      hAxis: {
        title: 'Year',
        titleTextStyle: {
          color: '#333'
        }
      },
      vAxis: {
        title: 'Projected Cumulative Revenue in USD',
        minValue: 0
      },
      is3D: true,
      animation: {
        "startup": true,
        duration: 1000,
        easing: 'out'
      }
    };

    /* get the average cost to buy a listing in every neighbourhood */
    //used TrustedChoice example of a P-to-R ratio of 16.7 (purchasing price to annual rent)

    //initiate variables
    var avgNeighbourhoodPurchasingPrice = [];
    var numListingsPerNeighbourhood = [];
    for (var i = 0; i < neighbourhoods.length; i++) {
      avgNeighbourhoodPurchasingPrice[i] = 0;
      numListingsPerNeighbourhood[i] = 0;
    }

    //1. get total
    for (var i = 0; i < districtListings.length; i++) {
      for (var j = 0; j < neighbourhoods.length; j++) {
        if (districtListings[i] == neighbourhoods[j]) {

          var purchasingPrice = 16.7 * prices[i] * 365;
          avgNeighbourhoodPurchasingPrice[j] += purchasingPrice;

          numListingsPerNeighbourhood[j]++;
          j = neighbourhoods.length;
        }
      }
    }

    //2. calculate average
    for (var i = 0; i < neighbourhoods.length; i++) {
      avgNeighbourhoodPurchasingPrice[i] /= numListingsPerNeighbourhood[i];
    }

    console.log("get investment average cost");

    /* get the average annual profit of a listing in every neighbourhood */

    //initiate variables
    var avgNeighbourhoodAnnualProfitPerListing = new Array(neighbourhoods.length);
    for (var i = 0; i < avgNeighbourhoodAnnualProfitPerListing.length; i++)
      avgNeighbourhoodAnnualProfitPerListing[i] = 0;

    //1. get total profit
    for (var i = 0; i < districtListings.length; i++) {
      for (var j = 0; j < neighbourhoods.length; j++) {
        if (districtListings[i] == neighbourhoods[j]) {

          var avgProfitInADay = prices[i] * (90 - availabilityNextNinetyDays[i]) / 90;
          avgNeighbourhoodAnnualProfitPerListing[j] += avgProfitInADay * 365;

          j = neighbourhoods.length;
        }
      }
    }

    //2. calculate average profit
    for (var i = 0; i < neighbourhoods.length; i++)
      avgNeighbourhoodAnnualProfitPerListing[i] /= numListingsPerNeighbourhood[i];

    console.log("get investment average profit of listings");

    /* get the number of listings you can buy, and hence amount of profit, you could make with 100 million in each neighbourhood per Year */

    var amntOfMoneyLeftPerNeighbourhood = [];
    var amntOfPurchasableListingsPerNeighbourhood = [];
    for (var i = 0; i < neighbourhoods.length; i++) {
      amntOfMoneyLeftPerNeighbourhood.push(startingInvestmentCash); //100 mil baby
      amntOfPurchasableListingsPerNeighbourhood.push(0);
    }

    for (var i = 0; i < neighbourhoods.length; i++) {
      while (amntOfMoneyLeftPerNeighbourhood[i] - avgNeighbourhoodPurchasingPrice[i] > 0) {
        amntOfMoneyLeftPerNeighbourhood[i] -= avgNeighbourhoodPurchasingPrice[i];
        amntOfPurchasableListingsPerNeighbourhood[i] += 1;
      }
    }

    console.log("get investment average profit of investment");

    /* calculate it over the next 40 years until profit is made, with minor changes in profit every year */

    //initial cost and revenue matrix
    var revenuePerNeighbourhoodPerYear = new Array(neighbourhoods.length);
    var expensesPerNeighbourhoodPerYear = new Array(neighbourhoods.length);
    for (var i = 0; i < neighbourhoods.length; i++) {
      revenuePerNeighbourhoodPerYear[i] = new Array(numYears);
      expensesPerNeighbourhoodPerYear[i] = new Array(numYears);

      for (var j = 0; j < revenuePerNeighbourhoodPerYear[i].length; j++) {
        revenuePerNeighbourhoodPerYear[i][j] = 0;
        expensesPerNeighbourhoodPerYear[i][j] = 0;
      }
    }

    for (var i = 0; i < neighbourhoods.length; i++) {
      revenuePerNeighbourhoodPerYear[i][0] = amntOfPurchasableListingsPerNeighbourhood[i] * avgNeighbourhoodAnnualProfitPerListing[i];
      expensesPerNeighbourhoodPerYear[i][0] = startingInvestmentCash - amntOfMoneyLeftPerNeighbourhood[i];
    }

    for (var i = 0; i < neighbourhoods.length; i++) {

      for (var j = 1; j < revenuePerNeighbourhoodPerYear[i].length; j++) { //todo: add taxes

        //multiply by a random deviant of a small percent (+-5%), for randomness' sake
        var deviant = Math.floor(Math.random() * 5) / 100;
        var gainOrLoss = Math.floor(Math.random() * 2);
        if (gainOrLoss != 1)
          gainOrLoss = -1;
        deviant = 1 + deviant * gainOrLoss;

        //use first year's earnings as standard/average
        revenuePerNeighbourhoodPerYear[i][j] = revenuePerNeighbourhoodPerYear[i][0] * deviant + revenuePerNeighbourhoodPerYear[i][j - 1];

        //only calculate until you have broken even
        if (revenuePerNeighbourhoodPerYear[i][j] >= expensesPerNeighbourhoodPerYear[i][0])
          revenuePerNeighbourhoodPerYear[i] = revenuePerNeighbourhoodPerYear[i].slice(0, j + 1);
      }

      for (var j = 1; j < expensesPerNeighbourhoodPerYear[i].length; j++) {

        //multiply by a random deviant of a small percent (+-5%), for randomness' sake
        var deviant = Math.floor(Math.random() * 5) / 100;
        var gainOrLoss = Math.floor(Math.random() * 2);
        if (gainOrLoss != 1)
          gainOrLoss = -1;
        deviant = 1 + deviant * gainOrLoss;

        //approx $120 in cleaning cost per booking; https://www.homeadvisor.com/cost/cleaning-services/, and about a week average stay per booking
        var numBookings = (90 - availabilityNextNinetyDays[j]) / 90 * 365 / 7;
        expensesPerNeighbourhoodPerYear[i][j] = amntOfPurchasableListingsPerNeighbourhood[i] * 120 * numBookings * deviant;

        //only calculate until you have broken even
        if (j + 1 >= revenuePerNeighbourhoodPerYear[i].length)
          expensesPerNeighbourhoodPerYear[i] = expensesPerNeighbourhoodPerYear[i].slice(0, j + 1);
      }
    }

    console.log("finish storing investment data");

    var completeData = [];
    var formatted = [];
    for (var i = 0; i < neighbourhoods.length; i++) {
      formatted = [];
      formatted.push(['Year', 'Revenue', 'Expenses']);

      for (var j = 0; j < revenuePerNeighbourhoodPerYear[i].length; j++) {
        var currYear = 2017 + j;
        formatted.push([currYear + '', revenuePerNeighbourhoodPerYear[i][j], expensesPerNeighbourhoodPerYear[i][j]]);
      }
      completeData.push(formatted);
    }

    function drawChart() {

      var button = document.getElementById('nextDistrict');
      var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
      var data = google.visualization.arrayToDataTable(completeData[currNeighbourhoodInvest]);

      button.disabled = true;
      google.visualization.events.addListener(chart, 'ready',
        function() {
          button.disabled = false;
        });

      button.onclick = function() {
        currNeighbourhoodInvest = (currNeighbourhoodInvest + 1) % neighbourhoods.length;
        data = google.visualization.arrayToDataTable(completeData[currNeighbourhoodInvest]);
        options['title'] = 'Long Term AirBnB Investment in ' + neighbourhoods[currNeighbourhoodInvest] + '';
        drawChart();
      }
      chart.draw(data, options);
    }
  }
}
