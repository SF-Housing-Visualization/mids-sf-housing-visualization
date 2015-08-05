import Reflux from 'reflux';
import d3 from 'd3';
import GeoMappingLoadAction from './geo-mapping-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { 
      pending: [ ],
      resolved: null,
      rejected: null
    };
    this.onGeoMappingLoad = this.onGeoMappingLoad.bind(this);
    this.onGeoMappingLoaded = this.onGeoMappingLoaded.bind(this);

    this.listenTo(GeoMappingLoadAction, this.onGeoMappingLoad);
    this.listenTo(GeoMappingLoadAction.completed, this.onGeoMappingLoaded);
  },

  getInitialState: function getInitialState() {
    return this.resolved;
  },

  getGeoMappingPromise: function getGeoMappingPromise() {
    console.log('GeoMappingStore.getGeoMappingPromise()');
    return new Promise( (resolve, reject) => {
      let memoized = this.state.resolved;

      if (memoized) {
        resolve(memoized);
      } else {
        let deferred = { resolve, reject };
        this.state.pending.push(deferred);
        console.log('GeoMappingStore.getGeoMappingPromise() calling '
          + 'GeoMappingLoadAction',
          'this.state.pending', this.state.pending);
        GeoMappingLoadAction();
      }
    });
  },

  onGeoMappingLoad: function onGeoMappingLoad() {
    const url = '/mids-sf-housing-sandbox/data/prod/data_geos.csv';
    d3.promise.csv(url)
      .then(GeoMappingLoadAction.completed)
      .catch(GeoMappingLoadAction.failed);
  },

  onGeoMappingLoaded: function onGeoMappingLoaded(dataGeos) {
    let geoMapping = this.transform(dataGeos);
    this.state.resolved = geoMapping;
    this.trigger(geoMapping);
    console.log('GeoMappingStore onGeoMappingLoaded()', geoMapping);

    // notify promise holders
    this.state.pending.forEach( (deferred) => {
      deferred.resolve(geoMapping);
    });
  },

  transform: function transform(dataGeos) {
    let forward = { };
    let reverse = { };
    
    let filtered = _.filter(dataGeos, (mapping) => (mapping.Include == 1));
    filtered.forEach( (mapping) => {
      let id = +( mapping.GeoID );
      let shortName = mapping.ShortName;
      forward[id] = mapping;
      reverse[shortName] = id;
    });

    return { forward, reverse };
  }

});
