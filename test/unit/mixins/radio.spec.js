describe('Radio Mixin on Marionette.Object', function() {
  'use strict';

  beforeEach(function() {
    this.RadioObject = Marionette.Object.extend({
      onBar: _.noop,
      getBaz: _.noop
    });

    this.sinon.spy(this.RadioObject.prototype, 'bindRadioEvents');

    this.sinon.spy(this.RadioObject.prototype, 'bindRequests');

    this.channelFoo = Backbone.Radio.channel('foo');
  });

  describe('when a channelName is not defined', function() {
    beforeEach(function() {
      this.radioObject = new this.RadioObject();
    });

    it('should not have a Radio channel', function() {
      expect(this.radioObject.getChannel()).to.be.undefined;
    });

    it('should not bind radioEvents', function() {
      expect(this.radioObject.bindRadioEvents).to.not.have.been.called;
    });

    it('should not bind radioRequests', function() {
      expect(this.radioObject.bindRequests).to.not.have.been.called;
    });
  });

  describe('when a channelName is defined', function() {
    beforeEach(function() {
      this.channelName = 'foo';
      this.channelNameFunc = this.sinon.stub().returns(this.channelName);
    });

    describe('on the prototype', function() {
      it('should have the named Radio channel', function() {
        this.RadioObject.prototype.channelName = this.channelName;
        this.radioObject = new this.RadioObject();

        expect(this.radioObject.getChannel()).to.eql(this.channelFoo);
      });
    });

    describe('as a function', function() {
      it('should have the named Radio channel', function() {
        this.RadioObject.prototype.channelName = this.channelNameFunc;
        this.radioObject = new this.RadioObject();

        expect(this.radioObject.getChannel()).to.eql(this.channelFoo);
      });
    });

    describe('as an option at instantation', function() {
      it('should have the named Radio channel', function() {
        this.radioObject = new this.RadioObject({
          channelName: this.channelName
        });

        expect(this.radioObject.getChannel()).to.eql(this.channelFoo);
      });
    });
  });

  describe('when a radioEvents is defined', function() {
    beforeEach(function() {
      this.RadioObject.prototype.channelName = 'foo';

      this.radioEvents = {'bar': 'onBar'};
      this.radioEventsFunc = this.sinon.stub().returns(this.radioEvents);
    });

    describe('on the prototype', function() {
      it('should bind events to the channel', function() {
        this.RadioObject.prototype.radioEvents = this.radioEvents;
        this.radioObject = new this.RadioObject();

        expect(this.radioObject.bindRadioEvents).to.have.been.calledOnce
          .and.to.have.been.calledWith(this.channelFoo, {'bar': 'onBar'});
      });
    });

    describe('as a function', function() {
      it('should bind events to the channel', function() {
        this.RadioObject.prototype.radioEvents = this.radioEventsFunc;
        this.radioObject = new this.RadioObject();

        expect(this.radioObject.bindRadioEvents).to.have.been.calledOnce
          .and.to.have.been.calledWith(this.channelFoo, {'bar': 'onBar'});
      });
    });

    describe('as an option at instantation', function() {
      it('should bind events to the channel', function() {
        this.radioObject = new this.RadioObject({
          radioEvents: this.radioEvents
        });

        expect(this.radioObject.bindRadioEvents).to.have.been.calledOnce
          .and.to.have.been.calledWith(this.channelFoo, {'bar': 'onBar'});
      });
    });
  });

  describe('when a radioRequests is defined', function() {
    beforeEach(function() {
      this.RadioObject.prototype.channelName = 'foo';

      this.radioRequests = {'baz': 'getBaz'};
      this.radioRequestsFunc = this.sinon.stub().returns(this.radioRequests);
    });

    describe('on the prototype', function() {
      it('should bind requests to the channel', function() {
        this.RadioObject.prototype.radioRequests = this.radioRequests;
        this.radioObject = new this.RadioObject();

        expect(this.radioObject.bindRequests).to.have.been.calledOnce
          .and.to.have.been.calledWith(this.channelFoo, {'baz': 'getBaz'});
      });
    });

    describe('as a function', function() {
      it('should bind requests to the channel', function() {
        this.RadioObject.prototype.radioRequests = this.radioRequestsFunc;
        this.radioObject = new this.RadioObject();

        expect(this.radioObject.bindRequests).to.have.been.calledOnce
          .and.to.have.been.calledWith(this.channelFoo, {'baz': 'getBaz'});
      });
    });

    describe('as an option at instantation', function() {
      it('should bind requests to the channel', function() {
        this.radioObject = new this.RadioObject({
          radioRequests: this.radioRequests
        });

        expect(this.radioObject.bindRequests).to.have.been.calledOnce
          .and.to.have.been.calledWith(this.channelFoo, {'baz': 'getBaz'});
      });
    });
  });

  describe('when an Object is destroyed', function() {
    beforeEach(function() {
      this.radioObject = new this.RadioObject({
        channelName: 'foo'
      });

      this.fooChannel = this.radioObject.getChannel();

      this.sinon.spy(this.fooChannel, 'stopReplying');

      this.radioObject.destroy();
    });

    it('should stopReplying to the object', function() {
      expect(this.fooChannel.stopReplying).to.have.been.calledOnce
        .and.to.have.been.calledWith(null, null, this.radioObject);
    });
  });
});
