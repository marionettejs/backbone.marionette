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
      this.model      = new Backbone.Model();
      this.collection = new Backbone.Collection();

      this.View = Marionette.ItemView.extend({triggers: this.triggersHash});
      this.view = new this.View({
        model      : this.model,
        collection : this.collection
      });

      this.view.on('fooHandler', this.fooHandlerStub);
      this.view.$el.trigger(this.fooEvent);
    });

    it('should trigger the first view event', function() {
      expect(this.fooHandlerStub).to.have.been.calledOnce;
    });

    it('should include the view in the event args', function() {
      expect(this.fooHandlerStub.lastCall.args[0]).to.contain({view: this.view});
    });

    it('should include the views model in the event args', function() {
      expect(this.fooHandlerStub.lastCall.args[0]).to.contain({model: this.model});
    });

    it('should include the views collection in the event args', function() {
      expect(this.fooHandlerStub.lastCall.args[0]).to.contain({collection: this.collection});
    });
  });

  describe('when triggers and standard events are both configured', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        triggers   : this.triggersHash,
        events     : this.eventsHash,
        barHandler : this.barHandlerStub
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
      this.View = Marionette.ItemView.extend({triggers: this.triggersStub});
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

  describe('triggers should stop propigation and events by default', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({triggers: this.triggersHash});
      this.view = new this.View();
      this.view.on('fooHandler', this.fooHandlerStub);

      this.view.$el.trigger(this.fooEvent);
    });

    it('should stop propigation by default', function() {
      expect(this.fooEvent.isPropagationStopped()).to.be.true;
    });

    it('should prevent default by default', function() {
      expect(this.fooEvent.isDefaultPrevented()).to.be.true;
    });
  });

  describe('when triggers items are manually configured', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
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
});
