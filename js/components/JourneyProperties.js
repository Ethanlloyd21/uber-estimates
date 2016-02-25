"use es6";

var React = require('react');
var JourneyProperty = require('./JourneyProperty');

var JourneyProperties = React.createClass({
  createProperty: function(title, value) {
    return (<JourneyProperty title={title} value={value} />);
  },

  createProperties: function(titleValueMap) {
    var properties = [];
    for (var key in titleValueMap) {
      if (titleValueMap.hasOwnPropertyKey) {
        properties.push(this.createProperty(key, titleValueMap[key]));
      }
    }
    return properties;
  },

  render: function() {
    return (
      <div>
        {this.createProperties(this.props.titleValueMap)}
      </div>
    );
  }
});

module.exports = JourneyProperties;