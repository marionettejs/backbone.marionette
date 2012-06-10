// Async ItemView
// --------------

// An asynchronous rendering method for the `ItemView`. This method
// assumes template loading, data serialization, `beforRender`, and
// `onRender` functions are all asynchronous, using `jQuery.Deferred()`
// and `jQuery.when(...).then(...)` to manage async calls.
Async.ItemView = {
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
      var template = that.getTemplate();
      var asyncRender = Marionette.Renderer.render(template, data);
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
  }
};
