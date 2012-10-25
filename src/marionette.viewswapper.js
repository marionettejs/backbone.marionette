// View Swapper
// ------------
//
// Switch out views based on events that are triggered
// by the currently displayed view. Enables easy "edit in
// place" features, "loading" screens, and more.

Marionette.ViewSwapper = Marionette.View.extend({
  initialize: function(options){
    this.views = options.views;
    this._setupViewEvents();
  },

  // get the view to start with, by looking up the
  // view by the `initialView` name
  _getInitialView: function(){
    var viewName;

    viewName = this.initialView;

    return this._getView(viewName);
  },

  _getView: function(viewName){
    var view = this.views[viewName];

    if (!view){
      var error = Error("Cannot show view in ViewSwapper. View '" + viewName + "' not found.");
      error.name = "ViewNotFoundError";
      throw error;
    }

    return view;
  },

  _setupViewEvents: function(){
    var that = this;
    _.each(this.swapOn, function(config, viewName){
      var view = that.views[viewName];
      _.each(config, function(targetView, eventName){
        var swapFunc = that._swapView.bind(that, targetView);
        view.on(eventName, swapFunc);
      });
    });
  },

  _swapView: function(viewName){
    if (this.currentView){
      this.currentView.$el.hide();
    }

    var view = this.views[viewName];

    this.currentView = view;
    this.render();
  },

  render: function(){
    if (!this.currentView){
      this.currentView = this._getInitialView();
    }

    this.currentView.render();
    this.$el.append(this.currentView.el);
    this.currentView.$el.show();
  }
});
