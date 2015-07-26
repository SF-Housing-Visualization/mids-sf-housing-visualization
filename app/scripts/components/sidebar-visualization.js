import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
import _ from 'underscore';
import SidebarData from '../data/sidebar-data';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';


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

    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  render() {
    return (
      <div className='sidebar'>
        <svg ref='svg'></svg>
      </div>
    );
  }

  componentDidMount() {
    let svg = React.findDOMNode(this.refs.svg);

    let data = this.state.data;

    let onBarHover = this.onBarHover;
    let onBarExit = this.onBarExit;
    let onBarClick = this.onBarClick;

    let setState = this.setState.bind(this);

    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .margin({top: 30, right: 20, bottom: 50, left: 175})
          .showValues(true)           //Show bar value next to each bar.
          //.transitionDuration(350)
          .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

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
      setState({ data, chart }); // ES6 implicit :data, :chart
    });

    d3.csv('/mids-sf-housing-sandbox/data/prod/data_geos.csv',
      function (data) {
        console.log('got data_geos.csv', data);
      });

    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
  }


  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
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

  onSelectionChange(newSelection) {
    let selectedGeographies = newSelection.selectedGeographies;

    let chart = this.state.chart;
    let data = this.state.data;

    for (var prop in chart) {
      console.log('chart.', prop, chart[prop]);
    }

    console.log('chart', chart);
    console.log('data', data);
    console.log('selectedGeographies', selectedGeographies);

    data.forEach((series) => this.darkenSelected(series, selectedGeographies));

    chart.barColor( (d) => d.color );

    chart.update();
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

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
  
}
