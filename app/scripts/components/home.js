import React from 'react';
import MapVisualization from './map-visualization';
import SidebarVisualization from './sidebar-visualization';
import TimeSeriesVisualization from './time-series-visualization';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';
import GeographyLoadAction from './geography-load-action';

import IndexLoadAction from './index-load-action';
import IndexStore from './index-store';

import MetricLoadAction from './metric-load-action';



export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };

    this.onIndexLoaded = this.onIndexLoaded.bind(this);
  }

  render() {
    return (
      <div className="root-container">

        <header className="group">
          <div className="appName">mids-sf-housing-visualization</div>
        </header>


        <SidebarVisualization />
        
        <div className="map-application">
          <MapVisualization />
        </div>


        <TimeSeriesVisualization />

      </div>
    );
  }

  componentDidMount() {
    this.unsubscribeFromIndexStore = IndexStore.listen(this.onIndexLoaded);

    const indexUrl = '/mids-sf-housing-sandbox/data/prod/data_variables.csv';

    console.log('Home componentDidMount, indexUrl', indexUrl);

    IndexLoadAction.start(indexUrl);
    //const url = '/mids-sf-housing-sandbox/data/prod/fpo/geographies.json'
    //this.unsubscribe = SelectionStore.listen(this.onSelectionChange);

    // load large static data
    //GeographyLoadAction(url);
  }

  componentWillUnmount() {
    //this.unsubscribe();
    this.unsubscribeFromIndexStore();
  }

  onIndexLoaded(index) {
    console.log('Home onIndexLoaded ', index);
  }

  onSelectionChange(newSelection) {
    this.setState({ selection: newSelection });
    console.log('onSelectionChange this.state: ', this.state);
  }
}
