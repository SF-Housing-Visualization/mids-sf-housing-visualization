import React from 'react';

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
  }

  render() {
    return (
      <div>
        <header className="group">
          <div className="appName">mids-sf-housing-visualization</div>
        </header>

        <div className="map-application">
          <div id="map" className="map"></div>
        </div>

        <div className="sidebar">
          <svg></svg>
        </div>

        <div className="time-series">
          <svg></svg>
        </div>
      </div>
    );
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
