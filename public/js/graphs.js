var client = new XMLHttpRequest();
client.open('GET', 'https://crossorigin.me/https://github.com/henryyc/air-list/tree/master/data/reviews.csv');
var reviews;
client.onreadystatechange = function() {
  reviews = client.responseText;
}
client.send();
alert(reviews.length);
