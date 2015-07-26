import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
import TimeSeriesData from '../data/time-series-data';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : TimeSeriesData
    };
    console.log(this.state);
  }

  render() {
    return (
      <div className="time-series">
        <svg ref='svg'></svg>
      </div>
    );
  }

  componentDidMount() {
    let svg = React.findDOMNode(this.refs.svg);

    let data = this.state.data;
    
    nv.addGraph(function() {
      var chart = nv.models.lineWithFocusChart();

      chart.xAxis
          .tickFormat(d3.format(',f'));

      chart.yAxis
          .tickFormat(d3.format(',.2f'));

      chart.y2Axis
          .tickFormat(d3.format(',.2f'));

      d3.select(svg)
          .datum(data)
          .transition().duration(500)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }
}
