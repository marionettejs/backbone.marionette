describe('collection view', function() {
  'use strict';

  beforeEach(function() {
    // Shared View Definitions
    // -----------------------
    this.ChildView = Backbone.View.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    this.MnChildView = Marionette.View.extend({
      tagName: 'span',
      render: function() {
        this.trigger('before:render', this);
        this.$el.html(this.model.get('foo'));
        this.trigger('render', this);
      }
    });

    this.CollectionView = Marionette.CollectionView.extend({
      childView: this.ChildView
    });
  });

  // Collection View Specs
  // ---------------------

  describe('when instantiating a CollectionView', function() {
    it('should trigger `initialize` on the behaviors', function() {
      this.sinon.stub(this.CollectionView.prototype, '_triggerEventOnBehaviors');

      const myCollectionView = new this.CollectionView();

      // _triggerEventOnBehaviors comes from Behaviors mixin
      expect(myCollectionView._triggerEventOnBehaviors)
        .to.be.calledOnce.and.calledWith('initialize', myCollectionView);
    });
  });

  describe('when a collection view is DOM', function() {
    beforeEach(function() {
      this.$fixtureEl = $('<div id="fixture-collectionview"><span id="el1">1</span></div>');
    });

    describe('and it\'s not attached to the document', function() {
      beforeEach(function() {
        this.collectionView = new this.CollectionView({el: this.$fixtureEl[0]});
        this.view1 = this.collectionView.addChildView(new Backbone.View({el: this.$fixtureEl.children()[0]}), 0);
      });

      it('should have _isAttached set to false', function() {
        expect(this.collectionView).to.have.property('_isAttached', false);
      });

      it('should have a child view without _isAttached', function() {
        expect(this.view1).to.not.have.property('_isAttached');
      });
    });

    describe('and it\'s attached to the document', function() {
      beforeEach(function() {
        this.setFixtures(this.$fixtureEl);
        this.collectionView = new this.CollectionView({el: '#fixture-collectionview'});
        this.view1 = this.collectionView.addChildView(new Backbone.View({el: '#el1'}), 0);
      });

      it('should have _isAttached set to true', function() {
        expect(this.collectionView).to.have.property('_isAttached', true);
      });

      it('should have a child view with _isAttached set to true', function() {
        expect(this.view1).to.have.property('_isAttached', true);
      });
    });

  });

  describe('before rendering a collection view', function() {
    beforeEach(function() {
      var CollectionView = this.CollectionView.extend({
        sort: function() { return 1; },
        onAddChild: this.sinon.stub(),
        onRemoveChild: this.sinon.stub()
      });

      this.collection = new Backbone.Collection([]);
      this.collectionView = new CollectionView({
        collection: this.collection
      });

      this.sinon.spy(this.collectionView, '_sortViews');
    });

    it('should not add a child', function() {
      this.collection.push({});
      expect(this.collectionView.onAddChild).to.not.have.been.called;
    });

    it('should not add a child', function() {
      this.collection.reset([{}]);
      expect(this.collectionView.onAddChild).to.not.have.been.called;
    });

    it('should not remove a child', function() {
      var model = new Backbone.Model();
      this.collection.add(model);
      this.collection.remove(model);
      expect(this.collectionView.onRemoveChild).to.not.have.been.called;
    });

    it('should not call sort', function() {
      this.collection.trigger('sort');
      expect(this.collectionView._sortViews).to.not.have.been.called;
    });
  });

  describe('when rendering a collection view with no "childView" specified', function() {
    beforeEach(function() {
      this.NoChildView = this.CollectionView.extend({
        childView: undefined
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
      this.collectionView = new this.NoChildView({
        collection: this.collection
      });
    });

    it('should throw an error saying theres not child view', function() {
      expect(this.collectionView.render).to.throw('A "childView" must be specified');
    });
  });

  describe('when rendering a collection view', function() {
    beforeEach(function() {
      var CollectionView = this.CollectionView.extend({
        childViewEvents: {
          'render': 'onChildViewRender'
        },
        onBeforeRender: function() { return this.isRendered(); },
        onRender: function() { return this.isRendered(); },
        onBeforeAddChild: this.sinon.stub(),
        onAddChild: this.sinon.stub(),
        onBeforeRenderChildren: this.sinon.stub(),
        onRenderChildren: this.sinon.stub(),
        onChildViewRender: this.sinon.stub()
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
      this.collectionView = new CollectionView({
        collection: this.collection
      });

      this.sinon.spy(this.collectionView, 'onBeforeRender');
      this.sinon.spy(this.collectionView, 'onRender');
      this.sinon.spy(this.collectionView, 'trigger');
      this.sinon.spy(this.collectionView, 'attachHtml');
      this.sinon.spy(this.collectionView, 'attachBuffer');
      this.sinon.spy(this.collectionView, '_startBuffering');
      this.sinon.spy(this.collectionView, '_endBuffering');
      this.sinon.spy(this.collectionView, 'addChildView');

      this.collectionView.render();
    });

    it('should only call attachBuffer once', function() {
      expect(this.collectionView.attachBuffer.callCount).to.equal(1);
    });

    it('should only call clear render buffer once', function() {
      expect(this.collectionView._endBuffering.callCount).to.equal(1);
    });

    it('should add to render buffer once for each child', function() {
      expect(this.collectionView.attachHtml.callCount).to.equal(2);
    });

    it('should only call onRenderChildren once', function() {
      expect(this.collectionView.onRenderChildren).to.have.been.calledOnce;
    });

    it('should only call onBeforeRenderChildren once', function() {
      expect(this.collectionView.onBeforeRenderChildren).to.have.been.calledOnce;
    });

    it('should append the html for each childView', function() {
      expect($(this.collectionView.$el)).to.have.$html('<span>bar</span><span>baz</span>');
    });

    it('should provide the index for each childView, when appending', function() {
      expect(this.collectionView.attachHtml.firstCall.args[2]).to.equal(0);
    });

    it('should reference each of the rendered view children', function() {
      expect(_.size(this.collectionView.children)).to.equal(2);
    });

    it('should call "onBeforeRender" before rendering', function() {
      expect(this.collectionView.onBeforeRender).to.have.been.called;
    });

    it('should call "onRender" after rendering', function() {
      expect(this.collectionView.onRender).to.have.been.called;
    });

    it('should call "onBeforeRender" before "onRender"', function() {
      expect(this.collectionView.onBeforeRender).to.have.been.calledBefore(this.collectionView.onRender);
    });

    it('should not be rendered when "onBeforeRender" is called', function() {
      expect(this.collectionView.onBeforeRender.lastCall.returnValue).to.not.be.ok;
    });

    it('should be rendered when "onRender" is called', function() {
      expect(this.collectionView.onRender.lastCall.returnValue).to.be.true;
    });

    it('should trigger a "before:render" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('before:render', this.collectionView);
    });

    it('should trigger a "before:render:children" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('before:render:children', this.collectionView);
    });

    it('should trigger a "render:children" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('render:children', this.collectionView);
    });

    it('should trigger a "render" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('render', this.collectionView);
    });

    it('should call "onBeforeAddChild" for each childView instance', function() {
      var v1 = this.collectionView.children.findByIndex(0);
      var v2 = this.collectionView.children.findByIndex(1);
      expect(this.collectionView.onBeforeAddChild).to.have.been.calledWith(this.collectionView, v1);
      expect(this.collectionView.onBeforeAddChild).to.have.been.calledWith(this.collectionView, v2);
    });

    it('should call "onAddChild" for each childView instance', function() {
      var v1 = this.collectionView.children.findByIndex(0);
      var v2 = this.collectionView.children.findByIndex(1);
      expect(this.collectionView.onAddChild).to.have.been.calledWith(this.collectionView, v1);
      expect(this.collectionView.onAddChild).to.have.been.calledWith(this.collectionView, v2);
    });

    it('should call "onBeforeAddChild" for all childView instances', function() {
      expect(this.collectionView.onBeforeAddChild.callCount).to.equal(2);
    });

    it('should call "onAddChild" for all childView instances', function() {
      expect(this.collectionView.onAddChild.callCount).to.equal(2);
    });

    it('should trigger "childview:render" for each item in the collection', function() {
      expect(this.collectionView.onChildViewRender.callCount).to.equal(2);
    });

    it('should call `addChildView` for each item in the collection', function() {
      var v1 = this.collectionView.children.findByIndex(0);
      var v2 = this.collectionView.children.findByIndex(1);
      expect(this.collectionView.addChildView).to.have.been.calledTwice.
        and.calledWith(v1).
        and.calledWith(v2);
    });

    it('should be marked rendered', function() {
      expect(this.collectionView).to.have.property('_isRendered', true);
    });
  });

  describe('when defining childView as a function that returns a view class', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{id: 1, name: 'one'}, {id: 2, name: 'two'}]);

      var EvenView = Marionette.View.extend({
        tagName: 'span',
        template: _.template('My name is <%= name %>. I am even.')
      });

      var OddView = Marionette.View.extend({
        tagName: 'article',
        template: _.template('My name is <%= name %>. I am odd.')
      });

      this.collectionView = new this.CollectionView({
        collection: this.collection,
        childView: function(child) {
          return child.get('id') % 2 === 0 ? EvenView : OddView;
        }
      });

      this.collectionView.render();
    });

    it('should use the correct view class for each child', function() {
      expect(this.collectionView.$el).to.have.$html('<article>My name is one. I am odd.</article><span>My name is two. I am even.</span>');
    });

  });

  describe('when defining childView as neither a function or a class', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{id: 1, name: 'one'}, {id: 2, name: 'two'}]);

      this.collectionView = new this.CollectionView({
        collection: this.collection,
        childView: 'invalid childView'
      });
    });

    it('should throw an error saying the childView is invalid', function() {
      expect(this.collectionView.render).to.throw('"childView" must be a view class or a function that returns a view class');
    });
  });

  describe('when rendering a collection view and accessing children via the DOM', function() {
    beforeEach(function() {
      var suite = this;

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);

      var CollectionView = this.CollectionView.extend({
        onRenderChildren: function() {
          suite.onRenderChildrenHTML = this.el.innerHTML;
        }
      });
      this.collectionView = new CollectionView({
        collection: this.collection,
      });
      sinon.spy(this.collectionView, 'onRenderChildren');
      this.collectionView.render();
    });

    it('should find the expected number of childen', function() {
      expect(this.onRenderChildrenHTML).to.equal('<span>bar</span><span>baz</span>');
    });
  });

  describe('when rendering a collection view without a collection', function() {
    beforeEach(function() {
      var CollectionView = this.CollectionView.extend({
        onRender: this.sinon.stub(),
        onBeforeRender: this.sinon.stub()
      });
      this.collectionView = new CollectionView();

      this.sinon.spy(this.collectionView, 'trigger');

      this.collectionView.render();
    });

    it('should not append any html', function() {
      expect($(this.collectionView.$el)).not.to.have.$html('<span>bar</span><span>baz</span>');
    });

    it('should not reference any view children', function() {
      expect(this.collectionView.children.length).to.equal(0);
    });
  });

  describe('when rendering a childView', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.model = new Backbone.Model({foo: 'bar'});
      var ChildView = this.ChildView.extend({
        constructor: function() {
          ChildView.__super__.constructor.apply(this, arguments);
          sinon.spy(this, 'render');
        }
      });
      this.collectionView = new this.CollectionView({
        childView: ChildView,
        collection: this.collection
      });
      this.collectionView.render();
      this.childView = this.collectionView._addChild(this.model, 0);
    });

    it('should call "render" on the childView', function() {
      expect(this.childView.render).to.have.been.calledOnce;
    });

    it('should not render childView twice', function() {
      this.collectionView._renderView(this.childView);

      expect(this.childView.render).to.not.have.been.calledTwice;
    });
  });

  describe('when sorting a collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{
        foo: 'foo'
      }, {
        foo: 'bar'
      }, {
        foo: 'biz'
      }, {
        foo: 'baz'
      }
      ]);
      this.collection.comparator = function(model) {
        return model.get('foo');
      };
    });

    it('should not update the order of children when "sort" is set to "false" as a property on a class', function() {
      this.collectionView = new this.CollectionView({
        sort: false,
        collection: this.collection
      });
      this.collectionView.render();

      this.collection.sort();
      expect($(this.collectionView.$('span').first())).to.contain.$text('foo');
    });

    it('should not update the order of children when "sort" is set to "false" inside options', function() {
      this.collectionView = new this.CollectionView({
        sort: false,
        collection: this.collection
      });
      this.collectionView.render();

      this.collection.sort();
      expect($(this.collectionView.$('span').first())).to.contain.$text('foo');
    });
  });

  describe('when instantiating a view with a different sort option than in the view\'s definition', function() {
    it('should maintain the instantiated sort option', function() {
      var CollectionView = this.CollectionView.extend({sort: false});
      this.newCollectionView = new CollectionView({sort: true});
      expect(this.newCollectionView.getOption('sort')).to.equal(true);
    });
  });

  describe('when a model is added to the collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
      this.collectionView.render();

      this.childViewRender = this.sinon.stub();
      this.collectionView.on('childview:render', this.childViewRender);

      this.sinon.spy(this.collectionView, 'attachHtml');

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection.add(this.model);
    });

    it('should add the model to the list', function() {
      expect(_.size(this.collectionView.children)).to.equal(1);
    });

    it('should render the model in to the DOM', function() {
      expect($(this.collectionView.$el)).to.contain.$text('bar');
    });

    it('should provide the index for each childView, when appending', function() {
      expect(this.collectionView.attachHtml.firstCall.args[2]).to.equal(0);
    });

    it('should trigger the childview:render event from the collectionView', function() {
      expect(this.childViewRender).to.have.been.called;
    });
  });

  describe('when a model is added to a non-empty collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection({foo: 'bar'});

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
      this.collectionView.render();

      this.childViewRender = this.sinon.stub();
      this.collectionView.on('childview:render', this.childViewRender);

      this.sinon.spy(this.collectionView, 'attachHtml');

      this.model = new Backbone.Model({foo: 'baz'});
      this.collection.add(this.model);
    });

    it('should add the model to the list', function() {
      expect(_.size(this.collectionView.children)).to.equal(2);
    });

    it('should render the model in to the DOM', function() {
      expect($(this.collectionView.$el)).to.contain.$text('barbaz');
    });

    it('should provide the index for each child view, when appending', function() {
      expect(this.collectionView.attachHtml.firstCall.args[2]).to.equal(1);
    });

    it('should trigger the childview:render event from the collectionView', function() {
      expect(this.childViewRender).to.have.been.called;
    });
  });

  describe('when a number of models are added to a non-empty collection with an "at" option', function() {
    beforeEach(function() {
      this.model1 = new Backbone.Model({foo: 1});
      this.model2 = new Backbone.Model({foo: 6});
      this.collection = new Backbone.Collection([this.model1, this.model2]);

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
      this.collectionView.render();

      this.model3 = new Backbone.Model({foo: 2});
      this.model4 = new Backbone.Model({foo: 5});
      this.collection.add([this.model3, this.model4], {at: 1});

      this.model5 = new Backbone.Model({foo: 3});
      this.model6 = new Backbone.Model({foo: 4});
      this.collection.add([this.model5, this.model6], {at: 2});

      this.order = _.map(this.collectionView.$el.find('span'), 'innerHTML');
    });

    it('should add models and render views in right order', function() {
      expect(this.order).to.deep.equal(['1', '2', '3', '4', '5', '6']);
    });

    describe('when the CollectionView has a filter', function() {
      beforeEach(function() {
        this.collectionView.filter = function(child) {
          return child.get('foo') > 4;
        };

        this.collectionView.render();
        this.collection.add([new Backbone.Model({foo: 10})], {at: 1});
        this.orderWithFilter = _.map(this.collectionView.$el.find('span'), 'innerHTML');

        this.collectionView.filter = null;
        this.collectionView.render();
        this.orderWithoutFilter = _.map(this.collectionView.$el.find('span'), 'innerHTML');
      });

      it('should render views in the right order', function() {
        expect(this.orderWithFilter).to.deep.equal(['10', '5', '6']);
      });

      it('should maintain view order after filter is removed', function() {
        expect(this.orderWithoutFilter).to.deep.equal(['1', '10', '2', '3', '4', '5', '6']);
      });
    });

    describe('when the CollectionView has a comparator', function() {
      beforeEach(function() {
        this.collectionView.viewComparator = 'foo';

        this.collectionView.render();
        this.collection.add([new Backbone.Model({foo: 10})], {at: 1});
        this.orderBeforeRerender = _.map(this.collectionView.$el.find('span'), 'innerHTML');

        this.collectionView.render();
        this.orderAfterRerender = _.map(this.collectionView.$el.find('span'), 'innerHTML');
      });

      it('should render views in comparator order overridden by `at` model adds since the last `render()`', function() {
        expect(this.orderBeforeRerender).to.deep.equal(['1', '10', '2', '3', '4', '5', '6']);
      });

      it('should return view to comparator order after subsequent `render()`', function() {
        expect(this.orderAfterRerender).to.deep.equal(['1', '2', '3', '4', '5', '6', '10']);
      });
    });

    describe('when the CollectionView has a filter and a comparator', function() {
      beforeEach(function() {
        this.collectionView.filter = function(child) {
          return child.get('foo') > 4;
        };
        this.collectionView.viewComparator = 'foo';

        this.collectionView.render();
        this.collection.add([new Backbone.Model({foo: 10})], {at: 1});
        this.orderBeforeRerender = _.map(this.collectionView.$el.find('span'), 'innerHTML');

        this.collectionView.render();
        this.orderAfterRerender = _.map(this.collectionView.$el.find('span'), 'innerHTML');

        this.collectionView.filter = null;
        this.collectionView.render();
        this.orderWithoutFilter = _.map(this.collectionView.$el.find('span'), 'innerHTML');
      });

      it('should render views in comparator order overriden by `at` model adds and, lastly, filtered', function() {
        expect(this.orderBeforeRerender).to.deep.equal(['10', '5', '6']);
      });

      it('should render views in comparator order but still filtered after subsequent `render()`', function() {
        expect(this.orderAfterRerender).to.deep.equal(['5', '6', '10']);
      });

      it('should render all views in comparator order after filter is removed', function() {
        expect(this.orderWithoutFilter).to.deep.equal(['1', '2', '3', '4', '5', '6', '10']);
      });
    });
  });

  describe('when firing an `add` event on the collection with `at` but without `index`, BB < 1.2 style', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([{foo: 1}, {foo: 3}]);
      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
      this.collectionView.render();

      this.collection.add({foo: 2}, {at: 1, silent: true});
      var model = this.collection.at(1);
      this.collection.trigger('add', model, this.collection, {at: 1});
      this.order = _.map(this.collectionView.$el.find('span'), 'innerHTML').join('');
    });

    it('should render views in `at` order', function() {
      expect(this.order).to.equal('123');
    });
  });

  describe('when providing a custom render that adds children, without a collection object to use, and removing a child', function() {
    beforeEach(function() {
      var suite = this;

      this.model = new Backbone.Model({foo: 'bar'});

      this.EmptyView = Backbone.View.extend({
        render: function() {}
      });

      this.CollectionView = this.CollectionView.extend({
        emptyView: this.EmptyView,
        childView: this.MnChildView,

        onBeforeRenderEmpty: function() {},
        onRenderEmpty: function() {},

        render: function() {
          this._addChild(suite.model, 0);
        }
      });

      this.collectionView = new this.CollectionView({});
      this.collectionView.render();

      this.childView = this.collectionView.children.findByIndex(0);

      this.beforeRenderSpy = this.sinon.spy(this.collectionView, 'onBeforeRenderEmpty');
      this.renderSpy = this.sinon.spy(this.collectionView, 'onRenderEmpty');
      this._removeChildModelsSpy = this.sinon.spy(this.collectionView, '_removeChildModels');

      this.sinon.spy(this.childView, 'destroy');
      this.sinon.spy(this.EmptyView.prototype, 'render');

      this.collectionView._removeChildModels([this.model]);
    });

    it('should destroy the models view', function() {
      expect(this.childView.destroy).to.have.been.called;
    });

    it('should show the empty view', function() {
      expect(this.EmptyView.prototype.render.callCount).to.equal(1);
    });

    it('should call "onBeforeRenderEmpty"', function() {
      expect(this.beforeRenderSpy).to.have.been.called;
    });

    it('should call "onRenderEmpty"', function() {
      expect(this.renderSpy).to.have.been.called;
    });

    it('should call "_removeChildModels"', function() {
      expect(this._removeChildModelsSpy).to.have.been.called
                                        .and.to.have.been.calledWith([this.model]);
    });
  });

  describe('when a model is removed from the collection', function() {
    beforeEach(function() {
      var CollectionView = this.CollectionView.extend({
        childView: this.MnChildView,
        onBeforeRemoveChild: this.sinon.stub(),
        onRemoveChild: this.sinon.stub()
      });

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection();
      this.collection.add(this.model);

      this.collectionView = new CollectionView({
        collection: this.collection
      });
      this.collectionView.render();

      this.childView = this.collectionView.children.findByIndex(0);

      this.sinon.spy(this.childView, 'destroy');

      this.collection.remove(this.model);
    });

    it('should destroy the models view', function() {
      expect(this.childView.destroy).to.have.been.called;
    });

    it('should remove the model-views HTML', function() {
      expect($(this.collectionView.$el).children().length).to.equal(0);
    });

    it('should execute onBeforeRemoveChild', function() {
      expect(this.collectionView.onBeforeRemoveChild).to.have.been.calledOnce;
    });

    it('should pass the removed view to onBeforeRemoveChild', function() {
      expect(this.collectionView.onBeforeRemoveChild).to.have.been.calledWithExactly(this.collectionView, this.childView);
    });

    it('should execute onRemoveChild', function() {
      expect(this.collectionView.onRemoveChild).to.have.been.calledOnce;
    });

    it('should pass the removed view to _onCollectionRemove', function() {
      expect(this.collectionView.onRemoveChild).to.have.been.calledWithExactly(this.collectionView, this.childView);
    });

    it('should execute onBeforeRemoveChild before _onCollectionRemove', function() {
      expect(this.collectionView.onBeforeRemoveChild).to.have.been.calledBefore(this.collectionView.onRemoveChild);
    });
  });

  describe('when destroying a collection view', function() {
    beforeEach(function() {
      this.EventedView = this.CollectionView.extend({
        childView: this.MnChildView,
        someCallback: function() {},
        onBeforeDestroy: function() {
          return {
            isRendered: this.isRendered(),
            isDestroyed: this.isDestroyed()
          };
        },
        onDestroy: function() {
          return {
            isRendered: this.isRendered(),
            isDestroyed: this.isDestroyed()
          };
        }
      });

      this.destroyHandler = this.sinon.stub();

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
      this.collectionView = new this.EventedView({
        template: '#itemTemplate',
        collection: this.collection
      });
      this.collectionView.someViewCallback = function() {};
      this.collectionView.render();

      this.childModel = this.collection.at(0);
      this.childView = this.collectionView.children.findByIndex(0);

      this.collectionView.listenTo(this.collection, 'foo', this.collectionView.someCallback);
      this.collectionView.listenTo(this.collectionView, 'item:foo', this.collectionView.someViewCallback);

      this.sinon.spy(this.childView, 'destroy');
      this.sinon.spy(this.collectionView, 'stopListening');
      this.sinon.spy(this.collectionView, 'removeEl');
      this.sinon.spy(this.collectionView, 'someCallback');
      this.sinon.spy(this.collectionView, 'someViewCallback');
      this.sinon.spy(this.collectionView, 'destroy');
      this.sinon.spy(this.collectionView, 'onDestroy');
      this.sinon.spy(this.collectionView, 'onBeforeDestroy');
      this.sinon.spy(this.collectionView, 'trigger');
      this.sinon.spy(this.collectionView, 'isEmpty');

      this.collectionView.bind('destroy:children', this.destroyHandler);

      this.collectionView.destroy();

      this.childView.trigger('foo');

      this.collection.trigger('foo');
      this.collection.remove(this.childModel);
    });

    it('should destroy all of the child views', function() {
      expect(this.childView.destroy).to.have.been.called;
    });

    it('should unbind all the listenTo events', function() {
      expect(this.collectionView.stopListening).to.have.been.called;
    });

    it('should unbind all collection events for the view', function() {
      expect(this.collectionView.someCallback).not.to.have.been.called;
    });

    it('should unbind all item-view events for the view', function() {
      expect(this.collectionView.someViewCallback).not.to.have.been.called;
    });

    it('should not retain any references to its children', function() {
      expect(_.size(this.collectionView.children)).to.equal(0);
    });

    it('should not affect the underlying collection', function() {
      expect(this.collection).to.have.length(1);
    });

    it('should unbind any listener to custom view events', function() {
      expect(this.collectionView.stopListening).to.have.been.called;
    });

    it('should remove the views EL from the DOM', function() {
      expect(this.collectionView.removeEl).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(this.collectionView.onDestroy).to.have.been.called;
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(this.collectionView.onBeforeDestroy).to.have.been.called;
    });

    it('should call "onBeforeDestroy" before "onDestroy"', function() {
      expect(this.collectionView.onBeforeDestroy).to.have.been.calledBefore(this.collectionView.onDestroy);
    });

    it('should not be destroyed when "onBeforeDestroy" is called', function() {
      expect(this.collectionView.onBeforeDestroy.lastCall.returnValue.isDestroyed).not.to.be.ok;
    });

    it('should be destroyed when "onDestroy" is called', function() {
      expect(this.collectionView.onDestroy.lastCall.returnValue.isDestroyed).to.be.true;
    });

    it('should trigger a "before:destroy" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('before:destroy:children');
    });

    it('should trigger a "destroy"', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('destroy:children');
    });

    it('should call the handlers add to the destroyed event', function() {
      expect(this.destroyHandler).to.have.been.called;
    });

    it('should return the collection view', function() {
      expect(this.collectionView.destroy).to.have.returned(this.collectionView);
    });

    it('should be marked destroyed', function() {
      expect(this.collectionView).to.have.property('_isDestroyed', true);
    });

    it('should be marked not rendered', function() {
      expect(this.collectionView).to.have.property('_isRendered', false);
    });

    it('should not call checkEmpty', function() {
      expect(this.collectionView.isEmpty).to.have.not.been.called;
    });

    it('should return the CollectionView', function() {
      expect(this.collectionView.destroy).to.have.returned(this.collectionView);
    });

    describe('and it has already been destroyed', function() {
      beforeEach(function() {
        this.collectionView.destroy();
      });

      it('should return the CollectionView', function() {
        expect(this.collectionView.destroy).to.have.returned(this.collectionView);
      });
    });
  });

  describe('when removing a childView that does not have a "destroy" method', function() {
    beforeEach(function() {
      const collection = new Backbone.Collection([{id: 1}]);
      this.collectionView = new this.CollectionView({
        childView: Backbone.View,
        collection
      });

      this.collectionView.render();

      this.childView = this.collectionView.children.findByIndex(0);
      this.sinon.spy(this.childView, 'remove');

      this.sinon.spy(this.collectionView, 'removeChildView');
      this.collectionView.removeChildView(this.childView);
    });

    it('should call the "remove" method', function() {
      expect(this.childView.remove).to.have.been.called;
    });

    it('should return the childView', function() {
      expect(this.collectionView.removeChildView).to.have.returned(this.childView);
    });
  });

  describe('when destroying all children', function() {
    beforeEach(function() {
      this.collectionView = new this.CollectionView({
        childView: Backbone.View,
        collection: new Backbone.Collection([{id: 1}, {id: 2}])
      });

      this.collectionView.render();

      this.childView0 = this.collectionView.children.findByIndex(0);
      this.sinon.spy(this.childView0, 'remove');

      this.childView1 = this.collectionView.children.findByIndex(1);
      this.sinon.spy(this.childView1, 'remove');

      this.collectionView._destroyChildren();
    });

    it('should call the "remove" method on each child', function() {
      expect(this.childView0.remove).to.have.been.called;
      expect(this.childView1.remove).to.have.been.called;
    });
  });

  describe('when override attachHtml', function() {
    beforeEach(function() {
      this.PrependHtmlView = this.CollectionView.extend({

        attachHtml: function(collectionView, childView) {
          collectionView.$el.prepend(childView.el);
        }
      });

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);

      this.collectionView = new this.PrependHtmlView({
        collection: this.collection
      });

      this.collectionView.render();
    });

    it('should append via the overridden method', function() {
      expect(this.collectionView.$el).to.contain.$html('<span>baz</span><span>bar</span>');
    });
  });

  describe('when a child view triggers an event', function() {
    beforeEach(function() {
      this.someEventSpy = this.sinon.stub();
      this.CollectionViewTriggers = this.CollectionView.extend({
        'onChildViewTriggerSomeEventStub': this.sinon.stub()
      });
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionViewTriggers({
        collection: this.collection,
        childViewTriggers: {
          'some:event': 'child:view:trigger:some:event:stub'
        }
      });
      this.collectionView.on('childview:some:event', this.someEventSpy);
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', 'test', this.model);
    });

    it('should provide the relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith('test', this.model);
    });

    it('should bubble up to the parent collection view childViewTriggers stub', function() {
      expect(this.collectionView.onChildViewTriggerSomeEventStub).to.have.been.calledWith('test', this.model);
    });
  });

  describe('when configuring a custom childViewEventPrefix', function() {
    beforeEach(function() {
      this.CollectionView = this.CollectionView.extend({
        childViewEventPrefix: 'myPrefix'
      });

      this.someEventSpy = this.sinon.stub();

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({collection: this.collection});
      this.collectionView.on('myPrefix:some:event', this.someEventSpy);
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('myPrefix:some:event', 'test', this.model);
    });

    it('should provide the relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith('test', this.model);
    });
  });

  describe('when setting childViewEventPrefix false', function() {
    beforeEach(function() {
      this.CollectionView = this.CollectionView.extend({
        childViewEventPrefix: false
      });

      this.someEventSpy = this.sinon.stub();

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({collection: this.collection});
      this.collectionView.on('childview:some:event', this.someEventSpy);
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should not bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.not.have.been.called;
    });

    it('should not trigger a childview event', function() {
      expect(this.someEventSpy).to.not.have.been.called;
    });
  });

  describe('when a child view triggers the default', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
    });

    describe('render events', function() {
      beforeEach(function() {
        this.beforeSpy = this.sinon.stub();
        this.renderSpy = this.sinon.stub();

        this.collectionView.on('childview:before:render', this.beforeSpy);
        this.collectionView.on('childview:render', this.renderSpy);

        this.collectionView.render();
        this.childView = this.collectionView.children.findByIndex(0);
      });

      it('should bubble up through the parent collection view', function() {
        expect(this.beforeSpy).to.have.been.calledWith(this.childView);
        expect(this.renderSpy).to.have.been.calledWith(this.childView);
      });
    });

    describe('destroy events', function() {
      beforeEach(function() {
        this.beforeSpy = this.sinon.stub();
        this.destroySpy = this.sinon.stub();

        this.collectionView.on('childview:before:destroy', this.beforeSpy);
        this.collectionView.on('childview:destroy', this.destroySpy);

        this.collectionView.render();
        this.childView = this.collectionView.children.findByIndex(0);
        this.collectionView.destroy();
      });

      it('should bubble up through the parent collection view', function() {
        expect(this.beforeSpy).to.have.been.calledWith(this.childView);
        expect(this.destroySpy).to.have.been.calledWith(this.childView);
      });
    });
  });

  describe('when a child view is removed from a collection view', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({
        template: '#itemTemplate',
        collection: this.collection
      });

      this.collectionView.render();
    });

    describe('by model', function() {
      beforeEach(function() {
        this.collection.remove(this.model);
        this.childView = this.collectionView.children[this.model.cid];
      });

      it('should not retain any bindings to this view', function() {
        var suite = this;
        var bindings = this.collectionView.bindings || {};
        expect(_.some(bindings, function(binding) {
          return binding.obj === suite.childView;
        })).to.be.false;
      });

      it('should not retain any references to this view', function() {
        expect(_.size(this.collectionView.children)).to.equal(0);
      });

      it('childView should be undefined', function() {
        expect(this.childView).to.be.undefined;
      });
    });

    describe('by view', function() {
      beforeEach(function() {
        this.childView = this.collectionView.children.findByModel(this.model);
        this.removedChildView = this.collectionView.removeChildView(this.childView);
        this.afterRemoveChildView = this.collectionView.children.findByModel(this.model);
      });

      it('should not retain any bindings to this view', function() {
        var suite = this;
        var bindings = this.collectionView.bindings || {};
        expect(_.some(bindings, function(binding) {
          return binding.obj === suite.childView;
        })).to.be.false;
      });

      it('should not retain any references to this view', function() {
        expect(this.collectionView.children.length).to.equal(0);
      });

      it('childView should be undefined', function() {
        expect(this.afterRemoveChildView).to.be.undefined;
      });

      it('should be removed and returned', function() {
        expect(this.childView).to.equal(this.removedChildView);
      });
    });

    describe('and trying to remove a view that isn\'t a view', function() {
      beforeEach(function() {
        this.sinon.spy(this.collectionView, '_removeChildView');
        this.removedChildView = this.collectionView.removeChildView(null);
      });

      it('should return null', function() {
        expect(this.removedChildView).is.null;
      });

      it('should not call internal function', function() {
        expect(this.collectionView._removeChildView).is.not.called;
      });
    });
  });

  describe('when the collection of a collection view is reset', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({
        template: '#itemTemplate',
        collection: this.collection
      });

      this.collectionView.render();

      this.childView = this.collectionView.children[this.model.cid];
      this.collection.reset();
    });

    it('should not retain any references to the previous views', function() {
      expect(_.size(this.collectionView.children)).to.equal(0);
    });

    it('should not retain any bindings to the previous views', function() {
      var suite = this;
      var bindings = this.collectionView.bindings || {};
      expect(_.some(bindings, function(binding) {
        return binding.obj === suite.childView;
      })).to.be.false;
    });
  });

  describe('when a collection view is initially attached to the DOM and shown', function() {
    beforeEach(function() {
      var spec = this;
      var ChildView = this.ChildView.extend({
        constructor: function() {
          ChildView.__super__.constructor.apply(this, arguments);
          spec.sinon.stub(this, 'onRender');
          spec.sinon.stub(this, 'onBeforeAttach');
          spec.sinon.stub(this, 'onAttach');
          spec.sinon.stub(this, 'onDomRefresh');
        },
        onRender: function() {},
        onBeforeAttach: function() {},
        onAttach: function() {},
        onDomRefresh: function() {}
      });

      this.collection = new Backbone.Collection([{foo: 1}, {foo: 2}]);
      this.collectionView = new this.CollectionView({
        childView: ChildView,
        collection: this.collection,
        emptyView: ChildView
      });

      this.setFixtures($('<div id="fixture-container"></div>'));
      var region = new Marionette.Region({el: '#fixture-container'});
      region.show(this.collectionView);

      this.childView1 = this.collectionView.children.findByIndex(0);
      this.childView2 = this.collectionView.children.findByIndex(1);
    });

    it('should trigger events on the initial child views in proper order', function() {
      expect(this.childView1.onRender).to.have.been.calledBefore(this.childView1.onBeforeAttach);
      expect(this.childView1.onBeforeAttach).to.have.been.calledBefore(this.childView1.onAttach);
      expect(this.childView1.onAttach).to.have.been.calledBefore(this.childView1.onDomRefresh);
      expect(this.childView1.onDomRefresh).to.have.been.called;
    });

    describe('when collection view is emptied', function() {
      beforeEach(function() {
        this.collection.reset();
        this.emptyView = this.collectionView.children.findByIndex(0);
      });

      it('should trigger events on the empty view in proper order', function() {
        expect(this.emptyView.onRender).to.have.been.calledBefore(this.emptyView.onBeforeAttach);
        expect(this.emptyView.onBeforeAttach).to.have.been.calledBefore(this.emptyView.onAttach);
        expect(this.emptyView.onAttach).to.have.been.calledBefore(this.emptyView.onDomRefresh);
        expect(this.emptyView.onDomRefresh).to.have.been.called;
      });
    });

    describe('when a child view is added to a collection view, after the collection view has been shown', function() {
      beforeEach(function() {
        this.sinon.spy(this.collectionView, 'attachBuffer');
        this.sinon.spy(this.collectionView, 'addChildView');
        this.model3 = new Backbone.Model({foo: 3});
        this.collection.add(this.model3);
        this.childView3 = this.collectionView.children.findByIndex(2);
      });

      it('should not use the render buffer', function() {
        expect(this.collectionView.attachBuffer).not.to.have.been.called;
      });

      it('should call addChildView with the new view', function() {
        expect(this.collectionView.addChildView).to.have.been.calledWith(this.childView3);
      });

      it('should trigger events on the added child view in proper order', function() {
        expect(this.childView3.onRender).to.have.been.calledBefore(this.childView3.onBeforeAttach);
        expect(this.childView3.onBeforeAttach).to.have.been.calledBefore(this.childView3.onAttach);
        expect(this.childView3.onAttach).to.have.been.calledBefore(this.childView3.onDomRefresh);
        expect(this.childView3.onDomRefresh).to.have.been.called;
      });
    });

    describe('when the childView is added at an existing index', function() {
      beforeEach(function() {
        this.childViewAtIndex0 = this.collectionView.children.findByIndex(0);

        this.beforeModel = new Backbone.Model({foo: 0});
        this.collectionView._addChild(this.beforeModel, 0);
      });

      it('should increment the later childView indexes', function() {
        expect(this.childViewAtIndex0._index).to.equal(1);
      });

      it('should be inserted in the DOM before later indexed children', function() {
        expect(this.collectionView.$el).to.have.$text('012');
      });
    });
  });

  describe('when setting a childView in the constructor options', function() {
    beforeEach(function() {
      var ChildView = this.ChildView.extend({
        template: function() {},
        MyView: true
      });

      this.collection = new Backbone.Collection([{a: 'b'}]);
      this.collectionView = new this.CollectionView({
        childView: ChildView,
        collection: this.collection
      });

      this.collectionView.render();

      this.itemView = this.collectionView.children.findByModel(this.collection.at(0));
    });

    it('should use the specified childView for each item', function() {
      expect(this.itemView.MyView).to.be.true;
    });
  });

  describe('when calling childViewEvents via a childViewEvents method', function() {
    beforeEach(function() {
      this.CollectionView = this.CollectionView.extend({
        childViewEvents: function() {
          return {
            'some:event': 'someEvent'
          };
        }
      });

      this.someEventSpy = this.sinon.stub();

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({collection: this.collection});
      this.collectionView.someEvent = this.someEventSpy;
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', 'test', this.model);
    });

    it('should provide the relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith('test', this.model);
    });
  });

  describe('when calling childViewEvents via the childViewEvents hash', function() {
    beforeEach(function() {
      this.onSomeEventSpy = this.sinon.stub();

      this.CollectionView = this.CollectionView.extend({
        childViewEvents: {
          'some:event': this.onSomeEventSpy
        }
      });

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.CollectionView({collection: this.collection});
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', 'test', this.model);
    });

    it('should provide the relevant parameters', function() {
      expect(this.onSomeEventSpy).to.have.been.calledWith('test', this.model);
    });
  });

  describe('when calling childViewEvents via the childViewEvents hash with a string of the function name', function() {
    beforeEach(function() {
      var CollectionView = this.CollectionView.extend({
        childViewEvents: {
          'some:event': 'someEvent'
        }
      });

      this.someEventSpy = this.sinon.stub();

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new CollectionView({collection: this.collection});
      this.collectionView.someEvent = this.someEventSpy;
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', 'test', this.model);
    });

    it('should provide the other relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith('test', this.model);
    });
  });

  describe('calling childViewEvents via the childViewEvents hash with a string of a nonexistent function name', function() {
    beforeEach(function() {
      var CollectionView = this.CollectionView.extend({
        childViewEvents: {
          'render': 'nonexistentFn'
        }
      });

      this.collectionView = new CollectionView({
        collection: (new Backbone.Collection([{}]))
      });

      this.collectionView.render();
    });

    it('should not break', function() {
      // Intentionally left blank
    });
  });

  describe('when a collection is reset while attached, child views should not be attached until the buffering is over', function() {
    var isBufferingOnChildAttach;
    var isBufferingOnChildRender;
    var collectionView;
    var childView;

    beforeEach(function() {
      var suite = this;

      var ChildView = this.ChildView.extend({
        template: _.template('<div>hi mom</div>'),
        constructor: function() {
          suite.ChildView.prototype.constructor.apply(this, arguments);
          suite.sinon.spy(this, 'onAttach');
          suite.sinon.spy(this, 'onRender');
        },
        onRender: function() {
          isBufferingOnChildRender = collectionView._isBuffering;
        },
        onAttach: function() {
          isBufferingOnChildAttach = collectionView._isBuffering;
        }
      });

      var collection = new Backbone.Collection([{}]);
      collectionView = new this.CollectionView({
        childView: ChildView,
        collection: collection
      });

      this.setFixtures('<div id="region"></div>');
      var region = new Marionette.Region({el: '#region'});
      region.show(collectionView);

      collection.reset([{}]);
      childView = collectionView.children.findByIndex(0);
    });

    it('collectionView should be buffering on childView render', function() {
      expect(childView.onRender).to.have.been.calledOnce;
      expect(isBufferingOnChildRender).to.be.true;
    });

    it('collectionView should not be buffering on childView attach', function() {
      expect(childView.onAttach).to.have.been.calledOnce;
      expect(isBufferingOnChildAttach).to.be.false;
    });
  });

  describe('when a collection view is not rendered', function() {
    beforeEach(function() {
      var suite = this;
      this.Model = Backbone.Model.extend({});
      this.Collection = Backbone.Collection.extend({model: this.Model});
      this.CollectionView = this.CollectionView.extend({
        tagName: 'ul'
      });

      this.addModel = function() {
        suite.collection.add(suite.model2);
      };

      this.removeModel = function() {
        suite.collection.remove(suite.model1);
      };

      this.resetCollection = function() {
        suite.collection.reset([suite.model1, suite.model2]);
      };

      this.sync = function() {
        suite.collection.trigger('sync');
      };

      this.model1 = new this.Model({monkey: 'island'});
      this.model2 = new this.Model({lechuck: 'tours'});
      this.collection = new this.Collection([this.model1]);

      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
    });

    it('should not fail when adding models to an unrendered collectionView', function() {
      expect(this.addModel).not.to.throw;
    });

    it('should not fail when an item is removed from an unrendered collectionView', function() {
      expect(this.removeModel).not.to.throw;
    });

    it('should not fail when a collection is reset on an unrendered collectionView', function() {
      expect(this.resetCollection).not.to.throw;
    });

    it('should not fail when a collection is synced on an unrendered collectionView', function() {
      expect(this.sync).not.to.throw;
    });
  });

  describe('when returning the view from addChild', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collectionView = new this.CollectionView();
      this.childView = this.collectionView._addChild(this.model, 0);
    });

    it('should return the child view for the model', function() {
      expect(this.childView.$el).to.contain.$text('bar');
    });
  });

  describe('has a valid inheritance chain back to Backbone.View', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Backbone.View.prototype, 'constructor');
    });

    it('calls the parent Backbone.Views constructor function on instantiation with the proper parameters', function() {
      const options = {foo: 'bar'};
      const customParam = {foo: 'baz'};

      this.layoutView = new this.CollectionView(options, customParam);
      expect(this.constructor).to.have.been.calledWith(options, customParam);
    });
  });
});
