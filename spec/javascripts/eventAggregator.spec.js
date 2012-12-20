describe("event aggregator", function(){
  "use strict";

  describe("when creating an event aggregator instance", function(){
    var ea;

    beforeEach(function(){
      spyOn(Marionette, "addEventBinder").andCallThrough();
      ea = new Marionette.EventAggregator();
    });
    
    it("should have an EventBinder mixed in to it", function(){
      expect(Marionette.addEventBinder).wasCalledWith(ea);
    });
  });

  describe("when binding to an event with listenTo", function(){
    var ea, callback;

    beforeEach(function(){
      ea = new Marionette.EventAggregator();
      callback = jasmine.createSpy("event handler callback");

      var model = new Backbone.Model();
      ea.listenTo(model, "foo", callback);

      ea.stopListening();
      model.trigger("foo");
    });

    describe("then unbinding all", function(){

      it("should unbind all events from the event aggregator", function(){
        expect(callback).not.toHaveBeenCalled();
      });

    });

  });

});
