import React from 'react';
import MapVisualization from './map-visualization';
import SidebarVisualization from './sidebar-visualization';
import TimeSeriesVisualization from './time-series-visualization';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';
import GeographyLoadAction from './geography-load-action';

console.log('SelectionActions: ', SelectionActions);
console.log('SelectionStore: ', SelectionStore);

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        'Browserify',
        'Babel',
        'Bootstrap',
        'Modernizr',
        'Jest'
      ]
    };

    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  render() {
    return (
      <div className="root-container">

        <header className="group">
          <div className="appName">mids-sf-housing-visualization</div>
        </header>

        <div className="map-application">
          <MapVisualization />
        </div>

        <SidebarVisualization />

        <TimeSeriesVisualization />

      </div>
    );
  }

  componentDidMount() {
    //const url = '/mids-sf-housing-sandbox/data/prod/fpo/geographies.json'
    //this.unsubscribe = SelectionStore.listen(this.onSelectionChange);

    // load large static data
    //GeographyLoadAction(url);
  }

  componentWillUnmount() {
    //this.unsubscribe();
  }

  onSelectionChange(newSelection) {
    this.setState({ selection: newSelection });
    console.log('onSelectionChange this.state: ', this.state);
  }

  oldRender() {
    return (
      <div className="hero-unit">
        <h1>'Allo, 'Allo!</h1>
        <p>This is a React component.<br/>
           You now also have:</p>
        <ul>{this.state.items.map(this.renderItem)}</ul>
      </div>
    );
  }

  renderItem(item, index) {
    return <li key={index}>{item}</li>;
  }
}
