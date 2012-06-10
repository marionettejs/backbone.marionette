// Async Region
// ------------

// Show a view that is rendered asynchronously, waiting for the view
// to be rendered before swaping it in.
Async.Region = {
  show: function(view){
    var that = this;

    this.ensureEl();
    this.close();

    // Wait for the view to finish rendering
    $.when(view.render()).then(function () {
      that.open(view);

      if (view.onShow) { view.onShow(); }
      view.trigger("show");

      if (that.onShow) { that.onShow(view); }
      that.trigger("view:show", view);
    });

    this.currentView = view;
  }
};
