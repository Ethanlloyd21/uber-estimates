"use es6";

var React = require('react');

var SuggestionInput = React.createClass({

  render: function() {

    return (
      <input 
        className="geosuggest__input" 
        type="text" 
        placeholder={this.props.placeholder}
        value={this.props.input} 
        onFocus={this.props.onFocus} 
        onBlur={this.props.onBlur}
        onKeyDown={this.props.onInputKeyDown}
        onChange={this.props.onChange}>
      </input>
    )
  }
});

module.exports = SuggestionInput;