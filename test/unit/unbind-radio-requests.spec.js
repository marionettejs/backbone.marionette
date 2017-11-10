import { unbindRequests } from '../../src/backbone.marionette';

describe('unbindRequests', function() {
  'use strict';

  let replyFooStub;
  let replyBarStub;
  let stopReplyingStub;
  let target;
  let channel;

  beforeEach(function() {
    replyFooStub = this.sinon.stub();
    replyBarStub = this.sinon.stub();
    stopReplyingStub = this.sinon.stub();

    target = {
      replyFoo: replyFooStub,
      replyBar: replyBarStub
    };

    channel = {
      stopReplying: stopReplyingStub
    };
  });

  describe('when channel isnt passed', function() {
    beforeEach(function() {
      unbindRequests(target, false, {'foo': 'foo'});
    });

    it('shouldnt unbind any request', function() {
      expect(stopReplyingStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(unbindRequests(target, false, {'foo': 'foo'})).to.equal(target);
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      unbindRequests(target, channel, null);
    });

    it('should unbind all requests', function() {
      expect(stopReplyingStub).to.have.been.calledOnce.and.calledWith(null, null, target);
    });

    it('should return the target', function() {
      expect(unbindRequests(target, channel, null)).to.equal(target);
    });
  });

  describe('when bindings is an object with one request-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        unbindRequests(target, channel, {'foo': target.replyFoo});
      });

      it('should unbind an request', function() {
        expect(stopReplyingStub).to.have.been.calledOnce.and.calledWith({'foo': target.replyFoo});
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          unbindRequests(target, channel, {'foo': 'replyFoo'});
        });

        it('should unbind an request', function() {
          expect(stopReplyingStub).to.have.been.calledOnce.and.calledWith({'foo': target.replyFoo});
        });
      });
    });
  });

  describe('when bindings is an object with multiple request-handler pairs', function() {
    beforeEach(function() {
      unbindRequests(target, channel, {
        'foo': 'replyFoo',
        'bar': 'replyBar'
      });
    });

    it('should unbind first request', function() {
      expect(stopReplyingStub).to.have.been.calledWith({'bar': target.replyBar, 'foo': target.replyFoo});
    });
  });
});
