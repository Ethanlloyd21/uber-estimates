"use es6";

var React = require('react');

var JourneyProperty = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.propertyTitle}: {this.props.propertyValue}
      </div>
    );
  }
});

module.exports = JourneyProperty;