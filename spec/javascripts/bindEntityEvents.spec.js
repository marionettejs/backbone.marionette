describe('Marionette.bindEntityEvents', function() {
  'use strict';

  var target, entity;

  beforeEach(function() {
    target = {
      foo: sinon.spy(),
      bar: sinon.spy(),
      listenTo: sinon.spy()
    };

    entity = sinon.spy();
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      Marionette.bindEntityEvents(target, false, {'eventNameMock': 'foo'});
    });

    it('shouldnt bind any events', function() {
      expect(target.listenTo).not.toHaveBeenCalled();
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.bindEntityEvents(target, entity, null);
    });

    it('shouldnt bind any events', function() {
      expect(target.listenTo).not.toHaveBeenCalled();
    });
  });

  describe('when binding is a function', function() {
    var bindingsSpy;

    beforeEach(function() {
      bindingsSpy = sinon.spy(function() {
        return {'eventNameMock': 'foo'};
      });

      Marionette.bindEntityEvents(target, entity, bindingsSpy);
    });

    it('should evaluate bindings function', function() {
      expect(bindingsSpy).toHaveBeenCalled();
    });

    it('should evaluate bindings function in context of target', function() {
      expect(bindingsSpy.calledOn(target)).toBe(true);
    });

    it('should bind events returned from bindings function to targets handlers', function() {
      expect(target.listenTo).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.bindEntityEvents(target, entity, {'eventNameMock': target.foo});
      });

      it('should bind an event to targets handler', function() {
        expect(target.listenTo).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.bindEntityEvents(target, entity, {'eventNameMock': 'foo'});
        });

        it('should bind an event to targets handler', function() {
          expect(target.listenTo).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.bindEntityEvents(target, entity, {'eventNameMock': 'foo bar'});
        });

        it('should bind first event to targets handler', function() {
          expect(target.listenTo).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
        });

        it('should bind second event to targets handler', function() {
          expect(target.listenTo).toHaveBeenCalledWith(entity, 'eventNameMock', target.bar);
        });
      });

      describe('when handler method doesnt exist', function() {
        it('should throw an exception', function() {
          expect(function() {
            Marionette.bindEntityEvents(target, entity, {'eventNameMock': 'notExistedMethod'});
          }).toThrow('Method "notExistedMethod" was configured as an event handler, but does not exist.');
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.bindEntityEvents(target, entity, {
        'firstEventNameMock': 'foo',
        'secondEventNameMock': 'bar'
      });
    });

    it('should bind first event to targets handler', function() {
      expect(target.listenTo).toHaveBeenCalledWith(entity, 'firstEventNameMock', target.foo);
    });

    it('should bind second event to targets handler', function() {
      expect(target.listenTo).toHaveBeenCalledWith(entity, 'secondEventNameMock', target.bar);
    });
  });
});
