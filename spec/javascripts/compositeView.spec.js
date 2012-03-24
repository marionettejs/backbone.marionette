describe("composite view", function(){

  describe("when a composite view has a template without a model", function(){
    var compositeView;

    beforeEach(function(){
      loadFixtures("compositeTemplate-noModel.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeViewNoModel({
        collection: collection
      });

      compositeView.render();
    });

    it("should render the template", function(){
      expect(compositeView.$el).toHaveText(/composite/);
    });

    it("should render the collection's items", function(){
      expect(compositeView.$el).toHaveText(/baz/);
    });
  });

  describe("when a composite view has a model and a template", function(){
    var compositeView;

    beforeEach(function(){
      loadFixtures("compositeTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.render();
    });

    it("should render the template with the model", function(){
      expect(compositeView.$el).toHaveText(/composite bar/);
    });

    it("should render the collection's items", function(){
      expect(compositeView.$el).toHaveText(/baz/);
    });
  });

  describe("when rendering a composite view", function(){
    var compositeView;
    var order;
    var deferredResolved;

    beforeEach(function(){
      order = [];
      loadFixtures("compositeTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      var collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.on("composite:model:rendered", function(){
        order.push(compositeView.renderedModelView);
      });

      compositeView.on("composite:collection:rendered", function(){
        order.push(compositeView.collection);
      });

      compositeView.on("composite:rendered", function(){
        order.push(compositeView);
      });

      spyOn(compositeView, "trigger").andCallThrough();
      spyOn(compositeView, "onRender").andCallThrough();

      var deferred = compositeView.render();
      
      deferred.done(function(){
        deferredResolved = true;
      });
    });

    it("should trigger a rendered event for the model view", function(){
      expect(compositeView.trigger).toHaveBeenCalledWith("composite:model:rendered");
    });

    it("should trigger a rendered event for the collection", function(){
      expect(compositeView.trigger).toHaveBeenCalledWith("composite:collection:rendered");
    });

    it("should trigger a rendered event for the composite view", function(){
      expect(compositeView.trigger).toHaveBeenCalledWith("composite:rendered");
    });

    it("should guarantee rendering of the model before rendering the collection", function(){
      expect(order[0]).toBe(compositeView.renderedModelView);
      expect(order[1]).toBe(compositeView.collection);
      expect(order[2]).toBe(compositeView);
    });

    it("should call 'onRender'", function(){
      expect(compositeView.onRender).toHaveBeenCalled();
    });

    it("should resolve the rendering deferred", function(){
      expect(deferredResolved).toBeTruthy();
    });
  });

  describe("when rendering a composite view twice", function(){
    var compositeView, compositeRenderSpy;

    beforeEach(function(){
      loadFixtures("compositeTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeModelView({
        model: m1,
        collection: collection
      });

      spyOn(ModelView.prototype, "render").andCallThrough();
      spyOn(compositeView, "render").andCallThrough();
      spyOn(compositeView, "closeChildren").andCallThrough();
      compositeRenderSpy = compositeView.render;

      compositeView.render();
      compositeView.render();
    });

    it("should re-render the template view", function(){
      expect(ModelView.prototype.render.callCount).toBe(2);
    });

    it("should close all of the child collection item views", function(){
      expect(compositeView.closeChildren).toHaveBeenCalled();
      expect(compositeView.closeChildren.callCount).toBe(2);
    });

    it("should re-render the collection's items", function(){
      expect(compositeRenderSpy.callCount).toBe(2);
    });
  });

  describe("when rendering a composite view with an empty collection and then resetting the collection", function(){
    var compositeView;

    beforeEach(function(){
      loadFixtures("compositeRerender.html");

      var m1 = new Model({foo: "bar"});
      var collection = new Collection();
      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.render();

      var m2 = new Model({foo: "baz"});
      collection.reset([m2]);
    });

    it("should render the template with the model", function(){
      expect(compositeView.$el).toHaveText(/composite bar/);
    });

    it("should render the collection's items", function(){
      expect(compositeView.$el).toHaveText(/baz/);
    });
  });

  describe("when rendering a composite view without a collection", function(){
    var compositeView;

    beforeEach(function(){
      loadFixtures("compositeRerender.html");

      var m1 = new Model({foo: "bar"});
      compositeView = new CompositeView({
        model: m1
      });

      compositeView.render();
    });

    it("should render the template with the model", function(){
      expect(compositeView.$el).toHaveText(/composite bar/);
    });

    it("should not render the collection's items", function(){
      expect(compositeView.$el).not.toHaveText(/baz/);
    });
  });

  describe("when rendering a composite with a collection and then resetting the collection", function(){
    var compositeView;

    beforeEach(function(){
      loadFixtures("compositeRerender.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      var collection = new Collection([m2]);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.render();

      var m3 = new Model({foo: "quux"});
      var m4 = new Model({foo: "widget"});
      collection.reset([m3, m4]);
    });

    it("should render the template with the model", function(){
      expect(compositeView.$el).toHaveText(/composite bar/);
    });

    it("should render the collection's items", function(){
      expect(compositeView.$el).not.toHaveText(/baz/);
      expect(compositeView.$el).toHaveText(/quux/);
      expect(compositeView.$el).toHaveText(/widget/);
    });
  });

  describe("when workign with a composite and recursive model", function(){
    var treeView;

    beforeEach(function(){
      loadFixtures("recursiveCompositeTemplate.html");

      var data = {
        name: "level 1",
        nodes: [
          {
            name: "level 2"
          }
        ]
      };

      var node = new Node(data);
      treeView = new TreeView({
        model: node
      });

      treeView.render();
    });

    it("should render the template with the model", function(){
      expect(treeView.$el).toHaveText(/composite bar/);
    });

    it("should render the collection's items", function(){
      expect(treeView.$el).toHaveText(/baz/);
    });
  });

  describe("when closing a composite view", function(){
    var compositeView, compositeModelCloseSpy;

    beforeEach(function(){
      loadFixtures("compositeTemplate.html");

      var m1 = new Model({foo: "bar"});
      var m2 = new Model({foo: "baz"});
      collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeModelView({
        model: m1,
        collection: collection
      });

      spyOn(CompositeModelView.prototype, "close").andCallThrough();

      compositeView.render();

      spyOn(compositeView.renderedModelView, "close");
      compositeModelCloseSpy = compositeView.renderedModelView.close;
      
      compositeView.close();
    });

    it("should close the model view", function(){
      expect(compositeModelCloseSpy.callCount).toBe(1);
    });

    it("should delete the model view", function(){
      expect(compositeView.renderedModelView).toBeUndefined();
    });

    it("should close the collection of views", function(){
      expect(CompositeModelView.prototype.close.callCount).toBe(1);
    });
  });

  var Model = Backbone.Model.extend({});

  var Collection = Backbone.Collection.extend({
    model: Model
  });
  
  var ItemView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
    }
  });

  var ModelView = Backbone.Marionette.ItemView.extend({
    tagName: "span",
    render: function(){
      this.$el.html(this.model.get("foo"));
    }
  });

  var Node = Backbone.Model.extend({
    initialize: function(){
      var nodes = this.get("nodes");
      if (nodes){
        this.nodes = new NodeCollection(nodes);
        this.unset("nodes");
      }
    }
  });

  var NodeCollection = Backbone.Collection.extend({
    model: Node
  });

  var TreeView = Backbone.Marionette.CompositeView.extend({
    tagName: "ul",
    template: "#recursive-composite-template",

    initialize: function(){
      this.collection = this.model.nodes;
    }
  });

  var CompositeView = Backbone.Marionette.CompositeView.extend({
    itemView: ItemView,
    template: "#composite-template",

    onRender: function(){}
  });

  var CompositeViewNoModel = Backbone.Marionette.CompositeView.extend({
    itemView: ItemView,
    template: "#composite-template-no-model"
  });

  var CompositeModelView = Backbone.Marionette.CompositeView.extend({
    modelView: ModelView,
    itemView: ItemView,
    template: "#composite-template"
  });

});
