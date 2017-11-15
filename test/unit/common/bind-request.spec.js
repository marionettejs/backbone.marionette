import { bindRequests } from '../../../src/backbone.marionette';

describe('bindRequests', function() {
  let replyFooStub;
  let replyBarStub;
  let replyStub;
  let target;
  let channel;

  beforeEach(function() {
    replyFooStub = this.sinon.stub();
    replyBarStub = this.sinon.stub();
    replyStub = this.sinon.stub();

    target = {
      replyFoo: replyFooStub,
      replyBar: replyBarStub
    };

    channel = {
      reply: replyStub
    };
  });

  describe('when channel isnt passed', function() {
    beforeEach(function() {
      bindRequests(target, false, {'foo': 'replyFoo'});
    });

    it('shouldnt bind any requests', function() {
      expect(replyStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(bindRequests(target, false, {'foo': 'replyFoo'})).to.equal(target);
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      bindRequests(target, channel, null);
    });

    it('shouldnt bind any requests', function() {
      expect(replyStub).not.to.have.been.called;
    });

    it('should return the target', function() {
      expect(bindRequests(target, channel, null)).to.equal(target);
    });
  });

  describe('when bindings is an object with one request-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        bindRequests(target, channel, {'foo': replyFooStub});
      });

      it('should bind a request to targets handler', function() {
        expect(replyStub).to.have.been.calledOnce.and.calledWith({'foo': replyFooStub});
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          bindRequests(target, channel, {'foo': 'replyFoo'});
        });

        it('should bind a request to targets handler', function() {
          expect(replyStub).to.have.been.calledOnce.and.calledWith({'foo': replyFooStub});
        });
      });
    });
  });

  describe('when bindings is an object with multiple event-handler pairs', function() {
    beforeEach(function() {
      bindRequests(target, channel, {
        'foo': 'replyFoo',
        'bar': 'replyBar'
      });
    });

    it('should bind both requests to target handlers', function() {
      expect(replyStub).to.have.been.calledOnce.and.calledWith({bar: replyBarStub, foo: replyFooStub});
    });
  });

  describe('when bindings is not an object', function() {
    let run;

    beforeEach(function() {
      run = function() {
        bindRequests(target, channel, 'replyFooStub');
      }.bind(this);
    });

    it('should error', function() {
      expect(run).to.throw('Bindings must be an object.');
    });
  });

});
