describe('view entity events', function() {

  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when a view has string-based model and collection event configuration', function() {
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: {'model-event': 'modelEventHandler modelEventHandler2'},
      collectionEvents: {'collection-event': 'collectionEventHandler collectionEventHandler2'},

      modelEventHandler: sinon.stub(),
      collectionEventHandler: sinon.stub(),
      modelEventHandler2: sinon.stub(),
      collectionEventHandler2: sinon.stub()
    });

    beforeEach(function() {
      view = new View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it('should wire up model events', function() {
      view.model.trigger('model-event');
      expect(view.modelEventHandler).to.have.been.called;
      expect(view.modelEventHandler2).to.have.been.called;
    });

    it('should wire up collection events', function() {
      view.collection.trigger('collection-event');
      expect(view.collectionEventHandler).to.have.been.called;
      expect(view.collectionEventHandler2).to.have.been.called;
    });

  });

  describe('when a view has function-based model and collection event configuration', function() {
    var view;

    var View = Backbone.Marionette.View.extend({
      modelEvents: {
        'model-event': sinon.stub()
      },
      collectionEvents: {
        'collection-event': sinon.stub()
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
      expect(view.modelEvents['model-event']).to.have.been.called;
    });

    it('should wire up collection events', function() {
      view.collection.trigger('collection-event');
      expect(view.collectionEvents['collection-event']).to.have.been.called;
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
      expect(getBadViewInstance).to.throw('Method "does_not_exist" was configured as an event handler, but does not exist.');
    });
  });

  describe('when configuring entity events with a function', function() {
    var view, modelHandler, collectionHandler;

    beforeEach(function() {
      modelHandler = sinon.stub();
      collectionHandler = sinon.stub();

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
      expect(modelHandler).to.have.been.called;
    });

    it('should trigger the collection event', function() {
      expect(collectionHandler).to.have.been.called;
    });
  });

  describe('when undelegating events on a view', function() {
    var view, modelHandler, collectionHandler;

    beforeEach(function() {
      modelHandler = sinon.stub();
      collectionHandler = sinon.stub();

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
      expect(modelHandler).not.to.have.been.called;
    });

    it('should undelegate the collection events', function() {
      expect(collectionHandler).not.to.have.been.called;
    });
  });

  describe('when undelegating events on a view, delegating them again, and then triggering a model event', function() {
    var view, modelHandler, collectionHandler;

    beforeEach(function() {
      modelHandler = sinon.stub();
      collectionHandler = sinon.stub();

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
      expect(modelHandler.callCount).to.equal(1);
    });

    it('should fire the collection event once', function() {
      expect(collectionHandler.callCount).to.equal(1);
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
      destroySpy = sinon.spy(ChildView.prototype, 'destroy');
      renderSpy = sinon.stub(ChildView.prototype, 'render');

      var model = new Backbone.Model();
      var parent = new ParentView({
        model: model
      });
      parent.render();

      model.trigger('sync');
      model.trigger('sync');
    });

    afterEach(function() {
      ChildView.prototype.destroy.restore();
      ChildView.prototype.render.restore();
    });

    it('should destroy the previous child view', function() {
      expect(destroySpy).to.have.been.called;
    });

    it('should undelegate all previous views modelEvents', function() {
      // ChildView 1 when destroyed should not react to event
      // we expect ChildView 1 to call render, (1st)
      // we expect ChildView 1 to destroy
      // we expect ChildView 2 to call render (2nd)
      // we expect destroyed ChildView 1 not to call render again
      expect(renderSpy.callCount).to.equal(5);
    });
  });
});
