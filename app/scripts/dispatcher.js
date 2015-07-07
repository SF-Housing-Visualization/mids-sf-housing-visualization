(function (window, undefined) {
  var getState = function getState() { return window.state; }.bind(this);

  var dispatcher = window.dispatcher = window.dispatcher || { };

  var handlers = dispatcher.handlers = dispatcher.handlers || [ ];

  dispatcher.dispatch = function dispatch(selection) {
    var state = getState();
    console.log('dispatching event', selection, state);
    for (handler in handlers) {
      var target = handlers[handler];
      console.log('calling handler', target, selection, state);
      target(selection, state);
    }
    
    return true;
  }.bind(this);

  dispatcher.register = function register(handler) {
    handlers.push(handler);
  }.bind(this);

})(window);