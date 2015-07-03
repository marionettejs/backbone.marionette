// DOM Refresh
// -----------

// Monitor a view's state, and after it has been rendered and shown
// in the DOM, trigger a "dom:refresh" event every time it is
// re-rendered.

Marionette.MonitorDOMRefresh = function(view) {
  view._isDomRefreshMonitored = true;

  // track when the view has been shown in the DOM,
  // using a Marionette.Region (or by other means of triggering "show")
  function handleShow() {
    view._isShown = true;
    triggerDOMRefresh();
  }

  // track when the view has been rendered
  function handleRender() {
    view._isRendered = true;
    triggerDOMRefresh();
  }

  // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
  function triggerDOMRefresh() {
    if (view._isShown && view._isRendered && Marionette.isNodeAttached(view.el)) {
      Marionette.triggerMethodOn(view, 'dom:refresh', view);
    }
  }

  view.on({
    show: handleShow,
    render: handleRender
  });
};
