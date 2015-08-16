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

    console.log('SidebarStore onSelectionStore() updates', 
        'selection', selection);
    if (selection.selectedPrimaryMetric
      && selection.index
      && selection.rows) {


      GeoMappingStore.getGeoMappingPromise().then( (geoMapping) => {
        console.log('SidebarStore onSelectionStore() reshaping', 
          selection, geoMapping);
        let bars = this.reshapeBars(selection, geoMapping);
        let update = _.extend(_.clone(selection), { bars });
        console.log('SidebarStore onSelectionStore() triggering', update);
        this.trigger(update);
      });
      
    }
  },

  onGeoMappingStore(geoMapping) {
    console.log('SidebarStore onGeoMappingStore()',
      'geoMapping', geoMapping);

    this.state.geoMapping = geoMapping;
  },

  reshapeBars(selection, geoMapping) {
    let selectedPrimaryMetric = selection.selectedPrimaryMetric;
    let selectedYear = selection.selectedTimePosition;
    let selectedGeographies = selection.selectedGeographies;
    let selectedMetric = selection.metric;
    let index = selection.index;
    let year = selection.selectedTimePosition;
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

    const color = '#4f99b4';

    let geography = selectedGeographies[0];

    let applicable = _.filter(rows, (row) => 
      row.Year === year
    );

    let valueByGeography = { };

    // implicitly keep only the last value for any geography/year
    applicable.forEach((row) => {
      if (row && forwardGeoMapping[row.GeoID]) {
        let geography = forwardGeoMapping[row.GeoID].ShortName
        valueByGeography[geography] = row[metric];
      } else {
        //console.log('SidebarVisualization.reshapeMetric() ignored bad data',
        //  row);
      }
    });

    let values = _.map(_.keys(valueByGeography), (geography) => {
      let label = geography;
      let series = 0;
      let value = valueByGeography[geography];
      return { color, key, label, series, value};
    });

    console.log('SidebarStore.reshapeBars', year, geography, geoMapping, color, key, 
       applicable, valueByGeography, values);

    return [{ color, key, values, formatString}];

  },

  contains(array, item) {
    return (_.indexOf(array, item) > -1);
  }
});