"use es6";

var React = require('react');

var SuggestionInput = React.createClass({

  render: function() {

    return (
      <input 
        className="geosuggest__input" 
        type="text" 
        placeholder="Start Address" 
        value={this.props.input} 
        onFocus={this.props.onFocus} 
        onBlur={this.props.onFocus}
        onKeyDown={this.props.onInputKeyDown}>
      </input>
    )
  }
});

module.exports = SuggestionInput;