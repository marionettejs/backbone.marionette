describe("async item view", function(){
  beforeEach(function(){
    this.itemViewRender = Backbone.Marionette.ItemView.prototype.render;

    // replace the standard render with an async render
    _.extend(Backbone.Marionette.ItemView.prototype, Backbone.Marionette.Async.ItemView);
  });

  afterEach(function(){
    Backbone.Marionette.ItemView.prototype.render = this.itemViewRender;
  });

  describe("when rendering", function(){
    var OnRenderView = Backbone.Marionette.ItemView.extend({
      template: "#emptyTemplate",
      beforeRender: function(){},
      onRender: function(){}
    });

    var view;
    var renderResult;
    var deferredDone;

    beforeEach(function(){
      loadFixtures("emptyTemplate.html");
      view = new OnRenderView({});
      
      spyOn(view, "beforeRender").andCallThrough();
      spyOn(view, "onRender").andCallThrough();
      spyOn(view, "trigger").andCallThrough();

      var deferred = view.render();
      deferred.done(function(){deferredDone = true; });
    });

    it("should call a `beforeRender` method on the view", function(){
      expect(view.beforeRender).toHaveBeenCalled();
    });

    it("should call an `onRender` method on the view", function(){
      expect(view.onRender).toHaveBeenCalled();
    });

    it("should trigger a before:render event", function(){
      expect(view.trigger).toHaveBeenCalledWith("item:before:render", view);
    });

    it("should trigger a rendered event", function(){
      expect(view.trigger).toHaveBeenCalledWith("item:rendered", view);
    });

    it("should resolve the returned deferred object", function(){
      expect(deferredDone).toBe(true);
    });
  });
  
  describe("when closed while waiting for a deferred", function(){
    var render = Backbone.Marionette.Renderer.render;
    
    var OnRenderView = Backbone.Marionette.ItemView.extend({
      beforeRender: function(){},
      onRender: function(){}
    });

    var view;
    var deferredDone = false;
    var deferredFail = false;
    var renderDeferred;

    beforeEach(function(){
      renderDeferred = $.Deferred();
      Backbone.Marionette.Renderer.render = function() {
        return renderDeferred.promise();
      };
      
      view = new OnRenderView({});
      
      spyOn(view, "beforeRender").andCallThrough();
      spyOn(view, "onRender").andCallThrough();
      spyOn(view, "trigger").andCallThrough();

      var deferred = view.render();
      
      deferred.done(function(){deferredDone = true; });
      deferred.fail(function(){deferredFail = true; });
      
      view.close();
      
      renderDeferred.resolve("bar");
    });
    
    afterEach(function() {
      Backbone.Marionette.Renderer.render = render;
    });

    it("should not call an `onRender` method on the view", function(){
      expect(view.onRender).not.toHaveBeenCalled();
    });

    it("should not trigger a render event", function(){
      expect(view.trigger).not.toHaveBeenCalledWith("render", view);
    });
    
    it("should not trigger a item:rendered event", function(){
      expect(view.trigger).not.toHaveBeenCalledWith("item:rendered", view);
    });

    it("should not append the html", function(){
      expect(view.$el).not.toHaveText(/bar/);;
    });

    it("should reject the returned deferred object", function(){
      expect(deferredDone).toBe(false);
      expect(deferredFail).toBe(true);
    });
  });

});
