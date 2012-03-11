describe("composite view", function(){
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

  var CompositeView = Backbone.Marionette.CompositeView.extend({
    itemView: ItemView,
    template: "#composite-template"
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

  describe("when rendering a composite view", function(){
    it("should guarantee rendering of the model before rendering the collection", function(){
      throw "not sure how to implement this";
      // this needs to handle async template loading where the
      // model view is guaranteed to have it's template loading
      // and have the model view rendered, before the collection
      // of items is rendered
    });
  });

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

  describe("when re-rendering a composite view", function(){
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
      compositeRenderSpy = compositeView.render;

      compositeView.render();
      compositeView.reRender();
    });

    it("should re-render the template view", function(){
      expect(ModelView.prototype.render.callCount).toBe(2);
    });

    it("should not re-render the collection's items", function(){
      expect(compositeRenderSpy.callCount).toBe(1);
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

});
