import Reflux from 'reflux';
import d3 from 'd3';
import _ from 'underscore';
import MetricLoadAction from './metric-load-action';

export default Reflux.createStore({

  init: function() { 
    this.state = { };
    this.onMetricLoad = this.onMetricLoad.bind(this);
    this.onMetricLoaded = this.onMetricLoaded.bind(this);

    this.listenTo(MetricLoadAction, this.onMetricLoad);
    this.listenTo(MetricLoadAction.completed, this.onMetricLoaded);
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

    let columns = this.transpose(data);
    let rows = this.transform(data)

    this.state[group] = rows;

    let result = { group, metric, columns, rows };
    this.trigger(result);
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