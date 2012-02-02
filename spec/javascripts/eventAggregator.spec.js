describe("event aggregator", function(){
  
  describe("when instantiating a marionette application", function(){
    var MyApp = new Backbone.Marionette.Application();

    it("should have an event aggregator attached to it", function(){
      expect(MyApp.vent).not.toBeUndefined();
    });
  });

  describe("when triggering events with the event aggregator", function() {
    var MyApp = new Backbone.Marionette.Application();

    it ("should throw a descriptive error if there is no callback for the triggered event", function(){
      var eventErrorMessage = function (event) {
        return 'Attempted to trigger application event \'' + event + '\', however there is no associated callback.';
      };
      
      // Trigger an event when there are no callbacks present at all
      expect(function () { MyApp.vent.trigger('save:image'); }).toThrow(new Error(eventErrorMessage('save:image')));
      expect(function () { MyApp.vent.trigger(); }).toThrow(new Error(eventErrorMessage('undefined')));
      
      // Trigger an event when there is at least one callback, but the name is not matched
      MyApp.vent.bind('new:file', function () { });
      expect(function () { MyApp.vent.trigger('new:files') }).toThrow(new Error(eventErrorMessage('new:files')));
    });
  });

});
