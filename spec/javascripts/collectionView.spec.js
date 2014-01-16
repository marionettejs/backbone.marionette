describe("collection view", function(){
  "use strict";

  // Shared View Definitions
  // -----------------------

  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
      this.trigger('render');
    },
    onRender: function(){}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    onBeforeRender: function(){},

    onRender: function(){},

    onBeforeItemAdded: function(view){},
    onAfterItemAdded: function(view){}
  });

  // Collection View Specs
  // ---------------------

  describe("when rendering a collection view with no `itemView` specified", function(){
    var NoItemView = Backbone.Marionette.CollectionView.extend({
    });

    var collectionView;

    beforeEach(function(){
      var collection = new Backbone.Collection([{foo: "bar"}, {foo: "baz"}]);
      collectionView = new NoItemView({
        collection: collection
      });
    });

    it("should throw an error saying there's not item view", function(){
      expect(function(){collectionView.render()}).toThrow("An `itemView` must be specified");
    });
  });

  describe("when rendering a collection view", function(){
    var collection = new Backbone.Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView, itemViewRender;

    beforeEach(function(){
      itemViewRender = jasmine.createSpy("itemview:render");

      collectionView = new CollectionView({
        collection: collection
      });

      collectionView.on("itemview:render", itemViewRender);

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "onBeforeItemAdded").andCallThrough();
      spyOn(collectionView, "onAfterItemAdded").andCallThrough();
      spyOn(collectionView, "onBeforeRender").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();
      spyOn(collectionView, "appendHtml").andCallThrough();
      spyOn(collectionView.$el, "append").andCallThrough();
      spyOn(collectionView, "startBuffering").andCallThrough();
      spyOn(collectionView, "endBuffering").andCallThrough();

      collectionView.render();
    });

    it("should only call $el.append once", function() {
      expect(collectionView.$el.append.callCount).toEqual(1);
    });

    it("should only call clear render buffer once", function() {
      expect(collectionView.endBuffering.callCount).toEqual(1);
    });

    it("should add to render buffer once for each child", function() {
      expect(collectionView.appendHtml.callCount).toEqual(2);
    });

    it("should append the html for each itemView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should provide the index for each itemView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(0);
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(2);
    });

    it("should call 'onBeforeRender' before rendering", function(){
      expect(collectionView.onBeforeRender).toHaveBeenCalled();
    });

    it("should call 'onRender' after rendering", function(){
      expect(collectionView.onRender).toHaveBeenCalled();
    });

    it("should trigger a 'before:render' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("before:render", collectionView);
    });

    it("should trigger a 'collection:before:render' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:before:render", collectionView);
    });

    it("should trigger a 'collection:rendered' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:rendered", collectionView);
    });

    it("should trigger a 'render' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("render", collectionView);
    });

    it("should call `onBeforeItemAdded` for each itemView instance", function(){
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onBeforeItemAdded).toHaveBeenCalledWith(v1);
      expect(collectionView.onBeforeItemAdded).toHaveBeenCalledWith(v2);
    });

    it("should call `onAfterItemAdded` for each itemView instance", function(){
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onAfterItemAdded).toHaveBeenCalledWith(v1);
      expect(collectionView.onAfterItemAdded).toHaveBeenCalledWith(v2);
    });

    it("should call `onBeforeItemAdded` for all itemView instances", function(){
      expect(collectionView.onBeforeItemAdded.callCount).toBe(2);
    });

    it("should call `onAfterItemAdded` for all itemView instances", function(){
      expect(collectionView.onAfterItemAdded.callCount).toBe(2);
    });

    it("should trigger itemview:render for each item in the collection", function(){
      expect(itemViewRender.callCount).toBe(2);
    });
  });

  describe("when rendering a collection view without a collection", function(){
    var collectionView;

    beforeEach(function(){
      collectionView = new CollectionView({
      });

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "onBeforeRender").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();

      collectionView.render();
    });

    it("should not append any html", function(){
      expect($(collectionView.$el)).not.toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should not reference any view items", function(){
      expect(collectionView.children.length).toBe(0);
    });
  });

  describe("when a model is added to the collection", function(){
    var collectionView, collection, model, itemViewRender;

    beforeEach(function(){
      collection = new Backbone.Collection();
      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

      itemViewRender = jasmine.createSpy("itemview:render");
      collectionView.on("itemview:render", itemViewRender);

      spyOn(collectionView, "appendHtml").andCallThrough();

      model = new Backbone.Model({foo: "bar"});
      collection.add(model);
    });

    it("should add the model to the list", function(){
      expect(_.size(collectionView.children)).toBe(1);
    });

    it("should render the model in to the DOM", function(){
      expect($(collectionView.$el)).toHaveText("bar");
    });

    it("should provide the index for each itemView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(0);
    });

    it("should trigger the itemview:render event from the collectionView", function(){
      expect(itemViewRender).toHaveBeenCalled();
    });
  });

  describe("when a model is added to a non-empty collection", function(){
    var collectionView, collection, model, itemViewRender;

    beforeEach(function(){
      collection = new Backbone.Collection({foo: 'bar'});

      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

      itemViewRender = jasmine.createSpy("itemview:render");
      collectionView.on("itemview:render", itemViewRender);

      spyOn(collectionView, "appendHtml").andCallThrough();

      model = new Backbone.Model({foo: "baz"});
      collection.add(model);
    });

    it("should add the model to the list", function(){
      expect(_.size(collectionView.children)).toBe(2);
    });

    it("should render the model in to the DOM", function(){
      expect($(collectionView.$el)).toHaveText("barbaz");
    });

    it("should provide the index for each itemView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(1);
    });

    it("should trigger the itemview:render event from the collectionView", function(){
      expect(itemViewRender).toHaveBeenCalled();
    });
  });

  describe("when providing a custom render that adds children, without a collection object to use, and removing a child", function(){
    var collectionView;
    var childView;

    var model = new Backbone.Model({foo: "bar"});

    var EmptyView = Backbone.Marionette.ItemView.extend({
      render: function(){}
    });

    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      emptyView: EmptyView,

      render: function(){
        var ItemView = this.getItemView();
        this.addItemView(model, ItemView, 0);
      }
    });

    beforeEach(function(){
      collectionView = new CollectionView({});
      collectionView.render();

      childView = collectionView.children.findByIndex(0);
      spyOn(childView, "close").andCallThrough();
      spyOn(EmptyView.prototype, "render");

      collectionView.removeItemView(model);
    });

    it("should close the model's view", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should show the empty view", function(){
      expect(EmptyView.prototype.render.callCount).toBe(1);
    });
  });

  describe("when a model is removed from the collection", function(){
    var collectionView;
    var collection;
    var childView;
    var model;

    beforeEach(function(){
      model = new Backbone.Model({foo: "bar"});
      collection = new Backbone.Collection();
      collection.add(model);

      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

      childView = collectionView.children.findByIndex(0);
      spyOn(childView, "close").andCallThrough();

      collection.remove(model);
    });

    it("should close the model's view", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should remove the model-view's HTML", function(){
      expect($(collectionView.$el).children().length).toBe(0);
    });
  });

  describe("when closing a collection view", function(){
    var EventedView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,

      someCallback: function(){ },

      onBeforeClose: function(){},

      onClose: function(){ }
    });

    var collectionView;
    var collection;
    var childView;
    var childModel;
    var closeHandler = jasmine.createSpy();

    beforeEach(function(){

      collection = new Backbone.Collection([{foo: "bar"}, {foo: "baz"}]);
      collectionView = new EventedView({
        template: "#itemTemplate",
        collection: collection
      });
      collectionView.someItemViewCallback = function(){};
      collectionView.render();


      childModel = collection.at(0);
      childView = collectionView.children.findByIndex(0);

      collectionView.listenTo(collection, "foo", collectionView.someCallback);
      collectionView.listenTo(collectionView, "item:foo", collectionView.someItemViewCallback);

      spyOn(childView, "close").andCallThrough();
      spyOn(collectionView, "removeItemView").andCallThrough();
      spyOn(collectionView, "stopListening").andCallThrough();
      spyOn(collectionView, "remove").andCallThrough();
      spyOn(collectionView, "someCallback").andCallThrough();
      spyOn(collectionView, "someItemViewCallback").andCallThrough();
      spyOn(collectionView, "close").andCallThrough();
      spyOn(collectionView, "onClose").andCallThrough();
      spyOn(collectionView, "onBeforeClose").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();

      collectionView.bind('collection:closed', closeHandler);

      collectionView.close();

      childView.trigger("foo");

      collection.trigger("foo");
      collection.remove(childModel);
    });

    it("should close all of the child views", function(){
      expect(childView.close).toHaveBeenCalled();
    });

    it("should unbind all the listenTo events", function(){
      expect(collectionView.stopListening).toHaveBeenCalled();
    });

    it("should unbind all collection events for the view", function(){
      expect(collectionView.someCallback).not.toHaveBeenCalled();
    });

    it("should unbind all item-view events for the view", function(){
      expect(collectionView.someItemViewCallback).not.toHaveBeenCalled();
    });

    it("should not retain any references to its children", function(){
      expect(_.size(collectionView.children)).toBe(0);
    });

    it("should unbind any listener to custom view events", function(){
      expect(collectionView.stopListening).toHaveBeenCalled();
    });

    it("should remove the view's EL from the DOM", function(){
      expect(collectionView.remove).toHaveBeenCalled();
    });

    it("should call `onClose` if provided", function(){
      expect(collectionView.onClose).toHaveBeenCalled();
    });

    it("should call `onBeforeClose` if provided", function(){
      expect(collectionView.onBeforeClose).toHaveBeenCalled();
    });

    it("should trigger a 'before:close' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:before:close");
    });

    it("should trigger a 'closed", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:closed");
    });

    it("should call the handlers add to the closed event", function(){
      expect(closeHandler).wasCalled();
    });
  });

  describe("when closing an itemView that does not have a 'close' method", function(){
    var collectionView, itemView;

    beforeEach(function(){
      collectionView = new Marionette.CollectionView({
        itemView: Backbone.View,
        collection: new Backbone.Collection([{id: 1}])
      });

      collectionView.render();

      itemView = collectionView.children.findByIndex(0);
      spyOn(itemView, "remove").andCallThrough();

      collectionView.closeChildren();
    });

    it("should call the 'remove' method", function(){
      expect(itemView.remove).toHaveBeenCalled();
    });

  });

  describe("when override appendHtml", function(){
    var PrependHtmlView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,

      appendHtml: function(collectionView, itemView){
        collectionView.$el.prepend(itemView.el);
      }
    });

    var collection = new Backbone.Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView;

    beforeEach(function(){
      collectionView = new PrependHtmlView({
        collection: collection
      });

      collectionView.render();
    });

    it("should append via the overridden method", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>baz</span><span>bar</span>");
    });
  });

  describe("when a child view triggers an event", function(){
    var model = new Backbone.Model({foo: "bar"});
    var collection = new Backbone.Collection([model]);
    var collectionView;
    var childView;
    var triggeringView;
    var eventArgs;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      collectionView.render();
      collectionView.on("itemview:some:event", function(){
        eventArgs = Array.prototype.slice.call(arguments);
      });

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("itemview:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event as the first parameter", function(){
      expect(eventArgs[0]).toBe(childView);
    });

    it("should forward all other arguments in order", function(){
      expect(eventArgs[1]).toBe("test");
      expect(eventArgs[2]).toBe(model);
    });
  });

  describe("when configuring a custom itemViewEventPrefix", function(){
    var model = new Backbone.Model({foo: "bar"});
    var collection = new Backbone.Collection([model]);
    var collectionView;
    var childView;
    var triggeringView;
    var eventArgs;

    beforeEach(function(){
      var CV = CollectionView.extend({
        itemViewEventPrefix: "myPrefix"
      });

      collectionView = new CV({
        collection: collection
      });

      collectionView.render();
      collectionView.on("myPrefix:some:event", function(){
        eventArgs = Array.prototype.slice.call(arguments);
      });

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("myPrefix:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event as the first parameter", function(){
      expect(eventArgs[0]).toBe(childView);
    });

    it("should forward all other arguments in order", function(){
      expect(eventArgs[1]).toBe("test");
      expect(eventArgs[2]).toBe(model);
    });
  });

  describe("when a child view triggers default events", function(){
    var model = new Backbone.Model({foo: "bar"});
    var collection = new Backbone.Collection([model]);
    var collectionView;
    var eventNames = [];

    beforeEach(function(){
      collectionView = new CollectionView({
        itemView: Backbone.Marionette.ItemView.extend({
            template: function() { return '<%= foo %>'; }
        }),
        collection: collection
      });

      collectionView.on("all", function(){
        var eventName = arguments[0];

        eventNames.push(eventName);
      });

      collectionView.render();
    });

    it("should bubble up through the parent collection view", function(){
      expect(eventNames).toBeDefined();
      expect(eventNames).toEqual([
          'before:render',
          'collection:before:render',
          'before:item:added',
          'itemview:before:render',
          'itemview:item:before:render',
          'itemview:render',
          'itemview:item:rendered',
          'after:item:added',
          'render',
          'collection:rendered'
      ]);
    });
  });

  describe("when a child view is removed from a collection view", function(){
    var model;
    var collection;
    var collectionView;
    var childView;

    beforeEach(function(){
      model = new Backbone.Model({foo: "bar"});
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({
        template: "#itemTemplate",
        collection: collection
      });

      collectionView.render();

      childView = collectionView.children[model.cid];
      collection.remove(model)
    });

    it("should not retain any bindings to this view", function(){
      var bindings = collectionView.bindings || {};
      expect(_.any(bindings, function(binding) {
        return binding.obj === childView;
      })).toBe(false);
    });

    it("should not retain any references to this view", function(){
      expect(_.size(collectionView.children)).toBe(0);
    });
  });

  describe("when the collection of a collection view is reset", function(){
    var model;
    var collection;
    var collectionView;
    var childView;

    beforeEach(function(){
      model = new Backbone.Model({foo: "bar"});
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({
        template: "#itemTemplate",
        collection: collection
      });

      collectionView.render();

      childView = collectionView.children[model.cid];
      collection.reset();
    });

    it("should not retain any references to the previous views", function(){
      expect(_.size(collectionView.children)).toBe(0);
    });

    it("should not retain any bindings to the previous views", function(){
      var bindings = collectionView.bindings || {};
      expect(_.any(bindings, function(binding) {
        return binding.obj === childView;
      })).toBe(false);
    });
  });

  describe("when a child view is added to a collection view, after the collection view has been shown", function(){
    var m1, m2, col, view;

    var ItemView = Backbone.Marionette.ItemView.extend({
      onShow: function(){},
      onDomRefresh: function(){ },
      onRender: function(){},
      render: function() {
        this.trigger("render");
      }
    });

    var ColView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      onShow: function(){}
    });
    var collectionView;

    beforeEach(function(){
      sinon.spy(ItemView.prototype, "onShow");
      sinon.spy(ItemView.prototype, "onDomRefresh");

      m1 = new Backbone.Model();
      m2 = new Backbone.Model();
      col = new Backbone.Collection([m1]);
      collectionView = new ColView({
        collection: col
      });
      $("body").append(collectionView.el);

      collectionView.render();
      collectionView.onShow();
      collectionView.trigger("show");

      sinon.spy(collectionView, "appendBuffer");

      col.add(m2);
      view = collectionView.children.findByIndex(1);
    });


    afterEach(function() {
      ItemView.prototype.onShow.restore();
      ItemView.prototype.onDomRefresh.restore();
    });

    it("should not use the render buffer", function() {
      expect(collectionView.appendBuffer).not.toHaveBeenCalled();
    });

    it("should call the 'onShow' method of the child view", function(){
      expect(ItemView.prototype.onShow).toHaveBeenCalled();
    });

    it("should call the child's 'onShow' method with itself as the context", function(){
      expect(ItemView.prototype.onShow).toHaveBeenCalledOn(view);
    });

    it("should call the child's 'onDomRefresh' method with itself as the context", function(){
      expect(ItemView.prototype.onDomRefresh).toHaveBeenCalled();
    });
  });

  describe("when setting an itemView in the constructor options", function(){
    var IV = Marionette.ItemView.extend({
      template: function(){},
      MyItemView: true
    });

    var iv;

    beforeEach(function(){
      var c = new Backbone.Collection([{a: "b"}]);
      var cv = new Marionette.CollectionView({
        itemView: IV,
        collection: c,
      });

      cv.render();

      iv = cv.children.findByModel(c.at(0));
    });

    it("should use the specified itemView for each item", function(){
      expect(iv.MyItemView).toBe(true);
    });
  });

  describe("calling itemEvents via an itemEvents method", function() {
    var renderCalled;

    var CV = Marionette.CollectionView.extend({
      itemView: ItemView,
      itemEvents: function() {
        return {
          "render": function() {
            renderCalled = true;
          }
        }
      }
    });

    beforeEach(function() {
      renderCalled = false;
      var cv = new CV({
        collection: (new Backbone.Collection([{}]))
      });

      cv.render();
    });

    it("should call the associated itemEvent when defined when itemEvents is a method", function() {
      expect(renderCalled).toBe(true);
    });
  });

  describe("calling itemEvents via the itemEvents hash", function(){
    var renderCalled;

    var CV = Marionette.CollectionView.extend({
      itemView: ItemView,
      itemEvents: {
        "render": function() {
          renderCalled = true;
        }
      }
    });

    beforeEach(function() {
      renderCalled = false;

      var cv = new CV({
        collection: (new Backbone.Collection([{}]))
      });

      cv.render();
    });

    it("should call the associated itemEvent when defined", function() {
      expect(renderCalled).toBe(true);
    });
  });

  describe("has a valid inheritance chain back to Marionette.View", function(){
    var constructor;

    beforeEach(function(){
      constructor = spyOn(Marionette.View.prototype, "constructor");
      new Marionette.CollectionView();
    });

    it("calls the parent Marionette.View's constructor function on instantiation", function(){
      expect(constructor).toHaveBeenCalled();
    });
  });

  describe("when a collection is reset itemViews should not be shown until the buffering is over", function() {
    var isBuffering, iv, cv, collection, cvInstance;

    iv = Marionette.ItemView.extend({
      template: _.template("<div>hi mom</div>"),
      onShow: function() {
        isBuffering = cvInstance.isBuffering;
      }
    });

    cv = Marionette.CollectionView.extend({
      itemView: iv
    });

    beforeEach(function() {
      isBuffering = null;
      collection = new Backbone.Collection([{}]);
      cvInstance = new cv({collection: collection});
      cvInstance.render().trigger('show');
    });

    it("collectionView should not be buffering on itemView show", function() {
      expect(isBuffering).toBe(false);
    });

    it("collectionView should not be buffering after reset on itemView show", function() {
      isBuffering = void 0;
      collection.reset([{}]);
      expect(isBuffering).toBe(false);
    });

    describe("item view show events", function () {
      var showCalled;
      beforeEach(function () {
        showCalled = false;
        iv.prototype.onShow = function () { showCalled = true; };
      });

      it("collectionView should trigger the show events when the buffer is inserted and the view has been shown", function () {
        collection.reset([{}]);
        expect(showCalled).toEqual(true);
      });

      it("collectionView should not trigger the show events if the view has not been shown", function () {
        cvInstance = new cv({collection: collection});
        cvInstance.render();
        expect(showCalled).toEqual(false);
      });
    });
  });

  describe("when a collection view is not rendered", function() {
    var collection, cv, model1, model2;

    var Model       = Backbone.Model.extend({});
    var Collection  = Backbone.Collection.extend({model: Model});
    var CV = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      tagName: 'ul'
    });

    var addModel = function() {
      collection.add(model2);
    }

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
      model1     = new Model({monkey: "island"});
      model2     = new Model({lechuck: "tours"});
      collection = new Collection([model1]);

      cv = new CV({
        collection: collection
      });
    });

    it("should not fail when adding models to an unrendered collectionView", function() {
      expect(addModel).not.toThrow();
    });

    it("should not fail when an item is removed from an unrendered collectionView", function() {
      expect(removeModel).not.toThrow();
    });

    it("should not fail when a collection is reset on an unrendered collectionView", function() {
      expect(resetCollection).not.toThrow();
    });

    it("should not fail when a collection is synced on an unrendered collectionView", function() {
      expect(sync).not.toThrow();
    });
  });

  describe("when returning the view from addItemView", function(){
    var childView;

    beforeEach(function(){
      var model = new Backbone.Model({foo: "bar"});

      var CollectionView = Backbone.Marionette.CollectionView.extend({
        itemView: ItemView
      });

      var collectionView = new CollectionView({});

      childView = collectionView.addItemView(model, ItemView, 0);
    });

    it("should return the item view for the model", function(){
      expect(childView.$el).toHaveText("bar");
    });
  });

});
