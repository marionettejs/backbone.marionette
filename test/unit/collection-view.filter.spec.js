describe("collection view - filter", function() {
  'use strict';

  beforeEach(function() {
    var spec = this;

    this.passModel = new Backbone.Model({foo: true});
    this.failModel = new Backbone.Model({foo: false});
    this.collection = new Backbone.Collection();

    this.EmptyView = Backbone.Marionette.ItemView.extend({
      template: function() {
        return 'empty';
      }
    });

    this.ChildView = Backbone.Marionette.ItemView.extend({
      template: function(data) {
        return data.foo;
      }
    });

    this.filter = this.sinon.spy(function(child) {
      return child.get('foo');
    });

    this.inverseFilter = this.sinon.spy(function(child) {
      return !spec.filter(child);
    });

    this.CollectionView = Backbone.Marionette.CollectionView.extend({
      emptyView: this.EmptyView,
      childView: this.ChildView,
      filter: this.filter,
      collection: this.collection,
      onBeforeRemoveChild: this.sinon.stub(),
      onRemoveChild: this.sinon.stub()
    });
  });

  describe("_shouldAddChild", function() {
    it("returns the result of the filter", function() {
      var collectionView = new this.CollectionView();
      expect(collectionView._shouldAddChild(this.passModel)).to.be.true;
      expect(collectionView._shouldAddChild(this.failModel)).to.be.false;
    });

    it("will prefer to use the filter supplied at construction", function() {
      var collectionView = new this.CollectionView({
        filter: this.inverseFilter
      });
      expect(collectionView._shouldAddChild(this.passModel)).to.be.false;
      expect(collectionView._shouldAddChild(this.failModel)).to.be.true;
    });

    it("always returns true when no filter is supplied", function() {
      var collectionView = new Backbone.Marionette.CollectionView();
      expect(collectionView._shouldAddChild(this.passModel)).to.be.true;
      expect(collectionView._shouldAddChild(this.failModel)).to.be.true;
    });
  });

  describe("when rendering a collection where some models pass the filter", function() {
    beforeEach(function() {
      this.collection.add(this.passModel);
      this.collection.add(this.failModel);
      this.collectionView = new this.CollectionView();
      this.collectionView.render();
    });

    it('should add children for models accepted by the filter', function() {
      expect(this.collectionView.children.findByModel(this.passModel)).to.exist;
    });

    it('should not add children for models rejected by the filter', function() {
      expect(this.collectionView.children.findByModel(this.failModel)).not.to.exist;
    });

    it('should call the filter method for each model', function() {
      expect(this.filter).to.have.been.calledTwice
        .and.calledOn(this.collectionView)
        .and.calledWith(this.passModel, 0, this.collection)
        .and.calledWith(this.failModel, 1, this.collection);
    });

    it('should contain the view that passed the filter in the DOM', function() {
      expect(this.collectionView.$el).to.contain.$text('true');
    });

    it('children.length corresponds to the number of children displayed', function() {
      expect(this.collectionView.children.length).to.equal(1);
    });

    describe("when a model that fails the filter is removed from the collection", function() {
      beforeEach(function() {
        this.collection.remove(this.failModel);
      });

      it('should not execute onBeforeRemoveChild', function() {
        expect(this.collectionView.onBeforeRemoveChild).not.to.have.been.called;
      });

      it('should not execute onRemoveChild', function() {
        expect(this.collectionView.onRemoveChild).not.to.have.been.called;
      });

      it('children.length corresponds to the number of children displayed', function() {
        expect(this.collectionView.children.length).to.equal(1);
      });
    });

    describe("when resetting the collection with some of the models passing the filter", function() {
      beforeEach(function() {
        this.filter.reset();
        this.newPassModel = this.passModel.clone();
        this.newFailModel = this.failModel.clone();
        this.collection.reset([this.newFailModel, this.newPassModel]);
      });

      it('should add children for models accepted by the filter', function() {
        expect(this.collectionView.children.findByModel(this.newPassModel)).to.exist;
      });

      it('should not add children for models rejected by the filter', function() {
        expect(this.collectionView.children.findByModel(this.newFailModel)).not.to.exist;
      });

      it('should call the filter method for each model', function() {
        expect(this.filter).to.have.been.calledTwice
          .and.calledOn(this.collectionView)
          .and.calledWith(this.newFailModel, 0, this.collection)
          .and.calledWith(this.newPassModel, 1, this.collection);
      });

      it('should contain the view that passed the filter in the DOM', function() {
        expect(this.collectionView.$el).to.contain.$text('true');
      });

      it('children.length corresponds to the number of children displayed', function() {
        expect(this.collectionView.children.length).to.equal(1);
      });
    });

    describe("when resetting the collection with none of the models passing the filter", function() {
      beforeEach(function() {
        this.filter.reset();
        this.newFailModel = this.failModel.clone();
        this.sinon.spy(this.collectionView, 'showEmptyView');
        this.collection.reset([this.newFailModel]);
      });

      it('should not add children for models rejected by the filter', function() {
        expect(this.collectionView.children.findByModel(this.newFailModel)).not.to.exist;
      });

      it('should show the empty view', function() {
        expect(this.collectionView.showEmptyView).to.have.been.calledOnce
          .and.calledOn(this.collectionView);
      });

      it('should contain the empty view in the DOM', function() {
        expect(this.collectionView.$el).to.contain.$text('empty');
      });
    });

    describe("changing the filter", function() {
      beforeEach(function() {
        this.collectionView.filter = this.inverseFilter;
      });

      it("uses the new filter on the next render", function() {
        this.collectionView.render();
        expect(this.collectionView.children.findByModel(this.passModel)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.failModel)).to.exist;
      });
    });

    describe("removing the filter", function() {
      beforeEach(function() {
        this.collectionView.filter = null;
      });

      it("shows all views on the next render", function() {
        this.collectionView.render();
        expect(this.collectionView.children.findByModel(this.passModel)).to.exist;
        expect(this.collectionView.children.findByModel(this.failModel)).to.exist;
      });
    });
  });

  describe("when rendering a collection where no models pass the filter", function() {
    beforeEach(function() {
      this.collection.add(this.failModel);
      this.collectionView = new this.CollectionView();
      this.sinon.spy(this.collectionView, 'showEmptyView');
      this.collectionView.render();
    });

    it('should show the empty view', function() {
      expect(this.collectionView.showEmptyView).to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should contain the empty view in the DOM', function() {
      expect(this.collectionView.$el).to.contain.$text('empty');
    });
  });

  describe("manipulating the collection after rendering with an empty collection", function() {
    beforeEach(function() {
      this.collectionView = new this.CollectionView();
      this.collectionView.render();
      this.sinon.spy(this.collectionView, 'destroyEmptyView');
    });

    describe('when a model is added to the collection but rejected by the filter', function() {
      beforeEach(function() {
        this.collection.add(this.failModel);
      });

      it('should contain the empty view in the DOM', function() {
        expect(this.collectionView.$el).to.contain.$text('empty');
      });

      it('should not destroy the empty view', function() {
        expect(this.collectionView.destroyEmptyView).not.to.have.been.called;
      });
    });

    describe('when a model is added to the collection and is accepted by the filter', function() {
      beforeEach(function() {
        this.collection.add(this.passModel);
      });

      it('should contain the empty view in the DOM', function() {
        expect(this.collectionView.$el).to.contain.$text('true');
      });

      it('should destroy the empty view', function() {
        expect(this.collectionView.destroyEmptyView).to.have.been.calledOnce
          .and.calledOn(this.collectionView);
      });
    });
  });

  describe("combined with a sort", function() {
    beforeEach(function() {
      this.collection.comparator = 'bar';
      this.model1 = new Backbone.Model({foo: true, bar: 1});
      this.model2 = new Backbone.Model({foo: false, bar: 2});
      this.model3 = new Backbone.Model({foo: true, bar: 3});
      this.model4 = new Backbone.Model({foo: false, bar: 4});
      this.collection.reset([this.model2, this.model4, this.model3, this.model1]);

      this.ChildView = Marionette.ItemView.extend({
        template: function(data) {
          return data.bar;
        }
      });
      this.collectionView = new this.CollectionView({childView: this.ChildView});
    });

    describe("when the filter does not change between sorts", function() {
      beforeEach(function() {
        this.collectionView.render();
        this.collection.comparator = function(model) {
          return -model.get('bar');
        };
        this.collection.sort();
      });

      it("only renders views that pass the filter", function() {
        expect(this.collectionView.children.findByModel(this.model1)).to.exist;
        expect(this.collectionView.children.findByModel(this.model2)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model3)).to.exist;
        expect(this.collectionView.children.findByModel(this.model4)).not.to.exist;
      });

      it("renders the views in the correct order", function() {
        expect(this.collectionView.$el).to.contain.$text('31');
      });
    });

    describe("when the filter changes between sorts", function() {
      beforeEach(function() {
        this.collectionView.render();
        this.collectionView.filter = this.inverseFilter;
        this.collection.sort();
      });

      it("only renders views that pass the filter", function() {
        expect(this.collectionView.children.findByModel(this.model1)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model2)).to.exist;
        expect(this.collectionView.children.findByModel(this.model3)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model4)).to.exist;
      });

      it("renders the views in the correct order", function() {
        expect(this.collectionView.$el).to.contain.$text('24');
      });
    });

    describe("when the filter changes between sorts and the collection hasn't changed order", function() {
      beforeEach(function() {
        this.collection.sort();
        this.collectionView.render();
        this.collectionView.filter = this.inverseFilter;
        this.collection.sort();
      });

      it("only renders views that pass the filter", function() {
        expect(this.collectionView.children.findByModel(this.model1)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model2)).to.exist;
        expect(this.collectionView.children.findByModel(this.model3)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model4)).to.exist;
      });

      it("renders the views in the correct order", function() {
        expect(this.collectionView.$el).to.contain.$text('24');
      });
    });
  });

  describe("combined with a reorder", function() {
    beforeEach(function() {
      this.collection.comparator = 'bar';
      this.model1 = new Backbone.Model({foo: true, bar: 1});
      this.model2 = new Backbone.Model({foo: false, bar: 2});
      this.model3 = new Backbone.Model({foo: true, bar: 3});
      this.model4 = new Backbone.Model({foo: false, bar: 4});
      this.collection.reset([this.model2, this.model4, this.model3, this.model1]);

      this.ChildView = Marionette.ItemView.extend({
        template: function(data) {
          return data.bar;
        }
      });
      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        reorderOnSort: true
      });
    });

    describe("when the filter does not change between sorts", function() {
      beforeEach(function() {
        this.collectionView.render();
        this.collection.comparator = function(model) {
          return -model.get('bar');
        };
        this.collection.sort();
      });

      it("only renders views that pass the filter", function() {
        expect(this.collectionView.children.findByModel(this.model1)).to.exist;
        expect(this.collectionView.children.findByModel(this.model2)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model3)).to.exist;
        expect(this.collectionView.children.findByModel(this.model4)).not.to.exist;
      });

      it("renders the views in the correct order", function() {
        expect(this.collectionView.$el).to.contain.$text('31');
      });
    });

    describe("when the filter changes between sorts", function() {
      beforeEach(function() {
        this.collectionView.render();
        this.collectionView.filter = this.inverseFilter;
        this.collection.sort();
      });

      it("only renders views that pass the filter", function() {
        expect(this.collectionView.children.findByModel(this.model1)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model2)).to.exist;
        expect(this.collectionView.children.findByModel(this.model3)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model4)).to.exist;
      });

      it("renders the views in the correct order", function() {
        expect(this.collectionView.$el).to.contain.$text('24');
      });
    });

    describe("when the filter changes between sorts and the collection hasn't changed order", function() {
      beforeEach(function() {
        this.collection.sort();
        this.collectionView.render();
        this.collectionView.filter = this.inverseFilter;
        this.collection.sort();
      });

      it("only renders views that pass the filter", function() {
        expect(this.collectionView.children.findByModel(this.model1)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model2)).to.exist;
        expect(this.collectionView.children.findByModel(this.model3)).not.to.exist;
        expect(this.collectionView.children.findByModel(this.model4)).to.exist;
      });

      it("renders the views in the correct order", function() {
        expect(this.collectionView.$el).to.contain.$text('24');
      });
    });
  });
});
