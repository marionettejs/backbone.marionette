// Async ItemView
// --------------

// An asynchronous rendering method for the `ItemView`. This method
// assumes template loading, data serialization, `beforRender`, and
// `onRender` functions are all asynchronous, using `jQuery.Deferred()`
// and `jQuery.when(...).then(...)` to manage async calls.
Async.ItemView = {
  // Consider overriding 'renderData' if you want to keep the
  // render-events being triggered but change the way your data
  // is being rendered.
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
      var asyncRender = that.renderData(data);
      $.when(asyncRender).then(templateRendered);
    }

    var templateRendered = function(html){
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
  
  // Render the provided data using Marionette.Renderer.
  // Override this to render the given data using a mechanism
  // that suits your needs. 
  // In general you should override the `Marionette.Renderer` 
  // object to change how Marionette renders views.
  // Return a deferred object when performing custom async rendering.
  renderData: function(data) {
    var template = this.getTemplate();
    var asyncRender = Marionette.Renderer.render(template, data);
    var that = this;
    $.when(asyncRender).then(function(html) {
      that.$el.html(html);
    });
    return asyncRender;
  }
};
