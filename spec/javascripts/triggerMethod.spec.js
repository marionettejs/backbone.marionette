describe('trigger event and method name', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  var view, eventHandler, methodHandler, CustomClass, customObject;

  beforeEach(function() {
    view = new Marionette.View();

    CustomClass = function() {
      this.triggerMethod = Marionette.triggerMethod;
    };

    eventHandler = this.sinon.stub();
    methodHandler = this.sinon.stub();
  });

  describe('when triggering an event', function() {
    var returnVal;

    beforeEach(function() {
      methodHandler.returns('return val');
      view.onSomething = methodHandler;
      view.on('something', eventHandler);

      returnVal = view.triggerMethod('something');
    });

    it('should trigger the event', function() {
      expect(eventHandler).to.have.been.called;
    });

    it('should call a method named on{Event}', function() {
      expect(methodHandler).to.have.been.called;
    });

    it('returns the value returned by the on{Event} method', function() {
      expect(returnVal).to.equal('return val');
    });

    describe('when trigger does not exist', function() {

      beforeEach(function() {
        customObject = new CustomClass();
      });

      it('should do nothing', function() {
        var triggerNonExistantEvent = function() {
          customObject.triggerMethod('does:not:exist');
        };

        expect(triggerNonExistantEvent).not.to.throw;
      });
    });
  });

  describe('when triggering an event with arguments', function() {

    beforeEach(function() {
      view.onSomething = methodHandler;
      view.on('something', eventHandler);

      view.triggerMethod('something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should call a method named on{Event} with the args', function() {
      expect(methodHandler.lastCall.args.length).to.equal(3);
    });

  });

  describe('when triggering an event with : separated name', function() {

    beforeEach(function() {
      view.onDoSomething = methodHandler;
      view.on('do:something', eventHandler);

      view.triggerMethod('do:something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should call a method named with each segment of the event name capitalized', function() {
      expect(methodHandler).to.have.been.called;
    });

  });

  describe('when triggering an event and no handler method exists', function() {
    beforeEach(function() {
      view.on('do:something', eventHandler);
      view.triggerMethod('do:something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(methodHandler).not.to.have.been.called;
    });

  });

  describe('when triggering an event and the attribute for that event is not a function', function() {
    beforeEach(function() {
      view.onDoSomething = 'bar';
      view.on('do:something', eventHandler);
      view.triggerMethod('do:something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(methodHandler).not.to.have.been.called;
    });

  });

  describe('triggering events through a child view', function() {
    var ResultView = Backbone.Marionette.ItemView.extend({
      template : '#aTemplate',
      events : {
        'click' : 'onAddToSelection'
      },
      onAddToSelection : function() {
        this.triggerMethod('add:selection', this.model);
      }
    });

    var ResultsView =  Backbone.Marionette.CompositeView.extend({
      template: '#aTemplate',
      childView: ResultView
    });

    var collectionView;

    beforeEach(function() {
      this.setFixtures('<script type="text/html" id="aTemplate"><div>foo</div></script>');

      var collection = new Backbone.Collection([{a: 'b'}, {a: 'c'}]);
      collectionView = new ResultsView({
        collection: collection
      });

      collectionView.onChildviewAddSelection = this.sinon.stub();

      collectionView.render();

      var childView = collectionView.children.findByModel(collection.at(0));
      childView.$el.click();
    });

    it('should fire the event method once', function() {
      expect(collectionView.onChildviewAddSelection.callCount).to.equal(1);
    });

  });

});
