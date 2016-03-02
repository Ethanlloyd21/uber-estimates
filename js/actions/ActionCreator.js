var Dispatcher = require('../core/Dispatcher');
var DeepCopy = require("deepcopy");
var LocationAutocompleteFetcher = require('../data/LocationAutocompleteFetcher');
var CoordinateFetcher = require('../data/CoordinateFetcher');
var EstimatesFetcher = require('../data/EstimatesFetcher');

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

  getLocationCoordinates: function(startLocation, endLocation) {
    getStartLocationCoordinates(startLocation);
    getEndLocationCoordinates(endLocation);
  },

  getTimeEstimates: function(latitude, longitude) {
    EstimatesFetcher
      .fetchTimeEstimates(latitude, longitude)
      .then(function (timeEstimates) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_TIME_ESTIMATES,
          timeEstimatesData: DeepCopy(timeEstimates)
        });
    });
  },

  getCostEstimates: function(startLatitude, startLongitude, endLatitude, endLongitude) {
    EstimatesFetcher
      .fetchCostEstimates(startLatitude, startLongitude, endLatitude, endLongitude)
      .then(function (costEstimates) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_COST_ESTIMATES,
          costEstimatesData: DeepCopy(costEstimates)
        });
    });
  }
};

module.exports = ActionCreator;