describe("event binder", function(){
  var Model = Backbone.Model;

  describe("when binding an event", function(){
    var binding, binder, model;

    var eventHandler = {
      doIt: function(){}
    }

    beforeEach(function(){
      binder = new Marionette.EventBinder();
      model = new Model();
      binding = binder.bindTo(model, "change:foo", eventHandler.doIt);
    });

    it("should store the bound object", function(){
      expect(binder._eventBindings[0].obj).toBe(model);
    });

    it("should store the event name", function(){
      expect(binder._eventBindings[0].eventName).toBe("change:foo");
    });

    it("should store the callback function", function(){
      expect(binder._eventBindings[0].callback).toBe(eventHandler.doIt);
    });

    it("should return a binding object for the bound event", function(){
      expect(binding).toBe(binder._eventBindings[0]);
    });

  });

  describe("when binding an event with a specified context", function(){
    var contextHandler = {
      doIt: function(){}
    }
    var contextBinder = new Marionette.EventBinder();
    var contextModel;

    beforeEach(function(){
      contextModel = new Model();
      contextBinder.bindTo(contextModel, "change:foo", contextHandler.doIt, contextHandler);
    });

    afterEach(function(){
      contextBinder.unbindAll();
    });

    it("should store the specified context", function(){
      expect(contextBinder._eventBindings[0].context).toBe(contextHandler);
    });

  });

  describe("when a bindTo event is triggered", function(){
    var handler = {
      doIt: function(){}
    }
    var binder = new Marionette.EventBinder();
    var model;

    beforeEach(function(){
      spyOn(handler, "doIt");
      model = new Model();
      binder.bindTo(model, "change:foo", handler.doIt);

      model.set({foo: "bar"});
    });

    it("should fire the event handlers", function(){
      expect(handler.doIt).toHaveBeenCalled();
    });
  });

  describe("when unbinding and then triggering", function(){
    var handler = {
      doIt: function(){}
    }
    var binder = new Marionette.EventBinder();
    var model;

    beforeEach(function(){
      spyOn(handler, "doIt");
      model = new Model();
      binder.bindTo(model, "change:foo", handler.doIt);

      binder.unbindAll();
      model.set({foo: "bar"});
    });

    it("should not tigger the handler", function(){
      expect(handler.doIt).not.toHaveBeenCalled();
    })

    it("should empty the list of registered events", function(){
      expect(binder._eventBindings.length).toBe(0);
    });
  });

  describe("when unbinding from a binding object", function(){
    var handler = {
      doIt: function(){}
    }

    var binder;
    var model;
    var binding;

    beforeEach(function(){
      binder = new Marionette.EventBinder();
      spyOn(handler, "doIt");
      model = new Model();
      binding = binder.bindTo(model, "change:foo", handler.doIt);

      binder.unbindFrom(binding);
      model.set({foo: "bar"});
    });

    it("should unbind all registered events", function(){
      expect(handler.doIt).not.toHaveBeenCalled();
    });

    it("should empty the list of registered events", function(){
      expect(binder._eventBindings.length).toBe(0);
    });
  });

  describe("when two bindTo objects are bound to the same object, same event, same callback, ", function(){

    describe("same context, and unbinding one of them", function(){
      var handler;
      var binder1, binder2;
      var binding1, binding2;
      var model;
      var context;

      beforeEach(function(){
        context = {};
        handler = jasmine.createSpy();

        binder1 = new Marionette.EventBinder();
        binder2 = new Marionette.EventBinder();

        model = new Model();
        binding1 = binder1.bindTo(model, "change:foo", handler, context);
        binding2 = binder2.bindTo(model, "change:foo", handler, context);

        binder1.unbindFrom(binding1);
        model.set({foo: "bar"});
      });

      it("should unbind both", function(){
        expect(handler.callCount).toBe(0);
      });
    });

    describe("no context (default context of the bindTo object itself), and unbinding one of them", function(){
      var handler = {
        doIt: function(){}
      }

      var binder1, binder2;
      var binding1, binding2;
      var model;

      beforeEach(function(){
        spyOn(handler, "doIt");

        binder1 = new Marionette.EventBinder();
        binder2 = new Marionette.EventBinder();

        model = new Model();
        binding1 = binder1.bindTo(model, "change:foo", handler.doIt);
        binding2 = binder2.bindTo(model, "change:foo", handler.doIt);

        binder1.unbindFrom(binding1);
        model.set({foo: "bar"});
      });

      it("should not unbind the other", function(){
        expect(handler.doIt.callCount).toBe(1);
      });
    });

    describe("different context, and unbinding one of them", function(){
      var handler = {
        doIt: function(){}
      }

      var binder1, binder2;
      var binding1, binding2;
      var model;

      beforeEach(function(){
        spyOn(handler, "doIt");

        binder1 = new Marionette.EventBinder();
        binder2 = new Marionette.EventBinder();

        model = new Model();
        binding1 = binder1.bindTo(model, "change:foo", handler.doIt, binder1);
        binding2 = binder2.bindTo(model, "change:foo", handler.doIt, binder2);

        binder1.unbindFrom(binding1);
        model.set({foo: "bar"});
      });

      it("should not unbind the other", function(){
        expect(handler.doIt.callCount).toBe(1);
      });
    });

  });

});
