"use es6";

var React = require('react');

var EstimatesTable = require('./EstimatesTable');
var JourneyProperties = require('./JourneyProperties');

var JourneyDetails = React.createClass({
  render: function() {
    return (
      <div>
        <EstimatesTable />
        <JourneyProperties titleValueMap={this.props.titleValueMap} />
      </div>
    );
  }
});

module.exports = JourneyDetails;