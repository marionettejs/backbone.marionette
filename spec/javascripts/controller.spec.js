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

  describe("when closing a controller", function(){
    var controller, closeHandler, listenToHandler;

    beforeEach(function(){
      controller = new (Marionette.Controller.extend({
        onClose: jasmine.createSpy("onClose")
      }));

      closeHandler = jasmine.createSpy("close");
      controller.on("close", closeHandler);

      listenToHandler = jasmine.createSpy("close");
      controller.listenTo(controller ,"close", listenToHandler);

      spyOn(controller, "stopListening").andCallThrough();
      spyOn(controller, "off").andCallThrough();

      controller.close(123, "second param");
    });

    it("should stopListening events", function(){
      expect(controller.stopListening).toHaveBeenCalled();
    });

    it("should turn off all events", function(){
      expect(controller.off).toHaveBeenCalled();
    });

    it("should stopListening after calling close", function(){
      expect(listenToHandler).toHaveBeenCalled();
    });

    it("should trigger a close event with any arguments passed to close", function(){
      expect(closeHandler).toHaveBeenCalledWith(123, "second param");
    });

    it("should call an onClose method with any arguments passed to close", function(){
      expect(controller.onClose).toHaveBeenCalledWith(123, "second param");
    });
  });

});
