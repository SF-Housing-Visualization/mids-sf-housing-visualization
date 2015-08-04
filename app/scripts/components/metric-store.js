import Reflux from 'reflux';
import d3 from 'd3';
import _ from 'underscore';
import MetricLoadAction from './metric-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { 
      pending: { },
      resolved: { },
      rejected: { }
    };
    this.onMetricLoad = this.onMetricLoad.bind(this);
    this.onMetricLoaded = this.onMetricLoaded.bind(this);

    this.listenTo(MetricLoadAction, this.onMetricLoad);
    this.listenTo(MetricLoadAction.completed, this.onMetricLoaded);
  },

  getMetricPromise: function getMetricPromise(metricSpecification) {
    console.log('MetricStore.getMetricPromise()', metricSpecification);
    return new Promise( (resolve, reject) => {
      let group = metricSpecification.group;

      let memoized = this.state.resolved[group];
      if (memoized) {
        resolve(memoized);
      } else {
        let deferred = { resolve, reject };
        let pending = this.state.pending[group] || [ ];
        if (pending.length == 0) {
          this.state.pending[group] = pending;
        }

        pending.push(deferred);

        console.log('MetricStore.getMetricPromise() calling MetricLoadAction',
          'this.state.pending', this.state.pending,
          'metricSpecification', metricSpecification);
        MetricLoadAction(metricSpecification);
      }
    });
  },

  onMetricLoad: function onMetricLoad(metricSpecification) {
    let group = metricSpecification.group;
    let metric = metricSpecification.metric;
    let url = '/mids-sf-housing-sandbox/data/prod/values/' + group + '.csv';
    // url: /mids-sf-housing-sandbox/data/prod/fpo/geographies.json
    console.log('MetricStore onMetricLoad() loading metrics ', url);
    d3.promise.csv(url)
      .then((data) => MetricLoadAction.completed({
        group, metric, data
      }))
      .catch(MetricLoadAction.failed);
  },

  onMetricLoaded: function onMetricLoaded(groupMetrics) {
    let group = groupMetrics.group;
    let metric = groupMetrics.metric;
    let data = groupMetrics.data;
    let promise = groupMetrics.promise;

    let columns = this.transpose(data);
    let rows = this.transform(data)

    this.state.resolved[group] = rows;

    let result = { group, metric, columns, rows };
    this.trigger(result);

    // notify promise holders
    let pending = this.state.pending[group];

    if (pending) {
      pending.forEach( (deferred) => {
        deferred.resolve(result);
      });

      delete this.state.pending[group];
    }

    console.log('MetricStore onMetricLoaded', result)
  },

  transpose: function transpose(data) {
    let columns = { };
    data.forEach( (row, index) => {
      for (var column in row) {
        if (! (column in columns) ) {
          columns[column] = [ ];
        }

        let value =
          (column === 'Date')
          ? new Date(Date.parse(row[column])).getUTCFullYear()
          : +( row[column] );
          
        columns[column][index] = value;
      }
    });

    return columns;
  },

  transform: function transform(data) {
    return data.map( (row, index) => {
      let transformedRow = _.mapObject(row, (value, column) => {
        return (column === 'Date')
            ? new Date(Date.parse(value))
            : +( value )
      });

      transformedRow.Year = transformedRow.Date.getUTCFullYear();
      return transformedRow;
    });
  }
});