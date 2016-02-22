"use es6";

var ReactDOM = require('react-dom');
var React = require('react');

var EstimatesTable = require('./components/EstimatesTable');

var CoordinateFetcher = require('./data/CoordinateFetcher');
var EstimatesFetcher = require('./data/EstimatesFetcher');

var App = React.createClass({

  getInitialState() {
      return {
          startAddress: null,
          endAddress: null,
          startLatitude: null,
          startLongitude: null,
          endLatitude: null,
          endLongitude: null,
          formattedStartAddress: null,
          formattedEndAddress: null,
          timeEstimates: [],
          costEstimates: [],
          combinedData: [],
          duration: null,
          distance: null
      };
  },

  fetchData: function() {
    // Uber Hacky data fetching

    if (this.state.startAddress != null && this.state.endAddress != null) {
      CoordinateFetcher
        .fetchCoordinates(this.state.startAddress)
        .then(function (coordinates) {
          this.state.formattedStartAddress = coordinates.results[0].formatted_address;
          this.state.startLatitude = coordinates.results[0].geometry.location.lat;
          this.state.startLongitude = coordinates.results[0].geometry.location.lng;
          CoordinateFetcher
            .fetchCoordinates(this.state.endAddress)
            .then(function (coordinates) {
              this.state.formattedEndAddress = coordinates.results[0].formatted_address;
              this.state.endLatitude = coordinates.results[0].geometry.location.lat;
              this.state.endLongitude = coordinates.results[0].geometry.location.lng;
              EstimatesFetcher
                .fetchTimeEstimates(this.state.startLatitude, this.state.startLongitude)
                .then(function (timeEstimates) {
                  this.state.timeEstimates = timeEstimates.times;
                  EstimatesFetcher
                    .fetchCostEstimates(this.state.startLatitude, this.state.startLongitude, this.state.endLatitude, this.state.endLongitude)
                    .then (function (costEstimates) {
                      this.state.costEstimates = costEstimates.prices;
                      var combinedData = [];
                      for (var i = 0; i < this.state.costEstimates.length; i++) {
                        var costEstimate = this.state.costEstimates[i];
                        var displayName = costEstimate.display_name;
                        this.state.distance = costEstimate.distance;
                        this.state.duration = costEstimate.duration;
                        var highEstimate = costEstimate.high_estimate;
                        var lowEstimate = costEstimate.low_estimate;
                        var minimum = costEstimate.minimum;
                        for (var j = 0; j < this.state.timeEstimates.length; j++) {
                          var timeEstimate = this.state.timeEstimates[j];
                          if (displayName != "uberTAXI" && timeEstimate.display_name == displayName) {
                            var wait = timeEstimate.estimate;
                            var roundedWait = Math.round(wait / 60);
                            var roundedWaitStr = roundedWait + " min";
                            combinedData[i] = {
                              Option: displayName,
                              High: "$" + highEstimate,
                              Low: "$" + lowEstimate,
                              Minimum: "$" + minimum,
                              Wait: roundedWaitStr
                            };
                          }
                        }
                      }
                      this.setState({
                        combinedData: combinedData
                      });
                    }.bind(this))
                }.bind(this))
            }.bind(this))
        }.bind(this))
    }
  },

  handleStartChange: function(e) {
    this.state.startAddress = e.target.value;
  },

  handleEndChange: function(e) {
    this.state.endAddress = e.target.value;
  },

  handleButtonClick: function() {
    this.fetchData();
  },

  render: function() {
    if (this.state.formattedStartAddress == null) {
      var startAddressMessage = null;
    } else {
      var startAddressMessage = <div className="formatted-address">Formatted Start Address: {this.state.formattedStartAddress}</div>;
    }

    if (this.state.formattedEndAddress == null) {
      var endAddressMessage = null;
    } else {
      var endAddressMessage = <div className="formatted-address">Formatted End Address: {this.state.formattedEndAddress}</div>;
    }

    return (
      <div>
        <input className="address-input" type="text" placeholder="Start Address" onChange={this.handleStartChange} />
        <input className="address-input" type="text" placeholder="End Address" onChange={this.handleEndChange} />
        <button className="get-estimate-button" onClick={this.handleButtonClick}>Get Estimates</button>
        <EstimatesTable className="estimates-table" estimates={this.state.combinedData} />
        {startAddressMessage}
        {endAddressMessage}
      </div>
    )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('uber-estimates')
);