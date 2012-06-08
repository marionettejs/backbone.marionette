// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView =  Marionette.View.extend({
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
    var that = this;

    var deferredRender = $.Deferred();

    var beforeRenderDone = function() {
      that.trigger("before:render", that);
      that.trigger("item:before:render", that);

      var deferredData = that.serializeData();
      $.when(deferredData).then(dataSerialized);
    } 

    var dataSerialized = function(data){
      var asyncRender = that.renderHtml(data);
      $.when(asyncRender).then(templateRendered);
    }

    var templateRendered = function(html){
      that.$el.html(html);
      callDeferredMethod(that.onRender, onRenderDone, that);
    }

    var onRenderDone = function(){
      that.trigger("render", that);
      that.trigger("item:rendered", that);

      deferredRender.resolve();
    }

    callDeferredMethod(this.beforeRender, beforeRenderDone, this);

    return deferredRender.promise();
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
