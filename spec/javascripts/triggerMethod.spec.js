describe("trigger event and method name", function(){
  "use strict";

  var view, eventHandler, methodHandler, CustomClass, customObject;

  beforeEach(function(){
    view = new Marionette.View();

    CustomClass = function() {
      this.triggerMethod = Marionette.triggerMethod;
    };

    eventHandler = jasmine.createSpy("event handler");
    methodHandler = jasmine.createSpy("method handler");
  });

  describe("when triggering an event", function(){
    var returnVal;

    beforeEach(function(){
      methodHandler.andReturn("return val");
      view.onSomething = methodHandler;
      view.on("something", eventHandler);

      returnVal = view.triggerMethod("something");
    });

    it("should trigger the event", function(){
      expect(eventHandler).toHaveBeenCalled();
    });

    it("should call a method named on{Event}", function(){
      expect(methodHandler).toHaveBeenCalled();
    });

    it("returns the value returned by the on{Event} method", function(){
      expect(returnVal).toBe("return val");
    });

    describe("when trigger does not exist", function() {

      beforeEach(function() {
        customObject = new CustomClass();
      });

      it("should do nothing", function() {
        var triggerNonExistantEvent = function() {
          customObject.triggerMethod("does:not:exist");
        };

        expect( triggerNonExistantEvent ).not.toThrow();
      });
    });
  });

  describe("when triggering an event with arguments", function(){

    beforeEach(function(){
      view.onSomething = methodHandler;
      view.on("something", eventHandler);

      view.triggerMethod("something", 1, 2, 3);
    });

    it("should trigger the event with the args", function(){
      expect(eventHandler.mostRecentCall.args.length).toBe(3);
    });

    it("should call a method named on{Event} with the args", function(){
      expect(methodHandler.mostRecentCall.args.length).toBe(3);
    });

  });

  describe("when triggering an event with : separated name", function(){

    beforeEach(function(){
      view.onDoSomething = methodHandler;
      view.on("do:something", eventHandler);

      view.triggerMethod("do:something", 1, 2, 3);
    });

    it("should trigger the event with the args", function(){
      expect(eventHandler.mostRecentCall.args.length).toBe(3);
    });

    it("should call a method named with each segment of the event name capitalized", function(){
      expect(methodHandler).toHaveBeenCalled();
    });

  });

  describe("when triggering an event and no handler method exists", function(){
    beforeEach(function(){
      view.on("do:something", eventHandler);
      view.triggerMethod("do:something", 1, 2, 3);
    });

    it("should trigger the event with the args", function(){
      expect(eventHandler.mostRecentCall.args.length).toBe(3);
    });

    it("should not call a method named with each segment of the event name capitalized", function(){
      expect(methodHandler).not.toHaveBeenCalled();
    });

  });

  describe("when triggering an event and the attribute for that event is not a function", function(){
    beforeEach(function(){
      view.onDoSomething = "bar";
      view.on("do:something", eventHandler);
      view.triggerMethod("do:something", 1, 2, 3);
    });

    it("should trigger the event with the args", function(){
      expect(eventHandler.mostRecentCall.args.length).toBe(3);
    });

    it("should not call a method named with each segment of the event name capitalized", function(){
      expect(methodHandler).not.toHaveBeenCalled();
    });

  });

  describe("triggering events through a child view", function(){
    var ResultView = Backbone.Marionette.ItemView.extend({
        template : "#aTemplate",
        events : {
          "click" : "onAddToSelection"
        },
        onAddToSelection : function(e) {
          this.triggerMethod("add:selection", this.model);
        }
    });

    var ResultsView =  Backbone.Marionette.CompositeView.extend({
        template: "#aTemplate",
        childView : ResultView
    });

    var cv;

    beforeEach(function(){
      setFixtures("<script type='text/html' id='aTemplate'><div>foo</div></script>");

      var c = new Backbone.Collection([{a: "b"}, {a: "c"}]);
      cv = new ResultsView({
        collection: c
      });

      cv.onChildviewAddSelection = jasmine.createSpy();

      cv.render();

      var childView = cv.children.findByModel(c.at(0));
      childView.$el.click();
    });

    it("should fire the event method once", function(){
      expect(cv.onChildviewAddSelection.callCount).toBe(1);
    });

  });

});
