"use es6";

var React = require('react');

var Suggestion = require('./Suggestion');

var SuggestionList = React.createClass({
  generateSuggestions: function() {
    var suggestions = [];
    var counter = 0;
    this.props.suggestions.forEach(function (suggestion) {
      if (counter == this.props.activeSuggestionIndex) {
        var className = "geosuggest-item--active";
      } else {
        var className = "geosuggest-item";
      }
      suggestions.push(<Suggestion className={className} value={suggestion.description}/>);
      counter++;
    }.bind(this));
    return suggestions;
  },

  render: function() {

    if (this.props.isHidden) {
      var className="geosuggest__suggests--hidden";
    } else {
      var className="geosuggest__suggests";
    }

    return (
      <ul className={className}>
        {this.generateSuggestions()}
      </ul>
    )
  }
});

module.exports = SuggestionList;