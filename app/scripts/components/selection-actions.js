import Reflux from 'reflux';

console.log('reflux: ', Reflux);
export default Reflux.createActions([
  'geographiesSelectionChange',
  'primaryMetricSelectionChange',
  'secondaryMetricsSelectionChange',
  'timePositionSelectionChange',
  'timeIntervalSelectionChange'
]);