import React from 'react';
import d3 from 'd3';
import nvd3 from 'd3';
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
        <svg id='sidebar-svg'></svg>
      </div>
    );
  }

  componentDidMount() {
    console.log('SidebarVisualization componentDidMount(): SelectionStore',
      SelectionStore);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);

    console.log('componentDidMount this: ', this);
    console.log(document.querySelector('.sidebar'));
    const container = '.sidebar svg';
    let data = this.state.data;

    let onBarHover = this.onBarHover;
    let onBarExit = this.onBarExit;
    let onBarClick = this.onBarClick;

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

      d3.select(container)
          .datum(data)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    }, function(chart) {
      let multibarDispatch = chart.multibar.dispatch;

      //multibarDispatch.elementMouseover
      //  .on('elementMouseover', this.onBarHover);
      multibarDispatch.on('elementMouseover', onBarHover);
      multibarDispatch.on('elementMouseout', onBarExit);
      multibarDispatch.on('elementClick', onBarClick);
      console.log('chart.dispatch', multibarDispatch);
      //dispatch.on('elementMounseover', function (event) {
      //  console.log('caught tooltip', event);
      //});
      //console.log('SidebarVisualization.componentDidMount() cild',
      //  chart);
      //d3
      //  .selectAll(container + ' .nv-bar')
      //  .on('click', onBarClick);
    });

    d3.csv('/mids-sf-housing-sandbox/data/prod/data_geos.csv',
      function (data) {
        console.log('got data_geos.csv', data);
      });
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
    console.log('onSelectionChange newSelection: ', newSelection, 
      'this: ', this, 'this.setState', this.setState);
    
    //console.log('Sidebar onSelectionChange this.state: ', this.state);
  }
  
}
