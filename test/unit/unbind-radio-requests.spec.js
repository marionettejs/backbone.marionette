describe('Marionette.unbindRadioRequests', function() {
  'use strict';

  beforeEach(function() {
    this.replyFooStub = this.sinon.stub();
    this.replyBarStub = this.sinon.stub();
    this.stopReplyingStub = this.sinon.stub();

    this.target = {
      replyFoo: this.replyFooStub,
      replyBar: this.replyBarStub
    };

    this.channel = {
      stopReplying: this.stopReplyingStub
    };
  });

  describe('when channel isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindRadioRequests(this.target, false, {'foo': 'foo'});
    });

    it('shouldnt unbind any request', function() {
      expect(this.stopReplyingStub).not.to.have.been.called;
    });
  });

  describe('when bindings isnt passed', function() {
    beforeEach(function() {
      Marionette.unbindRadioRequests(this.target, this.channel, null);
    });

    it('shouldnt unbind any requests', function() {
      expect(this.stopReplyingStub).not.to.have.been.called;
    });
  });

  describe('when bindings is an object with one request-handler pair', function() {
    describe('when handler is a function', function() {
      beforeEach(function() {
        Marionette.unbindRadioRequests(this.target, this.channel, {'foo': this.target.replyFoo});
      });

      it('should unbind an request', function() {
        expect(this.stopReplyingStub).to.have.been.calledOnce.and.calledWith({'foo': this.target.replyFoo});
      });
    });

    describe('when handler is a string', function() {
      describe('when one handler is passed', function() {
        beforeEach(function() {
          Marionette.unbindRadioRequests(this.target, this.channel, {'foo': 'replyFoo'});
        });

        it('should unbind an request', function() {
          expect(this.stopReplyingStub).to.have.been.calledOnce.and.calledWith({'foo': this.target.replyFoo});
        });
      });
    });
  });

  describe('when bindings is an object with multiple request-handler pairs', function() {
    beforeEach(function() {
      Marionette.unbindRadioRequests(this.target, this.channel, {
        'foo': 'replyFoo',
        'bar': 'replyBar'
      });
    });

    it('should unbind first request', function() {
      expect(this.stopReplyingStub).to.have.been.calledWith({'bar': this.target.replyBar, 'foo': this.target.replyFoo});
    });
  });
});
