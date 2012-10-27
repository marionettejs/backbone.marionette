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
      expect(controller.eventBinder).not.toBeUndefined();
      expect(typeof controller.bindTo).toBe("function");
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

    beforeEach(function(){
      controller = new Marionette.Controller();
    });

    it("should provide an empty object as the options", function(){
      expect(_.isObject(controller.options)).toBe(true);
    });
  });

});
