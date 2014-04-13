describe("destroying views", function(){
  "use strict";

  describe("when destroying a Marionette.View multiple times", function(){
    var View = Marionette.View.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeDestroy = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the destroying code once", function(){
      expect(view.onBeforeDestroy).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when destroying a Marionette.ItemView multiple times", function(){
    var View = Marionette.ItemView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeDestroy = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the destroying code once", function(){
      expect(view.onBeforeDestroy).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when rendering a Marionette.ItemView that was previously destroyed", function(){
    var View = Marionette.ItemView.extend({
      template: function(){},
      reRender: function() {
        try {
          this.render();
        }
        catch (e) {}
      }
    });
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeRender = jasmine.createSpy("before render");
      view.onRender = jasmine.createSpy("on render");

      view.destroy();
    });

    it("should throw an error saying the view's been destroyed if render is attempted again", function(){
      expect(function(){view.render()}).toThrow("Cannot use a view that's already been destroyed.");
    });

    it("should not run before render code", function(){
      view.reRender();
      expect(view.onBeforeRender).not.toHaveBeenCalled();
    });

    it("should not run render code", function(){
      view.reRender();
      expect(view.onRender).not.toHaveBeenCalled();
    });
  });

  describe("when destroying a Marionette.CollectionView multiple times", function(){
    var View = Marionette.CollectionView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeDestroy = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the destroying code once", function(){
      expect(view.onBeforeDestroy).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when rendering a Marionette.CollectionView that was previously destroyed", function(){
    var ItemView = Marionette.ItemView.extend({
      template: function(){}
    });

    var CollectionView = Marionette.CollectionView.extend({
      itemView: ItemView,
      reRender: function() {
        try {
          this.render();
        }
        catch (e) {}
      }
    });
    var view;

    beforeEach(function(){
      view = new CollectionView();
      view.onBeforeRender = jasmine.createSpy("before render");
      view.onRender = jasmine.createSpy("on render");

      view.destroy();
    });

    it("should throw an error saying the view's been destroyed if render is attempted again", function(){
      expect(function(){view.render()}).toThrow("Cannot use a view that's already been destroyed.");
    });

    it("should not run before render code", function(){
      view.reRender();
      expect(view.onBeforeRender).not.toHaveBeenCalled();
    });

    it("should not run render code", function(){
      view.reRender();
      expect(view.onRender).not.toHaveBeenCalled();
    });
  });

  describe("when destroying a Marionette.CompositeView multiple times", function(){
    var View = Marionette.CompositeView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeDestroy = jasmine.createSpy("before destroy");

      view.destroy();
      view.destroy();
    });

    it("should only run the destroying code once", function(){
      expect(view.onBeforeDestroy).toHaveBeenCalled();
    });

    it("should mark the view as destroyed", function(){
      expect(view.isDestroyed).toBe(true);
    });
  });

  describe("when rendering a Marionette.CompositeView that was previously destroyed", function(){
    var ItemView = Marionette.ItemView.extend({
      template: function(){}
    });

    var CompositeView = Marionette.CompositeView.extend({
      template: function(){},
      itemView: ItemView,
      reRender: function() {
        try {
          this.render();
        }
        catch (e) {}
      }
    });
    var view;

    beforeEach(function(){
      view = new CompositeView();

      view.onBeforeRender = jasmine.createSpy("before render");
      view.onRender = jasmine.createSpy("on render");

      view.destroy();
    });

    it("should throw an error saying the view's been destroyed if render is attempted again", function(){
      expect(function(){view.render()}).toThrow("Cannot use a view that's already been destroyed.");
    });

    it("should not run before render code", function(){
      view.reRender();
      expect(view.onBeforeRender).not.toHaveBeenCalled();
    });

    it("should not run render code", function(){
      view.reRender();
      expect(view.onRender).not.toHaveBeenCalled();
    });
  });

});
