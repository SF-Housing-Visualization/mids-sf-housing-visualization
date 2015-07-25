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
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.setState = this.setState.bind(this);
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
    //this.unsubscribeFromSelectionStore =
    //  SelectionStore.listen(this.onSelectionChange);

    console.log('componentDidMount this: ', this);
    console.log(document.querySelector('.sidebar'));
    const container = '.sidebar svg';
    let data = this.state.data;

    let onBarClick = this.onBarClick;

    console.log('this in com')

    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .margin({top: 30, right: 20, bottom: 50, left: 175})
          .showValues(true)           //Show bar value next to each bar.
          .tooltips(true)             //Show tooltips on hover.
          //.transitionDuration(350)
          .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.

      chart.yAxis
          .tickFormat(d3.format(',.2f'));

      d3.select(container)
          .datum(data)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    }, function() {
      d3
        .selectAll(container + ' .nv-bar')
        .on('click', onBarClick);
    });

    d3.csv('/mids-sf-housing-sandbox/data/prod/data_geos.csv',
      function (data) {
        console.log('got data_geos.csv', data);
      });
  }


  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
  }

  onBarClick(data) {
    console.log('onBarClick data: ', data, 'this: ', this);
    var geography = data.label;
    SelectionActions.geographiesSelectionChange([ geography ]);
  }

  onSelectionChange(newSelection) {
    console.log('onSelectionChange newSelection: ', newSelection, 
      'this: ', this, 'this.setState', this.setState);
    
    //console.log('Sidebar onSelectionChange this.state: ', this.state);
  }
  
}
