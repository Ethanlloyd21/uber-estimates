"use es6";

var React = require('react');

var JourneyProperty = React.createClass({
  render: function() {
    return (
      <div className="journey-property">
        <span className="journey-property-title">{this.props.title + ":"}</span> {this.props.value}
      </div>
    );
  }
});

module.exports = JourneyProperty;