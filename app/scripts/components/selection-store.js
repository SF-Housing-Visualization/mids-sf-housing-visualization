import Reflux from 'reflux';
import SelectionActions from './selection-actions';

var selectedGeographies = [ ];
var selectedMetrics = [ ];
var selectedTimeInterval = [ ];

export default Reflux.createStore({

  listenables: [ SelectionActions ],

  init: function() { },

  getInitialState: function() { 
    return { 
      selectedGeographies, // ES6 implicit :selectedGeographies
      selectedMetrics, // ES6 implicit :selectedMetrics
      selectedTimeInterval // ES6 implicit :selectedTimeInterval
    };
  },

  onGeographiesSelectionChange: 
    function onGeographiesSelectionChange(newValue) {
      selectedGeographies = newValue;
      this.trigger(selectedGeographies);
    },

  onMetricsSelectionChange:
    function onMetricsSelectionChange(newValue) {
      selectedMetrics = newValue;
      this.trigger(selectedMetrics);
    },

  onTimeIntervalSelectionChange:
    function onTimeIntervalSelectionChange(newValue) {
      selectedTimeInterval = newValue;
      this.trigger(selectedMetrics);
    }

});