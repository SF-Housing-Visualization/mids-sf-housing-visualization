import React from 'react';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import _ from 'underscore';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';
import GeographyStore from './geography-store';
import GeographyLoadAction from './geography-load-action';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [ ],
      layers: { },
      hover: [ ]
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

    this.onGeoMouseEnter = this.onGeoMouseEnter.bind(this);
    this.onGeoMouseExit = this.onGeoMouseExit.bind(this);
    this.onGeoClick = this.onGeoClick.bind(this);

    this.onGeographyStoreChange = this.onGeographyStoreChange.bind(this);

    this.onSelectionChange = this.onSelectionChange.bind(this);
    
    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.hover = this.hover.bind(this);
    this.unhover = this.unhover.bind(this);
    //this.setState = this.setState.bind(this);
  }

  render() {
    const position = [51.505, -0.09];
    const center = [37.7833, -122.4167];
    const zoom = 9;
    const minZoom = 0;
    const maxZoom = 18;
    const attribution = 
      'Map data &copy; '
      + '<a href="http://www.openstreetmap.org">'
      + 'OpenStreetMap contributors</a>';

    const url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

    const mapReactComponent = (
      <div className="map-application">
        <Map ref='map' className="map"
          minZoom={minZoom} maxZoom={maxZoom}
          center={center} zoom={zoom}>
          <TileLayer
            url={url}
            attribution={attribution}
          />
        </Map>
      </div>
    );

    //this.map = mapReactComponent;

    console.log('render() map', mapReactComponent);
    return mapReactComponent;
  }

  componentDidMount() {
    console.log('MapVisualization componentDidMount() SelectionStore', 
      SelectionStore, 'GeographyStore', GeographyStore);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);



    this.unsubscribeFromGeographyStore =
      GeographyStore.listen(this.onGeographyStoreChange);

    // load large static data
    const url = '/mids-sf-housing-sandbox/data/prod/ca-counties.json';
    GeographyLoadAction.start(url);
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromGeographyStore();
  }

  onGeographyStoreChange(geographies) {
    console.log('onGeographyStoreChange geographies: ', geographies,
      'this: ', this);

    let layers = { };

    let onGeoMouseEnter = this.onGeoMouseEnter;
    let onGeoMouseExit = this.onGeoMouseExit;
    let onGeoClick = this.onGeoClick;
    let getGeographyName = this.getGeographyName;

    function onEachGeoJsonFeature(feature, layer) {
      layer.on({
        click : onGeoClick,
        mouseover : onGeoMouseEnter,
        mouseout : onGeoMouseExit
      });

      let name = getGeographyName(layer);
      layers[name] = layer;
    }

    let leafletElement = this.refs.map.leafletElement;
    console.log('leafletElement ', leafletElement, 'style');

    L.geoJson(geographies, {
      style: this.geoStyles.baseline,
      onEachFeature: onEachGeoJsonFeature,
    }).addTo(leafletElement);

    this.setState({ layers }); // ES6 shorthand for : areas

  }


  onGeoMouseEnter(event) {
    console.log('entering area', event);
    let layer = event.target;
    let geography = this.getGeographyName(layer);

    let hover = this.state.hover.push(geography);
    this.setState({ hover }); // ES6 implicit : hover

    this.hover(geography);
  }

  onGeoMouseExit(event) {
    console.log('exiting area', event);
    let layer = event.target;
    let geography = this.getGeographyName(layer);

    let hover = _.without(this.state.hover, geography);
    this.setState({ hover }); // ES6 implicit : hover

    this.unhover(geography);
  }

  onGeoClick(event) {
    console.log('click in area', event);
    var layer = event.target;
    var geography = this.getGeographyName(layer);

    SelectionActions.geographiesSelectionChange([ geography ]);
  }

  onSelectionChange(newSelection) {
    console.log('MapVisualization onSelectionChange newSelection: ', 
      newSelection, 'this: ', this, 'this.setState', this.setState,
      '_.difference', _.difference);

    let selectedGeographies = newSelection.selectedGeographies;
    if (selectedGeographies) {
      selectedGeographies.forEach(this.select);
      let unselectedGeographies = _.difference(
        this.state.selected, selectedGeographies
      );
      console.log('unselectedGeographies', unselectedGeographies);
      unselectedGeographies.forEach(this.unselect);

      this.setState({ selected : selectedGeographies });
    }
  }

  select(geography) {
    let layer = this.state.layers[geography];
    let style = this.contains(this.state.hover, geography)
      ? this.geoStyles.hover
      : this.geoStyles.selected;
    layer.setStyle(style);
  }

  unselect(geography) {
    let layer = this.state.layers[geography];
    let style = this.contains(this.state.hover, geography)
      ? this.geoStyles.hover
      : this.geoStyles.baseline;
    layer.setStyle(style);
  }

  hover(geography) {
    let layer = this.state.layers[geography];
    // when entering an area, the hover style always wins
    let style = this.geoStyles.hover;
    layer.setStyle(style);
  }

  unhover(geography) {
    let layer = this.state.layers[geography];
    let style = this.contains(this.state.selected, geography)
      ? this.geoStyles.selected
      : this.geoStyles.baseline;
    layer.setStyle(style);
  }

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }

  getGeographyName(layer) {
    return layer.feature.properties['name'];
  }

}
