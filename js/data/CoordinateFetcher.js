"use es6";

var request = require('superagent');
var Promise = require('es6-promise').Promise;

var CoordinateFetcher = {
  geocodeApi: "https://maps.googleapis.com/maps/api/geocode/json",
  key: "AIzaSyCqY_GY36jbVcoCF8m-SNNqgLjKizIf7rQ",

  getUrl: function(address) {
    return this.geocodeApi + "?" + "address=" + encodeURIComponent(address) + "&key=" + this.key;
  },

  fetchCoordinates: function(address) {
    var url = this.getUrl(address);
    return new Promise(function (resolve, reject) {
      request
        .get(url)
        .end(function (err, res) {
          if (res.status === 404) {
            reject();
          } else {
            resolve(res.body);
          }
      });
    });
  },
};

module.exports = CoordinateFetcher;