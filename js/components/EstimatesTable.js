"use es6";

var React = require('react');
var Reactable = require('reactable');
var Table = Reactable.Table;

var EstimatesTable = React.createClass({
  render: function() {
    return (
      <div>
        <Table 
          className="table" 
          data={this.props.estimates} 
          sortable={[
            "Option",
            "High",
            "Low",
            "Minimum",
            "Wait"
          ]}
          filterable={[
            "Option",
            "High",
            "Low",
            "Minimum",
            "Wait"
          ]}
          defaultSort={
            {
              "column": "High",
              "direction": "Desc"
            }
          }
        />
      </div>
    );
  }
});

module.exports = EstimatesTable;