"use es6";

var Dispatcher = require('../core/Dispatcher');
var ActionConstants = require('../constants/ActionConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _startLocationAutocompleteData = [];
var _endLocationAutocompleteData = [];
var _startLocationCoordinates = [];
var _endLocationCoordinates = [];
var _timeEstimatesData = [];
var _costEstimatesData = [];

/**
 * Set the values for playerSalaries that will be used
 * with components.
 */

 
function setStartLocationAutocompleteData (startLocationAutocompleteData) {
  _startLocationAutocompleteData = startLocationAutocompleteData;
}

function setEndLocationAutocompleteData (endLocationAutocompleteData) {
  _endLocationAutocompleteData = endLocationAutocompleteData;
}

function setStartLocationCoordinates (coordinates) {
  _startLocationCoordinates = coordinates;
}

function setEndLocationCoordinates (coordinates) {
  _endLocationCoordinates = coordinates;
}

function setTimeEstimatesData (timeEstimatesData) {
  _timeEstimatesData = timeEstimatesData;
}

function setCostEstimatesData (costEstimatesData) {
  _costEstimatesData = costEstimatesData;
}

var Store = assign({}, EventEmitter.prototype, {

  /**
   * Emits change event.
   */
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Adds a change listener.
   *
   * @param {function} callback Callback function.
   */
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Removes a change listener.
   *
   * @param {function} callback Callback function.
   */
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * Return the value for playerSalaries.
   */
  getStartLocationAutocompleteData: function () {
    return _startLocationAutocompleteData;
  },

  getEndLocationAutocompleteData: function() {
    return _endLocationAutocompleteData;
  },

  getStartLocationCoordinates: function() {
    return _startLocationCoordinates;
  },

  getEndLocationCoordinates: function() {
    return _endLocationCoordinates;
  },

  getTimeEstimatesData: function() {
    return _timeEstimatesData;
  },

  getCostEstimatesData: function() {
    return _costEstimatesData;
  }

});

Store.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {
    case ActionConstants.GET_START_LOCATION_AUTOCOMPLETE:
      setStartLocationAutocompleteData(action.locationAutocompleteData);
      break;

    case ActionConstants.GET_END_LOCATION_AUTOCOMPLETE:
      setEndLocationAutocompleteData(action.locationAutocompleteData);
      break;

    case ActionConstants.GET_START_LOCATION_COORDINATES:
      setStartLocationCoordinates(action.coordinateData);
      break;

    case ActionConstants.GET_END_LOCATION_COORDINATES:
      setEndLocationCoordinates(action.coordinateData);
      break;

    case ActionConstants.GET_TIME_ESTIMATES:
      setTimeEstimatesData(action.timeEstimatesData);
      break;

    case ActionConstants.GET_COST_ESTIMATES:
      setCostEstimatesData(action.costEstimatesData);
      break;

    default:
      return true;
  }

  Store.emitChange();

  return true;
});

module.exports = Store;