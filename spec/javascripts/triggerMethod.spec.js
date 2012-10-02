describe("trigger event and method name", function(){

  describe("when triggering an event", function(){
    var eventHandler, methodHandler;

    beforeEach(function(){
      var view = new Backbone.View();
      var te = new Marionette.TriggerEvent(view);

      eventHandler = jasmine.createSpy("event handler");
      methodHandler = jasmine.createSpy("method handler");

      view.onSomething = methodHandler;
      view.on("something", eventHandler);

      te.trigger("something");
    });

    it("should trigger the event", function(){
      expect(eventHandler).toHaveBeenCalled();
    });

    it("should call a method named on{Event}", function(){
      expect(methodHandler).toHaveBeenCalled();
    });

  });

  describe("when triggering an event with arguments", function(){
    var eventHandler, methodHandler;

    beforeEach(function(){
      var view = new Backbone.View();
      var te = new Marionette.TriggerEvent(view);

      eventHandler = jasmine.createSpy("event handler");
      methodHandler = jasmine.createSpy("method handler");

      view.onSomething = methodHandler;
      view.on("something", eventHandler);

      te.trigger("something", 1, 2, 3);
    });

    it("should trigger the event with the args", function(){
      expect(eventHandler.mostRecentCall.args.length).toBe(3);
    });

    it("should call a method named on{Event} with the args", function(){
      expect(methodHandler.mostRecentCall.args.length).toBe(3);
    });

  });

  describe("when triggering an event with : separated name", function(){
    var eventHandler, methodHandler;

    beforeEach(function(){
      var view = new Backbone.View();
      var te = new Marionette.TriggerEvent(view);

      eventHandler = jasmine.createSpy("event handler");
      methodHandler = jasmine.createSpy("method handler");

      view.onDoSomething = methodHandler;
      view.on("do:something", eventHandler);

      te.trigger("do:something", 1, 2, 3);
    });

    it("should trigger the event with the args", function(){
      expect(eventHandler.mostRecentCall.args.length).toBe(3);
    });

    it("should call a method named with each segment of the event name capitalized", function(){
      expect(methodHandler).toHaveBeenCalled();
    });

  });

});
