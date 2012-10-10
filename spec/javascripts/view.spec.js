describe("base view", function(){

  describe("when initializing a view", function(){
    var fooHandler;

    beforeEach(function(){
      fooHandler = jasmine.createSpy();

      var view = Backbone.Marionette.View.extend({
        initialize: function(){
          this.bindTo(this.model, "foo", fooHandler);
        }
      });

      var model = new Backbone.Model();

      new view({
        model: model
      });

      model.trigger("foo");
    });

    it("should allow event to be bound via event binder", function(){
      expect(fooHandler).toHaveBeenCalled();
    });
  });

  describe("when a view has valid model and collection event configuration", function(){
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { 'model-event': 'modelEventHandler' },
      collectionEvents: { 'collection-event': 'collectionEventHandler' },

      modelEventHandler: jasmine.createSpy("model event handler"),
      collectionEventHandler: jasmine.createSpy("collection event handler")
    });

    beforeEach(function(){
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it("should wire up model events", function(){
      view.model.trigger("model-event");
      expect(view.modelEventHandler).toHaveBeenCalled();
    });

    it("should wire up collection events", function(){
      view.collection.trigger("collection-event");
      expect(view.collectionEventHandler).toHaveBeenCalled();
    });

  });

  describe("when a view has model event config with a specified handler method that doesn't exist", function(){
    var getBadViewInstance;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { "foo": "does not exist" }
    });

    beforeEach(function(){
      getBadViewInstance = function(){
        new View({ model: {} })
      }
    });

    it("should error when method doesn't exist", function(){
      expect(getBadViewInstance).toThrow("View method 'does not exist' was configured as an event handler, but does not exist.");
    });
  });
});
