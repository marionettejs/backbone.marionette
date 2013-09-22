describe("base view", function(){
  "use strict";

  describe("when initializing a view", function(){
    var view, fooHandler;

    beforeEach(function(){
      fooHandler = jasmine.createSpy();

      var View = Backbone.Marionette.View.extend({
        initialize: function(){
          this.listenTo(this.model, "foo", fooHandler);
        }
      });

      var model = new Backbone.Model();

      view = new View({
        model: model
      });

      model.trigger("foo");
    });

    it("should allow event to be bound via event binder", function(){
      expect(fooHandler).toHaveBeenCalled();
    });

    it("should pass the 'isIntact' test", function() {
      // shouldn't throw anything
      expect(view.ensureViewIsIntact()).toBeUndefined();
    });
  });

  describe("when using listenTo for the 'destroy' event on itself, and destroying the view", function(){
    var destroy;

    beforeEach(function(){
      destroy = jasmine.createSpy("destroy");

      var view = new Marionette.View();
      view.listenTo(view, "destroy", destroy);

      view.destroy();
    });

    it("should trigger the 'destroy' event", function(){
      expect(destroy).toHaveBeenCalled();
    });
  });

  describe("when destroying a view", function(){
    var destroy, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      destroy = jasmine.createSpy("destroy");
      view.on("destroy", destroy);

      view.destroy();
    });

    it("should trigger the destroy event", function(){
      expect(destroy).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isDestroyed to true", function(){
      expect(view.isDestroyed).toBe(true);
    });

    it("should fail the 'isIntact' test", function() {
      expect(function() { view.ensureViewIsIntact(); }).toThrow("Cannot use a view that's already been destroyed.");
    });
  });

  describe("when destroying a view and returning false from the onBeforeDestroy method", function(){
    var destroy, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      destroy = jasmine.createSpy("destroy");
      view.on("destroy", destroy);

      view.onBeforeDestroy = function(){
        return false;
      };

      view.destroy();
    });

    it("should not trigger the destroy event", function(){
      expect(destroy).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should not set the view isDestroyed to true", function(){
      expect(view.isDestroyed).not.toBe(true);
    });
  });

  describe("when destroying a view and returning undefined from the onBeforeDestroy method", function(){
    var destroy, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      destroy = jasmine.createSpy("destroy");
      view.on("destroy", destroy);

      view.onBeforeDestroy = function(){
        return undefined;
      };

      view.destroy();
    });

    it("should trigger the destroy event", function(){
      expect(destroy).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isDestroyed to true", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when destroying a view that is already destroyed", function(){
    var destroy, view;

    beforeEach(function(){
      view = new Marionette.View();
      view.destroy();

      spyOn(view, "remove").andCallThrough();
      destroy = jasmine.createSpy("destroy");
      view.on("destroy", destroy);

      view.destroy();
    });

    it("should not trigger the destroy event", function(){
      expect(destroy).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should leave isDestroyed as true", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

});
