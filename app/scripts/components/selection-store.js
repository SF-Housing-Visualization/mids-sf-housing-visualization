import Reflux from 'reflux';
import SelectionActions from './selection-actions';

export default Reflux.createStore({

  init: function() {
    this.state = {
      selectedGeographies: [ ],
      selectedMetrics: [ ],
      selectedTimeInterval: [ ]
    };

    this.listenTo(
      SelectionActions.geographiesSelectionChange,
      this.onGeographiesSelectionChange
    );

    this.listenTo(
      SelectionActions.metricsSelectionChange,
      this.onMetricsSelectionChange
    );

    this.listenTo(
      SelectionActions.timeIntervalSelectionChange,
      this.onTimeIntervalSelectionChange
    );

  },


  onGeographiesSelectionChange: function (selectedGeographies) {
    this.state.selectedGeographies = selectedGeographies;
    this.trigger({ selectedGeographies });
  },

  onMetricsSelectionChange: function (selectedMetrics) {
    this.state.selectedMetrics = selectedMetrics;
    this.trigger({ selectedMetrics });
  },

  onTimeIntervalSelectionChange: function (selectedTimeInterval) { 
    this.state.selectedTimeInterval = selectedTimeInterval;
    this.trigger({ selectedTimeInterval });
  }

});