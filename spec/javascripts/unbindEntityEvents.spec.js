describe('Marionette.unbindEntityEvents', function() {
  'use strict';

  beforeEach(function() {
    this.target = {
      foo: this.sinon.spy(),
      bar: this.sinon.spy(),
      stopListening: this.sinon.spy()
    };

    this.entity = this.sinon.spy();
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(this.target, false, {'eventNameMock': 'foo'});
    });

    it('shouldnt unbind any events', function() {
      expect(this.target.stopListening).not.to.have.been.called;
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(this.target, this.entity, null);
    });

    it('shouldnt unbind any events', function() {
      expect(this.target.stopListening).not.to.have.been.called;
    });
  });

  describe('when binding is a function', function() {
    beforeEach(function() {
      this.bindingsSpy = this.sinon.spy(function() {
        return {'eventNameMock': 'foo'};
      });

      Marionette.unbindEntityEvents(this.target, this.entity, this.bindingsSpy);
    });

    it('should evaluate bindings function', function() {
      expect(this.bindingsSpy).to.have.been.called;
    });

    it('should evaluate bindings function in context of target', function() {
      expect(_.first(this.bindingsSpy.thisValues)).to.equal(this.target);
    });

    it('should unbind events returned from bindings function', function() {
      expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.unbindEntityEvents(this.target, this.entity, {'eventNameMock': this.target.foo});
      });

      it('should unbind an event', function() {
        expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(this.target, this.entity, {'eventNameMock': 'foo'});
        });

        it('should unbind an event', function() {
          expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(this.target, this.entity, {'eventNameMock': 'foo bar'});
        });

        it('should unbind first event', function() {
          expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
        });

        it('should unbind second event', function() {
          expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.bar);
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(this.target, this.entity, {
        'firstEventNameMock': 'foo',
        'secondEventNameMock': 'bar'
      });
    });

    it('should unbind first event', function() {
      expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'firstEventNameMock', this.target.foo);
    });

    it('should unbind second event', function() {
      expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'secondEventNameMock', this.target.bar);
    });
  });

  describe('when unbindEntityEvents is proxied', function() {
    beforeEach(function() {
      this.target = {
        foo: this.sinon.spy(),
        bar: this.sinon.spy(),
        stopListening: this.sinon.spy(),
        unbindEntityEvents: Marionette.proxyUnbindEntityEvents
      };

      this.entity = this.sinon.spy();
      this.target.unbindEntityEvents(this.entity, {'eventNameMock': this.target.foo});
    });

    it('should bind an event to target\'s handler', function() {
      expect(this.target.stopListening).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
    });
  });
});
