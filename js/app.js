"use es6";

var ReactDOM = require('react-dom');
var React = require('react');
var Loading = require('react-loading');

var Store = require('./stores/Store');
var ActionCreator = require('./actions/ActionCreator');

var EstimatesTable = require('./components/EstimatesTable');
var Geosuggestion = require('./components/Geosuggestion');

var CoordinateFetcher = require('./data/CoordinateFetcher');
var EstimatesFetcher = require('./data/EstimatesFetcher');
var LocationAutocompleteFetcher = require('./data/LocationAutocompleteFetcher');

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
          distance: null,
          startAddressLocationAutocompleteData: [],
          endAddressLocationAutocompleteData: [], 
          activeStartAddressSuggestionIndex: 0,
          activeEndAddressSuggestionIndex: 0,
          isStartAddressSuggestionsHidden: true,
          isEndAddressSuggestionsHidden: true,
          isLoading: false,
          errorMessage: null
      };
  },

  componentWillMount() {
      ActionCreator.getStartLocationAutocompleteData(this.state.startAddress);
      ActionCreator.getEndLocationAutocompleteData(this.state.endAddress);

      this.setState({
        startAddressLocationAutocompleteData: Store.getStartLocationAutocompleteData(),
        endAddressLocationAutocompleteData: Store.getEndLocationAutocompleteData()
      });
  },

  fetchData: function() {
    // Uber Hacky data fetching

    if (this.state.startAddress != null && this.state.endAddress != null) {
      this.setState({
        isLoading: true
      });

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
                      if ('message' in costEstimates) {
                        this.setState({
                          errorMessage: costEstimates.message
                        });
                      } else {
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
                          combinedData: combinedData,
                          isLoading: false
                        });
                      }

                    }.bind(this))
                }.bind(this))
            }.bind(this))
        }.bind(this))
    }
    this.setState({
      activeEndAddressSuggestionIndex: 0,
      activeStartAddressSuggestionIndex: 0
    });
  },

  handleSuggestionOnChange: function(event, type) {
    if (type == "startAddress") {
      ActionCreator.getStartLocationAutocompleteData(event.target.value);
      this.setState({
        startAddressLocationAutocompleteData: Store.getStartLocationAutocompleteData(),
        startAddress: event.target.value,
      });
    } else {
      ActionCreator.getEndLocationAutocompleteData(event.target.value);
      this.setState({
        endAddressLocationAutocompleteData: Store.getEndLocationAutocompleteData(),
        endAddress: event.target.value,
      });
    }
  },

  handleSuggestionOnClick: function(event, type) {
    event.persist();
    if (type == "startAddress") {
      this.setState({
        startAddress: event.target.outerText
      });
    } else {
      this.setState({
        endAddress: event.target.outerText
      });
    }
  },

  handleStartAddressSuggestionsOnFocus: function() {
    this.setState({
      isStartAddressSuggestionsHidden: false
    });
  },

  handleStartAddressSuggestionsOnBlur: function() {
    this.setState({
      isStartAddressSuggestionsHidden: true
    });
  },

  handleEndAddressSuggestionsOnFocus: function() {
    this.setState({
      isEndAddressSuggestionsHidden: false
    });
  },

  handleEndAddressSuggestionsOnBlur: function() {
    this.setState({
      isEndAddressSuggestionsHidden: true
    });
  },

  onInputKeyDown: function(event, type) {
    switch (event.which) {
      case 40: // DOWN
        event.preventDefault();
        if (type == "startAddress") {
          if (this.state.activeStartAddressSuggestionIndex < this.state.startAddressLocationAutocompleteData.length - 1) {
            var newActiveSuggestionIndex = this.state.activeStartAddressSuggestionIndex + 1; 
          } else {
            var newActiveSuggestionIndex = this.state.activeStartAddressSuggestionIndex;
          }
          
          this.setState({
            activeStartAddressSuggestionIndex: newActiveSuggestionIndex
          });
        } else {
          if (this.state.activeEndAddressSuggestionIndex < this.state.endAddressLocationAutocompleteData.length - 1) {
            var newActiveSuggestionIndex = this.state.activeEndAddressSuggestionIndex + 1; 
          } else {
            var newActiveSuggestionIndex = this.state.activeEndAddressSuggestionIndex;
          }
          
          this.setState({
            activeEndAddressSuggestionIndex: newActiveSuggestionIndex
          });
        }
        break;
      case 38: // UP
        event.preventDefault();
        if (type == "startAddress") {
          if (this.state.activeStartAddressSuggestionIndex > 0) {
            var newActiveSuggestionIndex = this.state.activeStartAddressSuggestionIndex - 1; 
          } else {
            var newActiveSuggestionIndex = this.state.activeStartAddressSuggestionIndex;
          }
          this.setState({
            activeStartAddressSuggestionIndex: newActiveSuggestionIndex
          });
        } else {
          if (this.state.activeEndAddressSuggestionIndex > 0) {
            var newActiveSuggestionIndex = this.state.activeEndAddressSuggestionIndex - 1; 
          } else {
            var newActiveSuggestionIndex = this.state.activeEndAddressSuggestionIndex;
          }
          this.setState({
            activeEndAddressSuggestionIndex: newActiveSuggestionIndex
          });
        }
        break;
      case 13: // ENTER
        if (type == "startAddress") {
          var locationAutocompleteData = this.state.startAddressLocationAutocompleteData;
          this.state.startAddress = locationAutocompleteData[this.state.activeStartAddressSuggestionIndex].description;
          this.state.isStartAddressSuggestionsHidden = true;
        } else {
          var locationAutocompleteData = this.state.endAddressLocationAutocompleteData;
          this.state.endAddress = locationAutocompleteData[this.state.activeEndAddressSuggestionIndex].description;
          this.state.isEndAddressSuggestionsHidden = true;
        }
        this.fetchData();
        break;

      default:
        break;
    }
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

    if (this.state.duration != null) {
      var duration = <div className="duration">Duration: {Math.round(this.state.duration / 60) + " min"}</div>;
    } else {
      var duration = null;
    }

    if (this.state.distance != null) {
      var distance = <div className="distance">Distance: {this.state.distance + " miles"}</div>;
    } else {
      var distance = null;
    }

    if (this.state.errorMessage != null) {
      return (<div className="error">{"Error: " + this.state.errorMessage}</div>)
    }

    if (this.state.isLoading) {
      return (<Loading className='loading' type='spokes' color='#000000' />);
    } else {
      return (
        <div>
          <Geosuggestion 
            input={this.state.startAddress} 
            placeholder={"Start Address"}
            type={"startAddress"}
            onFocus={this.handleStartAddressSuggestionsOnFocus}
            onBlur={this.handleStartAddressSuggestionsOnBlur}
            onInputKeyDown={this.onInputKeyDown} 
            onChange={this.handleSuggestionOnChange}
            suggestions={this.state.startAddressLocationAutocompleteData} 
            isHidden={this.state.isStartAddressSuggestionsHidden}
            activeSuggestionIndex={this.state.activeStartAddressSuggestionIndex} 
            handleSuggestionOnClick={this.handleSuggestionOnClick} />
          <Geosuggestion 
            input={this.state.endAddress} 
            placeholder={"End Address"}
            type={"endAddress"}
            onFocus={this.handleEndAddressSuggestionsOnFocus}
            onBlur={this.handleEndAddressSuggestionsOnBlur}
            onInputKeyDown={this.onInputKeyDown} 
            onChange={this.handleSuggestionOnChange}
            suggestions={this.state.endAddressLocationAutocompleteData} 
            isHidden={this.state.isEndAddressSuggestionsHidden}
            activeSuggestionIndex={this.state.activeEndAddressSuggestionIndex} 
            handleSuggestionOnClick={this.handleSuggestionOnClick} />
          {distance}
          {duration}
          <EstimatesTable className="estimates-table" estimates={this.state.combinedData} />
          {startAddressMessage}
          {endAddressMessage}
        </div>
      )
    }
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('uber-estimates')
);