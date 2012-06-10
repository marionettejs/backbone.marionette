// Marionette.Async
// ----------------

// Provides asynchronous rendering implementations
// for the various view types in Marionette
Backbone.Marionette.Async = (function(Backbone, Marionette, _, $){

  // Configure Marionette to use the async rendering for all view types
  var Async = {
    init: function(){
      Marionette.TemplateCache = Async.TemplateCache;
      Marionette.Renderer = Async.Renderer;
      _.extend(Marionette.ItemView.prototype, Async.ItemView);
      _.extend(Marionette.CollectionView.prototype, Async.CollectionView);
      _.extend(Marionette.CompositeView.prototype, Async.CompositeView);
      _.extend(Marionette.Region.prototype, Async.Region);
    }
  };

// import "backbone.marionette.async.itemView.js"
// import "backbone.marionette.async.collectionview.js"
// import "backbone.marionette.async.compositeview.js"
// import "backbone.marionette.async.region.js"
// import "backbone.marionette.async.renderer.js"
// import "backbone.marionette.async.templatecache.js"
// import "backbone.marionette.async.helpers.js"
// import "async.init.js"
  
  return Async;
})(Backbone, Backbone.Marionette, _, window.jQuery || window.Zepto || window.ender);
