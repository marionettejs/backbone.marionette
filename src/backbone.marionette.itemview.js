// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView = (function(Mariontte, _){

  // **ItemView**
  var ItemView = Marionette.View.extend({
    constructor: function(){
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.initialEvents();
    },

    // Configured the initial events that the item view 
    // binds to. Override this method to prevent the initial
    // events, or to add your own initial events.
    initialEvents: function(){
      if (this.collection){
        this.bindTo(this.collection, "reset", this.render, this);
      }
    },

    // Render the view, defaulting to underscore.js templates.
    // You can override this in your view definition.
    render: function(){
      var renderer = new ItemViewRendering(this);
      return renderer.render();
    },

    // Render the data for this item view in to some HTML.
    // Override this method to replace the specific way in
    // which an item view has it's data rendered in to html.
    renderHtml: function(data) {
      var template = this.getTemplate();
      return Marionette.Renderer.render(template, data);
    },

    // Override the default close event to add a few
    // more events that are triggered.
    close: function(){
      this.trigger('item:before:close');
      Marionette.View.prototype.close.apply(this, arguments);
      this.trigger('item:closed');
    }
  });

  // **ItemViewRendering**
  // Object to manage rendering itemView. Extracted to reduce the
  // overhead and memory usage of anonymous / callback functions.
  var ItemViewRendering = function(view){
      this.view = view;
      _.bindAll(this);
  };

  _.extend(ItemViewRendering.prototype, {

    // Run the rendering process, call `beforeRender` on the view
    render: function(){
      this.deferredRender = $.Deferred();
      callDeferredMethod(this.view.beforeRender, this.beforeRenderDone, this.view);
      return this.deferredRender;
    },

    // Called after the `beforeRender` method has been run. Triggers
    // events on teh view, and serializes data
    beforeRenderDone: function() {
      var that = this;

      this.view.trigger("before:render", this.view);
      this.view.trigger("item:before:render", this.view);

      var serializeData = this.view.serializeData()
      $.when(serializeData).then(function(data){
        that.dataSerialized(data);
      });
    },

    // Called after data serialization has finished. Runs the
    // actual render process for the template and data
    dataSerialized: function(data){
      var that = this;
      var renderHtml = this.view.renderHtml(data);

      $.when(renderHtml).then(function(html){
        that.templateRendered(html);
      });
    },

    // Runs after the template has been rendered. Calls the
    // `onRender` method on the view.
    templateRendered: function(html){
      this.view.$el.html(html);
      callDeferredMethod(this.view.onRender, this.onRenderDone, this.view);
    },

    // Runs after the `onRender` method, triggers some events on
    // the view and resolves the deferred render promise.
    onRenderDone: function(){
      this.view.trigger("render", this.view);
      this.view.trigger("item:rendered", this.view);
      this.deferredRender.resolve();
    }
  });

  return ItemView;
})(Marionette, _);

