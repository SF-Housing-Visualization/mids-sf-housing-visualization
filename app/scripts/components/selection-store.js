import Reflux from 'reflux';
import _ from 'underscore';
import SelectionActions from './selection-actions';

import IndexStore from './index-store';
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
    this.onSelectionChange({ selectedGeographies });
  },

  onPrimaryMetricSelectionChange: function (selectedPrimaryMetric) {
     this.onSelectionChange({ selectedPrimaryMetric });
  },

  onSecondaryMetricsSelectionChange: function (selectedSecondaryMetrics) {
    this.onSelectionChange({ selectedSecondaryMetrics });
  },

  onTimePositionSelectionChange: function (selectedTimePosition) {
    this.onSelectionChange({ selectedTimePosition });
  },

  onTimeIntervalSelectionChange: function (selectedTimeInterval) { 
    this.onSelectionChange({ selectedTimeInterval });
  },

  onSelectionChange: function (changes) {
    this.state = _.extend(this.state, changes);
    // ugly workaround to missing Promise.all( m, i ).then( (m, i) => {})
    let indexPromise = IndexStore.getIndexPromise();

    indexPromise.then( (index) => {
      let selectedPrimaryMetric = this.state.selectedPrimaryMetric;
      if (selectedPrimaryMetric) {
        let metricPromise = MetricStore.getMetricPromise(selectedPrimaryMetric);
        metricPromise.then( (rows) => {

          let update = _.extend(this.state, { index, rows });
          
          console.log('SelectionStore onSelection() triggering', update);
          this.trigger(update);
          //this.trigger({ selectedPrimaryMetric, index, metric }); 

        });
      } else {
        let update = _.extend(this.state, { index });
        
        console.log('SelectionStore onSelection() triggering', update);
        this.trigger(update);
      }
    });
  }

});