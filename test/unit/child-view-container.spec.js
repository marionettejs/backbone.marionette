import ChildViewContainer from '../../src/child-view-container';

describe('childview container', function() {

  describe('when providing an array of views to the constructor', function() {
    var container;

    beforeEach(function() {
      var views = [
        new Backbone.View(),
        new Backbone.View(),
        new Backbone.View()
      ];

      container = new ChildViewContainer(views);
    });

    it('should add all of the views', function() {
      expect(container.length).to.equal(3);
    });

  });

  describe('when adding a view that does not have a model to the container', function() {
    var container;
    var view;
    var foundView;
    var indexView;

    beforeEach(function() {
      view = new Backbone.View();

      container = new ChildViewContainer();

      container.add(view);

      foundView = container.findByCid(view.cid);
      indexView = container.findByIndex(0);
    });

    it('should make the view retrievable by the view\'s cid', function() {
      expect(foundView).to.equal(view);
    });

    it('should make the view retrievable by numeric index', function() {
      expect(indexView).to.equal(view);
    });

    it('should update the size of the chidren', function() {
      expect(container.length).to.equal(1);
    })
  });

  describe('when adding a view that has a model, to the container', function() {
    var container;
    var view;
    var foundView;
    var model;

    beforeEach(function() {
      model = new Backbone.Model();
      view = new Backbone.View({
        model: model
      });

      container = new ChildViewContainer();

      container.add(view);

      foundView = container.findByModel(model);
    });

    it('should make the view retrievable by the model', function() {
      expect(foundView).to.equal(view);
    });
  });

  describe('when adding a view with a custom index value', function() {
    var container;
    var view;
    var foundView;

    beforeEach(function() {
      view = new Backbone.View();

      container = new ChildViewContainer();

      container.add(view, 'custom indexer');

      foundView = container.findByCustom('custom indexer');
    });

    it('should make the view retrievable by the custom indexer', function() {
      expect(foundView).to.equal(view);
    });
  });

  describe('when removing a view', function() {
    var container;
    var view;
    var model;
    var cust;

    beforeEach(function() {
      model = new Backbone.Model();
      cust = 'custom indexer';

      view = new Backbone.View({
        model: model
      });

      container = new ChildViewContainer();
      container.add(view, cust);

      container.remove(view);
    });

    it('should update the size of the children', function() {
      expect(container.length).to.equal(0);
    });

    it('should remove the index by model', function() {
      var v = container.findByModel(model);
      expect(v).to.be.undefined;
    });

    it('should remove the index by custom', function() {
      var v = container.findByCustom(cust);
      expect(v).to.be.undefined;
    });

    it('should remove the view from the container', function() {
      var v = container.findByCid(view.cid);
      expect(v).to.be.undefined;
    });
  });

  describe('adding or removing a view', function() {
    var container
    var view;
    var model;

    beforeEach(function() {
      model = new Backbone.Model();

      view = new Backbone.View({
        model: model
      });

      container = new ChildViewContainer();
    });

    it('should return itself when adding, for chaining methods', function() {
      expect(container.add(view)).to.equal(container);
    });

    it('should return itself when removing, for chaining methods', function() {
      expect(container.remove(view)).to.equal(container);
    });
  });

  describe('iterators and collection functions', function() {
    var container;
    var view;
    var views;

    beforeEach(function() {
      views = [];
      view = new Backbone.View();

      container = new ChildViewContainer();
      container.add(view);

      container.each(function(v) {
        views.push(v);
      });
    });

    it('should provide a .each iterator', function() {
      expect(_.isFunction(container.each)).to.equal(true);
    });

    it('should iterate the views with the .each function', function() {
      expect(views[0]).to.equal(view);
    });

  });

});
