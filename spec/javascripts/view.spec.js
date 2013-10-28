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

  describe("when retrieving view metadata", function(){
    var view1, view2;

    beforeEach(function(){
      view1 = new Marionette.View();
      view2 = new Marionette.View();
    });

    it("should initialize the data hash", function(){
      var data = view1.data('foo');
      expect(!!data).toBe(true);
    });

    it("should only create instance-scoped data", function(){
      var data1 = view1.data('foo');
      data1['test1'] = '1';
      var data2 = view2.data('foo');
      data2['test2'] = '2';
      expect(data1.test2).toBe(undefined);
      expect(data2.test1).toBe(undefined);
    });

    it("should return the same hash with multiple requests", function(){
      var data1 = view1.data('foo');
      data1['test1'] = '1';
      data1 = view1.data('foo');
      expect(data1.test1).toBe('1');
    });
  });
});
