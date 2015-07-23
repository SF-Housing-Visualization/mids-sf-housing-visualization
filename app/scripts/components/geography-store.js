import Reflux from 'reflux';
import d3 from 'd3';
import GeographyLoadAction from './geography-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { };
    this.onGeographyLoad = this.onGeographyLoad.bind(this);
    this.onGeographyLoaded = this.onGeographyLoaded.bind(this);

    this.listenTo(GeographyLoadAction, 'onGeographyLoad');
    this.listenTo(GeographyLoadAction.completed, 'onGeographyLoaded');
  },

  onGeographyLoad: function onGeographyLoad(url) {
    // url: /mids-sf-housing-sandbox/data/prod/fpo/geographies.json
    d3.promise.json(url)
      .then(GeographyLoadAction.completed)
      .catch(GeographyLoadAction.failed);
  },

  onGeographyLoaded: function onGeographyLoaded(geographies) {
    this.state = geographies;
    this.trigger(geographies);
  }

});