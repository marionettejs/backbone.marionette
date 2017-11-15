import { bindEvents } from '../../../src/backbone.marionette';
import { setEnabled } from '../../../src/config/features';
import deprecate from '../../../src/utils/deprecate';

describe('Marionette.bindEvents', function() {
  let handleFooStub;
  let handleBarStub;
  let handleMultiStub;
  let listenToStub;
  let entityStub;
  let target;
  let entity;

  beforeEach(function() {
    handleFooStub = this.sinon.stub();
    handleBarStub = this.sinon.stub();
    handleMultiStub = this.sinon.stub();
    listenToStub = this.sinon.stub();
    entityStub = this.sinon.stub();

    target = {
      handleFoo: handleFooStub,
      handleBar: handleBarStub,
      handleMulti: handleMultiStub,
      listenTo: listenToStub
    };

    entity = entityStub;
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      bindEvents(target, false, {'foo': 'handleFoo'});
    });

    it('shouldnt bind any events', function() {
      expect(listenToStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(bindEvents(target, false, {'foo': 'foo'})).to.equal(target);
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      bindEvents(target, entity, null);
    });

    it('shouldnt bind any events', function() {
      expect(listenToStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(bindEvents(target, entity, null)).to.equal(target);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        bindEvents(target, entity, {'foo': handleFooStub});
      });

      it('should bind an event to targets handler', function() {
        expect(listenToStub).to.have.been.calledOnce.and.calledWith(entity, 'foo', handleFooStub);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          bindEvents(target, entity, {'foo': 'handleFoo'});
        });

        it('should bind an event to targets handler', function() {
          expect(listenToStub).to.have.been.calledOnce.and.calledWith(entity, 'foo', handleFooStub);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          bindEvents(target, entity, {
            'baz': 'handleFoo handleBar'
          });
        });

        it('should bind first event to targets handler', function() {
          expect(listenToStub).to.have.been.calledTwice.and.calledWith(entity, 'baz', handleFooStub);
        });

        it('should bind second event to targets handler', function() {
          expect(listenToStub).to.have.been.calledTwice.and.calledWith(entity, 'baz', handleBarStub);
        });
      });

      describe('when handler method doesnt exist', function() {
        it('should throw an exception', function() {
          expect(function() {
            bindEvents(target, entity, {'baz': 'doesNotExist'});
          }).to.throw('Method "doesNotExist" was configured as an event handler, but does not exist.');
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      setEnabled('DEV_MODE', true);
      this.sinon.spy(deprecate, '_warn');
      this.sinon.stub(deprecate, '_console', {
        warn: this.sinon.stub()
      });
      deprecate._cache = {};
      bindEvents(target, entity, {
        'foo': 'handleFoo handleMulti',
        'bar': 'handleBar'
      });
    });

    afterEach(function() {
      setEnabled('DEV_MODE', false);
    });

    it('should call deprecate', function() {
      expect(deprecate._warn).to.be.calledWith('Deprecation warning: Multiple handlers for a single event are deprecated. If needed, use a single handler to call multiple methods.');
    });

    it('should bind first event to targets handlers', function() {
      expect(listenToStub).to.have.been.calledThrice
        .and.calledWith(entity, 'foo', handleFooStub)
        .and.calledWith(entity, 'foo', handleMultiStub);
    });

    it('should bind second event to targets handler', function() {
      expect(listenToStub).to.have.been.calledThrice.and.calledWith(entity, 'bar', handleBarStub);
    });
  });

  describe('when bindings is not an object', function() {
    let run;

    beforeEach(function() {
      run = function() {
        bindEvents(target, entity, 'handleFoo');
      }.bind(this);
    });

    it('should error', function() {
      expect(run).to.throw('Bindings must be an object.');
    });
  });
});
