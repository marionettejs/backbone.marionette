describe('view triggers', function() {
  'use strict';

  beforeEach(function() {
    this.triggersHash = {'foo': 'fooHandler'};
    this.eventsHash = {'bar': 'barHandler'};

    this.fooHandlerStub = this.sinon.stub();
    this.barHandlerStub = this.sinon.stub();

    this.fooEvent = $.Event('foo');
    this.barEvent = $.Event('bar');
  });

  describe('when DOM events are configured to trigger a view event, and the DOM events are fired', function() {
    beforeEach(function() {
      this.model = new Backbone.Model();
      this.collection = new Backbone.Collection();

      this.View = Marionette.View.extend({triggers: this.triggersHash});
      this.view = new this.View({
        model: this.model,
        collection: this.collection
      });

      this.view.on('fooHandler', this.fooHandlerStub);
      this.view.$el.trigger(this.fooEvent);
    });

    it('should trigger the first view event', function() {
      expect(this.fooHandlerStub).to.have.been.calledOnce;
    });

    it('should include the view in the event', function() {
      expect(this.fooHandlerStub.lastCall.args[0]).to.contain(this.view);
    });

    it('should include the event object in the event', function() {
      expect(this.fooHandlerStub.lastCall.args[1]).to.be.an.instanceOf($.Event);
    });
  });

  describe('when triggers and standard events are both configured', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        triggers: this.triggersHash,
        events: this.eventsHash,
        barHandler: this.barHandlerStub
      });

      this.view = new this.View();
      this.view.on('fooHandler', this.fooHandlerStub);

      this.view.$el.trigger(this.fooEvent);
      this.view.$el.trigger(this.barEvent);
    });

    it('should fire the trigger', function() {
      expect(this.fooHandlerStub).to.have.been.calledOnce;
    });

    it('should fire the standard event', function() {
      expect(this.barHandlerStub).to.have.been.calledOnce;
    });
  });

  describe('when triggers are configured with a function', function() {
    beforeEach(function() {
      this.triggersStub = this.sinon.stub().returns(this.triggersHash);
      this.View = Marionette.View.extend({triggers: this.triggersStub});
      this.view = new this.View();
      this.view.on('fooHandler', this.fooHandlerStub);

      this.view.$el.trigger(this.fooEvent);
    });

    it('should call the function', function() {
      expect(this.triggersStub).to.have.been.calledOnce.and.calledOn(this.view);
    });

    it('should trigger the first view event', function() {
      expect(this.fooHandlerStub).to.have.been.calledOnce;
    });
  });

  describe('triggers should stop propagation and events by default', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({triggers: this.triggersHash});
      this.view = new this.View();
      this.view.on('fooHandler', this.fooHandlerStub);

      this.view.$el.trigger(this.fooEvent);
    });

    it('should stop propagation by default', function() {
      expect(this.fooEvent.isPropagationStopped()).to.be.true;
    });

    it('should prevent default by default', function() {
      expect(this.fooEvent.isDefaultPrevented()).to.be.true;
    });
  });

  describe('when triggers items are manually configured', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        triggers: {
          'foo': {
            event: 'fooHandler',
            preventDefault: true,
            stopPropagation: false
          }
        }
      });
      this.view = new this.View();
      this.view.on('fooHandler', this.fooHandlerStub);

      this.view.$el.trigger(this.fooEvent);
    });

    it('should prevent and dont stop the first view event', function() {
      expect(this.fooEvent.isDefaultPrevented()).to.be.true;
      expect(this.fooEvent.isPropagationStopped()).to.be.false;
    });
  });

  describe('when triggersPreventDefault flag is set to false', function() {
    beforeEach(function() {
      Marionette.setEnabled('triggersPreventDefault', false);
    });

    afterEach(function() {
      Marionette.setEnabled('triggersPreventDefault', true);
    });

    describe('triggers should not prevent events by default', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({triggers: this.triggersHash});
        this.view = new this.View();
        this.view.on('fooHandler', this.fooHandlerStub);

        this.view.$el.trigger(this.fooEvent);
      });

      it('should stop propagation by default', function() {
        expect(this.fooEvent.isPropagationStopped()).to.be.true;
      });

      it('should not prevent default by default', function() {
        expect(this.fooEvent.isDefaultPrevented()).to.be.false;
      });
    });

    describe('when triggers items are manually configured', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({
          triggers: {
            'foo': {
              event: 'fooHandler',
              preventDefault: true,
              stopPropagation: true
            }
          }
        });
        this.view = new this.View();
        this.view.on('fooHandler', this.fooHandlerStub);

        this.view.$el.trigger(this.fooEvent);
      });

      it('should prevent and stop the first view event', function() {
        expect(this.fooEvent.isDefaultPrevented()).to.be.true;
        expect(this.fooEvent.isPropagationStopped()).to.be.true;
      });
    });
  });

  describe('when triggersStopPropagation flag is set to false', function() {
    beforeEach(function() {
      Marionette.setEnabled('triggersStopPropagation', false);
    });

    afterEach(function() {
      Marionette.setEnabled('triggersStopPropagation', true);
    });

    describe('triggers should not stop propagation by default', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({triggers: this.triggersHash});
        this.view = new this.View();
        this.view.on('fooHandler', this.fooHandlerStub);

        this.view.$el.trigger(this.fooEvent);
      });

      it('should stop propagation by default', function() {
        expect(this.fooEvent.isPropagationStopped()).to.be.false;
      });

      it('should prevent default by default', function() {
        expect(this.fooEvent.isDefaultPrevented()).to.be.true;
      });
    });

    describe('when triggers items are manually configured', function() {
      beforeEach(function() {
        this.View = Marionette.View.extend({
          triggers: {
            'foo': {
              event: 'fooHandler',
              preventDefault: true,
              stopPropagation: true
            }
          }
        });
        this.view = new this.View();
        this.view.on('fooHandler', this.fooHandlerStub);

        this.view.$el.trigger(this.fooEvent);
      });

      it('should prevent and stop the first view event', function() {
        expect(this.fooEvent.isDefaultPrevented()).to.be.true;
        expect(this.fooEvent.isPropagationStopped()).to.be.true;
      });
    });
  });
});
