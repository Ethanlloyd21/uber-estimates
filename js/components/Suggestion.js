"use es6";

var React = require('react');

var Suggestion = React.createClass({
  render: function() {

    return (
      <li 
        className={this.props.className}
        onMouseDown={this.props.handleLocationSuggestionMouseDown}>{this.props.value}
      </li>
    )
  }
});

module.exports = Suggestion;