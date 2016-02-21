"use es6";

var React = require('react');

var SuggestionInput = require('./SuggestionInput');
var SuggestionList = require('./SuggestionList');

var Geosuggestion = React.createClass({

  getInitialState() {
      return {
          isHidden: false  
      };
  },

  onFocus: function() {
     this.setState({
      isHidden: false
    });
  },

  onBlur: function() {
    this.setState({
      isHidden: true
    });
  },

  onChange: function(event) {
    this.props.onChange(event, this.props.type);
  },

  onInputKeyDown: function(event) {
    this.props.onInputKeyDown(event, this.props.type);
  },

  render: function() {
    return (
      <div className="geosuggest">
        <SuggestionInput 
          input={this.props.input} 
          placeholder={this.props.placeholder}
          onFocus={this.onFocus} 
          onBlur={this.onBlur}
          onInputKeyDown={this.onInputKeyDown} 
          onChange={this.onChange}/>
        <SuggestionList 
          suggestions={this.props.suggestions} 
          isHidden={this.state.isHidden} 
          activeSuggestionIndex={this.props.activeSuggestionIndex} 
          handleSuggestionOnClick={this.props.handleSuggestionOnClick} />
      </div>
    )
  }
});

module.exports = Geosuggestion;