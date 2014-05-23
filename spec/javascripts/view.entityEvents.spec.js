describe('view entity events', function() {
  'use strict';

  describe('when a view has string-based model and collection event configuration', function() {
    beforeEach(function() {
      this.View = Backbone.Marionette.View.extend({
        modelEvents: {'model-event': 'modelEventHandler modelEventHandler2'},
        collectionEvents: {'collection-event': 'collectionEventHandler collectionEventHandler2'},

        modelEventHandler: this.sinon.stub(),
        collectionEventHandler: this.sinon.stub(),
        modelEventHandler2: this.sinon.stub(),
        collectionEventHandler2: this.sinon.stub()
      });

      this.view = new this.View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it('should wire up model events', function() {
      this.view.model.trigger('model-event');
      expect(this.view.modelEventHandler).to.have.been.called;
      expect(this.view.modelEventHandler2).to.have.been.called;
    });

    it('should wire up collection events', function() {
      this.view.collection.trigger('collection-event');
      expect(this.view.collectionEventHandler).to.have.been.called;
      expect(this.view.collectionEventHandler2).to.have.been.called;
    });
  });

  describe('when a view has function-based model and collection event configuration', function() {
    beforeEach(function() {
      this.View = Backbone.Marionette.View.extend({
        modelEvents: {
          'model-event': this.sinon.stub()
        },
        collectionEvents: {
          'collection-event': this.sinon.stub()
        }
      });
      this.view = new this.View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });
    });

    it('should wire up model events', function() {
      this.view.model.trigger('model-event');
      expect(this.view.modelEvents['model-event']).to.have.been.called;
    });

    it('should wire up collection events', function() {
      this.view.collection.trigger('collection-event');
      expect(this.view.collectionEvents['collection-event']).to.have.been.called;
    });
  });

  describe('when a view has model event config with a specified handler method that doesnt exist', function() {
    beforeEach(function() {
      var suite = this;
      this.View = Backbone.Marionette.View.extend({
        modelEvents: {foo: 'does_not_exist'}
      });
      this.getBadViewInstance = function() {
        return new suite.View({model: {}});
      };
    });

    it('should error when method doesnt exist', function() {
      expect(this.getBadViewInstance).to.throw('Method "does_not_exist" was configured as an event handler, but does not exist.');
    });
  });

  describe('when configuring entity events with a function', function() {
    beforeEach(function() {
      var suite = this;
      this.modelHandler = this.sinon.stub();
      this.collectionHandler = this.sinon.stub();

      this.View = Backbone.Marionette.View.extend({
        modelEvents: function() {
          return {'model-event': suite.modelHandler};
        },
        collectionEvents: function() {
          return {'collection-event': suite.collectionHandler};
        }
      });

      this.view = new this.View({
        model: new Backbone.Model(),
        collection: new Backbone.Collection()
      });

      this.view.model.trigger('model-event');
      this.view.collection.trigger('collection-event');
    });

    it('should trigger the model event', function() {
      expect(this.modelHandler).to.have.been.called;
    });

    it('should trigger the collection event', function() {
      expect(this.collectionHandler).to.have.been.called;
    });
  });

  describe('when undelegating events on a view', function() {
    beforeEach(function() {
      this.modelHandler = this.sinon.stub();
      this.collectionHandler = this.sinon.stub();

      this.View = Marionette.View.extend({
        modelEvents: {
          'model-event': 'modelEventHandler'
        },

        collectionEvents: {
          'collection-event': 'collectionEventHandler'
        },

        modelEventHandler: this.modelHandler,
        collectionEventHandler: this.collectionHandler
      });

      this.model = new Backbone.Model();
      this.collection = new Backbone.Collection();

      this.view = new this.View({
        model: this.model,
        collection: this.collection
      });

      this.view.undelegateEvents();

      this.model.trigger('model-event');
      this.collection.trigger('collection-event');
    });

    it('should undelegate the model events', function() {
      expect(this.modelHandler).not.to.have.been.called;
    });

    it('should undelegate the collection events', function() {
      expect(this.collectionHandler).not.to.have.been.called;
    });
  });

  describe('when undelegating events on a view, delegating them again, and then triggering a model event', function() {
    beforeEach(function() {
      this.modelHandler = this.sinon.stub();
      this.collectionHandler = this.sinon.stub();

      this.View = Marionette.View.extend({
        modelEvents: {
          'model-event': 'modelEventHandler'
        },

        collectionEvents: {
          'collection-event': 'collectionEventHandler'
        },

        modelEventHandler: this.modelHandler,
        collectionEventHandler: this.collectionHandler
      });

      this.model = new Backbone.Model();
      this.collection = new Backbone.Collection();

      this.view = new this.View({
        model: this.model,
        collection: this.collection
      });

      this.view.undelegateEvents();
      this.view.delegateEvents();

      this.model.trigger('model-event');
      this.collection.trigger('collection-event');
    });

    it('should fire the model event once', function() {
      expect(this.modelHandler.callCount).to.equal(1);
    });

    it('should fire the collection event once', function() {
      expect(this.collectionHandler.callCount).to.equal(1);
    });
  });

  describe('when LayoutView bound to modelEvent replaces region with new view', function() {
    beforeEach(function() {
      var suite = this;

      this.ChildView = Marionette.ItemView.extend({
        template: _.template(''),

        modelEvents: {
          'sync': 'doStuff'
        },

        doStuff: function() {
          this.render();
        }
      });

      this.ParentView = Marionette.LayoutView.extend({
        template: _.template('<div id="child"></div>'),

        regions: {
          child: '#child'
        },

        onRender: function() {
          this.child.show(new suite.ChildView({
            model: this.model
          }));
        },

        modelEvents: {
          'sync': 'render'
        }
      });

      this.destroySpy = this.sinon.spy(this.ChildView.prototype, 'destroy');
      this.renderSpy = this.sinon.stub(this.ChildView.prototype, 'render');

      this.model = new Backbone.Model();
      this.parent = new this.ParentView({
        model: this.model
      });
      this.parent.render();

      this.model.trigger('sync');
      this.model.trigger('sync');
    });

    it('should destroy the previous child view', function() {
      expect(this.destroySpy).to.have.been.called;
    });

    it('should undelegate all previous views modelEvents', function() {
      // ChildView 1 when destroyed should not react to event
      // we expect ChildView 1 to call render, (1st)
      // we expect ChildView 1 to destroy
      // we expect ChildView 2 to call render (2nd)
      // we expect destroyed ChildView 1 not to call render again
      expect(this.renderSpy.callCount).to.equal(5);
    });
  });
});
