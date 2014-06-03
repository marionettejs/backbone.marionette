describe('trigger event and method name', function() {
  'use strict';

  beforeEach(function() {
    this.view = new Marionette.View();

    this.CustomClass = function() {
      this.triggerMethod = Marionette.triggerMethod;
    };

    this.eventHandler = this.sinon.stub();
    this.methodHandler = this.sinon.stub();
  });

  describe('when triggering an event', function() {
    beforeEach(function() {
      this.methodHandler.returns('return val');
      this.view.onSomething = this.methodHandler;
      this.view.on('something', this.eventHandler);
      this.returnVal = this.view.triggerMethod('something');
    });

    it('should trigger the event', function() {
      expect(this.eventHandler).to.have.been.called;
    });

    it('should call a method named on{Event}', function() {
      expect(this.methodHandler).to.have.been.called;
    });

    it('returns the value returned by the on{Event} method', function() {
      expect(this.returnVal).to.equal('return val');
    });

    describe('when trigger does not exist', function() {
      beforeEach(function() {
        var suite = this;
        this.customObject = new this.CustomClass();
        this.triggerNonExistantEvent = function() {
          suite.customObject.triggerMethod('does:not:exist');
        };
      });

      it('should do nothing', function() {
        expect(this.triggerNonExistantEvent).not.to.throw;
      });
    });
  });

  describe('when triggering an event with arguments', function() {
    beforeEach(function() {
      this.view.onSomething = this.methodHandler;
      this.view.on('something', this.eventHandler);
      this.view.triggerMethod('something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should call a method named on{Event} with the args', function() {
      expect(this.methodHandler.lastCall.args.length).to.equal(3);
    });
  });

  describe('when triggering an event with : separated name', function() {
    beforeEach(function() {
      this.view.onDoSomething = this.methodHandler;
      this.view.on('do:something', this.eventHandler);
      this.view.triggerMethod('do:something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler).to.have.been.called;
    });
  });

  describe('when triggering an event and no handler method exists', function() {
    beforeEach(function() {
      this.view.on('do:something', this.eventHandler);
      this.view.triggerMethod('do:something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler).not.to.have.been.called;
    });
  });

  describe('when triggering an event and the attribute for that event is not a function', function() {
    beforeEach(function() {
      this.view.onDoSomething = 'bar';
      this.view.on('do:something', this.eventHandler);
      this.view.triggerMethod('do:something', 1, 2, 3);
    });

    it('should trigger the event with the args', function() {
      expect(this.eventHandler.lastCall.args.length).to.equal(3);
    });

    it('should not call a method named with each segment of the event name capitalized', function() {
      expect(this.methodHandler).not.to.have.been.called;
    });
  });

  describe('triggering events through a child view', function() {
    beforeEach(function() {
      this.ResultView = Backbone.Marionette.ItemView.extend({
        template : '#aTemplate',
        events : {
          'click' : 'onAddToSelection'
        },
        onAddToSelection : function() {
          this.triggerMethod('add:selection', this.model);
        }
      });

      this.ResultsView = Backbone.Marionette.CompositeView.extend({
        template: '#aTemplate',
        childView: this.ResultView
      });

      this.setFixtures('<script type="text/html" id="aTemplate"><div>foo</div></script>');

      this.collection = new Backbone.Collection([{a: 'b'}, {a: 'c'}]);
      this.collectionView = new this.ResultsView({
        collection: this.collection
      });

      this.collectionView.onChildviewAddSelection = this.sinon.stub();
      this.collectionView.render();
      this.childView = this.collectionView.children.findByModel(this.collection.at(0));
      this.childView.$el.click();
    });

    it('should fire the event method once', function() {
      expect(this.collectionView.onChildviewAddSelection.callCount).to.equal(1);
    });
  });
});
