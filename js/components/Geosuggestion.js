"use es6";

var React = require('react');

var SuggestionInput = require('./SuggestionInput');
var SuggestionList = require('./SuggestionList');

var Geosuggestion = React.createClass({

  onChange: function(event) {
    this.props.onChange(event, this.props.type);
  },

  onInputKeyDown: function(event) {
    this.props.onInputKeyDown(event, this.props.type);
  },

  handleSuggestionOnClick: function(event) {
    this.props.handleSuggestionOnClick(event, this.props.type);
  },

  render: function() {
    return (
      <div 
        className="geosuggest" >
        <SuggestionInput 
          input={this.props.input} 
          placeholder={this.props.placeholder}
          onInputKeyDown={this.onInputKeyDown} 
          onBlur={this.props.onBlur} 
          onFocus={this.props.onFocus}
          onChange={this.onChange} />
        <SuggestionList 
          suggestions={this.props.suggestions} 
          isHidden={this.props.isHidden} 
          activeSuggestionIndex={this.props.activeSuggestionIndex} 
          handleLocationSuggestionMouseDown={this.props.handleLocationSuggestionMouseDown} />
      </div>
    )
  }
});

module.exports = Geosuggestion;