describe('view entity events', function() {

  describe('when a view has string-based model and collection event configuration', function() {
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: {'model-event': 'modelEventHandler modelEventHandler2'},
      collectionEvents: {'collection-event': 'collectionEventHandler collectionEventHandler2'},

      modelEventHandler: jasmine.createSpy('model event handler'),
      collectionEventHandler: jasmine.createSpy('collection event handler'),
      modelEventHandler2: jasmine.createSpy('model event handler2'),
      collectionEventHandler2: jasmine.createSpy('collection event handler2')
    });

    beforeEach(function() {
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it('should wire up model events', function() {
      view.model.trigger('model-event');
      expect(view.modelEventHandler).toHaveBeenCalled();
      expect(view.modelEventHandler2).toHaveBeenCalled();
    });

    it('should wire up collection events', function() {
      view.collection.trigger('collection-event');
      expect(view.collectionEventHandler).toHaveBeenCalled();
      expect(view.collectionEventHandler2).toHaveBeenCalled();
    });

  });

  describe('when a view has function-based model and collection event configuration', function() {
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: {
        'model-event': jasmine.createSpy('model event handler')
      },
      collectionEvents: {
        'collection-event': jasmine.createSpy('collection event handler')
      }
    });

    beforeEach(function() {
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it('should wire up model events', function() {
      view.model.trigger('model-event');
      expect(view.modelEvents['model-event']).toHaveBeenCalled();
    });

    it('should wire up collection events', function() {
      view.collection.trigger('collection-event');
      expect(view.collectionEvents['collection-event']).toHaveBeenCalled();
    });

  });

  describe('when a view has model event config with a specified handler method that doesnt exist', function() {
    var getBadViewInstance;

    var View = Backbone.Marionette.View.extend({
      modelEvents: {foo: 'does_not_exist'}
    });

    beforeEach(function() {
      getBadViewInstance = function() {
        return new View({model: {}});
      };
    });

    it('should error when method doesnt exist', function() {
      expect(getBadViewInstance).toThrow('Method "does_not_exist" was configured as an event handler, but does not exist.');
    });
  });

  describe('when configuring entity events with a function', function() {
    var view, modelHandler, collectionHandler;

    beforeEach(function() {
      modelHandler = jasmine.createSpy('model handler');
      collectionHandler = jasmine.createSpy('collection handler');

      var View = Backbone.Marionette.View.extend({
        modelEvents: function() {
          return {'model-event': modelHandler};
        },
        collectionEvents: function() {
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

    it('should trigger the model event', function() {
      expect(modelHandler).toHaveBeenCalled();
    });

    it('should trigger the collection event', function() {
      expect(collectionHandler).toHaveBeenCalled();
    });
  });

  describe('when undelegating events on a view', function() {
    var view, modelHandler, collectionHandler;

    beforeEach(function() {
      modelHandler = jasmine.createSpy('model event handler');
      collectionHandler = jasmine.createSpy('collection event handler');

      var View = Marionette.View.extend({
        modelEvents: {
          'model-event': 'modelEventHandler'
        },

        collectionEvents: {
          'collection-event': 'collectionEventHandler'
        },

        modelEventHandler: modelHandler,
        collectionEventHandler: collectionHandler
      });

      var model = new Backbone.Model();
      var collection = new Backbone.Collection();

      view = new View({
        model: model,
        collection: collection
      });

      view.undelegateEvents();

      model.trigger('model-event');
      collection.trigger('collection-event');
    });

    it('should undelegate the model events', function() {
      expect(modelHandler).not.toHaveBeenCalled();
    });

    it('should undelegate the collection events', function() {
      expect(collectionHandler).not.toHaveBeenCalled();
    });
  });

  describe('when undelegating events on a view, delegating them again, and then triggering a model event', function() {
    var view, modelHandler, collectionHandler;

    beforeEach(function() {
      modelHandler = jasmine.createSpy('model event handler');
      collectionHandler = jasmine.createSpy('collection event handler');

      var View = Marionette.View.extend({
        modelEvents: {
          'model-event': 'modelEventHandler'
        },

        collectionEvents: {
          'collection-event': 'collectionEventHandler'
        },

        modelEventHandler: modelHandler,
        collectionEventHandler: collectionHandler
      });

      var model = new Backbone.Model();
      var collection = new Backbone.Collection();

      view = new View({
        model: model,
        collection: collection
      });

      view.undelegateEvents();
      view.delegateEvents();

      model.trigger('model-event');
      collection.trigger('collection-event');
    });

    it('should fire the model event once', function() {
      expect(modelHandler.callCount).toBe(1);
    });

    it('should fire the collection event once', function() {
      expect(collectionHandler.callCount).toBe(1);
    });
  });

  describe('when LayoutView bound to modelEvent replaces region with new view', function() {
    var destroySpy, renderSpy;

    var ChildView = Marionette.ItemView.extend({
      template: _.template(''),

      modelEvents: {
        'sync': 'doStuff'
      },

      doStuff: function() {
        this.render();
      }
    });

    var ParentView = Marionette.LayoutView.extend({
      template: _.template('<div id="child"></div>'),

      regions: {
        child: '#child'
      },

      onRender: function() {
        this.child.show(new ChildView({
          model: this.model
        }));
      },

      modelEvents: {
        'sync': 'render'
      }
    });

    beforeEach(function() {
      destroySpy = spyOn(ChildView.prototype, 'destroy').andCallThrough();
      renderSpy = spyOn(ChildView.prototype, 'render').andCallFake(function() {});

      var model = new Backbone.Model();
      var parent = new ParentView({
        model: model
      });
      parent.render();

      model.trigger('sync');
      model.trigger('sync');
    });

    it('should destroy the previous child view', function() {
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should undelegate all previous views modelEvents', function() {
      // ChildView 1 when destroyed should not react to event
      // we expect ChildView 1 to call render, (1st)
      // we expect ChildView 1 to destroy
      // we expect ChildView 2 to call render (2nd)
      // we expect destroyed ChildView 1 not to call render again
      expect(renderSpy.calls.length).toEqual(5);
    });
  });
});
