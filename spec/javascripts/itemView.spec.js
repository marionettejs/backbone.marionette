describe("item view", function(){
  var Model = Backbone.Model.extend();

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({});

  var OnRenderView = Backbone.Marionette.ItemView.extend({
    template: "#emptyTemplate",
    beforeRender: function(){},
    onRender: function(){}
  });

  var CustomRenderView = Backbone.Marionette.ItemView.extend({
    renderTemplate: function(template, data){
      return "<foo>custom</foo>";
    }
  });

  var EventedView = Backbone.Marionette.ItemView.extend({
    template: "#emptyTemplate",

    modelChange: function(){ },

    collectionChange: function(){ },

    beforeClose: function(){},

    onClose: function(){ }
  });

  beforeEach(function(){
    loadFixtures("itemTemplate.html", "collectionItemTemplate.html", "emptyTemplate.html");
  });

  describe("when overriding the `renderTemplate` method", function(){
    var view;

    beforeEach(function(){
      view = new CustomRenderView({});
      view.render();
    });

    it("should render the view with the overridden method", function(){
      expect($(view.el)).toHaveHtml("<foo>custom</foo");
    });
  });

  describe("when rendering", function(){
    var view;
    var renderResult;
    var deferredDone;

    beforeEach(function(){
      view = new OnRenderView({});
      
      spyOn(view, "beforeRender").andCallThrough();
      spyOn(view, "onRender").andCallThrough();
      spyOn(view, "trigger").andCallThrough();

      var deferred = view.render();
      deferred.done(function(){deferredDone = true; });
    });

    it("should call a `beforeRender` method on the view", function(){
      expect(view.beforeRender).toHaveBeenCalled();
    });

    it("should call an `onRender` method on the view", function(){
      expect(view.onRender).toHaveBeenCalled();
    });

    it("should trigger a before:render event", function(){
      expect(view.trigger).toHaveBeenCalledWith("item:before:render", view);
    });

    it("should trigger a rendered event", function(){
      expect(view.trigger).toHaveBeenCalledWith("item:rendered", view);
    });

    it("should resolve the returned deferred object", function(){
      expect(deferredDone).toBe(true);
    });
  });

  describe("when an item view has a model and is rendered", function(){
    var view;

    beforeEach(function(){
      view = new ItemView({
        template: "#itemTemplate",
        model: new Model({
          foo: "bar"
        })
      });

      spyOn(view, "serializeData").andCallThrough();

      view.render();
    });

    it("should serialize the model", function(){
      expect(view.serializeData).toHaveBeenCalled();
    });

    it("should render the template with the serialized model", function(){
      expect($(view.el)).toHaveText(/bar/);
    });
  });

  describe("when an item view has a collection and is rendered", function(){
    var view;

    beforeEach(function(){
      view = new ItemView({
        template: "#collectionItemTemplate",
        collection: new Collection([ { foo: "bar" }, { foo: "baz" } ])
      });

      spyOn(view, "serializeData").andCallThrough();

      view.render();
    });

    it("should serialize the collection", function(){
      expect(view.serializeData).toHaveBeenCalled();
    });

    it("should render the template with the serialized collection", function(){
      expect($(view.el)).toHaveText(/bar/);
      expect($(view.el)).toHaveText(/baz/);
    });
  });

  describe("when an item view's collection is reset", function(){
    var view;

    beforeEach(function(){
      var collection = new Collection();
      view = new ItemView({
        template: "#collectionItemTemplate",
        collection: collection
      });

      spyOn(view, "serializeData").andCallThrough();

      collection.reset([ { foo: "bar" }, { foo: "baz" } ]);
    });

    it("should serialize the collection", function(){
      expect(view.serializeData).toHaveBeenCalled();
    });

    it("should render the template with the serialized collection", function(){
      expect($(view.el)).toHaveText(/bar/);
      expect($(view.el)).toHaveText(/baz/);
    });
  });

  describe("when an item view has a model and collection, and is rendered", function(){
    var view;

    beforeEach(function(){
      view = new ItemView({
        template: "#itemTemplate",
        model: new Model({foo: "bar"}),
        collection: new Collection([ { foo: "bar" }, { foo: "baz" } ])
      });

      spyOn(view, "serializeData").andCallThrough();

      view.render();
    });

    it("should serialize the model", function(){
      expect(view.serializeData).toHaveBeenCalled();
    });

    it("should render the template with the serialized model", function(){
      expect($(view.el)).toHaveText(/bar/);
      expect($(view.el)).not.toHaveText(/baz/);
    });
  });

  describe("when closing an item view", function(){
    var view;
    var model;
    var collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection();
      view = new EventedView({
        template: "#itemTemplate",
        model: model,
        collection: collection
      });
      view.render();

      spyOn(view, "unbind").andCallThrough();
      spyOn(view, "remove").andCallThrough();
      spyOn(view, "unbindAll").andCallThrough();
      spyOn(view, "modelChange").andCallThrough();
      spyOn(view, "collectionChange").andCallThrough();
      spyOn(view, "beforeClose").andCallThrough();
      spyOn(view, "onClose").andCallThrough();
      spyOn(view, "trigger").andCallThrough();

      view.bindTo(model, "change:foo", view.modelChange);
      view.bindTo(collection, "foo", view.collectionChange);

      view.close();

      model.set({foo: "bar"});
      collection.trigger("foo");
    });

    it("should unbind model events for the view", function(){
      expect(view.modelChange).not.toHaveBeenCalled();
    });

    it("should unbind all collection events for the view", function(){
      expect(view.collectionChange).not.toHaveBeenCalled();
    });

    it("should unbind any listener to custom view events", function(){
      expect(view.unbind).toHaveBeenCalled();
    });

    it("should remove the view's EL from the DOM", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should trigger 'item:before:close'", function(){
      expect(view.trigger).toHaveBeenCalledWith("item:before:close");
    });

    it("should trigger 'item:closed", function(){
      expect(view.trigger).toHaveBeenCalledWith("item:closed");
    });

    it("should call `beforeClose` if provided", function(){
      expect(view.beforeClose).toHaveBeenCalled();
    });

    it("should call `onClose` if provided", function(){
      expect(view.onClose).toHaveBeenCalled();
    });
  });

});
