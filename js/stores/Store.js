"use es6";

var Dispatcher = require('../core/Dispatcher');
var ActionConstants = require('../constants/ActionConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _locationAutocompleteData = [];

/**
 * Set the values for playerSalaries that will be used
 * with components.
 */

 
function setLocationAutocompleteData (locationAutocompleteData) {
  _locationAutocompleteData = locationAutocompleteData;
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
  getLocationAutocompleteData: function () {
    return _locationAutocompleteData;
  }
});

Store.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {
    case ActionConstants.GET_LOCATION_AUTOCOMPLETE:
      setLocationAutocompleteData(action.locationAutocompleteData);
      break;

    default:
      return true;
  }

  Store.emitChange();

  return true;
});

module.exports = Store;