describe("base view", function(){
  "use strict";

  describe("when initializing a view", function(){
    var fooHandler;

    beforeEach(function(){
      fooHandler = jasmine.createSpy();

      var view = Backbone.Marionette.View.extend({
        initialize: function(){
          this.bindTo(this.model, "foo", fooHandler);
        }
      });

      var model = new Backbone.Model();

      new view({
        model: model
      });

      model.trigger("foo");
    });

    it("should allow event to be bound via event binder", function(){
      expect(fooHandler).toHaveBeenCalled();
    });
  });

  describe("when a view has string-based model and collection event configuration", function(){
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { 'model-event': 'modelEventHandler modelEventHandler2' },
      collectionEvents: { 'collection-event': 'collectionEventHandler collectionEventHandler2' },

      modelEventHandler: jasmine.createSpy("model event handler"),
      collectionEventHandler: jasmine.createSpy("collection event handler"),
      modelEventHandler2: jasmine.createSpy("model event handler2"),
      collectionEventHandler2: jasmine.createSpy("collection event handler2")
    });

    beforeEach(function(){
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it("should wire up model events", function(){
      view.model.trigger("model-event");
      expect(view.modelEventHandler).toHaveBeenCalled();
      expect(view.modelEventHandler2).toHaveBeenCalled();
    });

    it("should wire up collection events", function(){
      view.collection.trigger("collection-event");
      expect(view.collectionEventHandler).toHaveBeenCalled();
      expect(view.collectionEventHandler2).toHaveBeenCalled();
    });

  });

  describe("when a view has function-based model and collection event configuration", function(){
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { 
        'model-event': jasmine.createSpy("model event handler")
      },
      collectionEvents: { 
        'collection-event': jasmine.createSpy("collection event handler")
      }
    });

    beforeEach(function(){
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it("should wire up model events", function(){
      view.model.trigger("model-event");
      expect(view.modelEvents['model-event']).toHaveBeenCalled();
    });

    it("should wire up collection events", function(){
      view.collection.trigger("collection-event");
      expect(view.collectionEvents['collection-event']).toHaveBeenCalled();
    });

  });

  describe("when a view has model event config with a specified handler method that doesn't exist", function(){
    var getBadViewInstance;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { "foo": "does_not_exist" }
    });

    beforeEach(function(){
      getBadViewInstance = function(){
        new View({ model: {} })
      }
    });

    it("should error when method doesn't exist", function(){
      expect(getBadViewInstance).toThrow("Method 'does_not_exist' was configured as an event handler, but does not exist.");
    });
  });

  describe("when using bindTo for the 'close' event on itself, and closing the view", function(){
    var close;

    beforeEach(function(){
      close = jasmine.createSpy("close");
      var view = new Marionette.View();

      view.bindTo(view, "close", close);

      view.close();
    });

    it("should trigger the 'close' event", function(){
      expect(close).toHaveBeenCalled();
    });
  });

  describe("when closing a view", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.close();
    });

    it("should trigger the close event", function(){
      expect(close).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isClosed to true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when closing a view and returning false from the onBeforeClose method", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.onBeforeClose = function(){
        return false;
      };

      view.close();
    });

    it("should not trigger the close event", function(){
      expect(close).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should not set the view isClosed to true", function(){
      expect(view.isClosed).not.toBe(true);
    });
  });

  describe("when closing a view and returning undefined from the onBeforeClose method", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.onBeforeClose = function(){
        return undefined;
      };

      view.close();
    });

    it("should trigger the close event", function(){
      expect(close).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isClosed to true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when closing a view that is already closed", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();
      view.close();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.close();
    });

    it("should not trigger the close event", function(){
      expect(close).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should leave isClosed as true", function(){
      expect(view.isClosed).toBe(true);
    });
  });
});
