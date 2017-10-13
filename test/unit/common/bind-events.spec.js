import * as Marionette from '../../../src/backbone.marionette';
import MarionetteError from '../../../src/utils/error';
import deprecate from '../../../src/utils/deprecate';

describe('Marionette.bindEvents', function() {
  beforeEach(function() {
    this.handleFooStub = this.sinon.stub();
    this.handleBarStub = this.sinon.stub();
    this.handleMultiStub = this.sinon.stub();
    this.listenToStub = this.sinon.stub();
    this.entityStub = this.sinon.stub();

    this.target = {
      handleFoo: this.handleFooStub,
      handleBar: this.handleBarStub,
      handleMulti: this.handleMultiStub,
      listenTo: this.listenToStub
    };

    this.entity = this.entityStub;
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      Marionette.bindEvents(this.target, false, {'foo': 'handleFoo'});
    });

    it('shouldnt bind any events', function() {
      expect(this.listenToStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(Marionette.bindEvents(this.target, false, {'foo': 'foo'})).to.equal(this.target);
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.bindEvents(this.target, this.entity, null);
    });

    it('shouldnt bind any events', function() {
      expect(this.listenToStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(Marionette.bindEvents(this.target, this.entity, null)).to.equal(this.target);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.bindEvents(this.target, this.entity, {'foo': this.handleFooStub});
      });

      it('should bind an event to targets handler', function() {
        expect(this.listenToStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.handleFooStub);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.bindEvents(this.target, this.entity, {'foo': 'handleFoo'});
        });

        it('should bind an event to targets handler', function() {
          expect(this.listenToStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.handleFooStub);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.bindEvents(this.target, this.entity, {
            'baz': 'handleFoo handleBar'
          });
        });

        it('should bind first event to targets handler', function() {
          expect(this.listenToStub).to.have.been.calledTwice.and.calledWith(this.entity, 'baz', this.handleFooStub);
        });

        it('should bind second event to targets handler', function() {
          expect(this.listenToStub).to.have.been.calledTwice.and.calledWith(this.entity, 'baz', this.handleBarStub);
        });
      });

      describe('when handler method doesnt exist', function() {
        it('should throw an exception', function() {
          var suite = this;
          expect(function() {
            Marionette.bindEvents(suite.target, suite.entity, {'baz': 'doesNotExist'});
          }).to.throw('Method "doesNotExist" was configured as an event handler, but does not exist.');
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.setEnabled('DEV_MODE', true);
      this.sinon.spy(deprecate, '_warn');
      this.sinon.stub(deprecate, '_console', {
        warn: this.sinon.stub()
      });
      deprecate._cache = {};
      Marionette.bindEvents(this.target, this.entity, {
        'foo': 'handleFoo handleMulti',
        'bar': 'handleBar'
      });
    });

    afterEach(function() {
      Marionette.setEnabled('DEV_MODE', false);
    });

    it('should call deprecate', function() {
      expect(deprecate._warn).to.be.calledWith('Deprecation warning: Multiple handlers for a single event are deprecated. If needed, use a single handler to call multiple methods.');
    });

    it('should bind first event to targets handlers', function() {
      expect(this.listenToStub).to.have.been.calledThrice
        .and.calledWith(this.entity, 'foo', this.handleFooStub)
        .and.calledWith(this.entity, 'foo', this.handleMultiStub);
    });

    it('should bind second event to targets handler', function() {
      expect(this.listenToStub).to.have.been.calledThrice.and.calledWith(this.entity, 'bar', this.handleBarStub);
    });
  });

  describe('when bindings is not an object', function() {
    beforeEach(function() {
      this.run = function() {
        Marionette.bindEvents(this.target, this.entity, 'handleFoo');
      }.bind(this);
    });

    it('should error', function() {
      expect(this.run).to.throw(MarionetteError, new MarionetteError({
        message: 'Bindings must be an object.',
        url: 'marionette.functions.html#marionettebindevents'
      }));
    });
  });
});
