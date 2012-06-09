// Marionette.Async
// ----------------

// Provides asynchronous rendering implementations
// for the various view types in Marionette
Backbone.Marionette.Async = (function(Backbone, Marionette, _, $){

  // Configure Marionette to use the async rendering for all view types
  var Async = {
    init: function(){
      Marionette.Renderer = Marionette.Async.Renderer;
      _.extend(Marionette.ItemView.prototype, Marionette.Async.ItemView);
      _.extend(Marionette.CollectionView.prototype, Marionette.Async.CollectionView);
      _.extend(Marionette.CompositeView.prototype, Marionette.Async.CompositeView);
    }
  };

// import "backbone.marionette.async.itemView.js"
// import "backbone.marionette.async.collectionview.js"
// import "backbone.marionette.async.compositeview.js"
// import "backbone.marionette.async.region.js"
// import "backbone.marionette.async.renderer.js"
// import "backbone.marionette.async.templatecache.js"

  return Async;
})(Backbone, Backbone.Marionette, _, window.jQuery || window.Zepto || window.ender);
