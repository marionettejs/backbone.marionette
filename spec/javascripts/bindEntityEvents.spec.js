describe('Marionette.bindEntityEvents', function() {
  'use strict';

  beforeEach(function() {
    this.target = {
      foo: this.sinon.spy(),
      bar: this.sinon.spy(),
      listenTo: this.sinon.spy()
    };

    this.entity = this.sinon.spy();
  });

  describe('when entity isnt passed', function() {
    beforeEach(function() {
      Marionette.bindEntityEvents(this.target, false, {'eventNameMock': 'foo'});
    });

    it('shouldnt bind any events', function() {
      expect(this.target.listenTo).not.to.have.been.called;
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.bindEntityEvents(this.target, this.entity, null);
    });

    it('shouldnt bind any events', function() {
      expect(this.target.listenTo).not.to.have.been.called;
    });
  });

  describe('when binding is a function', function() {
    beforeEach(function() {
      this.bindingsSpy = this.sinon.spy(function() {
        return {'eventNameMock': 'foo'};
      });

      Marionette.bindEntityEvents(this.target, this.entity, this.bindingsSpy);
    });

    it('should evaluate bindings function', function() {
      expect(this.bindingsSpy).to.have.been.called;
    });

    it('should evaluate bindings function in context of target', function() {
      expect(this.bindingsSpy.calledOn(this.target)).to.be.true;
    });

    it('should bind events returned from bindings function to targets handlers', function() {
      expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
    });
  });

  describe('when bindings is an object with one event-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.bindEntityEvents(this.target, this.entity, {'eventNameMock': this.target.foo});
      });

      it('should bind an event to targets handler', function() {
        expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.bindEntityEvents(this.target, this.entity, {'eventNameMock': 'foo'});
        });

        it('should bind an event to targets handler', function() {
          expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
        });
      });

      describe('when multiple handlers are passed', function() {
        beforeEach(function() {
          Marionette.bindEntityEvents(this.target, this.entity, {'eventNameMock': 'foo bar'});
        });

        it('should bind first event to targets handler', function() {
          expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
        });

        it('should bind second event to targets handler', function() {
          expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.bar);
        });
      });

      describe('when handler method doesnt exist', function() {
        it('should throw an exception', function() {
          var suite = this;
          expect(function() {
            Marionette.bindEntityEvents(suite.target, suite.entity, {'eventNameMock': 'notExistedMethod'});
          }).to.throw('Method "notExistedMethod" was configured as an event handler, but does not exist.');
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.bindEntityEvents(this.target, this.entity, {
        'firstEventNameMock': 'foo',
        'secondEventNameMock': 'bar'
      });
    });

    it('should bind first event to targets handler', function() {
      expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'firstEventNameMock', this.target.foo);
    });

    it('should bind second event to targets handler', function() {
      expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'secondEventNameMock', this.target.bar);
    });
  });

  describe('when bindEntityEvents is proxied', function() {
    beforeEach(function() {
      this.target = {
        foo: this.sinon.spy(),
        bar: this.sinon.spy(),
        listenTo: this.sinon.spy(),
        bindEntityEvents: Marionette.proxyBindEntityEvents
      };

      this.entity = this.sinon.spy();
      this.target.bindEntityEvents(this.entity, {'eventNameMock': this.target.foo});
    });

    it('should bind an event to targets handler', function() {
      expect(this.target.listenTo).to.have.been.calledWith(this.entity, 'eventNameMock', this.target.foo);
    });
  });
});
