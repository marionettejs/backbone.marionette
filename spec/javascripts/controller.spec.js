describe("controller", function(){

  describe("when creating a controller", function(){

    var Controller = Marionette.Controller.extend({
      initialize: jasmine.createSpy("initialize method")
    });

    var controller, options;

    beforeEach(function(){
      options = {};
      controller = new Controller(options);
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
  });

});
