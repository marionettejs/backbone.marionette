describe("view entity events", function(){

  describe("when a view has string-based model and collection event configuration", function(){
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { 'model-event': 'modelEventHandler modelEventHandler2' },
      collectionEvents: { 'collection-event': 'collectionEventHandler collectionEventHandler2' },

      modelEventHandler: jasmine.createSpy("model event handler"),
      collectionEventHandler: jasmine.createSpy("collection event handler"),
      modelEventHandler2: jasmine.createSpy("model event handler2"),
      collectionEventHandler2: jasmine.createSpy("collection event handler2")
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
      expect(view.modelEventHandler2).toHaveBeenCalled();
    });

    it("should wire up collection events", function(){
      view.collection.trigger("collection-event");
      expect(view.collectionEventHandler).toHaveBeenCalled();
      expect(view.collectionEventHandler2).toHaveBeenCalled();
    });

  });

  describe("when a view has function-based model and collection event configuration", function(){
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { 
        'model-event': jasmine.createSpy("model event handler")
      },
      collectionEvents: { 
        'collection-event': jasmine.createSpy("collection event handler")
      }
    });

    beforeEach(function(){
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it("should wire up model events", function(){
      view.model.trigger("model-event");
      expect(view.modelEvents['model-event']).toHaveBeenCalled();
    });

    it("should wire up collection events", function(){
      view.collection.trigger("collection-event");
      expect(view.collectionEvents['collection-event']).toHaveBeenCalled();
    });

  });

  describe("when a view has model event config with a specified handler method that doesn't exist", function(){
    var getBadViewInstance;

    var View = Backbone.Marionette.View.extend({
      modelEvents: { "foo": "does_not_exist" }
    });

    beforeEach(function(){
      getBadViewInstance = function(){
        new View({ model: {} })
      }
    });

    it("should error when method doesn't exist", function(){
      expect(getBadViewInstance).toThrow("Method 'does_not_exist' was configured as an event handler, but does not exist.");
    });
  });

  describe("when configuring entity events with a function", function(){
    var view, modelHandler, collectionHandler;

    beforeEach(function(){
      modelHandler = jasmine.createSpy("model handler");
      collectionHandler = jasmine.createSpy("collection handler");

      var View = Backbone.Marionette.View.extend({
        modelEvents: function(){ 
          return {'model-event': modelHandler};
        },
        collectionEvents: function(){ 
          return {'collection-event': collectionHandler};
        }
      });

      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });

      view.model.trigger('model-event');
      view.collection.trigger('collection-event');
    });

    it("should trigger the model event", function(){
      expect(modelHandler).toHaveBeenCalled();
    });

    it("should trigger the collection event", function(){
      expect(collectionHandler).toHaveBeenCalled();
    });
  });

});
