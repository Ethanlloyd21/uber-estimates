"use es6";

var request = require('superagent');
var Promise = require('es6-promise').Promise;

var IpAddressFetcher = {
  url: "https://api.ipify.org?format=json",

  fetchIpAddress: function() {
    return new Promise(function (resolve, reject) {
      request
        .get(this.url)
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

module.exports = IpAddressFetcher;