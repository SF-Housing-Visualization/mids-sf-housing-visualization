import Reflux from 'reflux';
import d3 from 'd3';
import GeoMappingLoadAction from './geo-mapping-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { };
    this.onGeoMappingLoad = this.onGeoMappingLoad.bind(this);
    this.onGeoMappingLoaded = this.onGeoMappingLoaded.bind(this);

    this.listenTo(GeoMappingLoadAction.start, this.onGeoMappingLoad);
    this.listenTo(GeoMappingLoadAction.completed, this.onGeoMappingLoaded);
  },

  onGeoMappingLoad: function onGeoMappingLoad() {
    const url = '/mids-sf-housing-sandbox/data/prod/data_geos.csv';
    d3.promise.csv(url)
      .then(GeoMappingLoadAction.completed)
      .catch(GeoMappingLoadAction.failed);
  },

  onGeoMappingLoaded: function onGeoMappingLoaded(dataGeos) {
    let geoMapping = this.transform(dataGeos);
    this.state = geoMapping;
    this.trigger(geoMapping);
    console.log('GeoMappingStore onGeoMappingLoaded()', geoMapping);
  },

  transform: function transform(dataGeos) {
    let forward = { };
    let reverse = { };

    dataGeos.forEach( (mapping) => {
      let id = +( mapping.GeoID );
      let shortName = mapping.ShortName;
      forward[id] = mapping;
      reverse[shortName] = id;
    });

    return { forward, reverse };
  }

});