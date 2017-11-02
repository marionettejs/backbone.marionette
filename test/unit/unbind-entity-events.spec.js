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
      Marionette.unbindEvents(this.target, false, {'foo': 'foo'});
    });

    it('shouldnt unbind any events', function() {
      expect(this.stopListeningStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(Marionette.unbindEvents(this.target, false, {'foo': 'foo'})).to.equal(this.target);
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindEvents(this.target, this.entity, null);
    });

    it('should unbind all events', function() {
      expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity);
    });

    it('should return the target', function() {
      expect(Marionette.unbindEvents(this.target, this.entity, null)).to.equal(this.target);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.unbindEvents(this.target, this.entity, {'foo': this.target.foo});
      });

      it('should unbind an event', function() {
        expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.unbindEvents(this.target, this.entity, {'foo': 'foo'});
        });

        it('should unbind an event', function() {
          expect(this.stopListeningStub).to.have.been.calledOnce.and.calledWith(this.entity, 'foo', this.target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.unbindEvents(this.target, this.entity, {'baz': 'foo bar'});
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
      Marionette.unbindEvents(this.target, this.entity, {
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
});
