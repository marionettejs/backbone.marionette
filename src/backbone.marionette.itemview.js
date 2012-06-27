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
  // You can override this in your view definition to provide
  // a very specific rendering for your view.
  // Consider overriding 'renderData' if you want to keep the
  // render-events being triggered but change the way your data
  // is being rendered.
  render: function(){
    if (this.beforeRender){ this.beforeRender(); }
    this.trigger("before:render", this);
    this.trigger("item:before:render", this);

    var data = this.serializeData();

    this.renderData(data);
    
    if (this.onRender){ this.onRender(); }
    this.trigger("render", this);
    this.trigger("item:rendered", this);
  },
  
  // Render the provided data using Marionette.Renderer.
  // Override this to render the given data using a mechanism
  // that suits your needs. 
  // In general you should override the `Marionette.Renderer` 
  // object to change how Marionette renders views.
  renderData: function(data) {
    var template = this.getTemplate();
    var html = Marionette.Renderer.render(template, data);
    this.$el.html(html);
  },

  // Override the default close event to add a few
  // more events that are triggered.
  close: function(){
    this.trigger('item:before:close');
    Marionette.View.prototype.close.apply(this, arguments);
    this.trigger('item:closed');
  }
});
