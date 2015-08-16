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

import SidebarStore from './sidebar-store';


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
    this.onSidebarStore = this.onSidebarStore.bind(this);
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
    this.unsubscribeFromSidebarStore =
      SidebarStore.listen(this.onSidebarStore);
  }


  componentWillUnmount() {
    this.unsubscribeFromSidebarStore();
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

  onSidebarStore(barChart) {
    console.log('SidebarVisualization onSidebarStore()', barChart);
    let data = barChart.bars;
    this.setState({ data });
    this.drawChart(data);

  }

  onMetricChange(metric) {
    console.log('SidebarVisualization onMetricChange() metric', metric);

    //let data = this.reshapeMetric(metric);
    //console.log('SidebarVisualization onMetricChange() data', data);

    //this.setState({ data });
    //this.drawChart(data);
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

    let formatString = data[0].formatString;
    console.log('SidebarVisualization drawChart() formatString', formatString)

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

      // use custom axis format
      chart.yAxis
          .tickFormat(d3.format(formatString));
      
      chart.valueFormat(d3.format(formatString));

      chart.tooltip.enabled();

      // Use custom tool tip
      chart.tooltipContent(function(data) {
        console.log(data)
        return 'County: ' + data.value + ', Value: ' + d3.format(formatString)(data.series[0].value)
      });

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
