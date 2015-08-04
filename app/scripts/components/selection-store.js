import Reflux from 'reflux';
import SelectionActions from './selection-actions';

import MetricStore from './metric-store';

export default Reflux.createStore({

  init: function() {
    this.state = {
      selectedGeographies: [ ],
      selectedPrimaryMetric: null,
      selectedSecondaryMetrics: [ ],
      selectedTimePosition: null,
      selectedTimeInterval: [ ]
    };

    this.listenTo(
      SelectionActions.geographiesSelectionChange,
      this.onGeographiesSelectionChange
    );

    this.listenTo(
      SelectionActions.primaryMetricSelectionChange,
      this.onPrimaryMetricSelectionChange
    );

    this.listenTo(
      SelectionActions.secondaryMetricsSelectionChange,
      this.onSecondaryMetricsSelectionChange
    );

    this.listenTo(
      SelectionActions.timePositionSelectionChange,
      this.onTimePositionSelectionChange
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

  onPrimaryMetricSelectionChange: function (selectedPrimaryMetric) {
    MetricStore
      .getMetricPromise(selectedPrimaryMetric)
      .then( (data) => {
        console.log('SelectionStore onPrimaryMetricSelectionChange()', 
          'resolved promise from MetricStore', data);
        this.state.selectedPrimaryMetric = selectedPrimaryMetric;
        this.trigger({ selectedPrimaryMetric }); // implicit :selectedPrimaryMetric

      });

  },

  onSecondaryMetricsSelectionChange: function (selectedSecondaryMetrics) {
    this.state.selectedSecondaryMetrics = selectedSecondaryMetrics;
    this.trigger({ selectedSecondaryMetrics });
  },

  onTimePositionSelectionChange: function (selectedTimePosition) { 
    this.state.selectedTimePosition = selectedTimePosition;
    this.trigger({ selectedTimePosition });
  },

  onTimeIntervalSelectionChange: function (selectedTimeInterval) { 
    this.state.selectedTimeInterval = selectedTimeInterval;
    this.trigger({ selectedTimeInterval });
  }

});