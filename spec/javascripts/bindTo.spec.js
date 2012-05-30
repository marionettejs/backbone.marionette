describe("bind to", function(){
  var Model = Backbone.Model.extend({});

  describe("when binding an event", function(){
    var binding, binder, model;

    var eventHandler = {
      doIt: function(){}
    }

    beforeEach(function(){
      binder = _.extend({}, Backbone.Marionette.BindTo);
      model = new Model();
      binding = binder.bindTo(model, "change:foo", eventHandler.doIt);
    });

    it("should store the bound object", function(){
      expect(binder.bindings[0].obj).toBe(model);
    });

    it("should store the event name", function(){
      expect(binder.bindings[0].eventName).toBe("change:foo");
    });

    it("should store the callback function", function(){
      expect(binder.bindings[0].callback).toBe(eventHandler.doIt);
    });

    it("should return a binding object for the bound event", function(){
      expect(binding).toBe(binder.bindings[0]);
    });

  });

  describe("when binding an event with a specified context", function(){
    var contextHandler = {
      doIt: function(){}
    }
    var contextBinder = _.extend({}, Backbone.Marionette.BindTo);
    var contextModel;

    beforeEach(function(){
      contextModel = new Model();
      contextBinder.bindTo(contextModel, "change:foo", contextHandler.doIt, contextHandler);
    });

    afterEach(function(){
      contextBinder.unbindAll();
    });

    it("should store the specified context", function(){
      expect(contextBinder.bindings[0].context).toBe(contextHandler);
    });

  });

  describe("when a bindTo event is triggered", function(){
    var handler = {
      doIt: function(){}
    }
    var binder = _.extend({}, Backbone.Marionette.BindTo);
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
    var binder = _.extend({}, Backbone.Marionette.BindTo);
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
      expect(binder.bindings.length).toBe(0);
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
      binder = _.extend({}, Backbone.Marionette.BindTo);
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
      expect(binder.bindings.length).toBe(0);
    });
  });

  describe("when two bindTo objects are bound to the same object, same event, same callback, and unbinding one of them", function(){
    var handler = {
      doIt: function(){}
    }

    var binder1, binder2;
    var binding1, binding2;
    var model;

    beforeEach(function(){
      spyOn(handler, "doIt");

      binder1 = _.extend({}, Backbone.Marionette.BindTo);
      binder2 = _.extend({}, Backbone.Marionette.BindTo);

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

});
