import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
import _ from 'underscore';
import TimeSeriesData from '../data/time-series-data';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : TimeSeriesData
    };
    console.log(this.state);

    this.onLineClick = this.onLineClick.bind(this);
    this.onLineHover = this.onLineHover.bind(this);
    this.onLineExit = this.onLineExit.bind(this);

    this.onSelectionChange = this.onSelectionChange.bind(this);
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

    let setState = this.setState.bind(this);
    let onLineClick = this.onLineClick;
    let onLineHover = this.onLineHover;
    let onLineExit = this.onLineExit;

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
    }, function (chart) {
      //for (var prop in chart) {console.log('TSV cDM(): ', prop, chart[prop]);}

      let linesDispatch = chart.lines.dispatch;

      linesDispatch.on('elementMouseover', onLineHover);
      linesDispatch.on('elementMouseout', onLineExit);
      linesDispatch.on('elementClick', onLineClick);

      setState({ data, chart }); // ES6 implicit :data, :chart
    });

    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
  }

  onSelectionChange(newSelection) {
    let selectedGeographies = newSelection.selectedGeographies;

    let chart = this.state.chart;
    let data = this.state.data;

    data.forEach((series) => this.darkenSelected(series, selectedGeographies));

    chart.color( (d) => {
      console.log('color mapper', d); //d.color 
    });

    chart.update();
  }

  onLineHover(data) {
    console.log('onLineHover data: ', data);
  }

  onLineExit(data) {
    console.log('onLineExit data: ', data);
  }

  onLineClick(event) {
    console.log('onLineClick data: ', event);
    var geography = event.series.key;
    SelectionActions.geographiesSelectionChange([ geography ]);
  }

  darkenSelected(series, selectedGeographies) {
    let key = series.key;

    let baselineColor = '#AAAAAA';
    let selectedColor = '#000000';

    series.color =
      this.contains(selectedGeographies, key)
      ? selectedColor
      : baselineColor;


    series.values.forEach((valueObject) => {
      let label = valueObject.label;
      valueObject.color =
        this.contains(selectedGeographies, label)
        ? selectedColor
        : baselineColor;
    });
  }

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
}
