describe('Marionette.unbindEntityEvents', function() {
  'use strict';

  beforeEach(function() {
    this.fooStub = this.sinon.stub();
    this.barStub = this.sinon.stub();
    this.stopListeningStub = this.sinon.stub();

    this.target = {
      foo: this.fooStub,
      bar: this.barStub,
      stopListening: this.stopListeningStub
    };

    this.entity = this.sinon.spy();
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(this.target, false, {'foo': 'foo'});
    });

    it('shouldnt unbind any events', function() {
      expect(this.stopListeningStub).not.to.have.been.called;
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(this.target, this.entity, null);
    });

    it('shouldnt unbind any events', function() {
      expect(this.stopListeningStub).not.to.have.been.called;
    });
  });

  describe('when binding is a function', function() {
    beforeEach(function() {
      this.bindingsSpy = this.sinon.spy(function() {
        return {'foo': 'foo'};
      });

      Marionette.unbindEntityEvents(this.target, this.entity, this.bindingsSpy);
    });

    it('should evaluate bindings function', function() {
      expect(this.bindingsSpy).to.have.been.calledOnce;
    });

    it('should evaluate bindings function in context of target', function() {
      expect(this.bindingsSpy).to.have.been.calledOnce.and.calledOn(this.target);
    });

    it('should unbind events returned from bindings function', function() {
      expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.target.foo);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.unbindEntityEvents(this.target, this.entity, {'foo': this.target.foo});
      });

      it('should unbind an event', function() {
        expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(this.target, this.entity, {'foo': 'foo'});
        });

        it('should unbind an event', function() {
          expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.unbindEntityEvents(this.target, this.entity, {'baz': 'foo bar'});
        });

        it('should unbind first event', function() {
          expect(this.stopListeningStub).to.have.been.calledWith(this.entity, 'baz', this.target.foo);
        });

        it('should unbind second event', function() {
          expect(this.stopListeningStub).to.have.been.calledWith(this.entity, 'baz', this.target.bar);
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.unbindEntityEvents(this.target, this.entity, {
        'foo': 'foo',
        'bar': 'bar'
      });
    });

    it('should unbind first event', function() {
      expect(this.stopListeningStub).to.have.been.calledWith(this.entity, 'foo', this.target.foo);
    });

    it('should unbind second event', function() {
      expect(this.stopListeningStub).to.have.been.calledWith(this.entity, 'bar', this.target.bar);
    });
  });

  describe('when unbindEntityEvents is proxied', function() {
    beforeEach(function() {
      this.target.unbindEntityEvents = Marionette.proxyUnbindEntityEvents;
      this.target.unbindEntityEvents(this.entity, {'foo': this.target.foo});
    });

    it('should bind an event to target\'s handler', function() {
      expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.target.foo);
    });
  });
});
