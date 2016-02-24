"use es6";

var request = require('superagent');
var Promise = require('es6-promise').Promise;

var LocationAutocompleteFetcher = {
  geocodeApi: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  key: "AIzaSyByL2zWHcBI3ew1yrFv9oQKM3sJR773R3s",

  getUrl: function(input) {
    return this.geocodeApi + "?input=" + encodeURIComponent(input) + "&key=" + this.key;
  },

  fetchLocationAutocompleteData: function(input) {
    var url = this.getUrl(input);
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

module.exports = LocationAutocompleteFetcher;