"use es6";

var React = require('react');

var JourneyProperty = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.title}: {this.props.value}
      </div>
    );
  }
});

module.exports = JourneyProperty;