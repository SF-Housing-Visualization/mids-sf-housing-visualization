import Reflux from 'reflux';

import MetricSelectorActions from './metric-selector-actions';

export default Reflux.createStore({

  init: function() { 
    this.state = { expanded : false };
    this.onCollapse = this.onCollapse.bind(this);
    this.onExpand = this.onExpand.bind(this);

    this.listenTo(MetricSelectorActions.collapse, this.onCollapse);
    this.listenTo(MetricSelectorActions.expand, this.onExpand);
  },

  onCollapse: function onCollapse() {
    this.state.expanded = false;
    this.trigger(this.state);
  },

  onExpand: function onExpand() {
    this.state.expanded = true;
    this.trigger(this.state);
  }
});