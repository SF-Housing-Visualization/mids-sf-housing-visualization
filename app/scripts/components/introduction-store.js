import Reflux from 'reflux';

import IntroductionActions from './introduction-actions';

export default Reflux.createStore({

  init: function() { 
    this.state = { expanded : false };
    this.onCollapse = this.onCollapse.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onVisualize = this.onVisualize.bind(this);

    this.listenTo(IntroductionActions.collapse, this.onCollapse);
    this.listenTo(IntroductionActions.expand, this.onExpand);
    this.listenTo(IntroductionActions.visualize, this.onVisualize);
  },

  onCollapse: function onCollapse() {
    this.state.expanded = false;
    this.trigger(this.state);
  },

  onExpand: function onExpand() {
    this.state.expanded = true;
    this.trigger(this.state);
  },

  onVisualize: function onVisualize() {
    this.trigger({ visualize: true });
  }
});