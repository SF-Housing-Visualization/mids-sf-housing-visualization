import Reflux from 'reflux';

console.log('reflux: ', Reflux);
export default Reflux.createActions([
  'geographySelectionChange',
  'metricSelectionChange',
  'timeSelectionChange'
]);