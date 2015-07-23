import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

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
    const position = [51.505, -0.09];
    const center = [52.5377, 13.3958];
    const zoom = 4;
    const minZoom = 0;
    const maxZoom = 18;
    return (
      <div className="map-application">
        <Map className="map"
          minZoom={minZoom} maxZoom={maxZoom}
          center={center} zoom={zoom}>
          <TileLayer
            url='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
            attribution='Map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
          />
        </Map>
      </div>
    );
  }

  kloogeRender() {
    const position = [51.505, -0.09];
    const center = [52.5377, 13.3958];
    const zoom = 4;
    const minZoom = 0;
    const maxZoom = 18;
    const mapClassName = "map-application";
    return (
      <div className="map-application">
        <div className="map" ref="leafletContainer">
        </div>
      </div>
    );
  }

  kloodgeComponentDidMount() {
    let leafletContainer = 
      React.findDOMNode(this.refs.leafletContainer);
    console.log(leafletContainer);
    /* create leaflet map */
    var map = L.map(leafletContainer, {
      center: [52.5377, 13.3958],
      zoom: 4
    });

    /* add default stamen tile layer */
    new L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 18,
      attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
    }).addTo(map);
  }



}
