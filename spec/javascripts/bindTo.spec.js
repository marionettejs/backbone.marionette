describe("bind to", function(){
  var Model = Backbone.Model.extend({});

  describe("when binding an event", function(){
    var eventHandler = {
      doIt: function(){}
    }
    spyOn(eventHandler, "doIt");
    var binder = _.extend({}, Backbone.Marionette.BindTo);
    var model;

    beforeEach(function(){
      model = new Model();
      binder.bindTo(model, "change:foo", eventHandler.doIt);
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

  describe("when unbinding an event", function(){
    var handler = {
      doIt: function(){},
      dontDoIt: function(){}
    }
    var binder = _.extend({}, Backbone.Marionette.BindTo);
    var model;

    beforeEach(function(){
      spyOn(handler, "doIt");
      spyOn(handler, "dontDoIt");
      model = new Model();
      binder.bindTo(model, "change:foo", handler.doIt);
      binder.bindTo(model, "change:foo", handler.dontDoIt);

      binder.unbindFrom(model, "change:foo", handler.dontDoIt);
      model.set({foo: "bar"});
    });

    it("should unbind the registered events for the given callback", function(){
      expect(handler.doIt).toHaveBeenCalled();
      expect(handler.dontDoIt).not.toHaveBeenCalled();
    });

    it("should remove the binding from the list of registered events", function(){
      var bindings = _.filter(binder.bindings, function(binding) {
        return binding.obj === model && binding.eventName === "change:foo" && binding.callback === handler.dontDoIt;
      });
      expect(bindings.length).toBe(0);
    });
  });

  describe("when unbinding all events", function(){
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

    it("should unbind all registered events", function(){
      expect(handler.doIt).not.toHaveBeenCalled();
    });

    it("should empty the list of registered events", function(){
      expect(binder.bindings.length).toBe(0);
    });
  });

});
