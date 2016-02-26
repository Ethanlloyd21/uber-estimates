"use es6";

var ReactDOM = require('react-dom');
var React = require('react');
var Loading = require('react-loading');
var Tabs = require('react-simpletabs');
var Panel = Tabs.Panel;

var Store = require('./stores/Store');
var ActionCreator = require('./actions/ActionCreator');

var JourneyDetails = require('./components/JourneyDetails');
var Geosuggestion = require('./components/Geosuggestion');
var JourneyLocationInput = require('./components/JourneyLocationInput');

var AddressTypeConstants = require('./constants/AddressTypeConstants');

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
          ignoreEndAddressBlur: true,
          ignoreStartAddressBlur: true,
          isLoading: false,
          errorMessage: null,
          activeTabIndex: 1
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
                          isLoading: false,
                          activeTabIndex: 2
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

  // HANDLERS

  handleStartLocationSuggestionOnChange: function(event) {
    if ('target' in event && 'value' in event.target) {
      ActionCreator.getStartLocationAutocompleteData(event.target.value);
      this.setState({
        startAddressLocationAutocompleteData: Store.getStartLocationAutocompleteData(),
        startAddress: event.target.value,
        isStartAddressSuggestionsHidden: false
      });
    }
  },

  handleEndLocationSuggestionOnChange: function(event) {
    if ('target' in event && 'value' in event.target) {
      ActionCreator.getEndLocationAutocompleteData(event.target.value);
      this.setState({
        endAddressLocationAutocompleteData: Store.getEndLocationAutocompleteData(),
        endAddress: event.target.value,
        isEndAddressSuggestionsHidden: false
      });
    }
  },

  handleEndLocationSuggestionMouseDown: function(event) {
    this.setState({
      ignoreEndAddressBlur: false,
      endAddress: event.target.outerText,
      isEndAddressSuggestionsHidden: true
    });

    this.fetchData();
  },

  handleStartLocationSuggestionMouseDown: function(event) {
    this.setState({
      ignoreStartAddressBlur: false,
      startAddress: event.target.outerText,
      isStartAddressSuggestionsHidden: true
    });

    this.fetchData();
  },

  handleStartAddressSuggestionsOnFocus: function() {
    this.setState({
      isStartAddressSuggestionsHidden: false
    });
  },

  handleStartAddressSuggestionsOnBlur: function() {
    if (!this.state.ignoreStartAddressBlur) {
      this.setState({
        isStartAddressSuggestionsHidden: true
      });
    }
  },

  handleEndAddressSuggestionsOnFocus: function() {
    this.setState({
      isEndAddressSuggestionsHidden: false
    });
  },

  handleEndAddressSuggestionsOnBlur: function() {
    if (!this.state.ignoreEndAddressBlur) {
      this.setState({
        isEndAddressSuggestionsHidden: true
      });
    }
  },

  generateTitleValueMap: function() {
    return {
      'Start': this.state.formattedStartAddress,
      'End': this.state.formattedEndAddress,
      'Duration': this.state.duration,
      'Distance': this.state.distance
    }
  },

  onInputKeyDown: function(event, type) {
    switch (event.which) {
      case 40: // DOWN
        event.preventDefault();
        if (type == AddressTypeConstants.START) {
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
        if (type == AddressTypeConstants.START) {
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
        if (type == AddressTypeConstants.START) {
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

    if (this.state.isLoading) {
      return (<Loading className='loading' type='spokes' color='white' />);
    } else {
      return (
        <Tabs tabActive={this.state.activeTabIndex}>
          <Panel title='Location'>
            <JourneyLocationInput
              startAddress={this.state.startAddress}
              handleStartAddressSuggestionsOnFocus={this.handleStartAddressSuggestionsOnFocus}
              handleStartAddressSuggestionsOnBlur={this.handleStartAddressSuggestionsOnBlur}
              onInputKeyDown={this.onInputKeyDown} 
              handleStartLocationSuggestionOnChange={this.handleStartLocationSuggestionOnChange}
              handleStartLocationSuggestionMouseDown={this.handleStartLocationSuggestionMouseDown}
              startAddressLocationAutocompleteData={this.state.startAddressLocationAutocompleteData} 
              isStartAddressSuggestionsHidden={this.state.isStartAddressSuggestionsHidden}
              activeStartAddressSuggestionIndex={this.state.activeStartAddressSuggestionIndex} 
              endAddress={this.state.endAddress} 
              handleEndAddressSuggestionsOnFocus={this.handleEndAddressSuggestionsOnFocus}
              handleEndAddressSuggestionsOnBlur={this.handleEndAddressSuggestionsOnBlur}
              handleEndLocationSuggestionOnChange={this.handleEndLocationSuggestionOnChange}
              handleEndLocationSuggestionMouseDown={this.handleEndLocationSuggestionMouseDown}
              endAddressLocationAutocompleteData={this.state.endAddressLocationAutocompleteData} 
              isEndAddressSuggestionsHidden={this.state.isEndAddressSuggestionsHidden}
              activeEndAddressSuggestionIndex={this.state.activeEndAddressSuggestionIndex} />
          </Panel>
          <Panel title='Estimates'>
            <JourneyDetails
              estimates={this.state.combinedData}
              titleValueMap={this.generateTitleValueMap()} />
          </Panel>
        </Tabs>
      )
    }
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('uber-estimates')
);