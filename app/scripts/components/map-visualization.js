import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';
import GeographyStore from './geography-store';

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

    this.geoStyles = {
      baseline: {
        fillColor: "#E3E3E3",
        weight: 1,
        opacity: 0.4,
        color: 'gray',
        fillOpacity: 0.3
      },
      hover: {
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      },
      selected: {
        weight: 4,
        color: '#333',
        dashArray: '',
        fillOpacity: 0.9
      }
    };

    this.onGeoClick = this.onGeoClick.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.setState = this.setState.bind(this);
  }

  render() {
    const position = [51.505, -0.09];
    const center = [52.5377, 13.3958];
    const zoom = 4;
    const minZoom = 0;
    const maxZoom = 18;
    const attribution = 
      'Map data &copy; '
      + '<a href="http://www.openstreetmap.org">'
      + 'OpenStreetMap contributors</a>';

    const url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

    return (
      <div className="map-application">
        <Map className="map"
          minZoom={minZoom} maxZoom={maxZoom}
          center={center} zoom={zoom}>
          <TileLayer
            url={url}
            attribution={attribution}
          />
        </Map>
      </div>
    );
  }

  onGeoMouseEnter(event) {
    console.log('entering area', event);
    var layer = event.target;
    layer.setStyle(this.geoStyles.hover);
  }

  onGeoMouseExit(event) {
    console.log('exiting area', event);
    var layer = event.target;
    layer.setStyle(this.geoStyles.baseline);
  }

  onGeoClick(event) {
    console.log('click in area', event);
    var layer = event.target;
    var name = layer.feature.properties['NAME'];

    var geography = { label : name };

    SelectionActions.geographiesSelectionChange([ geography ]);
  }

  onSelectionChange(newSelection) {
    console.log('onSelectionChange newSelection: ', newSelection, 
      'this: ', this, 'this.setState', this.setState);
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
