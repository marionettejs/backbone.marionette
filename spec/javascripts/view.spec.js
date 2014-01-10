describe("base view", function(){
  "use strict";

  describe("when initializing a view", function(){
    var fooHandler;

    beforeEach(function(){
      fooHandler = jasmine.createSpy();

      var view = Backbone.Marionette.View.extend({
        initialize: function(){
          this.listenTo(this.model, "foo", fooHandler);
        }
      });

      var model = new Backbone.Model();

      new view({
        model: model
      });

      model.trigger("foo");
    });

    it("should allow event to be bound via event binder", function(){
      expect(fooHandler).toHaveBeenCalled();
    });
  });

  describe("when using listenTo for the 'close' event on itself, and closing the view", function(){
    var close;

    beforeEach(function(){
      close = jasmine.createSpy("close");

      var view = new Marionette.View();
      view.listenTo(view, "close", close);

      view.close();
    });

    it("should trigger the 'close' event", function(){
      expect(close).toHaveBeenCalled();
    });
  });

  describe("when closing a view", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.close();
    });

    it("should trigger the close event", function(){
      expect(close).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isClosed to true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when closing a view and returning false from the onBeforeClose method", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.onBeforeClose = function(){
        return false;
      };

      view.close();
    });

    it("should not trigger the close event", function(){
      expect(close).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should not set the view isClosed to true", function(){
      expect(view.isClosed).not.toBe(true);
    });
  });

  describe("when closing a view and returning undefined from the onBeforeClose method", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.onBeforeClose = function(){
        return undefined;
      };

      view.close();
    });

    it("should trigger the close event", function(){
      expect(close).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isClosed to true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("constructing a view with default options", function(){
    var view = Marionette.ItemView.extend();
    var presetOptions = Marionette.View.extend({
      options: {
        'lila': 'zoidberg'
      }
    });
    var presetOptionsFn = Marionette.View.extend({
      options: function () {
        return { 'fry': 'bender' };
      }
    });

    it("should take and store view options", function() {
      var viewInstance = new view({"Guybrush": "Island"});
      expect(viewInstance.options.Guybrush).toBe("Island");
    });

    it("should take and store view options as a function", function() {
      var viewInstance = new view(function(){
        return { "Guybrush": "Island" }
      });
      expect(viewInstance.options.Guybrush).toBe("Island");
    });

    it("should have an empty hash of options by default", function() {
      var viewInstance = new view;
      expect(typeof(viewInstance.options.Guybrush)).toBe("undefined");
    });

    it("should retain options set on view class", function() {
      var viewInstance = new presetOptions;
      expect(viewInstance.options.lila).toBe("zoidberg");
    });

    it("should retain options set on view class as a function", function() {
      var viewInstance = new presetOptionsFn;
      expect(viewInstance.options.fry).toBe("bender");
    });
  });

  describe("should expose its options in the constructor", function() {
    var View = Marionette.View.extend({
       initialize: function() {
        this.info = this.options;
      }
    });

    it("should be able to access instance options", function() {
      var myView = new View({name: "LeChuck"});
      expect(myView.info.name).toBe("LeChuck");
    });
  });

  describe("when closing a view that is already closed", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();
      view.close();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.close();
    });

    it("should not trigger the close event", function(){
      expect(close).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should leave isClosed as true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

});
