describe("event aggregator", function(){

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

  describe("when binding to an event with bindTo", function(){
    var ea, callback;

    beforeEach(function(){
      ea = new Marionette.EventAggregator();
      callback = jasmine.createSpy("event handler callback");

      var model = new Backbone.Model();
      ea.bindTo(model, "foo", callback);

      ea.unbindAll();
      model.trigger("foo");
    });

    describe("then unbinding all", function(){

      it("should unbind all events from the event aggregator", function(){
        expect(callback).not.toHaveBeenCalled();
      });

    });

  });

});
