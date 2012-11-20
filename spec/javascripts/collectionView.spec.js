describe("collection view", function(){
  "use strict";

  // Shared View Definitions
  // -----------------------
  
  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
    },
    onRender: function(){}
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView,

    onBeforeRender: function(){},

    onRender: function(){},

    onItemAdded: function(view){}
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
    var collectionView;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "onItemAdded").andCallThrough();
      spyOn(collectionView, "onBeforeRender").andCallThrough();
      spyOn(collectionView, "trigger").andCallThrough();
      spyOn(collectionView, "appendHtml").andCallThrough();

      collectionView.render();
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

    it("should call `onItemAdded` for each itemView instance", function(){
      var v1 = collectionView.children.findByIndex(0);
      var v2 = collectionView.children.findByIndex(1);
      expect(collectionView.onItemAdded).toHaveBeenCalledWith(v1);
      expect(collectionView.onItemAdded).toHaveBeenCalledWith(v2);
    });

    it("should call `onItemAdded` for all itemView instances", function(){
      expect(collectionView.onItemAdded.callCount).toBe(2);
    });
  });

  describe("when rendering and an 'itemViewOptions' is provided", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      itemViewOptions: {
        foo: "bar"
      }
    });

    var collection = new Backbone.Collection([{foo: "bar"}]);
    var collectionView, view;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
    });
  });

  describe("when rendering and an 'itemViewOptions' is provided as a function", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      itemViewOptions: function(model){
        return {
          foo: "bar"
        };
      }
    });

    var collection = new Backbone.Collection([{foo: "bar"},{foo: "baz"}]);
    var collectionView, view;


    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection
      });
      spyOn(collectionView, 'itemViewOptions').andCallThrough();

      collectionView.render();
      view = collectionView.children.findByIndex(0);
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
    });
    
    it("should pass the model when calling 'itemViewOptions'", function() {
      expect(collectionView.itemViewOptions).toHaveBeenCalledWith(collection.at(0)); 
      expect(collectionView.itemViewOptions).toHaveBeenCalledWith(collection.at(1)); 
    });
  });

  describe("when rendering and an 'itemViewOptions' is provided at construction time", function(){
    var CollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView
    });

    var collection = new Backbone.Collection([{foo: "bar"}]);
    var collectionView, view;

    beforeEach(function(){
      collectionView = new CollectionView({
        collection: collection,
        itemViewOptions: {
          foo: "bar"
        }
      });

      collectionView.render();
      view = _.values(collectionView.children._views)[0];
    });

    it("should pass the options to every view instance", function(){
      expect(view.options.hasOwnProperty("foo")).toBe(true);
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

  describe("when a collection is reset after the view is loaded", function(){
    var collection;
    var collectionView;

    beforeEach(function(){
      collection = new Backbone.Collection();

      collectionView = new CollectionView({
        collection: collection
      });

      spyOn(collectionView, "onRender").andCallThrough();
      spyOn(collectionView, "closeChildren").andCallThrough();

      collectionView.render();

      collection.reset([{foo: "bar"}, {foo: "baz"}]);
    });

    it("should close all open child views", function(){
      expect(collectionView.closeChildren).toHaveBeenCalled();
    });

    it("should append the html for each itemView", function(){
      expect($(collectionView.$el)).toHaveHtml("<span>bar</span><span>baz</span>");
    });

    it("should reference each of the rendered view items", function(){
      expect(_.size(collectionView.children)).toBe(2);
    });

    it("should call 'onRender' after rendering", function(){
      expect(collectionView.onRender).toHaveBeenCalled();
    });
  });

  describe("when a model is added to the collection", function(){
    var collectionView;
    var collection;
    var model;

    beforeEach(function(){
      spyOn(ItemView.prototype, "onRender");

      collection = new Backbone.Collection();
      collectionView = new CollectionView({
        itemView: ItemView,
        collection: collection
      });
      collectionView.render();

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

      collectionView.bindTo(collection, "foo", collectionView.someCallback);
      collectionView.bindTo(collectionView, "item:foo", collectionView.someItemViewCallback);

      spyOn(childView, "close").andCallThrough();
      spyOn(collectionView, "removeItemView").andCallThrough();
      spyOn(collectionView, "unbindAll").andCallThrough();
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

    it("should unbind all the bindTo events", function(){
      expect(collectionView.unbindAll).toHaveBeenCalled();
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

    it("should not retain any bindings to its children", function(){
      expect(_.size(collectionView.eventBinder._eventBindings)).toBe(0);
    });

    it("should unbind any listener to custom view events", function(){
      expect(collectionView.unbindAll).toHaveBeenCalled();
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
          'item:added',
          'itemview:before:render',
          'itemview:item:before:render',
          'itemview:render',
          'itemview:item:rendered',
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
    var m1, m2, col, view, viewOnShowContext;

    var ItemView = Backbone.Marionette.ItemView.extend({
      onShow: function(){ viewOnShowContext = this; },
      onRender: function(){},
      render: function(){}
    });

    var ColView = Backbone.Marionette.CollectionView.extend({
      itemView: ItemView,
      onShow: function(){}
    });

    beforeEach(function(){
      spyOn(ItemView.prototype, "onShow").andCallThrough();

      m1 = new Backbone.Model();
      m2 = new Backbone.Model();
      col = new Backbone.Collection([m1]);
      var colView = new ColView({
        collection: col
      });

      colView.render();
      colView.onShow();
      colView.trigger("show");

      col.add(m2);
      view = colView.children.findByModel(m2);
    });

    it("should call the 'onShow' method of the child view", function(){
      expect(ItemView.prototype.onShow).toHaveBeenCalled();
    });

    it("should call the child's 'onShow' method with itself as the context", function(){
      expect(viewOnShowContext).toBe(view);
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

});
