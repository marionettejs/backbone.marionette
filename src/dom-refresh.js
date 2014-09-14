// DOM Refresh
// -----------

// Monitor a view's state, and after it has been rendered and shown
// in the DOM, trigger a "dom:refresh" event every time it is
// re-rendered.

Marionette.MonitorDOMRefresh = (function(documentElement) {
  // track when the view has been shown in the DOM,
  // using a Marionette.Region (or by other means of triggering "show")
  function handleShow(view) {
    view._isShown = true;
    triggerDOMRefresh(view);
  }

  // track when the view has been rendered
  function handleRender(view) {
    view._isRendered = true;
    triggerDOMRefresh(view);
  }

  // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
  function triggerDOMRefresh(view) {
    if (view._isShown && view._isRendered && isInDOM(view)) {
      if (_.isFunction(view.triggerMethod)) {
        view.triggerMethod('dom:refresh');
      }
    }
  }

  function isInDOM(view) {
    return Backbone.$.contains(documentElement, view.el);
  }

  // Export public API
  return function(view) {
    view.listenTo(view, 'show', function() {
      handleShow(view);
    });

    view.listenTo(view, 'render', function() {
      handleRender(view);
    });
  };
})(document.documentElement);
