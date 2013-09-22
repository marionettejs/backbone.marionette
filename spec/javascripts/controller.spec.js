describe("marionette controller", function(){

  describe("when creating an controller", function(){

    var Controller = Marionette.Controller.extend({
      initialize: jasmine.createSpy("initialize method")
    });

    var controller, options, handler;

    beforeEach(function(){
      options = {};
      controller = new Controller(options);

      handler = jasmine.createSpy("foo handler");
      controller.on("foo", handler);

      controller.trigger("foo", options);
    });

    it("should support triggering events", function(){
      expect(handler).toHaveBeenCalledWith(options);
    });

    it("should have an event aggregator built in to it", function(){
      expect(typeof controller.listenTo).toBe("function");
    });

    it("should support an initialize function", function(){
      expect(controller.initialize).toHaveBeenCalled();
    });

    it("should pass constructor options to the initialize function", function(){
      expect(controller.initialize.mostRecentCall.args[0]).toBe(options);
    });

    it("should maintain a reference to the options", function(){
      expect(controller.options).toBe(options);
    });

  });

  describe("when no options argument is supplied to the constructor", function(){
    var controller;

    var Controller = Marionette.Controller.extend({
      initialize: jasmine.createSpy("initialize")
    });

    beforeEach(function(){
      controller = new Controller();
    });

    it("should provide an empty object as the options", function(){
      expect(_.isObject(controller.options)).toBe(true);
    });

    it("should provide the empty object as the options to initialize", function(){
      expect(controller.initialize.mostRecentCall.args[0]).toBe(controller.options);
    });
  });

  describe("when destroying a controller", function(){
    var controller, destroyHandler;

    beforeEach(function(){
      controller = new (Marionette.Controller.extend({
        onDestroy: jasmine.createSpy("onDestroy")
      }));

      destroyHandler = jasmine.createSpy("destroy");
      controller.on("destroy", destroyHandler);

      spyOn(controller, "stopListening").andCallThrough();
      spyOn(controller, "unbind").andCallThrough();

      controller.destroy();
    });

    it("should stopListening events", function(){
      expect(controller.stopListening).toHaveBeenCalled();
    });

    it("should unbind events", function(){
      expect(controller.unbind).toHaveBeenCalled();
    });

    it("should trigger a destroy event", function(){
      expect(destroyHandler).toHaveBeenCalled();
    });

    it("should call an onDestroy method", function(){
      expect(controller.onDestroy).toHaveBeenCalled();
    });
  });

});
