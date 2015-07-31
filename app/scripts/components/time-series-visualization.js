import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
import _ from 'underscore';
import TimeSeriesData from '../data/time-series-data';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';

import MetricStore from './metric-store';

import GeoMappingStore from './geo-mapping-store';

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

    this.onGeoMappingChange = this.onGeoMappingChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onMetricChange = this.onMetricChange.bind(this);
  }

  render() {
    return (
      <div className="time-series">
        <svg ref='svg'></svg>
      </div>
    );
  }

  componentDidMount() {
    this.unsubscribeFromGeoMappingStore =
      GeoMappingStore.listen(this.onGeoMappingChange);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
    this.unsubscribeFromMetricStore =
      MetricStore.listen(this.onMetricChange);

    let data = this.state.data;
    this.drawChart(data);
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
  }

  drawChart(data) {
    let svg = React.findDOMNode(this.refs.svg);

    console.log('TimeSeriesVisualization drawChart(data)', data);

    let setState = this.setState.bind(this);
    let onLineClick = this.onLineClick;
    let onLineHover = this.onLineHover;
    let onLineExit = this.onLineExit;

    nv.addGraph(function() {
      var chart = nv.models.lineWithFocusChart();

      chart.xAxis
          .tickFormat(d3.format('f'));

      chart.yAxis
          .tickFormat(d3.format(',.2f'));

      chart.y2Axis
          .tickFormat(d3.format(',.2f'));

      chart.showLegend(false);

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


  }



  onSelectionChange(newSelection) {
    this.setState(newSelection);

    let metric = this.state.metric;

    if (metric && metric.rows) {
      let data = this.reshapeMetric(this.state.metric);
      this.setState({ data });
      console.log('TimeSeriesVisualization onSelectionChange()', 
        metric, data, this.state.selectedGeographies);
      this.drawChart(data);
    }

    
    

    /*let selectedGeographies = newSelection.selectedGeographies;

    let chart = this.state.chart;
    let data = this.state.data;

    data.forEach((series) => this.darkenSelected(series, selectedGeographies));

    chart.update();*/
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

  onGeoMappingChange(geoMapping) {
    console.log('TimeSeriesVisualization onGeoMappingChange()', geoMapping);
    this.setState({ geoMapping });
  }

  onMetricChange(metric) {
    console.log('TimeSeriesVisualization onMetricChange() metric', metric);
    let data = this.reshapeMetric(metric);
    console.log('TimeSeriesVisualization onMetricChange() data', data);

    this.setState({ metric, data });
    this.drawChart(data);
  }

  reshapeMetric(data) {
    let selectedYear = this.state.selectedTimePosition;
    let selectedGeographies = this.state.selectedGeographies;
    let geoMapping = this.state.geoMapping;
    let reverseGeoMapping = geoMapping.reverse;
    let forwardGeoMapping = geoMapping.forward;

    let baselineColor = '#4f99b4';
    let selectedColor = '#000000';
    let group = data.group;
    let metric = data.metric;
    let key = group + ' > ' + metric;

    let rows = data.rows;

    let valuesByGeography = _.mapObject(reverseGeoMapping, () => {
      return { }
    });

    // implicitly keep only the last value for any geography/year
    rows.forEach((row) => {
      let geography = forwardGeoMapping[row.GeoID].ShortName;
      let year = row.Year;
      valuesByGeography[geography][year] = row[metric];
    });

    let geographies = _.sortBy(_.keys(valuesByGeography), (geography) => {
      return this.contains(selectedGeographies, geography) ? 1 : 0;
    });

    let lines = _.map(geographies, (geography, series) => {
      console.log('debug reshapeMetric', geography, selectedGeographies)
      let color = 
        this.contains(selectedGeographies, geography)
        ? selectedColor
        : baselineColor;

      console.log('debug reshapeMetric', geography, selectedGeographies, color);
      let key = geography;
      let years = valuesByGeography[geography];
      let values = _.map(_.sortBy(_.keys(years)), (year) => {
        let x = year;
        let y = years[year];
        return {color, series, x, y}
      });
      //let values = [ { color, series: index, x: year, y} ]
      
      return { color, key, values };
    });




    console.log('reshapeMetric', selectedGeographies, geoMapping, key, 
       valuesByGeography, lines);

    return lines;
  }

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
}
