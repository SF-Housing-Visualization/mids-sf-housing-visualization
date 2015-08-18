import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
import _ from 'underscore';
import TimeSeriesData from '../data/time-series-data';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';

import MetricStore from './metric-store';

import GeoMappingStore from './geo-mapping-store';

import TimeSeriesStore from './time-series-store';

import DimensionStore from './dimension-store';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : TimeSeriesData,
      format : ',.2f'
    };
    console.log(this.state);

    this.onLineClick = this.onLineClick.bind(this);
    this.onLineHover = this.onLineHover.bind(this);
    this.onLineExit = this.onLineExit.bind(this);

    this.onGeoMappingChange = this.onGeoMappingChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onMetricChange = this.onMetricChange.bind(this);
    this.onDimensionChange = this.onDimensionChange.bind(this);
    this.onTimeSeriesStore = this.onTimeSeriesStore.bind(this);
  }

  render() {
    let componentHeight = this.state.componentHeight;
    let style = componentHeight ? { height: componentHeight } : { };

    return (
      <div className='time-series' style={ style }>
        <svg ref='svg'></svg>
      </div>
    );
  }

  componentDidMount() {
    this.unsubscribeFromDimensionStore =
      DimensionStore.listen(this.onDimensionChange);
    this.unsubscribeFromGeoMappingStore =
      GeoMappingStore.listen(this.onGeoMappingChange);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
    this.unsubscribeFromMetricStore =
      MetricStore.listen(this.onMetricChange);
    this.unsubscribeFromTimeSeriesStore =
      TimeSeriesStore.listen(this.onTimeSeriesStore);

    let data = this.state.data;
    let format = this.state.format;
    this.drawChart(data, format);
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromDimensionStore();
  }

  drawChart(data, format) {
    let svg = React.findDOMNode(this.refs.svg);

    console.log('TimeSeriesVisualization drawChart(data)', data);
    let formatString = data[0].formatString;

    // WORKAROUND: https://github.com/novus/nvd3/issues/998
    // Issue: NVD3 does not clean up its tooltips when re-drawing
    // Solution: delete tooltip element manually from the DOM before redraw
    let previousChart = this.state.chart;
    if (previousChart) {
      let tooltipElement = previousChart.tooltip.tooltipElem();
      
      previousChart.tooltip.enabled(false);
      previousChart.update();
      
      if (tooltipElement && tooltipElement.parentNode) {
        tooltipElement.parentNode.removeChild(tooltipElement);
      }
    }

    let setState = this.setState.bind(this);
    let onLineClick = this.onLineClick;
    let onLineHover = this.onLineHover;
    let onLineExit = this.onLineExit;

    nv.addGraph(function() {
      var chart = nv.models.lineChart().options({
        // useInteractiveGuideline: true
      });

      chart.xAxis
          .tickFormat(d3.format('f'));

      chart.yAxis
          .tickFormat(d3.format(formatString));

      //chart.valueFormat(d3.format(formatString));

      //chart.y2Axis
      //    .tickFormat(d3.format(',.2f'));

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

  onDimensionChange(newDimension) {
    console.log('TimeSeriesVisualization onDimensionChange()', newDimension);
    let windowHeight = newDimension.windowHeight;
    let visualizationHeaderHeight = newDimension.visualizationHeaderHeight;

    if (windowHeight && visualizationHeaderHeight) {
      let componentHeight = 0.60 * (windowHeight - visualizationHeaderHeight);
      this.setState({ componentHeight });
    }
    
  }

  onSelectionChange(newSelection) {

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
    var year = event.point.x | 0; // to integer
    SelectionActions.timePositionSelectionChange( year );
    SelectionActions.geographiesSelectionChange([ geography ]);
  }

  darkenSelected(series, selectedGeographies) {
    let key = series.key;

    let baselineColor = '#3C73E1';
    let selectedColor = '#F38630';

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
  }

  onTimeSeriesStore(timeSeries) {
    console.log('TimeSeriesVisualization onTimeSeriesStore()', timeSeries);
    let data = timeSeries.lines;
    let format = this.getPrimaryMetricFormat(timeSeries);
    
    this.setState({ data, format });
    this.drawChart(data, format);
  }

  getPrimaryMetricFormat(timeSeries) {
    console.log('TimeSeriesVisualization getPrimaryMetricFormat()', timeSeries);
    let selected = timeSeries.selectedPrimaryMetric;
    let group = selected.group;
    let metric = selected.metric;
    let index = timeSeries.index;

    return index.groups[group].variables[metric].formatString;

  }

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
}
