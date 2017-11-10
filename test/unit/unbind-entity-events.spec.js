import { unbindEvents } from '../../src/backbone.marionette';

describe('unbindEntityEvents', function() {
  'use strict';

  let fooStub;
  let barStub;
  let stopListeningStub;
  let target;
  let entity;

  beforeEach(function() {
    fooStub = this.sinon.stub();
    barStub = this.sinon.stub();
    stopListeningStub = this.sinon.stub();

    target = {
      foo: fooStub,
      bar: barStub,
      stopListening: stopListeningStub
    };

    entity = this.sinon.spy();
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      unbindEvents(target, false, {'foo': 'foo'});
    });

    it('shouldnt unbind any events', function() {
      expect(stopListeningStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(unbindEvents(target, false, {'foo': 'foo'})).to.equal(target);
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      unbindEvents(target, entity, null);
    });

    it('should unbind all events', function() {
      expect(stopListeningStub).to.have.been.calledOnce.and.calledWith(entity);
    });

    it('should return the target', function() {
      expect(unbindEvents(target, entity, null)).to.equal(target);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        unbindEvents(target, entity, {'foo': target.foo});
      });

      it('should unbind an event', function() {
        expect(stopListeningStub).to.have.been.calledOnce.and.calledWith(entity, 'foo', target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          unbindEvents(target, entity, {'foo': 'foo'});
        });

        it('should unbind an event', function() {
          expect(stopListeningStub).to.have.been.calledOnce.and.calledWith(entity, 'foo', target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          unbindEvents(target, entity, {'baz': 'foo bar'});
        });

        it('should unbind first event', function() {
          expect(stopListeningStub).to.have.been.calledWith(entity, 'baz', target.foo);
        });

        it('should unbind second event', function() {
          expect(stopListeningStub).to.have.been.calledWith(entity, 'baz', target.bar);
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      unbindEvents(target, entity, {
        'foo': 'foo',
        'bar': 'bar'
      });
    });

    it('should unbind first event', function() {
      expect(stopListeningStub).to.have.been.calledWith(entity, 'foo', target.foo);
    });

    it('should unbind second event', function() {
      expect(stopListeningStub).to.have.been.calledWith(entity, 'bar', target.bar);
    });
  });
});
