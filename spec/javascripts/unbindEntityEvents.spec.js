describe("Marionette.unbindEntityEvents", function(){
  "use strict";

  var target, entity;

  beforeEach(function() {
    target = {
      foo: sinon.spy(),
      bar: sinon.spy(),
      stopListening: sinon.spy()
    };

    entity = sinon.spy();
  });

  describe("when entity isn't passed", function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(target, false, {'eventNameMock': 'foo'});
    });

    it("shouldn't unbind any events", function() {
      expect(target.stopListening).not.toHaveBeenCalled();
    });
  });

  describe("when bindings isn't passed", function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(target, entity, null);
    });

    it("shouldn't unbind any events", function() {
      expect(target.stopListening).not.toHaveBeenCalled();
    });
  });

  describe("when binding is a function", function() {
    var bindingsSpy;

    beforeEach(function() {
      bindingsSpy = sinon.spy(function() {
        return {"eventNameMock": "foo"};
      });

      Marionette.unbindEntityEvents(target, entity, bindingsSpy);
    });

    it("should evaluate bindings function", function() {
      expect(bindingsSpy).toHaveBeenCalled();
    });

    it("should evaluate bindings function in context of target", function() {
      expect(_.first(bindingsSpy.thisValues)).toBe(target);
    });

    it("should unbind events returned from bindings function", function() {
      expect(target.stopListening).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
    });
  });

  describe("when bindings is an object with one event-handler pair", function() {
    describe("when handler is a function", function() {
      beforeEach(function() {
        Marionette.unbindEntityEvents(target, entity, {"eventNameMock": target.foo});
      });

      it("should unbind an event", function() {
        expect(target.stopListening).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
      });
    });

    describe("when handler is a string", function() {
      describe("when one handler is passed", function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(target, entity, {"eventNameMock": "foo"});
        });

        it("should unbind an event", function() {
          expect(target.stopListening).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
        });
      });

      describe("when multiple handlers are passed", function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(target, entity, {"eventNameMock": "foo bar"});
        });

        it("should unbind first event", function() {
          expect(target.stopListening).toHaveBeenCalledWith(entity, 'eventNameMock', target.foo);
        });

        it("should unbind second event", function() {
          expect(target.stopListening).toHaveBeenCalledWith(entity, 'eventNameMock', target.bar);
        });
      });
    });
  });

  describe("when bindings is an object with multiple event-handler pairs", function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(target, entity, {
        "firstEventNameMock": "foo",
        "secondEventNameMock": "bar"
      });
    });

    it("should unbind first event", function() {
      expect(target.stopListening).toHaveBeenCalledWith(entity, 'firstEventNameMock', target.foo);
    });

    it("should unbind second event", function() {
      expect(target.stopListening).toHaveBeenCalledWith(entity, 'secondEventNameMock', target.bar);
    });
  });
});
