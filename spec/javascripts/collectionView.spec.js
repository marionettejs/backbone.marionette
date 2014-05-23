describe('collection view', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  // Shared View Definitions
  // -----------------------

  var ChildView = Backbone.Marionette.ItemView.extend({
    tagName: 'span',
    render: function() {
      this.$el.html(this.model.get('foo'));
      this.trigger('render');
    },
    onRender: function() {}
  });

  var MockCollectionView = Backbone.Marionette.CollectionView.extend({
    childView: ChildView,

    onBeforeRender: function() {},
    onRender: function() {},
    onBeforeAddChild: function() {},
    onAddChild: function() {},
    onBeforeRemoveChild: function() {},
    onRemoveChild: function() {}
  });

  // Collection View Specs
  // ---------------------

  describe('when rendering a collection view with no "childView" specified', function() {
    var NoChildView = Backbone.Marionette.CollectionView.extend();

    var collectionView;

    beforeEach(function() {
      var collection = new Backbone.Collection([{foo:'bar'}, {foo: 'baz'}]);
      collectionView = new NoChildView({
        collection: collection
      });
    });

    it('should throw an error saying theres not child view', function() {
      expect(collectionView.render).to.throw('A "childView" must be specified');
    });
  });

  describe('when rendering a collection view', function() {
    var collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
    var collectionView, childViewRender;

    beforeEach(function() {
      childViewRender = this.sinon.stub();

      collectionView = new MockCollectionView({
        collection: collection
      });

      collectionView.on('childview:render', childViewRender);

      this.sinon.spy(collectionView, 'onRender');
      this.sinon.spy(collectionView, 'onBeforeAddChild');
      this.sinon.spy(collectionView, 'onAddChild');
      this.sinon.spy(collectionView, 'onBeforeRender');
      this.sinon.spy(collectionView, 'trigger');
      this.sinon.spy(collectionView, 'attachHtml');
      this.sinon.spy(collectionView.$el, 'append');
      this.sinon.spy(collectionView, 'startBuffering');
      this.sinon.spy(collectionView, 'endBuffering');

      collectionView.render();
    });

    it('should only call $el.append once', function() {
      expect(collectionView.$el.append.callCount).to.equal(1);
    });

    it('should only call clear render buffer once', function() {
      expect(collectionView.endBuffering.callCount).to.equal(1);
    });

    it('should add to render buffer once for each child', function() {
      expect(collectionView.attachHtml.callCount).to.equal(2);
    });

    it('should append the html for each childView', function() {
      expect($(collectionView.$el)).to.have.$html('<span>bar</span><span>baz</span>');
    });

    it('should provide the index for each childView, when appending', function() {
      expect(collectionView.attachHtml.firstCall.args[2]).to.equal(0);
    });

    it('should reference each of the rendered view children', function() {
      expect(_.size(collectionView.children)).to.equal(2);
    });

    it('should call "onBeforeRender" before rendering', function() {
      expect(collectionView.onBeforeRender).to.have.been.called;
    });

    it('should call "onRender" after rendering', function() {
      expect(collectionView.onRender).to.have.been.called;
    });

    it('should trigger a "before:render" event', function() {
      expect(collectionView.trigger).to.have.been.calledWith('before:render', collectionView);
    });

    it('should trigger a "before:render:collection" event', function() {
      expect(collectionView.trigger).to.have.been.calledWith('before:render:collection', collectionView);
    });

    it('should trigger a "render:collection" event', function() {
      expect(collectionView.trigger).to.have.been.calledWith('render:collection', collectionView);
    });

    it('should trigger a "render" event', function() {
      expect(collectionView.trigger).to.have.been.calledWith('render', collectionView);
    });

    it('should call "onBeforeAddChild" for each childView instance', function() {
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onBeforeAddChild).to.have.been.calledWith(v1);
      expect(collectionView.onBeforeAddChild).to.have.been.calledWith(v2);
    });

    it('should call "onAddChild" for each childView instance', function() {
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onAddChild).to.have.been.calledWith(v1);
      expect(collectionView.onAddChild).to.have.been.calledWith(v2);
    });

    it('should call "onBeforeAddChild" for all childView instances', function() {
      expect(collectionView.onBeforeAddChild.callCount).to.equal(2);
    });

    it('should call "onAddChild" for all childView instances', function() {
      expect(collectionView.onAddChild.callCount).to.equal(2);
    });

    it('should trigger "childview:render" for each item in the collection', function() {
      expect(childViewRender.callCount).to.equal(2);
    });
  });

  describe('when rendering a collection view without a collection', function() {
    var collectionView;

    beforeEach(function() {
      collectionView = new MockCollectionView();

      this.sinon.spy(collectionView, 'onRender');
      this.sinon.spy(collectionView, 'onBeforeRender');
      this.sinon.spy(collectionView, 'trigger');

      collectionView.render();
    });

    it('should not append any html', function() {
      expect($(collectionView.$el)).not.to.have.$html('<span>bar</span><span>baz</span>');
    });

    it('should not reference any view children', function() {
      expect(collectionView.children.length).to.equal(0);
    });
  });

  describe('when a model is added to the collection', function() {
    var collectionView, collection, model, childViewRender;

    beforeEach(function() {
      collection = new Backbone.Collection();
      collectionView = new MockCollectionView({
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      childViewRender = this.sinon.stub();
      collectionView.on('childview:render', childViewRender);

      this.sinon.spy(collectionView, 'attachHtml');

      model = new Backbone.Model({foo: 'bar'});
      collection.add(model);
    });

    it('should add the model to the list', function() {
      expect(_.size(collectionView.children)).to.equal(1);
    });

    it('should render the model in to the DOM', function() {
      expect($(collectionView.$el)).to.contain.$text('bar');
    });

    it('should provide the index for each childView, when appending', function() {
      expect(collectionView.attachHtml.firstCall.args[2]).to.equal(0);
    });

    it('should trigger the childview:render event from the collectionView', function() {
      expect(childViewRender).to.have.been.called;
    });
  });

  describe('when a model is added to a non-empty collection', function() {
    var collectionView, collection, model, childViewRender;

    beforeEach(function() {
      collection = new Backbone.Collection({foo: 'bar'});

      collectionView = new MockCollectionView({
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      childViewRender = this.sinon.stub();
      collectionView.on('childview:render', childViewRender);

      this.sinon.spy(collectionView, 'attachHtml');

      model = new Backbone.Model({foo: 'baz'});
      collection.add(model);
    });

    it('should add the model to the list', function() {
      expect(_.size(collectionView.children)).to.equal(2);
    });

    it('should render the model in to the DOM', function() {
      expect($(collectionView.$el)).to.contain.$text('barbaz');
    });

    it('should provide the index for each child view, when appending', function() {
      expect(collectionView.attachHtml.firstCall.args[2]).to.equal(1);
    });

    it('should trigger the childview:render event from the collectionView', function() {
      expect(childViewRender).to.have.been.called;
    });
  });

  describe('when providing a custom render that adds children, without a collection object to use, and removing a child', function() {
    var collectionView;
    var childView;
    var beforeRenderSpy;
    var renderSpy;

    var model = new Backbone.Model({foo: 'bar'});

    var EmptyView = Backbone.Marionette.ItemView.extend({
      render: function() {}
    });

    var CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,
      emptyView: EmptyView,

      onBeforeRenderEmpty: function() {},
      onRenderEmpty: function() {},

      render: function() {
        var ChildView = this.getChildView();
        this.addChild(model, ChildView, 0);
      }
    });

    beforeEach(function() {
      collectionView = new CollectionView({});
      collectionView.render();

      childView = collectionView.children.findByIndex(0);

      beforeRenderSpy = this.sinon.spy(collectionView, 'onBeforeRenderEmpty');
      renderSpy = this.sinon.spy(collectionView, 'onRenderEmpty');

      this.sinon.spy(childView, 'destroy');
      this.sinon.spy(EmptyView.prototype, 'render');

      collectionView._onCollectionRemove(model);
    });

    it('should destroy the models view', function() {
      expect(childView.destroy).to.have.been.called;
    });

    it('should show the empty view', function() {
      expect(EmptyView.prototype.render.callCount).to.equal(1);
    });

    it('should call "onBeforeRenderEmpty"', function() {
      expect(beforeRenderSpy).to.have.been.called;
    });

    it('should call "onRenderEmpty"', function() {
      expect(renderSpy).to.have.been.called;
    });
  });

  describe('when a model is removed from the collection', function() {
    var collectionView;
    var collection;
    var childView;
    var model;
    var onBeforeRemoveChildSpy;
    var onRemoveChildSpy;

    beforeEach(function() {
      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection();
      collection.add(model);

      collectionView = new MockCollectionView({
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      childView = collectionView.children.findByIndex(0);

      this.sinon.spy(childView, 'destroy');

      onBeforeRemoveChildSpy = this.sinon.spy(collectionView, 'onBeforeRemoveChild');
      onRemoveChildSpy = this.sinon.spy(collectionView, 'onRemoveChild');

      collection.remove(model);
    });

    it('should destroy the models view', function() {
      expect(childView.destroy).to.have.been.called;
    });

    it('should remove the model-views HTML', function() {
      expect($(collectionView.$el).children().length).to.equal(0);
    });

    it('should execute onBeforeRemoveChild', function() {
      expect(onBeforeRemoveChildSpy).to.have.been.calledOnce;
    });

    it('should pass the removed view to onBeforeRemoveChild', function() {
      expect(onBeforeRemoveChildSpy).to.have.been.calledWithExactly(childView);
    });

    it('should execute onRemoveChild', function() {
      expect(onRemoveChildSpy).to.have.been.calledOnce;
    });

    it('should pass the removed view to _onCollectionRemove', function() {
      expect(onRemoveChildSpy).to.have.been.calledWithExactly(childView);
    });

    it('should execute onBeforeRemoveChild before _onCollectionRemove', function() {
      expect(onBeforeRemoveChildSpy).to.have.been.calledBefore(onRemoveChildSpy);
    });

  });

  describe('when destroying a collection view', function() {
    var EventedView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,

      someCallback: function() {},
      onBeforeDestroy: function() {},
      onDestroy: function() {}
    });

    var collectionView;
    var collection;
    var childView;
    var childModel;
    var destroyHandler;

    beforeEach(function() {
      destroyHandler = this.sinon.stub();

      collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
      collectionView = new EventedView({
        template: '#itemTemplate',
        collection: collection
      });
      collectionView.someItemViewCallback = function() {};
      collectionView.render();


      childModel = collection.at(0);
      childView = collectionView.children.findByIndex(0);

      collectionView.listenTo(collection, 'foo', collectionView.someCallback);
      collectionView.listenTo(collectionView, 'item:foo', collectionView.someItemViewCallback);

      this.sinon.spy(childView, 'destroy');
      this.sinon.spy(collectionView, '_onCollectionRemove');
      this.sinon.spy(collectionView, 'stopListening');
      this.sinon.spy(collectionView, 'remove');
      this.sinon.spy(collectionView, 'someCallback');
      this.sinon.spy(collectionView, 'someItemViewCallback');
      this.sinon.spy(collectionView, 'destroy');
      this.sinon.spy(collectionView, 'onDestroy');
      this.sinon.spy(collectionView, 'onBeforeDestroy');
      this.sinon.spy(collectionView, 'trigger');

      collectionView.bind('destroy:collection', destroyHandler);

      collectionView.destroy();

      childView.trigger('foo');

      collection.trigger('foo');
      collection.remove(childModel);
    });

    it('should destroy all of the child views', function() {
      expect(childView.destroy).to.have.been.called;
    });

    it('should unbind all the listenTo events', function() {
      expect(collectionView.stopListening).to.have.been.called;
    });

    it('should unbind all collection events for the view', function() {
      expect(collectionView.someCallback).not.to.have.been.called;
    });

    it('should unbind all item-view events for the view', function() {
      expect(collectionView.someItemViewCallback).not.to.have.been.called;
    });

    it('should not retain any references to its children', function() {
      expect(_.size(collectionView.children)).to.equal(0);
    });

    it('should unbind any listener to custom view events', function() {
      expect(collectionView.stopListening).to.have.been.called;
    });

    it('should remove the views EL from the DOM', function() {
      expect(collectionView.remove).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(collectionView.onDestroy).to.have.been.called;
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(collectionView.onBeforeDestroy).to.have.been.called;
    });

    it('should trigger a "before:destroy" event', function() {
      expect(collectionView.trigger).to.have.been.calledWith('before:destroy:collection');
    });

    it('should trigger a "destroy"', function() {
      expect(collectionView.trigger).to.have.been.calledWith('destroy:collection');
    });

    it('should call the handlers add to the destroyed event', function() {
      expect(destroyHandler).to.have.been.called;
    });

    it('should throw an error saying the views been destroyed if render is attempted again', function() {
      expect(collectionView.render).to.throw('Cannot use a view thats already been destroyed.');
    });
  });

  describe('when destroying an childView that does not have a "destroy" method', function() {
    var collectionView, childView;

    beforeEach(function() {
      collectionView = new Marionette.CollectionView({
        childView: Backbone.View,
        collection: new Backbone.Collection([{id: 1}])
      });

      collectionView.render();

      childView = collectionView.children.findByIndex(0);
      this.sinon.spy(childView, 'remove');

      collectionView.destroyChildren();
    });

    it('should call the "remove" method', function() {
      expect(childView.remove).to.have.been.called;
    });

  });

  describe('when override attachHtml', function() {
    var PrependHtmlView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,

      attachHtml: function(collectionView, childView) {
        collectionView.$el.prepend(childView.el);
      }
    });

    var collection = new Backbone.Collection([{foo: 'bar'}, {foo: 'baz'}]);
    var collectionView;

    beforeEach(function() {
      collectionView = new PrependHtmlView({
        collection: collection
      });

      collectionView.render();
    });

    it('should append via the overridden method', function() {
      expect(collectionView.$el).to.contain.$html('<span>baz</span><span>bar</span>');
    });
  });

  describe('when a child view triggers an event', function() {
    var model, collection, collectionView, childView, someEventSpy;

    beforeEach(function() {
      someEventSpy = this.sinon.stub();

      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new MockCollectionView({collection: collection});
      collectionView.on('childview:some:event', someEventSpy);
      collectionView.render();

      this.sinon.spy(collectionView, 'trigger');
      childView = collectionView.children.findByIndex(0);
      childView.trigger('some:event', 'test', model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(collectionView.trigger).to.have.been.calledWith('childview:some:event', childView, 'test', model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(someEventSpy).to.have.been.calledWith(childView, 'test', model);
    });
  });

  describe('when configuring a custom childViewEventPrefix', function() {
    var model, collection, collectionView, childView, someEventSpy;

    var CollectionView = MockCollectionView.extend({
      childViewEventPrefix: 'myPrefix'
    });

    beforeEach(function() {
      someEventSpy = this.sinon.stub();

      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({collection: collection});
      collectionView.on('myPrefix:some:event', someEventSpy);
      collectionView.render();

      this.sinon.spy(collectionView, 'trigger');
      childView = collectionView.children.findByIndex(0);
      childView.trigger('some:event', 'test', model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(collectionView.trigger).to.have.been.calledWith('myPrefix:some:event', childView, 'test', model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(someEventSpy).to.have.been.calledWith(childView, 'test', model);
    });
  });

  describe('when a child view triggers the default', function() {
    var model, collection, collectionView, childView;

    beforeEach(function() {
      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new MockCollectionView({
        childView: Backbone.Marionette.ItemView.extend({
          template: function() { return '<%= foo %>'; }
        }),
        collection: collection
      });
    });

    describe('render events', function() {
      var beforeSpy, renderSpy;

      beforeEach(function() {
        beforeSpy = this.sinon.stub();
        renderSpy = this.sinon.stub();

        collectionView.on('childview:before:render', beforeSpy);
        collectionView.on('childview:render', renderSpy);

        collectionView.render();
        childView = collectionView.children.findByIndex(0);
      });

      it('should bubble up through the parent collection view', function() {
        // As odd as it seems, the events are triggered with two arguments,
        // the first being the child view which triggered the event
        // and the second being the event's owner.  It just so happens to be the
        // same view.
        expect(beforeSpy).to.have.been.calledWith(childView, childView);
        expect(renderSpy).to.have.been.calledWith(childView, childView);
      });
    });

    describe('destroy events', function() {
      var beforeSpy, destroySpy;

      beforeEach(function() {
        beforeSpy = this.sinon.stub();
        destroySpy = this.sinon.stub();

        collectionView.on('childview:before:destroy', beforeSpy);
        collectionView.on('childview:destroy', destroySpy);

        collectionView.render();
        childView = collectionView.children.findByIndex(0);
        collectionView.destroy();
      });

      it('should bubble up through the parent collection view', function() {
        expect(beforeSpy).to.have.been.calledWith(childView);
        expect(destroySpy).to.have.been.calledWith(childView);
      });
    });
  });

  describe('when a child view is removed from a collection view', function() {
    var model;
    var collection;
    var collectionView;
    var childView;

    beforeEach(function() {
      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new MockCollectionView({
        template: '#itemTemplate',
        collection: collection
      });

      collectionView.render();

      childView = collectionView.children[model.cid];
      collection.remove(model);
    });

    it('should not retain any bindings to this view', function() {
      var bindings = collectionView.bindings || {};
      expect(_.any(bindings, function(binding) {
        return binding.obj === childView;
      })).to.be.false;
    });

    it('should not retain any references to this view', function() {
      expect(_.size(collectionView.children)).to.equal(0);
    });
  });

  describe('when the collection of a collection view is reset', function() {
    var model;
    var collection;
    var collectionView;
    var childView;

    beforeEach(function() {
      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([ model ]);

      collectionView = new MockCollectionView({
        template: '#itemTemplate',
        collection: collection
      });

      collectionView.render();

      childView = collectionView.children[model.cid];
      collection.reset();
    });

    it('should not retain any references to the previous views', function() {
      expect(_.size(collectionView.children)).to.equal(0);
    });

    it('should not retain any bindings to the previous views', function() {
      var bindings = collectionView.bindings || {};
      expect(_.any(bindings, function(binding) {
        return binding.obj === childView;
      })).to.be.false;
    });
  });

  describe('when a child view is added to a collection view, after the collection view has been shown', function() {
    var model1, model2, collection, view;

    var ChildView = Backbone.Marionette.ItemView.extend({
      onShow: function() {},
      onDomRefresh: function() {},
      onRender: function() {},
      render: function() {
        this.trigger('render');
      }
    });

    var CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,
      onShow: function() {}
    });

    var collectionView;

    beforeEach(function() {
      this.sinon.spy(ChildView.prototype, 'onShow');
      this.sinon.spy(ChildView.prototype, 'onDomRefresh');

      model1 = new Backbone.Model();
      model2 = new Backbone.Model();
      collection = new Backbone.Collection([ model1 ]);
      collectionView = new CollectionView({
        collection: collection
      });
      $('body').append(collectionView.el);

      collectionView.render();
      collectionView.onShow();
      collectionView.trigger('show');

      this.sinon.spy(collectionView, 'attachBuffer');

      collection.add(model2);
      view = collectionView.children.findByIndex(1);
    });

    it('should not use the render buffer', function() {
      expect(collectionView.attachBuffer).not.to.have.been.called;
    });

    it('should call the "onShow" method of the child view', function() {
      expect(ChildView.prototype.onShow).to.have.been.called;
    });

    it('should call the childs "onShow" method with itself as the context', function() {
      expect(ChildView.prototype.onShow).to.have.been.calledOn(view);
    });

    it('should call the childs "onDomRefresh" method with itself as the context', function() {
      expect(ChildView.prototype.onDomRefresh).to.have.been.called;
    });
  });

  describe('when setting an childView in the constructor options', function() {
    var ItemView = Marionette.ItemView.extend({
      template: function() {},
      MyItemView: true
    });

    var itemView;

    beforeEach(function() {
      var collection = new Backbone.Collection([{a: 'b'}]);
      var collectionView = new Marionette.CollectionView({
        childView: ItemView,
        collection: collection
      });

      collectionView.render();

      itemView = collectionView.children.findByModel(collection.at(0));
    });

    it('should use the specified childView for each item', function() {
      expect(itemView.MyItemView).to.be.true;
    });
  });

  describe('when calling childEvents via an childEvents method', function() {
    var model, collection, collectionView, childView, someEventSpy;

    var CollectionView = MockCollectionView.extend({
      childEvents: function() {
        return {
          'some:event': 'someEvent'
        };
      }
    });

    beforeEach(function() {
      someEventSpy = this.sinon.stub();

      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({collection: collection});
      collectionView.someEvent = someEventSpy;
      collectionView.render();

      this.sinon.spy(collectionView, 'trigger');
      childView = collectionView.children.findByIndex(0);
      childView.trigger('some:event', 'test', model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(collectionView.trigger).to.have.been.calledWith('childview:some:event', childView, 'test', model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(someEventSpy).to.have.been.calledWith(childView, 'test', model);
    });
  });

  describe('when calling childEvents via the childEvents hash', function() {
    var model, collection, collectionView, childView, onSomeEventSpy;

    beforeEach(function() {
      onSomeEventSpy = this.sinon.stub();

      var CollectionView = MockCollectionView.extend({
        childEvents: {
          'some:event': onSomeEventSpy
        }
      });

      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({collection: collection});
      collectionView.render();

      this.sinon.spy(collectionView, 'trigger');
      childView = collectionView.children.findByIndex(0);
      childView.trigger('some:event', 'test', model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(collectionView.trigger).to.have.been.calledWith('childview:some:event', childView, 'test', model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(onSomeEventSpy).to.have.been.calledWith(childView, 'test', model);
    });
  });

  describe('when calling childEvents via the childEvents hash with a string of the function name', function() {
    var model, collection, collectionView, childView, someEventSpy;

    var CollectionView = MockCollectionView.extend({
      childEvents: {
        'some:event': 'someEvent'
      }
    });

    beforeEach(function() {
      someEventSpy = this.sinon.stub();

      model = new Backbone.Model({foo: 'bar'});
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({collection: collection});
      collectionView.someEvent = someEventSpy;
      collectionView.render();

      this.sinon.spy(collectionView, 'trigger');
      childView = collectionView.children.findByIndex(0);
      childView.trigger('some:event', 'test', model);
    });

    it('should bubble up through the parent collection view', function() {
      expect(collectionView.trigger).to.have.been.calledWith('childview:some:event', childView, 'test', model);
    });

    it('should provide the child view that triggered the event, including other relevant parameters', function() {
      expect(someEventSpy).to.have.been.calledWith(childView, 'test', model);
    });
  });

  describe('calling childEvents via the childEvents hash with a string of a nonexistent function name', function() {

    var CollectionView = Marionette.CollectionView.extend({
      childView: ChildView,
      childEvents: {
        'render': 'nonexistentFn'
      }
    });

    beforeEach(function() {
      var collectionView = new CollectionView({
        collection: (new Backbone.Collection([{}]))
      });
      collectionView.render();
    });

    it('should not break', function() {
      // Intentionally left blank
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    var constructor, collectionView;

    beforeEach(function() {
      constructor = this.sinon.spy(Marionette, 'View');
      collectionView = new Marionette.CollectionView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(constructor).to.have.been.called;
    });
  });

  describe('when a collection is reset child views should not be shown until the buffering is over', function() {
    var isBuffering, ItemView, CollectionView, collection, collectionView;

    ItemView = Marionette.ItemView.extend({
      template: _.template('<div>hi mom</div>'),
      onShow: function() {
        isBuffering = collectionView.isBuffering;
      }
    });

    CollectionView = Marionette.CollectionView.extend({
      childView: ItemView
    });

    beforeEach(function() {
      isBuffering = null;
      collection = new Backbone.Collection([{}]);
      collectionView = new CollectionView({collection: collection});
      collectionView.render().trigger('show');
    });

    it('collectionView should not be buffering on childView show', function() {
      expect(isBuffering).to.be.false;
    });

    it('collectionView should not be buffering after reset on childView show', function() {
      isBuffering = void 0;
      collection.reset([{}]);
      expect(isBuffering).to.be.false;
    });

    describe('child view show events', function() {
      var showCalled;
      beforeEach(function() {
        showCalled = false;
        ItemView.prototype.onShow = function() { showCalled = true; };
      });

      it('collectionView should trigger the show events when the buffer is inserted and the view has been shown', function() {
        collection.reset([{}]);
        expect(showCalled).to.equal(true);
      });

      it('collectionView should not trigger the show events if the view has not been shown', function() {
        collectionView = new CollectionView({collection: collection});
        collectionView.render();
        expect(showCalled).to.equal(false);
      });
    });
  });

  describe('when a collection view is not rendered', function() {
    var collection, collectionView, model1, model2;

    var Model       = Backbone.Model.extend({});
    var Collection  = Backbone.Collection.extend({model: Model});
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,
      tagName: 'ul'
    });

    var addModel = function() {
      collection.add(model2);
    };

    function removeModel() {
      collection.remove(model1);
    }

    function resetCollection() {
      collection.reset([model1, model2]);
    }

    function sync() {
      collection.trigger('sync');
    }

    beforeEach(function() {
      model1     = new Model({monkey: 'island'});
      model2     = new Model({lechuck: 'tours'});
      collection = new Collection([model1]);

      collectionView = new CollectionView({
        collection: collection
      });
    });

    it('should not fail when adding models to an unrendered collectionView', function() {
      expect(addModel).not.to.throw;
    });

    it('should not fail when an item is removed from an unrendered collectionView', function() {
      expect(removeModel).not.to.throw;
    });

    it('should not fail when a collection is reset on an unrendered collectionView', function() {
      expect(resetCollection).not.to.throw;
    });

    it('should not fail when a collection is synced on an unrendered collectionView', function() {
      expect(sync).not.to.throw;
    });
  });

  describe('when returning the view from addChild', function() {
    var childView;

    beforeEach(function() {
      var model = new Backbone.Model({foo: 'bar'});

      var CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ChildView
      });

      var collectionView = new CollectionView();

      childView = collectionView.addChild(model, ChildView, 0);
    });

    it('should return the child view for the model', function() {
      expect(childView.$el).to.contain.$text('bar');
    });
  });

});
