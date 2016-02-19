"use es6";

var request = require('superagent');
var Promise = require('es6-promise').Promise;

var EstimatesFetcher = {
  timeEstimateApi: "https://api.uber.com/v1/estimates/time",
  costEstimateApi: "https://api.uber.com/v1/estimates/price",
  serverToken: "We0MNCaIpx00F_TUopt4jgL9BzW3bWWt16aYM4mh",

  getTimeEstimatesUrl: function(startLatitude, startLongitude) {
    return this.timeEstimateApi + "?start_latitude=" + startLatitude + "&start_longitude=" + startLongitude + "&server_token=" + this.serverToken;
  },

  getCostEstimatesUrl: function(startLatitude, startLongitude, endLatitude, endLongitude) {
    return this.costEstimateApi + "?start_latitude=" + startLatitude + "&start_longitude=" + startLongitude + "&end_latitude=" + endLatitude + "&end_longitude=" + endLongitude + "&server_token=" + this.serverToken;
  },

  fetchTimeEstimates: function(startLatitude, startLongitude) {
    var url = this.getTimeEstimatesUrl(startLatitude, startLongitude);
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

  fetchCostEstimates: function(startLatitude, startLongitude, endLatitude, endLongitude) {
    var url = this.getCostEstimatesUrl(startLatitude, startLongitude, endLatitude, endLongitude);
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
  }
};

module.exports = EstimatesFetcher;