// View Swapper
// ------------
//
// Switch out views based on events that are triggered
// by the currently displayed view. Enables easy "edit in
// place" features, "loading" screens, and more.

Marionette.ViewSwapper = Marionette.View.extend({
  constructor: function(options){
    this.views = options.views;
    this._swapperViews = {};
    this._setupViewEvents();
    Marionette.View.prototype.constructor.apply(this, arguments);
  },

  // Render the current view. If no current view is set, it
  // will render the `initialView` that was configured.
  render: function(){
    if (!this.currentView){
      this.currentView = this._getInitialView();
    }

    this.currentView.render();
    this.$el.append(this.currentView.el);
    this.currentView.$el.show();
  },

  close: function(){
    _.each(this.views, function(view, name){
      view.close();
    });
    this._swapperViews = {};
    Marionette.View.prototype.close.apply(this, arguments);
  },

  // get the view to start with, by looking up the
  // view by the `initialView` name
  _getInitialView: function(){
    var viewName;

    viewName = this.initialView;

    return this._getView(viewName);
  },

  // Get a view by name, throwing an exception if the view instance
  // is not found.
  _getView: function(viewName){
    var originalView;
    var swapperView = this._swapperViews[viewName];

    if (!swapperView){
      originalView = this.views[viewName];

      if (!originalView){
        var error = Error("Cannot show view in ViewSwapper. View '" + viewName + "' not found.");
        error.name = "ViewNotFoundError";
        throw error;
      }

      swapperView = this._buildSwapperView(originalView);
      this._swapperViews[viewName] = swapperView;
    }

    return swapperView;
  },

  // Decorate the configured view with information that the view swapper
  // needs, to keep track of the view's current state.
  _buildSwapperView: function(originalView){
    var swapperView = Marionette.createObject(originalView);
    _.extend(swapperView, {
      
      // Prevent the underlying view from being rendered more than once
      render: function(){
        if (this._hasBeenRendered){
          return this;
        } else {
          this._hasBeenRendered = true;
          return originalView.render.apply(originalView, arguments);
        }
      }

    });

    return swapperView;
  },

  // Set up the event handlers for the individual views, so that the
  // swapping can happen when a view event is triggered
  _setupViewEvents: function(){
    var that = this;
    _.each(this.swapOn, function(config, viewName){
      var view = that.views[viewName];
      _.each(config, function(targetView, eventName){
        var swapFunc = _.bind(that._swapView, that, targetView);
        view.on(eventName, swapFunc);
      });
    });
  },

  // Do the swapping of the views to the new view, by name
  _swapView: function(viewName){
    if (this.currentView){
      this.currentView.$el.hide();
    }

    var view = this._getView(viewName);

    this.currentView = view;
    this.render();
  }
});
