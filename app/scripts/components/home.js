import React from 'react';
import $ from 'jquery';

import Introduction from './introduction';
import IntroductionActions from './introduction-actions';
import IntroductionStore from './introduction-store';

import MetricSelector from './metric-selector';
import MapVisualization from './map-visualization';
import SidebarVisualization from './sidebar-visualization';
import TimeSeriesVisualization from './time-series-visualization';

import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';

import IndexLoadAction from './index-load-action';
import IndexStore from './index-store';

import GeoMappingLoadAction from './geo-mapping-load-action';
import GeoMappingStore from './geo-mapping-store';

import MetricLoadAction from './metric-load-action';
import MetricStore from './metric-store';

import DimensionActions from './dimension-actions';
import DimensionStore from './dimension-store';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };

    this.initial = {
      geography: 'San Francisco',
      date: 2013,
      interval: [1999, 2015]
    };

    //this.onIndexLoaded = this.onIndexLoaded.bind(this);
    this.onGeoMappingLoaded = this.onGeoMappingLoaded.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onIntroductionStore = this.onIntroductionStore.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDimensionStore = this.onDimensionStore.bind(this);
  }

  render() {
    return (
      <div className="root-container">

        <Introduction />
        
        <MetricSelector ref='visualization' />

        <SidebarVisualization />
                
        <MapVisualization />

        <TimeSeriesVisualization />

      </div>
    );
  }

  componentDidMount() {
    //this.unsubscribeFromGeoMappingStore =
    //  GeoMappingStore.listen(this.onGeoMappingLoaded);
    //this.unsubscribeFromIndexStore =
    //  IndexStore.listen(this.onIndexLoaded);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
    this.unsubscribeFromIntroductionStore =
      IntroductionStore.listen(this.onIntroductionStore);
    this.unsubscribeFromDimensionStore =
      DimensionStore.listen(this.onDimensionStore);

    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();

    //GeoMappingLoadAction();
    GeoMappingStore.getGeoMappingPromise()
      .then(this.onGeoMappingLoaded);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);

    this.unsubscribeFromDimensionStore();
    this.unsubscribeFromIntroductionStore();
    this.unsubscribeFromSelectionStore();
    //this.unsubscribeFromIndexStore();
    //this.unsubscribeFromGeoMappingStore();
  }

  onGeoMappingLoaded(geoMapping) {
    console.log('Home onGeoMappingLoaded() ', geoMapping);


    SelectionActions.geographiesSelectionChange([ this.initial.geography ]);
    SelectionActions.timePositionSelectionChange( this.initial.date );
    SelectionActions.timeIntervalSelectionChange( this.initial.interval );
    //IndexLoadAction();
    IndexStore.getIndexPromise().then(this.onIndexLoaded);
  }

  onIndexLoaded(index) {
    console.log('Home onIndexLoaded() ', index);

    let primaryGroupId = 'CARS';
    let primaryGroup = index.groups[primaryGroupId];
    let primaryGroupName = primaryGroup.LogicalCategory;

    let primaryVariableId = primaryGroup.variableOrder[0];
    let primaryVariable = primaryGroup.variables[primaryVariableId];

    let primaryMetric = primaryVariable.variableName;

    let metric = {
      group: primaryGroupId,
      metric: primaryVariableId,
      display: {
        group: primaryGroupName,
        metric: primaryMetric
      }
    };


    MetricLoadAction(metric);
    console.log('Home onIndexLoaded() called MetricLoadAction.start', metric);
    SelectionActions.primaryMetricSelectionChange(metric);

    //this.setState({ primaryMetric }); // ES6 implicit :primaryMetric
  }

  onSelectionChange(newSelection) {
    this.setState(newSelection);
    console.log('onSelectionChange this.state: ', this.state);
  }

  onIntroductionStore(event) {
    console.log('onIntroductionStore', event);
    if (event.visualize) {
      let body = document.body; // React.findDOMNode('body');
      let visualization = React.findDOMNode(this.refs.visualization);
      $(body).animate({
        scrollTop: $(visualization).offset().top
      }, 500);
    }
  }

  onWindowResize(event) {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    DimensionActions.resize({ windowWidth, windowHeight });
  }

  onDimensionStore(newDimensions) {
    console.log('Home onDimensionStore()', newDimensions);
    this.setState(newDimensions);
  }
}
