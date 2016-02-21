"use es6";

var React = require('react');

var Suggestion = require('./Suggestion');

var SuggestionList = React.createClass({
  generateSuggestions: function() {
    var suggestions = [];
    this.props.suggestions.forEach(function (suggestion) {
      suggestions.push(<Suggestion value={suggestion.description}/>);
    })
    return suggestions;
  },

  render: function() {

    return (
      <ul>
        {this.generateSuggestions()}
      </ul>
    )
  }
});

module.exports = SuggestionList;