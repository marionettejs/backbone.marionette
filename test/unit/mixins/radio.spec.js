import MnObject from '../../../src/object';


describe('Radio Mixin on Marionette.Object', function() {
  'use strict';
  let RadioObject;
  let channelFoo;

  beforeEach(function() {
    RadioObject = MnObject.extend({
      onBar: _.noop,
      getBaz: _.noop
    });

    this.sinon.spy(RadioObject.prototype, 'bindEvents');

    this.sinon.spy(RadioObject.prototype, 'bindRequests');

    channelFoo = Backbone.Radio.channel('foo');
  });

  describe('when a channelName is not defined', function() {
    let radioObject;

    beforeEach(function() {
      radioObject = new RadioObject();
    });

    it('should not have a Radio channel', function() {
      expect(radioObject.getChannel()).to.be.undefined;
    });

    it('should not bind radioEvents', function() {
      expect(radioObject.bindEvents).to.not.have.been.called;
    });

    it('should not bind radioRequests', function() {
      expect(radioObject.bindRequests).to.not.have.been.called;
    });
  });

  describe('when a channelName is defined', function() {
    let channelName;
    let channelNameFunc;

    beforeEach(function() {
      channelName = 'foo';
      channelNameFunc = this.sinon.stub().returns(channelName);
    });

    describe('on the prototype', function() {
      let radioObject;

      it('should have the named Radio channel', function() {
        RadioObject.prototype.channelName = channelName;
        radioObject = new RadioObject();

        expect(radioObject.getChannel()).to.eql(channelFoo);
      });
    });

    describe('as a function', function() {
      it('should have the named Radio channel', function() {
        RadioObject.prototype.channelName = channelNameFunc;
        const radioObject = new RadioObject();

        expect(radioObject.getChannel()).to.eql(channelFoo);
      });
    });

    describe('as an option at instantation', function() {
      it('should have the named Radio channel', function() {
        const radioObject = new RadioObject({
          channelName: channelName
        });

        expect(radioObject.getChannel()).to.eql(channelFoo);
      });
    });
  });

  describe('when a radioEvents is defined', function() {
    let radioEvents;
    let radioEventsFunc;

    beforeEach(function() {
      RadioObject.prototype.channelName = 'foo';

      radioEvents = {'bar': 'onBar'};
      radioEventsFunc = this.sinon.stub().returns(radioEvents);
    });

    describe('on the prototype', function() {
      it('should bind events to the channel', function() {
        RadioObject.prototype.radioEvents = radioEvents;
        const radioObject = new RadioObject();

        expect(radioObject.bindEvents).to.have.been.calledOnce
          .and.to.have.been.calledWith(channelFoo, {'bar': 'onBar'});
      });
    });

    describe('as a function', function() {
      it('should bind events to the channel', function() {
        RadioObject.prototype.radioEvents = radioEventsFunc;
        const radioObject = new RadioObject();

        expect(radioObject.bindEvents).to.have.been.calledOnce
          .and.to.have.been.calledWith(channelFoo, {'bar': 'onBar'});
      });
    });

    describe('as an option at instantation', function() {
      it('should bind events to the channel', function() {
        const radioObject = new RadioObject({
          radioEvents: radioEvents
        });

        expect(radioObject.bindEvents).to.have.been.calledOnce
          .and.to.have.been.calledWith(channelFoo, {'bar': 'onBar'});
      });
    });
  });

  describe('when a radioRequests is defined', function() {
    let radioRequests;
    let radioRequestsFunc;

    beforeEach(function() {
      RadioObject.prototype.channelName = 'foo';

      radioRequests = {'baz': 'getBaz'};
      radioRequestsFunc = this.sinon.stub().returns(radioRequests);
    });

    describe('on the prototype', function() {
      it('should bind requests to the channel', function() {
        RadioObject.prototype.radioRequests = radioRequests;
        const radioObject = new RadioObject();

        expect(radioObject.bindRequests).to.have.been.calledOnce
          .and.to.have.been.calledWith(channelFoo, {'baz': 'getBaz'});
      });
    });

    describe('as a function', function() {
      it('should bind requests to the channel', function() {
        RadioObject.prototype.radioRequests = radioRequestsFunc;
        const radioObject = new RadioObject();

        expect(radioObject.bindRequests).to.have.been.calledOnce
          .and.to.have.been.calledWith(channelFoo, {'baz': 'getBaz'});
      });
    });

    describe('as an option at instantation', function() {
      it('should bind requests to the channel', function() {
        const radioObject = new RadioObject({
          radioRequests: radioRequests
        });

        expect(radioObject.bindRequests).to.have.been.calledOnce
          .and.to.have.been.calledWith(channelFoo, {'baz': 'getBaz'});
      });
    });
  });

  describe('when an Object is destroyed', function() {
    let radioObject;
    let fooChannel;

    beforeEach(function() {
      radioObject = new RadioObject({
        channelName: 'foo'
      });

      fooChannel = radioObject.getChannel();

      this.sinon.spy(fooChannel, 'stopReplying');

      radioObject.destroy();
    });

    it('should stopReplying to the object', function() {
      expect(fooChannel.stopReplying).to.have.been.calledOnce
        .and.to.have.been.calledWith(null, null, radioObject);
    });
  });
});
