describe("event aggregator", function(){
  
  describe("when instantiating a marionette application", function(){
    var MyApp = new Backbone.Marionette.Application();

    it("should have an event aggregator attached to it", function(){
      expect(MyApp.vent).not.toBeUndefined();
    });
  });

  describe("when triggering events with the event aggregator", function() {
    var MyApp = new Backbone.Marionette.Application();

    it ("should throw a descriptive error if there is no callback for the trigger", function(){
      var eventErrorMessage = function (event) {
        return 'Attempted to trigger application event \'' + event + '\', however there is no associated callback.';
      };

      expect(function () { MyApp.vent.trigger('save:image'); }).toThrow(new Error(eventErrorMessage('save:image')));
      expect(function () { MyApp.vent.trigger('') }).toThrow(new Error(eventErrorMessage('')));
    });
  });

});
