import Reflux from 'reflux';
import d3 from 'd3';
import MetricLoadAction from './metric-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { };
    this.onMetricLoad = this.onMetricLoad.bind(this);
    this.onMetricLoaded = this.onMetricLoaded.bind(this);

    this.listenTo(MetricLoadAction.start, this.onMetricLoad);
    this.listenTo(MetricLoadAction.completed, this.onMetricLoaded);
  },

  onMetricLoad: function onMetricLoad(url) {
    // url: /mids-sf-housing-sandbox/data/prod/fpo/geographies.json
    console.log('loading index with url ', url);
    d3.promise.csv(url)
      .then(MetricLoadAction.completed)
      .catch(MetricLoadAction.failed);
  },

  onMetricLoaded: function onMetricLoaded(index) {
    let shapedIndex = index;
    this.state = shapedIndex;
    this.trigger(shapedIndex);
  }
}