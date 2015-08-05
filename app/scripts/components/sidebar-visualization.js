import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
import _ from 'underscore';
import SidebarData from '../data/sidebar-data';

import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';

import MetricStore from './metric-store';

import GeoMappingStore from './geo-mapping-store';

import DimensionStore from './dimension-store';


export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data : SidebarData
    };
    console.log(this.state);

    this.onBarClick = this.onBarClick.bind(this);
    this.onBarHover = this.onBarHover.bind(this);
    this.onBarExit = this.onBarExit.bind(this);

    this.onGeoMappingChange = this.onGeoMappingChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onMetricChange = this.onMetricChange.bind(this);
    this.onDimensionChange = this.onDimensionChange.bind(this);
  }

  render() {
    let componentHeight = this.state.componentHeight;
    let style = componentHeight ? { height: componentHeight } : { };
    
    return (
      <div className='sidebar' style={ style }>
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
  }


  componentWillUnmount() {
    this.unsubscribeFromMetricStore();
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromGeoMappingStore();
    this.unsubscribeFromDimensionStore();
  }

  onBarHover(data) {
    console.log('onBarHover data: ', data);
  }

  onBarExit(data) {
    console.log('onBarExit data: ', data);
  }

  onBarClick(event) {
    console.log('onBarClick data: ', event);
    var geography = event.data.label;
    SelectionActions.geographiesSelectionChange([ geography ]);
  }

  onGeoMappingChange(geoMapping) {
    console.log('SidebarVisualization onGeoMappingChange()', geoMapping);
    this.setState({ geoMapping });
  }

  onMetricChange(metric) {
    console.log('SidebarVisualization onMetricChange() metric', metric);

    let data = this.reshapeMetric(metric);
    console.log('SidebarVisualization onMetricChange() data', data);

    this.setState({ data });
    this.drawChart(data);
  }

  reshapeMetric(data) {
    let year = this.state.selectedTimePosition;
    let geography = this.state.selectedGeographies[0];
    let geoMapping = this.state.geoMapping;
    let forwardGeoMapping = geoMapping.forward;

    let color = '#4f99b4';
    let group = data.group;
    let metric = data.metric;
    let key = group + ' > ' + metric;

    let geoId = geoMapping.reverse[geography];

    let rows = data.rows;

    let applicable = _.filter(rows, (row) => 
      row.Year === year
    );

    let valueByGeography = { };

    // implicitly keep only the last value for any geography/year
    applicable.forEach((row) => {
      if (row && forwardGeoMapping[row.GeoID]) {
        let geography = forwardGeoMapping[row.GeoID].ShortName
        valueByGeography[geography] = row[metric];
      } else {
        console.log('SidebarVisualization.reshapeMetric() ignored bad data',
          row);
      }
    });

    let values = _.map(_.keys(valueByGeography), (geography) => {
      let label = geography;
      let series = 0;
      let value = valueByGeography[geography];
      return { color, key, label, series, value};
    });




    console.log('reshapeMetric', year, geography, geoMapping, color, key, 
       applicable, valueByGeography, values);

    return [{ color, key, values }];
  }

  onSelectionChange(newSelection) {
    this.setState(newSelection);
    let data = this.state.data;
    this.drawChart(data);

    console.log('SidebarVisualization onSelectionChange() new state:', this.state);
  }

  onDimensionChange(newDimension) {
    console.log('SidebarVisualization onDimensionChange()', newDimension);
    let windowHeight = newDimension.windowHeight;
    let visualizationHeaderHeight = newDimension.visualizationHeaderHeight;

    if (windowHeight && visualizationHeaderHeight) {
      let componentHeight = windowHeight - visualizationHeaderHeight;
      this.setState({ componentHeight });
    }
    
  }

  darkenSelected(series, selectedGeographies) {
    let baselineColor = series.color;
    let selectedColor = '#000000';

    series.values.forEach((valueObject) => {
      let label = valueObject.label;
      valueObject.color =
        this.contains(selectedGeographies, label)
        ? selectedColor
        : baselineColor;
    });
  }

  drawChart(data) {
    let svg = React.findDOMNode(this.refs.svg);

    console.log('SidebarVisualization drawChart() data', data);

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

    let onBarHover = this.onBarHover;
    let onBarExit = this.onBarExit;
    let onBarClick = this.onBarClick;

    let setState = this.setState.bind(this);

    let selectedGeographies = this.state.selectedGeographies;
    data.forEach((series) => this.darkenSelected(series, selectedGeographies));

    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .margin({top: 30, right: 20, bottom: 50, left: 125})
          .barColor( (d) => d.color )
          .showValues(true)           //Show bar value next to each bar.
          //.transitionDuration(350)
          .showLegend(false)
          .showControls(false);        //Allow user to switch between "Grouped" and "Stacked" mode.

      chart.yAxis
          .tickFormat(d3.format(',.2f'));

      chart.tooltip.enabled();

      d3.select(svg)
          .datum(data)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    }, function(chart) {
      let multibarDispatch = chart.multibar.dispatch;

      multibarDispatch.on('elementMouseover', onBarHover);
      multibarDispatch.on('elementMouseout', onBarExit);
      multibarDispatch.on('elementClick', onBarClick);

      // memoize the chart for later highlighting from external events
      setState({ chart }); // ES6 implicit :data, :chart
    });
  }

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
  
}
