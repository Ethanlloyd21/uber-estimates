var Dispatcher = require('../core/Dispatcher');
var DeepCopy = require("deepcopy");
var LocationAutocompleteFetcher = require('../data/LocationAutocompleteFetcher');
var CoordinateFetcher = require('../data/CoordinateFetcher');
var IpAddressFetcher = require('../data/IpAddressFetcher');

var ActionConstants = require('../constants/ActionConstants');

var ActionCreator = {
  getStartLocationAutocompleteData: function (startLocation) {
    LocationAutocompleteFetcher
      .fetchLocationAutocompleteData(startLocation)
      .then(function (locationAutocompleteData) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_START_LOCATION_AUTOCOMPLETE,
          locationAutocompleteData: DeepCopy(locationAutocompleteData.predictions)
        });
      });
  },
  getEndLocationAutocompleteData: function (endLocation) {
    LocationAutocompleteFetcher
      .fetchLocationAutocompleteData(endLocation)
      .then(function (locationAutocompleteData) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_END_LOCATION_AUTOCOMPLETE,
          locationAutocompleteData: DeepCopy(locationAutocompleteData.predictions)
        });
      });
  },

  getStartLocationCoordinates: function(startLocation) {
    CoordinateFetcher
      .fetchCoordinates(startLocation)
      .then(function (coordinates) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_START_LOCATION_COORDINATES,
          coordinateData: DeepCopy(coordinates)
        });
    });
  },

  getEndLocationCoordinates: function(endLocation) {
    CoordinateFetcher
      .fetchCoordinates(endLocation)
      .then(function (coordinates) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_END_LOCATION_COORDINATES,
          coordinateData: DeepCopy(coordinates)
        });
    });
  },

  getIpAddress: function() {
    IpAddressFetcher
      .fetchIpAddress()
      .then(function (ipAddressData) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_IP_ADDRESS,
          ipAddressData: DeepCopy(ipAddressData)
        });
    });
  }
};

module.exports = ActionCreator;