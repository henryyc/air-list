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
       freq[i] = priceData[i] ;/// priceFreq[i];

      //if(priceFreq[i] == 0)
        //console.log("lmao oops");
      //freq[i] = 4;
    }

    /* from my old code: https://github.com/usnistgov/PasswordVizTool/blob/master/Histogram/histogram.html */
    var margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
    var y = d3.scale.linear()
      .range([height, 0]);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        /* CUST9: Change tooltip content & color (for color: span style='color:yourcolor'>)*/
        return d.letter + "  <strong>Frequency:<\/strong> <span style='color:red'>" + d.frequency + "<\/span>";
      })
    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.call(tip);

    // The new data variable.
    var data = [];
    for (var i = 0; i < horiAxis.length; i++)
      data.push({
        letter: horiAxis[i],
        frequency: freq[i],
        order: i
      });

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }
    x.domain(data.map(function(d) {
      return d.letter;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.frequency;
    })]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return x(d.letter);
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(d.frequency);
      })
      .attr("height", function(d) {
        return height - y(d.frequency);
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    d3.selectAll("sortIt").on("change", change);
    var sortTimeout = setTimeout(function() {
      d3.selectAll("sortIt").property("checked", true).each(change);
    }, 2000);
    //sort
    function change() {
      clearTimeout(sortTimeout);
      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(data.sort(this.checked
            /* CUST10: Change graph sort */
            /* Use this: ? function(a, b) { return a.frequency - b.frequency; } to sort ascending */
            ?
            function(a, b) {
              return b.frequency - a.frequency;
            }
            /* Use this: : function(a, b) { return d3.ascending(b.order, a.order); }) to sort from space to A*/
            :
            function(a, b) {
              return d3.ascending(a.order, b.order);
            })

          .map(function(d) {
            return d.letter;
          }))
        .copy();
      svg.selectAll(".bar")
        /* Use this: .sort(function(a, b) { return x0(b.letter) - x0(a.letter); }); to sort smaller values first*/
        .sort(function(a, b) {
          return x0(a.letter) - x0(b.letter);
        });
      var transition = svg.transition().duration(750),
        delay = function(d, i) {
          return i * 50;
        };
      transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) {
          return x0(d.letter);
        });
      transition.select(".x.axis")
        .call(xAxis)
        .selectAll("g")
        .delay(delay);
    }

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
      document.getElementById('loadPercent').innerHTML = 'Press &#39Learn more&#39 to get started.';
    }

    //continue adding to dataset
    else {
      var weight = {
        location: new google.maps.LatLng(lat, long),
        weight: parseFloat(price)
      }; //check up later
      heatmapData.push(weight);
    }
  }

  //add a marker to listing map
  this.addMarker = function(data) {

    var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading" style="color:black">Uluru</h1>' +
      '<div id="bodyContent">' +

      '<p style="color:black"> <b style="color:black">Uluru</b>, also referred to as <b style="color:black">Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the ' +
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
      'south west of the nearest large town, Alice Springs; 450&#160;km ' +
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
      'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
      'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
      'Aboriginal people of the area. It has many springs, waterholes, ' +
      'rock caves and ancient paintings. Uluru is listed as a World ' +
      'Heritage Site.' +

      '<br />More info: ' + data["host_url"] + '</p>' +

      '</div>' +
      '</div>';


    var infowindow = new google.maps.InfoWindow({
      content: '<p style="color:black;">' + contentString + '</p>'
    });

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data["latitude"], data["longitude"]),
      map: listingsMap,
      title: data["host_name"]
    });

    marker.addListener('click', function() {
      infowindow.open(listingsMap, marker);
    });
  }
}
