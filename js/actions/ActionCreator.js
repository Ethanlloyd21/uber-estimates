var Dispatcher = require('../core/Dispatcher');
var DeepCopy = require("deepcopy");
var LocationAutocompleteFetcher = require('../data/LocationAutocompleteFetcher');

var ActionConstants = require('../constants/ActionConstants');

var ActionCreator = {
  getLocationAutocompleteData: function (input) {
    LocationAutocompleteFetcher
      .fetchLocationAutocompleteData(input)
      .then(function (locationAutocompleteData) {
        Dispatcher.handleViewAction({
          actionType: ActionConstants.GET_LOCATION_AUTOCOMPLETE,
          locationAutocompleteData: DeepCopy(locationAutocompleteData.predictions)
        });
      });
  }
};

module.exports = ActionCreator;