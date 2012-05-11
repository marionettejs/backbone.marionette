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

  var AsyncOnRenderView = Backbone.Marionette.ItemView.extend({
    template: "#emptyTemplate",
    asyncCallback: function(){},
    onRender: function() {
      var that = this;
      var deferred = $.Deferred();
      setTimeout(function() {
        deferred.resolve(that.asyncCallback());
      }, 0);
      return deferred.promise();
    }
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
      loadFixtures("itemTemplate.html");

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

  describe("when an item view has asynchronous data and is rendered", function(){
    var view;

    beforeEach(function(){
      loadFixtures("itemTemplate.html");

      view = new ItemView({
        template: "#itemTemplate",
        serializeData: function() {
          var that = this;
          var deferred = $.Deferred();
          setTimeout(function() {
            deferred.resolve(that.model.toJSON());
          }, 100);
          return deferred.promise();
        },
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

  describe("when an item view has an asynchronous onRender and is rendered", function(){
    var view, promise, callbackSpy;

    beforeEach(function(){
      loadFixtures("emptyTemplate.html");
      view = new AsyncOnRenderView();
      callbackSpy = spyOn(view, "asyncCallback").andCallThrough();
      promise = view.render();
    });

    it("should delay until onRender resolves", function(){
      waits(0);
      runs(function(){
        $.when(promise).then(function(){
          expect(callbackSpy).toHaveBeenCalled();
        });
      });
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
      loadFixtures("itemTemplate.html");

      model = new Model({foo: "bar"});
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

  describe("when a view with a checkbox is bound to re-render on the 'change:done' event of the model", function(){
    describe("and rendering the view, then changing the checkbox from unchecked, to checked, and back to unchecked", function(){

      var View = Backbone.Marionette.ItemView.extend({
        template: "#item-with-checkbox",

        setupHandler: function(){
          this.bindTo(this.model, "change:done", this.render, this);
        },

        events: {
          "change #chk": "changeClicked"
        },

        changeClicked: function(e){
          var chk = $(e.currentTarget);
          var checkedAttr = chk.attr("checked");
          var checked = !!checkedAttr;
          this.model.set({done: checked});
        }
      });

      var view, spy, model, chk;

      beforeEach(function(){
        loadFixtures("itemWithCheckbox.html");

        model = new Backbone.Model({
          done: false
        });

        view = new View({
          model: model
        });

        spy = spyOn(view, "render").andCallThrough();

        view.setupHandler();
        view.render();

        chk = view.$("#chk");
        chk.attr("checked", "checked");
        chk.trigger('change');

        chk = view.$("#chk");
        chk.removeAttr("checked");
        chk.trigger('change');
      });

      it("should render the view 3 times total", function(){
        expect(spy.callCount).toBe(3);
      });
    });

  });

});
