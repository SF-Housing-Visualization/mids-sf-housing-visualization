import Reflux from 'reflux';

export default Reflux.createAction({
  asyncResult: true,
  children: [ 'start' ]
});