describe('collection view', function() {
  'use strict';

  beforeEach(function() {
    // Shared View Definitions
    // -----------------------

    this.ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
        this.trigger('render');
      },
      onRender: function() {}
    });

    this.MockCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: this.ChildView,
      onBeforeRender: function() {
        return this.isRendered;
      },
      onRender: function() {
        return this.isRendered;
      },
      onBeforeAddChild: function() {},
      onAddChild: function() {},
      onBeforeRemoveChild: function() {},
      onRemoveChild: function() {},
      onRenderCollection: function() {},
      onBeforeRenderCollection: function() {}
    });
  });

  // Collection View Specs
  // ---------------------

  describe('before rendering a collection view', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection([]);
      this.CollectionView = this.MockCollectionView.extend({
        sort: function() { return 1; }
      });

      this.collectionView = new this.CollectionView({
        collection: this.collection,
        _sortViews: function() {}
      });

      this.onAddChildSpy = this.sinon.spy(this.collectionView, 'onAddChild');
      this.onRemoveChildSpy = this.sinon.spy(this.collectionView, 'onRemoveChild');
      this.onSortViewsSpy = this.sinon.spy(this.collectionView, '_sortViews');
    });

    it('should not add a child', function() {
      this.collection.push({});

      expect(this.onAddChildSpy).to.not.have.been.called;
    });

    it('should not add a child', function() {
      this.collection.reset([{}]);

      expect(this.onAddChildSpy).to.not.have.been.called;
    });

    it('should not remove a child', function() {
      var model = new Backbone.Model();
      this.collection.add(model);
      this.collection.remove(model);

      expect(this.onRemoveChildSpy).to.not.have.been.called;
    });

    it('should not call sort', function() {
      this.collection.trigger('sort');

      expect(this.onSortViewsSpy).to.not.have.been.called;
    });
  });

  describe('when rendering a collection view with no "childView" specified', function() {
    beforeEach(function() {
      this.NoChildView = Backbone.Marionette.CollectionView.extend();

      this.collection = new Backbone.Collection([{foo:'bar'}, {foo: 'baz'}]);
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
      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);

      this.childViewRender = this.sinon.stub();

      this.collectionView = new this.MockCollectionView({
        collection: this.collection
      });

      this.collectionView.on('childview:render', this.childViewRender);

      this.sinon.spy(this.collectionView, 'onRender');
      this.sinon.spy(this.collectionView, 'onBeforeAddChild');
      this.sinon.spy(this.collectionView, 'onAddChild');
      this.sinon.spy(this.collectionView, 'onBeforeRender');
      this.sinon.spy(this.collectionView, 'onBeforeRenderCollection');
      this.sinon.spy(this.collectionView, 'onRenderCollection');
      this.sinon.spy(this.collectionView, 'trigger');
      this.sinon.spy(this.collectionView, 'attachHtml');
      this.sinon.spy(this.collectionView.$el, 'append');
      this.sinon.spy(this.collectionView, 'startBuffering');
      this.sinon.spy(this.collectionView, 'endBuffering');
      this.sinon.spy(this.collectionView, 'getChildView');

      this.collectionView.render();
    });

    it('should only call $el.append once', function() {
      expect(this.collectionView.$el.append.callCount).to.equal(1);
    });

    it('should only call clear render buffer once', function() {
      expect(this.collectionView.endBuffering.callCount).to.equal(1);
    });

    it('should add to render buffer once for each child', function() {
      expect(this.collectionView.attachHtml.callCount).to.equal(2);
    });

    it('should only call onRenderCollection once', function() {
      expect(this.collectionView.onRenderCollection).to.have.been.calledOnce;
    });

    it('should only call onBeforeRenderCollection once', function() {
      expect(this.collectionView.onBeforeRenderCollection).to.have.been.calledOnce;
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

    it('children should reference collectionView', function() {
      var children = this.collectionView._getImmediateChildren();
      expect(children[0]._parent).to.deep.equal(this.collectionView);
      expect(children[1]._parent).to.deep.equal(this.collectionView);
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
      expect(this.collectionView.onBeforeRender.lastCall.returnValue).not.to.be.ok;
    });

    it('should be rendered when "onRender" is called', function() {
      expect(this.collectionView.onRender.lastCall.returnValue).to.be.true;
    });

    it('should trigger a "before:render" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('before:render', this.collectionView);
    });

    it('should trigger a "before:render:collection" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('before:render:collection', this.collectionView);
    });

    it('should trigger a "render:collection" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('render:collection', this.collectionView);
    });

    it('should trigger a "render" event', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('render', this.collectionView);
    });

    it('should call "onBeforeAddChild" for each childView instance', function() {
      var v1 = this.collectionView.children.findByIndex(0);
      var v2 = this.collectionView.children.findByIndex(1);
      expect(this.collectionView.onBeforeAddChild).to.have.been.calledWith(v1);
      expect(this.collectionView.onBeforeAddChild).to.have.been.calledWith(v2);
    });

    it('should call "onAddChild" for each childView instance', function() {
      var v1 = this.collectionView.children.findByIndex(0);
      var v2 = this.collectionView.children.findByIndex(1);
      expect(this.collectionView.onAddChild).to.have.been.calledWith(v1);
      expect(this.collectionView.onAddChild).to.have.been.calledWith(v2);
    });

    it('should call "onBeforeAddChild" for all childView instances', function() {
      expect(this.collectionView.onBeforeAddChild.callCount).to.equal(2);
    });

    it('should call "onAddChild" for all childView instances', function() {
      expect(this.collectionView.onAddChild.callCount).to.equal(2);
    });

    it('should trigger "childview:render" for each item in the collection', function() {
      expect(this.childViewRender.callCount).to.equal(2);
    });

    it('should call "getChildView" for each item in the collection', function() {
      expect(this.collectionView.getChildView).to.have.been.calledTwice.
        and.calledWith(this.collection.models[0]).
        and.calledWith(this.collection.models[1]);
    });

    it('should be marked rendered', function() {
      expect(this.collectionView).to.have.property('isRendered', true);
    });
  });

  describe('when rendering a collection view and accessing children via the DOM', function() {
    beforeEach(function() {
      var suite = this;

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);

      this.collectionView = new this.MockCollectionView({
        collection: this.collection
      });

      this.sinon.stub(this.collectionView, 'onRenderCollection', function() {
        suite.onRenderCollectionHTML = this.el.innerHTML;
      });

      this.collectionView.render();
    });

    it('should find the expected number of childen', function() {
      expect(this.onRenderCollectionHTML).to.equal('<span>bar</span><span>baz</span>');
    });
  });

  describe('when rendering a collection view without a collection', function() {
    beforeEach(function() {
      this.collectionView = new this.MockCollectionView();

      this.sinon.spy(this.collectionView, 'onRender');
      this.sinon.spy(this.collectionView, 'onBeforeRender');
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
      this.collection = new Backbone.Collection([{foo: 'bar'}]);
      this.collectionView = new Marionette.CollectionView({
        childView: this.ChildView,
        collection: this.collection
      });

      this.collectionView.render();

      this.childView = this.collectionView.children.first();
      this.sinon.spy(this.childView, 'render');

      this.sinon.spy(this.collectionView, 'renderChildView');
      this.collectionView.renderChildView(this.childView);
    });

    it('should call "render" on the childView', function() {
      expect(this.childView.render).to.have.been.calledOnce;
    });

    it('should return the childView', function() {
      expect(this.collectionView.renderChildView).to.have.returned(this.childView);
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
      }]);
      this.collection.comparator = function(model) {
        return model.get('foo');
      };
    });

    it('should not update the order of children when "sort" is set to "false" as a property on a class', function() {
      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.ChildView,
        sort : false
      });
      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        collection: this.collection
      });
      this.collectionView.render();

      this.collection.sort();
      expect($(this.collectionView.$('span').first())).to.contain.$text('foo');
    });

    it('should not update the order of children when "sort" is set to "false" inside options', function() {
      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.ChildView,
      });
      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        sort : false,
        collection: this.collection
      });
      this.collectionView.render();

      this.collection.sort();
      expect($(this.collectionView.$('span').first())).to.contain.$text('foo');
    });
  });

  describe('when instantiating a view with a different sort option than in the view\'s definition', function() {
    it('should maintain the instantiated sort option', function() {
      this.CollectionView = Marionette.CollectionView.extend({sort: false});
      this.newCollectionView = new this.CollectionView({sort: true});
      expect(this.newCollectionView.getOption('sort')).to.equal(true);
    });
  });

  describe('when a model is added to the collection', function() {
    beforeEach(function() {
      this.collection = new Backbone.Collection();
      this.collectionView = new this.MockCollectionView({
        childView: this.ChildView,
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

      this.collectionView = new this.MockCollectionView({
        childView: this.ChildView,
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

    it('children should reference collectionView', function() {
      var children = this.collectionView._getImmediateChildren();
      expect(children[0]._parent).to.deep.equal(this.collectionView);
      expect(children[1]._parent).to.deep.equal(this.collectionView);
    });
  });

  describe('when providing a custom render that adds children, without a collection object to use, and removing a child', function() {
    beforeEach(function() {
      var suite = this;

      this.model = new Backbone.Model({foo: 'bar'});

      this.EmptyView = Backbone.Marionette.ItemView.extend({
        render: function() {}
      });

      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ChildView,
        emptyView: this.EmptyView,

        onBeforeRenderEmpty: function() {},
        onRenderEmpty: function() {},

        render: function() {
          var ChildView = this.getChildView();
          this.addChild(suite.model, ChildView, 0);
        }
      });

      this.collectionView = new this.CollectionView({});
      this.collectionView.render();

      this.childView = this.collectionView.children.findByIndex(0);

      this.beforeRenderSpy = this.sinon.spy(this.collectionView, 'onBeforeRenderEmpty');
      this.renderSpy = this.sinon.spy(this.collectionView, 'onRenderEmpty');

      this.sinon.spy(this.childView, 'destroy');
      this.sinon.spy(this.EmptyView.prototype, 'render');

      this.collectionView._onCollectionRemove(this.model);
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
  });

  describe('when a model is removed from the collection', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection();
      this.collection.add(this.model);

      this.collectionView = new this.MockCollectionView({
        childView: this.ChildView,
        collection: this.collection
      });
      this.collectionView.render();

      this.childView = this.collectionView.children.findByIndex(0);

      this.sinon.spy(this.childView, 'destroy');

      this.onBeforeRemoveChildSpy = this.sinon.spy(this.collectionView, 'onBeforeRemoveChild');
      this.onRemoveChildSpy = this.sinon.spy(this.collectionView, 'onRemoveChild');

      this.collection.remove(this.model);
    });

    it('should destroy the models view', function() {
      expect(this.childView.destroy).to.have.been.called;
    });

    it('should remove the model-views HTML', function() {
      expect($(this.collectionView.$el).children().length).to.equal(0);
    });

    it('should execute onBeforeRemoveChild', function() {
      expect(this.onBeforeRemoveChildSpy).to.have.been.calledOnce;
    });

    it('should pass the removed view to onBeforeRemoveChild', function() {
      expect(this.onBeforeRemoveChildSpy).to.have.been.calledWithExactly(this.childView);
    });

    it('should execute onRemoveChild', function() {
      expect(this.onRemoveChildSpy).to.have.been.calledOnce;
    });

    it('should pass the removed view to _onCollectionRemove', function() {
      expect(this.onRemoveChildSpy).to.have.been.calledWithExactly(this.childView);
    });

    it('should execute onBeforeRemoveChild before _onCollectionRemove', function() {
      expect(this.onBeforeRemoveChildSpy).to.have.been.calledBefore(this.onRemoveChildSpy);
    });
  });

  describe('when destroying a collection view', function() {
    beforeEach(function() {
      this.EventedView = Backbone.Marionette.CollectionView.extend({
        childView: this.ChildView,
        someCallback: function() {},
        onBeforeDestroy: function() {
          return {
            isRendered: this.isRendered,
            isDestroyed: this.isDestroyed
          };
        },
        onDestroy: function() {
          return {
            isRendered: this.isRendered,
            isDestroyed: this.isDestroyed
          };
        }
      });

      this.destroyHandler = this.sinon.stub();

      this.collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
      this.collectionView = new this.EventedView({
        template: '#itemTemplate',
        collection: this.collection
      });
      this.collectionView.someItemViewCallback = function() {};
      this.collectionView.render();

      this.childModel = this.collection.at(0);
      this.childView = this.collectionView.children.findByIndex(0);

      this.collectionView.listenTo(this.collection, 'foo', this.collectionView.someCallback);
      this.collectionView.listenTo(this.collectionView, 'item:foo', this.collectionView.someItemViewCallback);

      this.sinon.spy(this.childView, 'destroy');
      this.sinon.spy(this.collectionView, '_onCollectionRemove');
      this.sinon.spy(this.collectionView, 'stopListening');
      this.sinon.spy(this.collectionView, 'remove');
      this.sinon.spy(this.collectionView, 'someCallback');
      this.sinon.spy(this.collectionView, 'someItemViewCallback');
      this.sinon.spy(this.collectionView, 'destroy');
      this.sinon.spy(this.collectionView, 'onDestroy');
      this.sinon.spy(this.collectionView, 'onBeforeDestroy');
      this.sinon.spy(this.collectionView, 'trigger');

      this.collectionView.bind('destroy:collection', this.destroyHandler);

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
      expect(this.collectionView.someItemViewCallback).not.to.have.been.called;
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
      expect(this.collectionView.remove).to.have.been.called;
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
      expect(this.collectionView.trigger).to.have.been.calledWith('before:destroy:collection');
    });

    it('should trigger a "destroy"', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('destroy:collection');
    });

    it('should call the handlers add to the destroyed event', function() {
      expect(this.destroyHandler).to.have.been.called;
    });

    it('should throw an error saying the views been destroyed if render is attempted again', function() {
      expect(this.collectionView.render).to.throw('View (cid: "' + this.collectionView.cid +
          '") has already been destroyed and cannot be used.');
    });

    it('should return the collection view', function() {
      expect(this.collectionView.destroy).to.have.returned(this.collectionView);
    });

    it('should be marked destroyed', function() {
      expect(this.collectionView).to.have.property('isDestroyed', true);
    });

    it('should be marked not rendered', function() {
      expect(this.collectionView).to.have.property('isRendered', false);
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
      this.collectionView = new Marionette.CollectionView({
        childView: Backbone.View,
        collection: new Backbone.Collection([{id: 1}])
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
      this.collectionView = new Marionette.CollectionView({
        childView: Backbone.View,
        collection: new Backbone.Collection([{id: 1}, {id: 2}])
      });

      this.collectionView.render();

      this.childView0 = this.collectionView.children.findByIndex(0);
      this.sinon.spy(this.childView0, 'remove');

      this.childView1 = this.collectionView.children.findByIndex(1);
      this.sinon.spy(this.childView1, 'remove');

      this.childrenViews = this.collectionView.children.map(_.identity);

      this.sinon.spy(this.collectionView, 'destroyChildren');
      this.collectionView.destroyChildren();
    });

    it('should call the "remove" method on each child', function() {
      expect(this.childView0.remove).to.have.been.called;
      expect(this.childView1.remove).to.have.been.called;
    });

    it('should return the child views', function() {
      expect(this.collectionView.destroyChildren).to.have.returned(this.childrenViews);
    });
  });

  describe('when override attachHtml', function() {
    beforeEach(function() {
      this.PrependHtmlView = Backbone.Marionette.CollectionView.extend({
        childView: this.ChildView,

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

      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.MockCollectionView({collection: this.collection});
      this.collectionView.on('childview:some:event', this.someEventSpy);
      this.collectionView.render();

      this.sinon.spy(this.collectionView, 'trigger');
      this.childView = this.collectionView.children.findByIndex(0);
      this.childView.trigger('some:event', 'test', this.model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', this.childView, 'test', this.model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith(this.childView, 'test', this.model);
    });
  });

  describe('when configuring a custom childViewEventPrefix', function() {
    beforeEach(function() {
      this.CollectionView = this.MockCollectionView.extend({
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
      expect(this.collectionView.trigger).to.have.been.calledWith('myPrefix:some:event', this.childView, 'test', this.model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith(this.childView, 'test', this.model);
    });
  });

  describe('when a child view triggers the default', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.MockCollectionView({
        childView: Backbone.Marionette.ItemView.extend({
          template: function() { return '<%= foo %>'; }
        }),
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
        // As odd as it seems, the events are triggered with two arguments,
        // the first being the child view which triggered the event
        // and the second being the event's owner.  It just so happens to be the
        // same view.
        expect(this.beforeSpy).to.have.been.calledWith(this.childView, this.childView);
        expect(this.renderSpy).to.have.been.calledWith(this.childView, this.childView);
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

      this.collectionView = new this.MockCollectionView({
        template: '#itemTemplate',
        collection: this.collection
      });

      this.collectionView.render();

      this.childView = this.collectionView.children[this.model.cid];
      this.collection.remove(this.model);
    });

    it('should not retain any bindings to this view', function() {
      var suite = this;
      var bindings = this.collectionView.bindings || {};
      expect(_.any(bindings, function(binding) {
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

  describe('when the collection of a collection view is reset', function() {
    beforeEach(function() {
      this.model = new Backbone.Model({foo: 'bar'});
      this.collection = new Backbone.Collection([this.model]);

      this.collectionView = new this.MockCollectionView({
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
      expect(_.any(bindings, function(binding) {
        return binding.obj === suite.childView;
      })).to.be.false;
    });
  });

  describe('when a child view is added to a collection view, after the collection view has been shown', function() {
    beforeEach(function() {
      this.ChildView = Backbone.Marionette.ItemView.extend({
        onBeforeShow: function() {},
        onShow: function() {},
        onDomRefresh: function() {},
        onRender: function() {},
        template: _.template('<%= foo %>')
      });

      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ChildView,
        onShow: function() {}
      });

      this.sinon.spy(this.ChildView.prototype, 'onBeforeShow');
      this.sinon.spy(this.ChildView.prototype, 'onShow');
      this.sinon.spy(this.ChildView.prototype, 'onDomRefresh');

      this.model1 = new Backbone.Model({foo: 1});
      this.model2 = new Backbone.Model({foo: 2});
      this.collection = new Backbone.Collection([this.model1]);
      this.collectionView = new this.CollectionView({
        collection: this.collection
      });
      $('body').append(this.collectionView.el);

      this.collectionView.render();
      this.collectionView.onShow();
      this.collectionView.trigger('show');

      this.sinon.spy(this.collectionView, 'attachBuffer');
      this.sinon.spy(this.collectionView, 'getChildView');

      this.collection.add(this.model2);
      this.view = this.collectionView.children.findByIndex(1);
    });

    it('should not use the render buffer', function() {
      expect(this.collectionView.attachBuffer).not.to.have.been.called;
    });

    it('should call the "onBeforeShow" method of the child view', function() {
      expect(this.ChildView.prototype.onBeforeShow).to.have.been.called;
    });

    it('should call the childs "onBeforeShow" method with itself as the context', function() {
      expect(this.ChildView.prototype.onBeforeShow).to.have.been.calledOn(this.view);
    });

    it('should call the "onShow" method of the child view', function() {
      expect(this.ChildView.prototype.onShow).to.have.been.called;
    });

    it('should call the childs "onShow" method with itself as the context', function() {
      expect(this.ChildView.prototype.onShow).to.have.been.calledOn(this.view);
    });

    it('should call the childs "onDomRefresh" method with itself as the context', function() {
      expect(this.ChildView.prototype.onDomRefresh).to.have.been.called;
    });

    it('should call "getChildView" with the new model', function() {
      expect(this.collectionView.getChildView).to.have.been.calledWith(this.model2);
    });

    describe('when the childView is added at an existing index', function() {
      beforeEach(function() {
        this.childViewAtIndex0 = this.collectionView.children.findByIndex(0);

        this.beforeModel = new Backbone.Model({foo: 0});
        this.beforeView = this.collectionView.addChild(this.beforeModel, this.ChildView, 0);
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
      this.ItemView = Marionette.ItemView.extend({
        template: function() {},
        MyItemView: true
      });

      this.collection = new Backbone.Collection([{a: 'b'}]);
      this.collectionView = new Marionette.CollectionView({
        childView: this.ItemView,
        collection: this.collection
      });

      this.collectionView.render();

      this.itemView = this.collectionView.children.findByModel(this.collection.at(0));
    });

    it('should use the specified childView for each item', function() {
      expect(this.itemView.MyItemView).to.be.true;
    });
  });

  describe('when calling childEvents via a childEvents method', function() {
    beforeEach(function() {
      this.CollectionView = this.MockCollectionView.extend({
        childEvents: function() {
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
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', this.childView, 'test', this.model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith(this.childView, 'test', this.model);
    });
  });

  describe('when calling childEvents via the childEvents hash', function() {
    beforeEach(function() {
      this.onSomeEventSpy = this.sinon.stub();

      this.CollectionView = this.MockCollectionView.extend({
        childEvents: {
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
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', this.childView, 'test', this.model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(this.onSomeEventSpy).to.have.been.calledWith(this.childView, 'test', this.model);
    });
  });

  describe('when calling childEvents via the childEvents hash with a string of the function name', function() {
    beforeEach(function() {
      this.CollectionView = this.MockCollectionView.extend({
        childEvents: {
          'some:event': 'someEvent'
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
      expect(this.collectionView.trigger).to.have.been.calledWith('childview:some:event', this.childView, 'test', this.model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(this.someEventSpy).to.have.been.calledWith(this.childView, 'test', this.model);
    });
  });

  describe('calling childEvents via the childEvents hash with a string of a nonexistent function name', function() {
    beforeEach(function() {
      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.ChildView,
        childEvents: {
          'render': 'nonexistentFn'
        }
      });

      this.collectionView = new this.CollectionView({
        collection: (new Backbone.Collection([{}]))
      });

      this.collectionView.render();
    });

    it('should not break', function() {
      // Intentionally left blank
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Marionette, 'View');
      this.collectionView = new Marionette.CollectionView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(this.constructor).to.have.been.called;
    });
  });

  describe('when a collection is reset child views should not be shown until the buffering is over', function() {
    beforeEach(function() {
      var suite = this;

      this.ItemView = Marionette.ItemView.extend({
        template: _.template('<div>hi mom</div>'),
        onShow: function() {
          suite.isBuffering = suite.collectionView.isBuffering;
        }
      });

      this.CollectionView = Marionette.CollectionView.extend({
        childView: this.ItemView
      });

      this.isBuffering = null;
      this.collection = new Backbone.Collection([{}]);
      this.collectionView = new this.CollectionView({collection: this.collection});
      this.collectionView.render().trigger('show');
    });

    it('collectionView should not be buffering on childView show', function() {
      expect(this.isBuffering).to.be.false;
    });

    it('collectionView should not be buffering after reset on childView show', function() {
      this.isBuffering = undefined;
      this.collection.reset([{}]);
      expect(this.isBuffering).to.be.false;
    });

    describe('child view show events', function() {
      beforeEach(function() {
        var suite = this;
        this.showCalled = false;
        this.ItemView.prototype.onShow = function() { suite.showCalled = true; };
      });

      it('collectionView should trigger the show events when the buffer is inserted and the view has been shown', function() {
        this.collection.reset([{}]);
        expect(this.showCalled).to.equal(true);
      });

      it('collectionView should not trigger the show events if the view has not been shown', function() {
        this.collectionView = new this.CollectionView({collection: this.collection});
        this.collectionView.render();
        expect(this.showCalled).to.equal(false);
      });
    });
  });

  describe('when a collection view is not rendered', function() {
    beforeEach(function() {
      var suite = this;
      this.Model       = Backbone.Model.extend({});
      this.Collection  = Backbone.Collection.extend({model: this.Model});
      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ChildView,
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

      this.model1     = new this.Model({monkey: 'island'});
      this.model2     = new this.Model({lechuck: 'tours'});
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

      this.CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: this.ChildView
      });

      this.collectionView = new this.CollectionView();

      this.childView = this.collectionView.addChild(this.model, this.ChildView, 0);
    });

    it('should return the child view for the model', function() {
      expect(this.childView.$el).to.contain.$text('bar');
    });
  });
});
