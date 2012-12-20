describe("event binder", function(){
  var model, obj;

  beforeEach(function(){
    model = new Backbone.Model();
    obj = new Marionette.EventBinder();
  });

  describe("when binding an event with no context specified, then triggering that event", function(){
    var context, handler;

    beforeEach(function(){
      handler = jasmine.createSpy("context free handler");

      obj.listenTo(model, "foo", handler);

      model.trigger("foo");
    });

    it("should execute in the context of the object that has the event binder attached to it", function(){
      expect(handler.mostRecentCall.object).toBe(obj);
    });

    it("should execute", function(){
      expect(handler).toHaveBeenCalled();
    });

  });

  describe("when binding an event with a context specified, then triggering that event", function(){
    var context, handler;

    beforeEach(function(){
      handler = jasmine.createSpy("context bound handler");

      obj.listenTo(model, "foo", handler, model);

      model.trigger("foo");
    });

    it("should execute in the context of the object that has the event binder attached to it", function(){
      expect(handler.mostRecentCall.object).toBe(model);
    });

    it("should execute", function(){
      expect(handler).toHaveBeenCalled();
    });

  });

});
