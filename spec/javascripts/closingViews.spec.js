describe("closing views", function(){

  describe("when closing a Marionette.View multiple times", function(){
    var View = Marionette.View.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.close();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as closed", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when closing a Marionette.ItemView multiple times", function(){
    var View = Marionette.ItemView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.close();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as closed", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when rendering a Marionette.ItemView that was previously closed", function(){
    var View = Marionette.ItemView.extend({
      template: function(){}
    });
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.render();
    });

    it("should mark the view as not closed", function(){
      expect(view.isClosed).toBe(false);
    });
  });

  describe("when closing a Marionette.CollectionView multiple times", function(){
    var View = Marionette.CollectionView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.close();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as closed", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when rendering a Marionette.CollectionView that was previously closed", function(){
    var ItemView = Marionette.ItemView.extend({
      template: function(){}
    });

    var CollectionView = Marionette.CollectionView.extend({
      itemView: ItemView
    });
    var view;

    beforeEach(function(){
      view = new CollectionView();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.render();
    });

    it("should mark the view as not closed", function(){
      expect(view.isClosed).toBe(false);
    });
  });

  describe("when closing a Marionette.CompositeView multiple times", function(){
    var View = Marionette.CompositeView.extend({});
    var view;

    beforeEach(function(){
      view = new View();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.close();
    });

    it("should only run the closing code once", function(){
      expect(view.onBeforeClose).toHaveBeenCalled();
    });

    it("should mark the view as closed", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when rendering a Marionette.CompositeView that was previously closed", function(){
    var ItemView = Marionette.ItemView.extend({
      template: function(){}
    });

    var CompositeView = Marionette.CompositeView.extend({
      template: function(){},
      itemView: ItemView
    });
    var view;

    beforeEach(function(){
      view = new CompositeView();
      view.onBeforeClose = jasmine.createSpy("before close");

      view.close();
      view.render();
    });

    it("should mark the view as not closed", function(){
      expect(view.isClosed).toBe(false);
    });
  });

});
