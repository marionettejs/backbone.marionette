describe("trigger event and method name", function(){
  "use strict";

  var view, eventHandler, methodHandler;

  beforeEach(function(){
    view = new Marionette.View();

    eventHandler = jasmine.createSpy("event handler");
    methodHandler = jasmine.createSpy("method handler");
  });

  describe("when triggering an event", function(){

    beforeEach(function(){
      view.onSomething = methodHandler;
      view.on("something", eventHandler);

      view.triggerMethod("something");
    });

    it("should trigger the event", function(){
      expect(eventHandler).toHaveBeenCalled();
    });

    it("should call a method named on{Event}", function(){
      expect(methodHandler).toHaveBeenCalled();
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
        itemView : ResultView
    });

    var cv;

    beforeEach(function(){
      setFixtures("<script type='text/html' id='aTemplate'><div>foo</div></script>");

      var c = new Backbone.Collection([{a: "b"}, {a: "c"}]);
      cv = new ResultsView({
        collection: c
      });

      cv.onItemviewAddSelection = jasmine.createSpy();

      cv.render();

      var childView = cv.children[c.at(0).cid];
      childView.$el.click();
    });

    it("should fire the event method once", function(){
      expect(cv.onItemviewAddSelection.callCount).toBe(1);
    });

  });

});
