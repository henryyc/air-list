var otherLats = [];
var otherLongs = [];
var otherPrices = [];
var otherAvailability = [];

var R = 6371; //radius of earth in km

module.exports = function() {

  this.initCalculate = function(lats, longs, prices, availability) {
    otherLats = lats;
    otherLongs = longs;
    otherPrices = prices;
    otherAvailability = availability;
    initData(lats, longs, prices, availability);
  }
}
