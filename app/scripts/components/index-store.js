import Reflux from 'reflux';
import d3 from 'd3';
import IndexLoadAction from './index-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { };
    this.onIndexLoad = this.onIndexLoad.bind(this);
    this.onIndexLoaded = this.onIndexLoaded.bind(this);

    this.listenTo(IndexLoadAction.start, this.onIndexLoad);
    this.listenTo(IndexLoadAction.completed, this.onIndexLoaded);
  },

  onIndexLoad: function onIndexLoad(url) {
    // url: /mids-sf-housing-sandbox/data/prod/fpo/geographies.json
    console.log('loading index with url ', url);
    d3.promise.csv(url)
      .then(IndexLoadAction.completed)
      .catch(IndexLoadAction.failed);
  },

  onIndexLoaded: function onIndexLoaded(index) {
    this.state = index;
    this.trigger(index);
  }

});