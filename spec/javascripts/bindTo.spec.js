describe("bind to", function(){
  var Model = Backbone.Model.extend({});

  describe("when binding an event", function(){
    var handler = {
      doIt: function(){}
    }
    spyOn(handler, "doIt");
    var binder = _.extend({}, Backbone.Marionette.BindTo);
    var model;

    beforeEach(function(){
      model = new Model();
      binder.bindTo(model, "change:foo", handler.doIt);
    });

    it("should store the bound object", function(){
      expect(binder.bindings[0].obj).toBe(model);
    });

    it("should store the event name", function(){
      expect(binder.bindings[0].eventName).toBe("change:foo");
    });

    it("should store the callback function", function(){
      expect(binder.bindings[0].callback).toBe(handler.doIt);
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

  describe("when unbinding", function(){
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
