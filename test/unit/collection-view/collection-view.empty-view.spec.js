describe('collectionview - emptyView', function() {
  'use strict';

  beforeEach(function() {
    this.View = Backbone.Marionette.View.extend({
      tagName: 'span',
      template: _.template('<%= foo %>')
    });

    this.EmptyView = Backbone.Marionette.View.extend({
      tagName: 'span',
      template: _.template('empty')
    });

    this.EmptyCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: this.View,
      emptyView: this.EmptyView,

      onBeforeRenderEmpty: function() {},
      onRenderEmpty: function() {},
      onBeforeRemoveEmpty: function() {},
      onRemoveEmpty: function() {},
      onBeforeAttach: function() {},
      onAttach: function() {}
    });
  });

  describe('when rendering a collection view with an empty collection', function() {
    beforeEach(function() {
      this.childRenderSpy = this.sinon.spy();
      this.collection = new Backbone.Collection();
      this.CollectionView = this.EmptyCollectionView.extend({
        childViewEvents: {
          'render': this.childRenderSpy
        }
      });

      this.collectionView = new this.CollectionView({
        collection: this.collection,
      });

      this.beforeRenderSpy = this.sinon.spy(this.collectionView, 'onBeforeRenderEmpty');
      this.renderSpy = this.sinon.spy(this.collectionView, 'onRenderEmpty');

      this.collectionView.render();
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span>empty</span>');
    });

    it('should emit emptyView events', function() {
      expect(this.childRenderSpy)
      .to.have.been.calledOnce;
    });

    it('should call "onBeforeRenderEmpty"', function() {
      expect(this.beforeRenderSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should call "onRenderEmpty"', function() {
      expect(this.renderSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should reference each of the rendered view items', function() {
      expect(this.collectionView.children).to.have.lengthOf(1);
    });

    describe('and then adding an item to the collection', function() {
      beforeEach(function() {
        this.destroySpy = this.sinon.spy(this.EmptyView.prototype, 'destroy');
        this.beforeRemoveSpy = this.sinon.spy(this.collectionView, 'onBeforeRemoveEmpty');
        this.removeSpy = this.sinon.spy(this.collectionView, 'onRemoveEmpty');
        this.collection.add({foo: 'wut'});
      });

      it('should destroy the emptyView', function() {
        expect(this.destroySpy).to.have.been.called;
      });

      it('should call "onBeforeRemoveEmpty"', function() {
        expect(this.beforeRemoveSpy)
          .to.have.been.calledOnce
          .and.calledOn(this.collectionView);
      });

      it('should call "onRemoveEmpty"', function() {
        expect(this.removeSpy)
          .to.have.been.calledOnce
          .and.calledOn(this.collectionView);
      });

      it('should show the new item', function() {
        expect(this.collectionView.$el).to.have.$text('wut');
      });
    });
  });

  describe('when the emptyView has been rendered for an empty collection and then collection reset, receiving some values. Then adding an item to the collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.destroySpy = this.sinon.spy(this.EmptyView.prototype, 'destroy');
      this.beforeRemoveSpy = this.sinon.spy(this.collectionView, 'onBeforeRemoveEmpty');
      this.removeSpy = this.sinon.spy(this.collectionView, 'onRemoveEmpty');

      this.collectionView.render();
      this.collection.reset([{foo: 'bar'}, {foo: 'baz'}]);
      this.collection.add({foo: 'wut'});
    });

    it('should destroy the emptyView', function() {
      expect(this.destroySpy).to.have.been.called;
    });

    it('should call "onBeforeRemoveEmpty"', function() {
      expect(this.beforeRemoveSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should call "onRemoveEmpty"', function() {
      expect(this.removeSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should show all three items without empty view', function() {
      expect(this.collectionView.$el).to.have.$html('<span>bar</span><span>baz</span><span>wut</span>');
    });
  });

  describe('when the last item is removed from a collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{foo: 'wut'}]);
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.beforeRenderSpy = this.sinon.spy(this.collectionView, 'onBeforeRenderEmpty');
      this.renderSpy = this.sinon.spy(this.collectionView, 'onRenderEmpty');

      this.collectionView.render();
      this.collection.remove(this.collection.at(0));
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span>empty</span>');
    });

    it('should call "onBeforeRenderEmpty"', function() {
      expect(this.beforeRenderSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should call "onRenderEmpty"', function() {
      expect(this.renderSpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should reference each of the rendered view items', function() {
      expect(this.collectionView.children).to.have.lengthOf(1);
    });
  });

  describe('when the collection is reset multiple times', function() {
    beforeEach(function() {
      this.population = [{foo: 1}, {foo: 2}, {foo: 3}];
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });
      this.collectionView.render();
    });

    it('should remove all EmptyView', function() {
      this.collection.reset();
      this.collection.reset(this.population);
      expect(this.collectionView.$el).not.to.have.$html('<span>empty</span>');
    });

    it('should have only one emptyView open', function() {
      this.collection.reset(this.population);
      this.collection.reset();
      expect(this.collectionView.$el).to.have.$html('<span>empty</span>');
    });
  });

  describe('when a collection is reset with empty data after the view is shown', function() {
    beforeEach(function() {
      this.data = [{foo: 'bar'}, {foo: 'baz'}];
      this.collection = new Backbone.Collection(this.data);
      this.setFixtures('<div id="region"></div>');
      this.region = new Backbone.Marionette.Region({
        el: '#region'
      });

      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection,
        emptyView: this.EmptyView
      });

      this.beforeAttachEmptySpy = this.sinon.spy(this.collectionView, 'onBeforeAttach');
      this.attachEmptySpy = this.sinon.spy(this.collectionView, 'onAttach');

      this.region.show(this.collectionView);
      this.collection.reset();
    });

    it('should call "onBeforeAttach"', function() {
      expect(this.beforeAttachEmptySpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });

    it('should call "onAttach"', function() {
      expect(this.attachEmptySpy)
        .to.have.been.calledOnce
        .and.calledOn(this.collectionView);
    });
  });

  describe('when a collection is reset with empty data after the view is loaded', function() {
    beforeEach(function() {
      this.data = [{foo: 'bar'}, {foo: 'baz'}];
      this.collection = new Backbone.Collection(this.data);

      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection,
        emptyView: this.EmptyView
      });

      this.collectionView.render();
      this.collection.reset();
    });

    it('should have 1 child view (empty view)', function() {
      expect(this.collectionView.children).to.have.lengthOf(1);
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span>empty</span>');
    });

    it('should not have the empty child view after resetting with data', function() {
      this.collection.reset(this.data);
      expect(this.collectionView.$el).to.have.$html('<span>bar</span><span>baz</span>');
    });
  });

  describe('when emptyView is specified as a function', function() {
    beforeEach(function() {
      this.OtherEmptyView = Marionette.View.extend({
        template: _.template('other empty')
      });
      this.emptyViewStub = this.sinon.stub().returns(this.OtherEmptyView);

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.View,
        emptyView: this.emptyViewStub
      });
    });

    describe('when rendering a collection view with an empty collection', function() {
      beforeEach(function() {
        this.collection = new Backbone.Collection();
        this.collectionView = new this.CollectionView({
          collection: this.collection
        });

        this.collectionView.render();
      });

      it('renders other empty view instance', function() {
        expect(this.collectionView.$el).to.have.$html('<div>other empty</div>');
      });
    });
  });

  describe('isEmpty', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.collectionView.render();
    });

    it('should return true when the collection is empty', function() {
      expect(this.collectionView.isEmpty()).to.be.true;
    });

    it('should return false when the collection is not empty', function() {
      this.collectionView.collection.add({foo: 'wut'});
      expect(this.collectionView.isEmpty()).to.be.false;
    });

    describe('when overriding with a populated collection', function() {
      beforeEach(function() {
        this.isEmptyStub = this.sinon.stub().returns(true);

        this.collection = new Backbone.Collection([{foo: 'wut'}, {foo: 'wat'}]);
        this.OverriddenIsEmptyCollectionView = this.EmptyCollectionView.extend({
          isEmpty: this.isEmptyStub
        });
        this.collectionView = new this.OverriddenIsEmptyCollectionView({
          collection: this.collection
        });

        this.collectionView.render();
      });

      it('should append the html for the emptyView', function() {
        expect(this.collectionView.$el).to.have.$html('<span>empty</span>');
      });

      it('should reference each of the rendered view items', function() {
        expect(this.collectionView.children).to.have.lengthOf(1);
      });
    });

    describe('with a filter', function() {
      beforeEach(function() {
        this.collection.reset([{foo: true}, {foo: false}]);
      });

      it('returns false if any of the models pass the filter', function() {
        this.collectionView.filter = function(model) {
          return model.get('foo');
        };
        expect(this.collectionView.isEmpty()).to.be.false;
      });

      it('returns true if none of the models pass the filter', function() {
        this.collectionView.filter = function() {
          return false;
        };
        expect(this.collectionView.isEmpty()).to.be.true;
      });
    });
  });

  describe('when reorder is called with an emptyView', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([]);
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection
      });

      this.collectionView.render();

      this.collectionView.reorder();
    });

    it('should append the html for the emptyView', function() {
      expect(this.collectionView.$el).to.have.$html('<span>empty</span>');
    });
  });

  describe('when rendering and an "emptyViewOptions" is provided', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection,
        emptyViewOptions: {
          foo: 'bar',
          tagName: 'p'
        }
      });

      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('should pass the options to the empty view instance', function() {
      expect(this.view.options).to.have.property('foo', 'bar');
    });

    it('overrides options of emptyView class', function() {
      expect(this.collectionView.$el).to.have.$html('<p>empty</p>');
    });

    describe('when "emptyViewOptions" is provided as a function', function() {
      beforeEach(function() {
        this.collection = new Backbone.Collection();
        this.collectionView = new this.EmptyCollectionView({
          collection: this.collection,
          emptyViewOptions: function() {
            return {
              foo: 'bar',
              collection: this.collection
            };
          }
        });

        this.collectionView.render();
        this.view = this.collectionView.children.findByIndex(0);
      });

      it('should pass the options to the empty view instance', function() {
        expect(this.view.options).to.be.have.property('foo', 'bar');
      });

      it('should pass the collectionView as the context', function() {
        expect(this.view.options).to.have.property('collection', this.collection);
      });
    });

    describe('when "childViewOptions" are also provided', function() {
      beforeEach(function() {
        this.collection = new Backbone.Collection();
        this.collectionView = new this.EmptyCollectionView({
          collection: this.collection,
          childViewOptions: {foo: 'bar'},
          emptyViewOptions: {foo: 'baz'}
        });

        this.collectionView.render();
        this.view = this.collectionView.children.findByIndex(0);
      });

      it('passes the options to the empty view instance correctly', function() {
        expect(this.view.options).to.have.property('foo', 'baz');
      });
    });
  });

  describe('when rendering and only "childViewOptions" are provided', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.EmptyCollectionView({
        collection: this.collection,
        childViewOptions: {foo: 'bar'}
      });

      this.collectionView.render();
      this.view = this.collectionView.children.findByIndex(0);
    });

    it('passes the options to the empty view instance', function() {
      expect(this.view.options).to.have.property('foo', 'bar');
    });
  });
});
