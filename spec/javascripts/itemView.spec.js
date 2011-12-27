describe("item view rendering", function(){
  var Model = Backbone.Model.extend();

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({});

  var OnRenderView = Backbone.Marionette.ItemView.extend({
    template: "#emptyTemplate",
    onRender: function(){}
  });

  var EventedView = Backbone.Marionette.ItemView.extend({
    initialize: function(){
      this.bindTo(this.model, "change:foo", this.modelChange);
    }
  });

  beforeEach(function(){
    loadFixtures("itemTemplate.html", "collectionItemTemplate.html", "emptyTemplate.html");
  });

  describe("after rendering", function(){
    var view;

    beforeEach(function(){
      view = new OnRenderView({});
      
      spyOn(view, "onRender");

      view.render();
    });

    it("should call an `onRender` method on the view", function(){
      expect(view.onRender).toHaveBeenCalled();
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
        collection: new Collection([,
          {
            foo: "bar"
          },
          {
            foo: "baz"
          }
        ])
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

  describe("when an item view has a model and collection, and is rendered", function(){
    var view;

    beforeEach(function(){
      view = new ItemView({
        template: "#itemTemplate",
        model: new Model({foo: "bar"}),
        collection: new Collection([,
          {
            foo: "bar"
          },
          {
            foo: "baz"
          }
        ])
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

    beforeEach(function(){
      view = new ItemView({
        template: "#itemTemplate",
        model: new Model({foo: "bar"}),
        collection: new Collection([, { foo: "bar" }, { foo: "baz" } ])
      });

      spyOn(view, "unbind").andCallThrough();

      view.render();
      view.close();
    });

    it("should unbind all model events for the view", function(){
      
    });

    it("should unbind all collection events for the view", function(){
      fail
    });

    it("should unbind any listener to custom view events", function(){
      fail
    });

    it("should remove the view's EL from the DOM", function(){
      fail
    });
  });

});
