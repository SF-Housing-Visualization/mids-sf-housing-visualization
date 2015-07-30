import React from 'react';
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
    this.state = { 
      selectedPrimaryMetric: null
    };

    this.onIndexLoaded = this.onIndexLoaded.bind(this);
    this.onGeoMappingLoaded = this.onGeoMappingLoaded.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  render() {
    return (
      <div className="root-container">

        <header className="group">
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

    const indexUrl = '/mids-sf-housing-sandbox/data/prod/data_variables.csv';

    console.log('Home componentDidMount, indexUrl', indexUrl);
    GeoMappingLoadAction.start();
    

  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromIndexStore();
    this.unsubscribeFromGeoMappingStore();
  }

  onGeoMappingLoaded(geoMapping) {
    console.log('Home onGeoMappingLoaded() ', geoMapping);

    const indexUrl = '/mids-sf-housing-sandbox/data/prod/data_variables.csv';
    IndexLoadAction.start(indexUrl);
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


    MetricLoadAction.start(metric);
    console.log('Home onIndexLoaded() called MetricLoadAction.start', metric);
    SelectionActions.primaryMetricSelectionChange(metric);

    //this.setState({ primaryMetric }); // ES6 implicit :primaryMetric
  }

  onSelectionChange(newSelection) {
    this.setState(newSelection);
    console.log('onSelectionChange this.state: ', this.state);
  }
}
