"use es6";

var React = require('react');

var Geosuggestion = require('./Geosuggestion');
var AddressTypeConstants = require('../constants/AddressTypeConstants');

var JourneyLocationInput = React.createClass({

  render: function() {
    return (
      <div>
        <Geosuggestion 
          input={this.props.startAddress} 
          placeholder={"Start Address"}
          type={AddressTypeConstants.START}
          onFocus={this.props.handleStartAddressSuggestionsOnFocus}
          onBlur={this.props.handleStartAddressSuggestionsOnBlur}
          onInputKeyDown={this.props.onInputKeyDown} 
          onChange={this.props.handleStartLocationSuggestionOnChange}
          suggestions={this.props.startAddressLocationAutocompleteData} 
          isHidden={this.props.isStartAddressSuggestionsHidden}
          activeSuggestionIndex={this.props.activeStartAddressSuggestionIndex} 
          handleLocationSuggestionMouseDown={this.props.handleStartLocationSuggestionMouseDown} />
        <Geosuggestion 
          input={this.props.endAddress} 
          placeholder={"End Address"}
          type={AddressTypeConstants.END}
          onFocus={this.props.handleEndAddressSuggestionsOnFocus}
          onBlur={this.props.handleEndAddressSuggestionsOnBlur}
          onInputKeyDown={this.props.onInputKeyDown} 
          onChange={this.props.handleEndLocationSuggestionOnChange}
          suggestions={this.props.endAddressLocationAutocompleteData} 
          isHidden={this.props.isEndAddressSuggestionsHidden}
          activeSuggestionIndex={this.props.activeEndAddressSuggestionIndex} 
          handleLocationSuggestionMouseDown={this.props.handleEndLocationSuggestionMouseDown} />
      </div>
    );
  }
});

module.exports = JourneyLocationInput;