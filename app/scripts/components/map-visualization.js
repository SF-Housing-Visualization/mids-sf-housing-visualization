import React from 'react';
import d3 from 'd3';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import _ from 'underscore';
import SelectionActions from './selection-actions';
import SelectionStore from './selection-store';
import GeographyStore from './geography-store';
import GeographyLoadAction from './geography-load-action';
import SidebarStore from './sidebar-store';

import DimensionStore from './dimension-store';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [ ],
      layers: { },
      hover: [ ],
      heatmapData: { },
      colorDomain: [0, 1],
      colorRange: ["white", "#4F99B4"]
    };

    this.geoStyles = {
      baseline: {
        //fillColor: "#E3E3E3",
        weight: 1,
        opacity: 0.4,
        color: 'white',
        fillOpacity: 0.6
      },
      hover: {
        weight: 2,
        color: '#F7ED38',
        dashArray: '',
        opacity: 0.7
      },
      selected: {
        weight: 4,
        color: '#F7ED38',
        dashArray: '',
        opacity: 0.9
      }
    };


    this.onGeoMouseEnter = this.onGeoMouseEnter.bind(this);
    this.onGeoMouseExit = this.onGeoMouseExit.bind(this);
    this.onGeoClick = this.onGeoClick.bind(this);

    this.onGeographyStoreChange = this.onGeographyStoreChange.bind(this);
    this.onSidebarStore = this.onSidebarStore.bind(this);

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onDimensionChange = this.onDimensionChange.bind(this);

    //this.onGeoMappingChange = this.onGeoMappingChange.bind(this);
    
    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.hover = this.hover.bind(this);
    this.unhover = this.unhover.bind(this);
    this.reheat = this.reheat.bind(this)
    this.value2color = this.value2color.bind(this)
    //this.setState = this.setState.bind(this);
  }

  render() {
    let componentHeight = this.state.componentHeight;
    let style = componentHeight ? { height: componentHeight } : { };

    const position = [51.505, -0.09];
    const center = [37.7833, -122.4167];
    const zoom = 9;
    const minZoom = 0;
    const maxZoom = 18;
    const attribution = 
      'Map data &copy; '
      + '<a style="color: grey" href="http://www.openstreetmap.org">'
      + 'OpenStreetMap contributors</a>';

    const url = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';

    const mapReactComponent = (
      <div className='map-application' style={ style }>
        <Map ref='map' className='map'
          center={center} 
          zoom={ zoom } zoomControl={ true }
          minZoom={ minZoom } maxZoom={ maxZoom }
          dragging={ true } touchZoom={ false } 
          scrollWheelZoom={ false } doubleClickZoom={ false }>
          <TileLayer
            url={url}
            attribution={attribution}
          />
        </Map>
      </div>
    );
    return mapReactComponent;
  }

  componentDidMount() {
    this.unsubscribeFromDimensionStore =
      DimensionStore.listen(this.onDimensionChange);
    this.unsubscribeFromSelectionStore =
      SelectionStore.listen(this.onSelectionChange);
    this.unsubscribeFromGeographyStore =
      GeographyStore.listen(this.onGeographyStoreChange);
    this.unsubscribeFromSidebarStore =
      SidebarStore.listen(this.onSidebarStore);

    let leaflet = this.refs.map.getLeafletElement();
    console.log('MapVisualization.componentDidMount()', leaflet);

    leaflet.attributionControl.options = { 
      position: 'bottomleft',
      prefix: false
    };
    

    // load large static data
    const url = '/mids-sf-housing-sandbox/data/prod/ca-counties.json';
    GeographyLoadAction.start(url);
  }

  componentWillUnmount() {
    this.unsubscribeFromSelectionStore();
    this.unsubscribeFromGeographyStore();
    this.unsubscribeFromDimensionStore();
    this.unsubscribeFromSidebarStore();
  }

  onDimensionChange(newDimension) {
    console.log('MapVisualization onDimensionChange()', newDimension);
    let windowHeight = newDimension.windowHeight;
    let visualizationHeaderHeight = newDimension.visualizationHeaderHeight;

    if (windowHeight && visualizationHeaderHeight) {
      let componentHeight = 0.40 * (windowHeight - visualizationHeaderHeight);
      this.setState({ componentHeight });
    }
    
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

  onSidebarStore(barChart) {
    console.log('MapVisualization onSidebarStore()', barChart);

    let primaryMetric = barChart.bars[0];
    let values = primaryMetric.values;
    let heatmapData = _.object(
      _.pluck(values, 'label'), _.pluck(values, 'color')
    );
    this.setState({ heatmapData });
    console.log('MapVisualization onSidebarStore() heatmapData', 
      this.state.heatmapData);
    this.reheat();
  }

  reheat(){
    let geos = _.keys(this.state.layers);
    let heatmapData = this.state.heatmapData;
    //let valueMax = _.max(_.values(heatmapData))
    //let valueMin = _.min(_.values(heatmapData))
    //let colorDomain = [valueMin, valueMax]
    //this.setState({ colorDomain })
    //_.each(geos, function(geo){
    geos.forEach((geo) => {
      let layer = this.state.layers[geo]

      //console.log('MapVisualization value2color geo:', geo, ', value:', heatmapData[geo])

      layer.setStyle({fillColor: 
        //this.value2color(heatmapData[geo])
        heatmapData[geo]
      })
    })
  }

  value2color(value) { // TODO (jab): remove dead code after review with rb
    let colorMap = d3.scale.linear().domain(this.state.colorDomain).range(this.state.colorRange)

    return colorMap(value)
    /*
    if(value > 0.25){
      return '#4F99B4'
    }else if(value <= 0.25){
      return '#FF6666'
    }else{
      return "#E3E3E3"
    }
    */
  }
}
