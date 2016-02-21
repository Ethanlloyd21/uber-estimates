"use es6";

var React = require('react');

var Suggestion = React.createClass({
  render: function() {

    return (
      <li 
        className={this.props.className}
        onSelect={this.props.handleSuggestionOnClick}>{this.props.value}</li>
    )
  }
});

module.exports = Suggestion;