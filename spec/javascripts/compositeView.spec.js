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
    var compositeView;

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

      compositeView.render();
      compositeView.reRender();
    });

    it("should re-render the template view", function(){
      expect(ModelView.prototype.render.callCount).toBe(2);
    });

    it("should re-render the collection's items", function(){
      expect(compositeView.render.callCount).toBe(2);
    });
  });

});
