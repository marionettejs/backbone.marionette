// View Swapper
// ------------
//
// Switch out views based on events that are triggered
// by the currently displayed view. Enables easy "edit in
// place" features, "loading" screens, and more.

Marionette.ViewSwapper = Marionette.View.extend({
  constructor: function(options){
    this._swapperViews = {};
    this._swapperBindings = new Marionette.EventBinder();
    this._currentViewBindings = new Marionette.EventBinder();

    Marionette.View.prototype.constructor.apply(this, arguments);

    this.views = Marionette.getOption(this, "views");
    this.swapOn = Marionette.getOption(this, "swapOn");
    this.initialView = Marionette.getOption(this, "initialView");

    this._setupViewEvents("swapper", this, this._swapperBindings);
  },

  // Render the current view. If no current view is set, it
  // will render the `initialView` that was configured.
  render: function(){
    var initialView;

    if (!this.currentView){
      initialView = Marionette.getOption(this, "initialView");
      this._swapView(initialView);
    }

    this.currentView.render();
    this.$el.append(this.currentView.$el);
    this.showView(this.currentView);
  },

  // Show a view that is being swapped in. Override this method to
  // set up your own custom fade in / show method
  showView: function(view){
    view.$el.show();
  },

  // Hide a view that is being swapped out. Override this method to
  // set up your own custom fade out / hide method
  hideView: function(view){
    view.$el.hide();
  },

  // Ensure the views that were configured for this view swapper get closed
  close: function(){
    _.each(this.views, function(view, name){
      view.close();
    });
    this._swapperViews = {};
    this._currentViewBindings.unbindAll();
    this._swapperBindings.unbindAll();
    Marionette.View.prototype.close.apply(this, arguments);
  },

  // Get a view by name, throwing an exception if the view instance
  // is not found.
  _getView: function(viewName){
    var originalView, error;
    var swapperView = this._swapperViews[viewName];

    if (viewName === "swapper"){
      error = new Error("Cannot display 'swapper' as a view.");
      error.name = "InvalidViewName";
      throw error;
    }

    if (!swapperView){
      originalView = this.views[viewName];

      if (!originalView){
        error = new Error("Cannot show view in ViewSwapper. View '" + viewName + "' not found.");
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
  _setupViewEvents: function(viewName, view, bindings){
    if (!this.swapOn || !this.swapOn[viewName]){ return; }
    var that = this;

    // default to current view bindings, unless otherwise specified
    if (!bindings){
      bindings = this._currentViewBindings;
    }

    // close the previous event bindings
    bindings.unbindAll();

    // set up the new view's event bindings
    _.each(this.swapOn[viewName], function(targetViewName, eventName){

      bindings.bindTo(view, eventName, function(){
        that._swapView(targetViewName);
        that.render();
      });

    });
  },

  // Do the swapping of the views to the new view, by name
  _swapView: function(viewName){
    if (this.currentView){
      this.hideView(this.currentView);
    }

    var view = this._getView(viewName);
    this._setupViewEvents(viewName, view);

    this.currentView = view;
  }
});
