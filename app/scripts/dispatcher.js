(function (window, undefined) {
  var getState = function getState() { return window.state; }.bind(this);

  window.dispatcher = function dispatcher(selection) {
    var state = getState();
    console.log(selection, state);
  }.bind(this);

})(window);