describe('Marionette.unbindEntityEvents', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  var target, entity;

  beforeEach(function() {
    target = {
      foo: sinon.spy(),
      bar: sinon.spy(),
      stopListening: sinon.spy()
    };

    entity = sinon.spy();
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(target, false, {'eventNameMock': 'foo'});
    });

    it('shouldnt unbind any events', function() {
      expect(target.stopListening).not.to.have.been.called;
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(target, entity, null);
    });

    it('shouldnt unbind any events', function() {
      expect(target.stopListening).not.to.have.been.called;
    });
  });

  describe('when binding is a function', function() {
    var bindingsSpy;

    beforeEach(function() {
      bindingsSpy = sinon.spy(function() {
        return {'eventNameMock': 'foo'};
      });

      Marionette.unbindEntityEvents(target, entity, bindingsSpy);
    });

    it('should evaluate bindings function', function() {
      expect(bindingsSpy).to.have.been.called;
    });

    it('should evaluate bindings function in context of target', function() {
      expect(_.first(bindingsSpy.thisValues)).to.equal(target);
    });

    it('should unbind events returned from bindings function', function() {
      expect(target.stopListening).to.have.been.calledWith(entity, 'eventNameMock', target.foo);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.unbindEntityEvents(target, entity, {'eventNameMock': target.foo});
      });

      it('should unbind an event', function() {
        expect(target.stopListening).to.have.been.calledWith(entity, 'eventNameMock', target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(target, entity, {'eventNameMock': 'foo'});
        });

        it('should unbind an event', function() {
          expect(target.stopListening).to.have.been.calledWith(entity, 'eventNameMock', target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(target, entity, {'eventNameMock': 'foo bar'});
        });

        it('should unbind first event', function() {
          expect(target.stopListening).to.have.been.calledWith(entity, 'eventNameMock', target.foo);
        });

        it('should unbind second event', function() {
          expect(target.stopListening).to.have.been.calledWith(entity, 'eventNameMock', target.bar);
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(target, entity, {
        'firstEventNameMock': 'foo',
        'secondEventNameMock': 'bar'
      });
    });

    it('should unbind first event', function() {
      expect(target.stopListening).to.have.been.calledWith(entity, 'firstEventNameMock', target.foo);
    });

    it('should unbind second event', function() {
      expect(target.stopListening).to.have.been.calledWith(entity, 'secondEventNameMock', target.bar);
    });
  });

 describe('when unbindEntityEvents is proxied', function() {
    beforeEach(function() {
      target = {
        foo: sinon.spy(),
        bar: sinon.spy(),
        stopListening: sinon.spy(),
        unbindEntityEvents: Marionette.proxyUnbindEntityEvents
      };

      entity = sinon.spy();
      target.unbindEntityEvents(entity, {'eventNameMock': target.foo});
    });

    it('should bind an event to target\'s handler', function() {
      expect(target.stopListening).to.have.been.calledWith(entity, 'eventNameMock', target.foo);
    });
  });
});
