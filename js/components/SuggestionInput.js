"use es6";

var React = require('react');

var SuggestionInput = React.createClass({
  render: function() {

    return (
      <input>
        {this.props.input}
      </input>
    )
  }
});

module.exports = SuggestionInput;