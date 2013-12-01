describe("collection view", function(){
  "use strict";

  // Shared View Definitions
  // -----------------------

  var ChildView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
      this.trigger('render');
    },
    onRender: function(){}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    childView: ChildView,

    onBeforeRender: function(){},

    onRender: function(){},

    onBeforeChildAdded: function(view){},
    onAfterChildAdded: function(view){}
  });

  // Collection View Specs
  // ---------------------

  describe("when rendering a collection view with no `childView` specified", function(){
    var NoChildView = Backbone.Marionette.CollectionView.extend({
    });

    var collectionView;

    beforeEach(function(){
      var collection = new Backbone.Collection([{foo: "bar"}, {foo: "baz"}]);
      collectionView = new NoChildView({
        collection: collection
      });
    });

    it("should throw an error saying there's not child view", function(){
      expect(function(){collectionView.render()}).toThrow("A `childView` must be specified");
    });
  });

  describe("when rendering a collection view", function(){
    var collection = new Backbone.Collection([{foo: "bar"}, {foo: "baz"}]);
    var collectionView, childViewRender;

    beforeEach(function(){
      childViewRender = jasmine.createSpy("childview:render");

      collectionView = new CollectionView({
        collection: collection
      });

      collectionView.on("childview:render", childViewRender);

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "onBeforeChildAdded").andCallThrough();
      spyOn(collectionView, "onAfterChildAdded").andCallThrough();
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

    it("should append the html for each childView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should provide the index for each childView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(0);
    });

    it("should reference each of the rendered view children", function(){
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

    it("should call `onBeforeChildAdded` for each childView instance", function(){
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onBeforeChildAdded).toHaveBeenCalledWith(v1);
      expect(collectionView.onBeforeChildAdded).toHaveBeenCalledWith(v2);
    });

    it("should call `onAfterChildAdded` for each childView instance", function(){
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onAfterChildAdded).toHaveBeenCalledWith(v1);
      expect(collectionView.onAfterChildAdded).toHaveBeenCalledWith(v2);
    });

    it("should call `onBeforeChildAdded` for all childView instances", function(){
      expect(collectionView.onBeforeChildAdded.callCount).toBe(2);
    });

    it("should call `onAfterChildAdded` for all childView instances", function(){
      expect(collectionView.onAfterChildAdded.callCount).toBe(2);
    });

    it("should trigger childview:render for each item in the collection", function(){
      expect(childViewRender.callCount).toBe(2);
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

    it("should not reference any view children", function(){
      expect(collectionView.children.length).toBe(0);
    });
  });

  describe("when a model is added to the collection", function(){
    var collectionView, collection, model, childViewRender;

    beforeEach(function(){
      collection = new Backbone.Collection();
      collectionView = new CollectionView({
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      childViewRender = jasmine.createSpy("childview:render");
      collectionView.on("childview:render", childViewRender);

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

    it("should provide the index for each childView, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(0);
    });

    it("should trigger the childview:render event from the collectionView", function(){
      expect(childViewRender).toHaveBeenCalled();
    });
  });

  describe("when a model is added to a non-empty collection", function(){
    var collectionView, collection, model, childViewRender;

    beforeEach(function(){
      collection = new Backbone.Collection({foo: 'bar'});

      collectionView = new CollectionView({
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      childViewRender = jasmine.createSpy("childview:render");
      collectionView.on("childview:render", childViewRender);

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

    it("should provide the index for each child view, when appending", function(){
      expect(collectionView.appendHtml.calls[0].args[2]).toBe(1);
    });

    it("should trigger the childview:render event from the collectionView", function(){
      expect(childViewRender).toHaveBeenCalled();
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
      childView: ChildView,
      emptyView: EmptyView,

      render: function(){
        var ChildView = this.getChildView();
        this.addChild(model, ChildView, 0);
      }
    });

    beforeEach(function(){
      collectionView = new CollectionView({});
      collectionView.render();

      childView = collectionView.children.findByIndex(0);
      spyOn(childView, "destroy").andCallThrough();
      spyOn(EmptyView.prototype, "render");

      collectionView.onChildRemove(model);
    });

    it("should destroy the model's view", function(){
      expect(childView.destroy).toHaveBeenCalled();
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
        childView: ChildView,
        collection: collection
      });
      collectionView.render();

      childView = collectionView.children.findByIndex(0);
      spyOn(childView, "destroy").andCallThrough();

      collection.remove(model);
    });

    it("should destroy the model's view", function(){
      expect(childView.destroy).toHaveBeenCalled();
    });

    it("should remove the model-view's HTML", function(){
      expect($(collectionView.$el).children().length).toBe(0);
    });
  });

  describe("when destroying a collection view", function(){
    var EventedView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,

      someCallback: function(){ },

      onBeforeDestroy: function(){},

      onDestroy: function(){ }
    });

    var collectionView;
    var collection;
    var childView;
    var childModel;
    var destroyHandler = jasmine.createSpy();

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

      spyOn(childView, "destroy").andCallThrough();
      spyOn(collectionView, "removeChildView").andCallThrough();
      spyOn(collectionView, "stopListening").andCallThrough();
      spyOn(collectionView, "remove").andCallThrough();
      spyOn(collectionView, "someCallback").andCallThrough();
      spyOn(collectionView, "someItemViewCallback").andCallThrough();
      spyOn(collectionView, "destroy").andCallThrough();
      spyOn(collectionView, "onDestroy").andCallThrough();
      spyOn(collectionView, "onBeforeDestroy").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();

      collectionView.bind('collection:destroyed', destroyHandler);

      collectionView.destroy();

      childView.trigger("foo");

      collection.trigger("foo");
      collection.remove(childModel);
    });

    it("should destroy all of the child views", function(){
      expect(childView.destroy).toHaveBeenCalled();
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

    it("should call `onDestroy` if provided", function(){
      expect(collectionView.onDestroy).toHaveBeenCalled();
    });

    it("should call `onBeforeDestroy` if provided", function(){
      expect(collectionView.onBeforeDestroy).toHaveBeenCalled();
    });

    it("should trigger a 'before:destroy' event", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:before:destroy");
    });

    it("should trigger a 'destroyed", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("collection:destroyed");
    });

    it("should call the handlers add to the destroyed event", function(){
      expect(destroyHandler).wasCalled();
    });

    it("should throw an error saying the view's been destroyed if render is attempted again", function(){
      expect(function(){collectionView.render()}).toThrow("Cannot use a view that's already been destroyed.");
    });
  });

  describe("when destroying an childView that does not have a 'destroy' method", function(){
    var collectionView, childView;

    beforeEach(function(){
      collectionView = new Marionette.CollectionView({
        childView: Backbone.View,
        collection: new Backbone.Collection([{id: 1}])
      });

      collectionView.render();

      childView = collectionView.children.findByIndex(0);
      spyOn(childView, "remove").andCallThrough();

      collectionView.destroyChildren();
    });

    it("should call the 'remove' method", function(){
      expect(childView.remove).toHaveBeenCalled();
    });

  });

  describe("when override appendHtml", function(){
    var PrependHtmlView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,

      appendHtml: function(collectionView, childView){
        collectionView.$el.prepend(childView.el);
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
    var model, collection, collectionView, childView, someEventSpy;

    beforeEach(function(){
      someEventSpy = jasmine.createSpy("some:event spy");

      model = new Backbone.Model({ foo: "bar" });
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({ collection: collection });
      collectionView.on("childview:some:event", someEventSpy);
      collectionView.render();

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event, including other relevant parameters", function() {
      expect(someEventSpy).toHaveBeenCalledWith(childView, "test", model);
    });
  });

  describe("when configuring a custom childViewEventPrefix", function(){
    var model, collection, collectionView, childView, someEventSpy;

    var CV = CollectionView.extend({
      childViewEventPrefix: "myPrefix"
    });

    beforeEach(function(){
      someEventSpy = jasmine.createSpy("some:event spy");

      model = new Backbone.Model({ foo: "bar" });
      collection = new Backbone.Collection([model]);

      collectionView = new CV({ collection: collection });
      collectionView.on("myPrefix:some:event", someEventSpy);
      collectionView.render();

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function(){
      expect(collectionView.trigger).toHaveBeenCalledWith("myPrefix:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event, including other relevant parameters", function() {
      expect(someEventSpy).toHaveBeenCalledWith(childView, "test", model);
    });
  });

  describe("when a child view triggers the default", function(){
    var model, collection, collectionView, childView;

    beforeEach(function(){
      model = new Backbone.Model({ foo: "bar" });
      collection = new Backbone.Collection([model]);

      collectionView = new CollectionView({
        childView: Backbone.Marionette.ItemView.extend({
            template: function() { return '<%= foo %>'; }
        }),
        collection: collection
      });
    });

    describe("render events", function(){
      var beforeSpy, renderSpy, childBeforeSpy, childRenderedSpy;

      beforeEach(function(){
        beforeSpy = jasmine.createSpy("before:render spy");
        renderSpy = jasmine.createSpy("render spy");

        collectionView.on("childview:before:render", beforeSpy);
        collectionView.on("childview:render", renderSpy);

        collectionView.render();
        childView = collectionView.children.findByIndex(0);
      });

      it("should bubble up through the parent collection view", function(){
        // As odd as it seems, the events are triggered with two arguments,
        // the first being the child view which triggered the event
        // and the second being the event's owner.  It just so happens to be the
        // same view.
        expect(beforeSpy).toHaveBeenCalledWith(childView, childView);
        expect(renderSpy).toHaveBeenCalledWith(childView, childView);
      });
    });

    describe("destroy events", function(){
      var beforeSpy, destroySpy, childBeforeSpy, childClosedSpy;

      beforeEach(function(){
        beforeSpy = jasmine.createSpy("before:destroy spy");
        destroySpy = jasmine.createSpy("destroy spy");

        collectionView.on("childview:before:destroy", beforeSpy);
        collectionView.on("childview:destroy", destroySpy);

        collectionView.render();
        childView = collectionView.children.findByIndex(0);
        collectionView.destroy();
      });

      it("should bubble up through the parent collection view", function(){
        expect(beforeSpy).toHaveBeenCalledWith(childView);
        expect(destroySpy).toHaveBeenCalledWith(childView);
      });
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

    var ChildView = Backbone.Marionette.ItemView.extend({
      onShow: function(){},
      onDomRefresh: function(){ },
      onRender: function(){},
      render: function() {
        this.trigger("render");
      }
    });

    var ColView = Backbone.Marionette.CollectionView.extend({
      childView: ChildView,
      onShow: function(){}
    });
    var collectionView;

    beforeEach(function(){
      sinon.spy(ChildView.prototype, "onShow");
      sinon.spy(ChildView.prototype, "onDomRefresh");

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
      ChildView.prototype.onShow.restore();
      ChildView.prototype.onDomRefresh.restore();
    });

    it("should not use the render buffer", function() {
      expect(collectionView.appendBuffer).not.toHaveBeenCalled();
    });

    it("should call the 'onShow' method of the child view", function(){
      expect(ChildView.prototype.onShow).toHaveBeenCalled();
    });

    it("should call the child's 'onShow' method with itself as the context", function(){
      expect(ChildView.prototype.onShow).toHaveBeenCalledOn(view);
    });

    it("should call the child's 'onDomRefresh' method with itself as the context", function(){
      expect(ChildView.prototype.onDomRefresh).toHaveBeenCalled();
    });
  });

  describe("when setting an childView in the constructor options", function(){
    var IV = Marionette.ItemView.extend({
      template: function(){},
      MyItemView: true
    });

    var iv;

    beforeEach(function(){
      var c = new Backbone.Collection([{a: "b"}]);
      var cv = new Marionette.CollectionView({
        childView: IV,
        collection: c,
      });

      cv.render();

      iv = cv.children.findByModel(c.at(0));
    });

    it("should use the specified childView for each item", function(){
      expect(iv.MyItemView).toBe(true);
    });
  });

  describe("when calling childEvents via an childEvents method", function() {
    var model, collection, collectionView, childView, someEventSpy;

    var CV = CollectionView.extend({
      childEvents: function() {
        return {
          "some:event": "someEvent"
        }
      }
    });

    beforeEach(function() {
      someEventSpy = jasmine.createSpy("some:event spy");

      model = new Backbone.Model({ foo: "bar" });
      collection = new Backbone.Collection([model]);

      collectionView = new CV({ collection: collection });
      collectionView.someEvent = someEventSpy;
      collectionView.render();

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function() {
      expect(collectionView.trigger).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event, including other relevant parameters", function() {
      expect(someEventSpy).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });
  });

  describe("when calling childEvents via the childEvents hash", function() {
    var model, collection, collectionView, childView, onSomeEventSpy;

    beforeEach(function() {
      onSomeEventSpy = jasmine.createSpy("some:event spy");
      var CV = CollectionView.extend({
        childEvents: {
          "some:event": onSomeEventSpy
        }
      });

      model = new Backbone.Model({ foo: "bar" });
      collection = new Backbone.Collection([model]);

      collectionView = new CV({ collection: collection });
      collectionView.render();

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function() {
      expect(collectionView.trigger).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event, including other relevant parameters", function() {
      expect(onSomeEventSpy).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });
  });

  describe("when calling childEvents via the childEvents hash with a string of the function name", function() {
    var model, collection, collectionView, childView, someEventSpy;

    var CV = CollectionView.extend({
      childEvents: {
        "some:event": "someEvent"
      }
    });

    beforeEach(function() {
      someEventSpy = jasmine.createSpy("some:event spy");

      model = new Backbone.Model({ foo: "bar" });
      collection = new Backbone.Collection([model]);

      collectionView = new CV({ collection: collection });
      collectionView.someEvent = someEventSpy;
      collectionView.render();

      spyOn(collectionView, "trigger").andCallThrough();
      childView = collectionView.children.findByIndex(0);
      childView.trigger("some:event", "test", model);
    });

    it("should bubble up through the parent collection view", function() {
      expect(collectionView.trigger).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });

    it("should provide the child view that triggered the event, including other relevant parameters", function() {
      expect(someEventSpy).toHaveBeenCalledWith("childview:some:event", childView, "test", model);
    });
  });

  describe("calling childEvents via the childEvents hash with a string of a nonexistent function name", function(){

    var CV = Marionette.CollectionView.extend({
      childView: ChildView,
      childEvents: {
        "render": "nonexistentFn"
      }
    });

    beforeEach(function() {
      var cv = new CV({
        collection: (new Backbone.Collection([{}]))
      });
      cv.render();
    });

    it("should not break", function() {
      // Intentionally left blank
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

  describe("when a collection is reset child views should not be shown until the buffering is over", function() {
    var isBuffering, iv, cv, collection, cvInstance;

    iv = Marionette.ItemView.extend({
      template: _.template("<div>hi mom</div>"),
      onShow: function() {
        isBuffering = cvInstance.isBuffering;
      }
    });

    cv = Marionette.CollectionView.extend({
      childView: iv
    });

    beforeEach(function() {
      isBuffering = null;
      collection = new Backbone.Collection([{}]);
      cvInstance = new cv({collection: collection});
      cvInstance.render().trigger('show');
    });

    it("collectionView should not be buffering on childView show", function() {
      expect(isBuffering).toBe(false);
    });

    it("collectionView should not be buffering after reset on childView show", function() {
      isBuffering = void 0;
      collection.reset([{}]);
      expect(isBuffering).toBe(false);
    });

    describe("child view show events", function () {
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
      childView: ChildView,
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

  describe("when returning the view from addChild", function(){
    var childView;

    beforeEach(function(){
      var model = new Backbone.Model({foo: "bar"});

      var CollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ChildView
      });

      var collectionView = new CollectionView({});

      childView = collectionView.addChild(model, ChildView, 0);
    });

    it("should return the child view for the model", function(){
      expect(childView.$el).toHaveText("bar");
    });
  });

});
