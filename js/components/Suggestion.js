"use es6";

var React = require('react');

var Suggestion = React.createClass({
  render: function() {

    return (
      <li>{this.props.value}</li>
    )
  }
});

module.exports = Suggestion;