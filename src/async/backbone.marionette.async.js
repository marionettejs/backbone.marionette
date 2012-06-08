// Marionette.Async
// ----------------

// Provides asynchronous rendering implementations
// for the various view types in Marionette
Backbone.Marionette.Async = {

  // Configure Marionette to use the async rendering
  // for all view types
  init: function(){
    Backbone.Marionette.Renderer = Backbone.Marionette.Async.Renderer;
    _.extend(Backbone.Marionette.ItemView.prototype, Backbone.Marionette.Async.ItemView);
    _.extend(Backbone.Marionette.CollectionView.prototype, Backbone.Marionette.Async.CollectionView);
    _.extend(Backbone.Marionette.CompositeView.prototype, Backbone.Marionette.Async.CompositeView);
  }
};

// import "backbone.marionette.async.itemView.js
// import "backbone.marionette.async.collectionview.js
// import "backbone.marionette.async.compositeview.js
// import "backbone.marionette.async.renderer.js
// import "backbone.marionette.async.templatecache.js
