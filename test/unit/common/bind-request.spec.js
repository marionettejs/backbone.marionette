import * as Marionette from '../../../src/backbone.marionette';
import MarionetteError from '../../../src/error';

describe('Marionette.bindRequests', function() {
  'use strict';

  beforeEach(function() {
    this.replyFooStub = this.sinon.stub();
    this.replyBarStub = this.sinon.stub();
    this.replyStub = this.sinon.stub();

    this.target = {
      replyFoo: this.replyFooStub,
      replyBar: this.replyBarStub
    };

    this.channel = {
      reply: this.replyStub
    };
  });

  describe('when channel isnt passed', function() {
    beforeEach(function() {
      Marionette.bindRequests(this.target, false, {'foo': 'replyFoo'});
    });

    it('shouldnt bind any requests', function() {
      expect(this.replyStub).not.to.have.been.called;
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.bindRequests(this.target, this.channel, null);
    });

    it('shouldnt bind any requests', function() {
      expect(this.replyStub).not.to.have.been.called;
    });
  });

  describe('when bindings is an object with one request-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.bindRequests(this.target, this.channel, {'foo': this.replyFooStub});
      });

      it('should bind a request to targets handler', function() {
        expect(this.replyStub).to.have.been.calledOnce.and.calledWith({'foo': this.replyFooStub});
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.bindRequests(this.target, this.channel, {'foo': 'replyFoo'});
        });

        it('should bind a request to targets handler', function() {
          expect(this.replyStub).to.have.been.calledOnce.and.calledWith({'foo': this.replyFooStub});
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      Marionette.bindRequests(this.target, this.channel, {
        'foo': 'replyFoo',
        'bar': 'replyBar'
      });
    });

    it('should bind both requests to target handlers', function() {
      expect(this.replyStub).to.have.been.calledOnce.and.calledWith({bar: this.replyBarStub, foo: this.replyFooStub});
    });
  });

  describe('when bindings is not an object', function() {
    beforeEach(function() {
      this.run = function() {
        Marionette.bindRequests(this.target, this.channel, 'replyFooStub');
      }.bind(this);
    });

    it('should error', function() {
      expect(this.run).to.throw(MarionetteError, new MarionetteError({
        message: 'Bindings must be an object.',
        url: 'marionette.functions.html#marionettebindrequests'
      }));
    });
  });

});
