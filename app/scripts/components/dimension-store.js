import Reflux from 'reflux';

import DimensionActions from './dimension-actions';

export default Reflux.createStore({

  init: function() { 
    this.state = { width: 0, height: 0 };

    this.onResize = this.onResize.bind(this);
    this.onResizeVisualizationHeader =
      this.onResizeVisualizationHeader.bind(this);

    this.listenTo(DimensionActions.resize, this.onResize);
    this.listenTo(DimensionActions.resizeVisualizationHeader,
      this.onResizeVisualizationHeader);
  },

  onResize: function onResize(newSize) {
    this.updateState(newSize);

    this.trigger(this.state);
  },

  onResizeVisualizationHeader: function onResizeVisualizationHeader(newSize) {
    this.updateState(newSize);

    console.log('DimensionStore onResizeVisualizationHeader state', 
      this.state, newSize);
    this.trigger(this.state);


  },

  updateState: function updateState(updates) {
    for (var key in updates) {
      this.state[key] = updates[key];
    }
  }
});