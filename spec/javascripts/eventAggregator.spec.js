describe("event aggregator", function(){
  
  describe("when instantiating a marionette application", function(){
    var MyApp = new Backbone.Marionette.Application();

    it("should have an event aggregator attached to it", function(){
      expect(MyApp.vent).not.toBeUndefined();
    });
  });

  describe("when instantiating an event aggregator with options", function(){
    var vent, options;

    beforeEach(function(){
      options = {foo: "bar"};
      vent = new Backbone.Marionette.EventAggregator(options);
    });
  
    it("should copy the options on to the aggregator", function(){
      expect(vent.foo).toEqual("bar");
    });
  });

  describe("when binding and unbinding all, then firing an event", function(){
    var vent, handlerCalled;
    
    beforeEach(function(){
      var vent = new Backbone.Marionette.EventAggregator();

      vent.bindTo("foo", function(){
        handlerCalled = true;
      });
      vent.unbindAll();

      vent.trigger("foo");
    });

    it("should not fire any handlers", function(){
      expect(handlerCalled).toBeUndefined();
    });
  });

});
