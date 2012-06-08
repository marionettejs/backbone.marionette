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

});
