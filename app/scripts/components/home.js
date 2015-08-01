import React from 'react';
import $ from 'jquery';

import Introduction from './introduction';
import IntroductionActions from './introduction-actions';
import IntroductionStore from './introduction-store';

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

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };

    this.initial = {
      geography: 'San Francisco',
      date: 2013,
      interval: [1999, 2015]
    };

    this.onIndexLoaded = this.onIndexLoaded.bind(this);
    this.onGeoMappingLoaded = this.onGeoMappingLoaded.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onIntroductionStore = this.onIntroductionStore.bind(this);
  }

  render() {
    return (
      <div className="root-container">



        <Introduction />
        
        <header ref='visualization' className="group">
          <div className="appName">
            mids-sf-housing-visualization 
            metric: { 
              this.state.selectedPrimaryMetric
              ? this.state.selectedPrimaryMetric.group
                + ' > '
                + this.state.selectedPrimaryMetric.metric
              : 'Loading...' 
            }
          </div>

        </header>

        <SidebarVisualization />
                
        <MapVisualization />

        <TimeSeriesVisualization />

      </div>
    );
  }

  componentDidMount() {
    this.unsubscribeFromGeoMappingStore =
      GeoMappingStore.listen(this.onGeoMappingLoaded);
    this.unsubscribeFromIndexStore =
      IndexStore.listen(this.onIndexLoaded);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
    this.unsubscribeFromIntroductionStore =
      IntroductionStore.listen(this.onIntroductionStore);

    //this.listenTo

    const indexUrl = '/mids-sf-housing-sandbox/data/prod/data_variables.csv';

    console.log('Home componentDidMount, indexUrl', indexUrl);
    GeoMappingLoadAction();
    

  }

  componentWillUnmount() {
    this.unsubscribeFromIntroductionStore();
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromIndexStore();
    this.unsubscribeFromGeoMappingStore();
  }

  onGeoMappingLoaded(geoMapping) {
    console.log('Home onGeoMappingLoaded() ', geoMapping);


    SelectionActions.geographiesSelectionChange([ this.initial.geography ]);
    SelectionActions.timePositionSelectionChange( this.initial.date );
    SelectionActions.timeIntervalSelectionChange( this.initial.interval );
    IndexLoadAction();
  }

  onIndexLoaded(index) {
    console.log('Home onIndexLoaded() ', index);

    let primaryGroupId = index.groupOrder[0];
    let primaryGroup = index.groups[primaryGroupId];

    let primaryVariableId = primaryGroup.variableOrder[0];
    let primaryVariable = primaryGroup.variables[primaryVariableId];

    let primaryMetric = primaryVariable.variableName;

    let metric = {
      group: primaryGroupId,
      metric: primaryVariableId,
      display: {
        group: primaryGroup,
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
}
