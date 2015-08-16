import Reflux from 'reflux';
import SelectionStore from './selection-store';
import GeoMappingStore from './geo-mapping-store';

import IndexStore from './index-store';
import MetricStore from './metric-store';

export default Reflux.createStore({

  init() {
    this.state = { 
      geoMapping : null
    };

    this.listenTo(
      SelectionStore,
      this.onSelectionStore);

    this.listenTo(
      GeoMappingStore,
      this.onGeoMappingStore);

  },

  onSelectionStore(selection) {

    //let [selection, geoMapping] = updates;

    console.log('TimeSeriesStore onSelectionStore() updates', 
        'selection', selection);
    if (selection.selectedPrimaryMetric
      && selection.index
      && selection.rows) {


      GeoMappingStore.getGeoMappingPromise().then( (geoMapping) => {
        console.log('TimeSeriesStore onSelectionStore() reshaping', 
          selection, geoMapping);
        let lines = this.reshapeLines(selection, geoMapping);
        let update = _.extend(_.clone(selection), { lines });
        console.log('TimeSeriesStore onSelectionStore() triggering', update);
        this.trigger(update);
      });
      
    }
  },

  onGeoMappingStore(geoMapping) {
    console.log('TimeSeriesStore onGeoMappingStore()',
      'geoMapping', geoMapping);

    this.state.geoMapping = geoMapping;
  },

  reshapeLines(selection, geoMapping) {
    let selectedPrimaryMetric = selection.selectedPrimaryMetric;
    let selectedYear = selection.selectedTimePosition;
    let selectedGeographies = selection.selectedGeographies;
    let selectedMetric = selection.metric;
    let index = selection.index;
    //let data = selection.rows;

    let data = selection.rows;
    // Need to investigate why this is inconsistent
    let rows = (data.rows) ? data.rows : data;

    let reverseGeoMapping = geoMapping.reverse;
    let forwardGeoMapping = geoMapping.forward;

    let group = selectedPrimaryMetric.group;
    let metric = selectedPrimaryMetric.metric;
    let formatString = index.groups[group].variables[metric].formatString
    
    let key = group + ' > ' + metric;

    const baselineColor = '#4f99b4';
    const selectedColor = '#000000';

    let valuesByGeography = _.mapObject(reverseGeoMapping, () => {
      return { }
    });

    
    
    // implicitly keep only the last value for any geography/year
    rows.forEach((row) => {
      if (row && forwardGeoMapping[row.GeoID]) {
        let geography = forwardGeoMapping[row.GeoID].ShortName;
        let year = row.Year;
        valuesByGeography[geography][year] = row[metric];
      } else {
        //console.log('TimeSeriesVisualization.reshapeMetric() ignored bad data',
        //  row);
      }
    });

    let geographies = _.sortBy(_.keys(valuesByGeography), (geography) => {
      return this.contains(selectedGeographies, geography) ? 1 : 0;
    });

    let lines = _.map(geographies, (geography, series) => {
      let color = 
        this.contains(selectedGeographies, geography)
        ? selectedColor
        : baselineColor;

      let key = geography;
      let years = valuesByGeography[geography];
      let values = _.map(_.sortBy(_.keys(years)), (year) => {
        let x = year;
        let y = years[year];
        return {color, series, x, y}
      });
      //let values = [ { color, series: index, x: year, y} ]
      
      return { color, key, values, formatString};
    });


    console.log('TimeSeriesStore.reshapeLines()', 
      selectedGeographies, geoMapping, key, 
       valuesByGeography, lines);

    return lines;
  },

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
});