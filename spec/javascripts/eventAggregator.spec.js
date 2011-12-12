describe("event aggregator", function(){
  
  describe("when instantiating a marionette application", function(){
    var MyApp = new Backbone.Marionette.Application();

    it("should have an event aggregator attached to it", function(){
      expect(MyApp.vent).not.toBeUndefined();
    });
  });

});
