import _ from 'underscore';
import Radio from 'backbone.radio';
import MarionetteError from '../utils/error';

// MixinOptions
// - channelName
// - radioEvents
// - radioRequests

export default {

  _initRadio() {
    const channelName = _.result(this, 'channelName');

    if (!channelName) {
      return;
    }

    /* istanbul ignore next */
    if (!Radio) {
      throw new MarionetteError({
        message: 'The dependency "backbone.radio" is missing.',
        url: 'backbone.radio.html#marionette-integration'
      });
    }

    const channel = this._channel = Radio.channel(channelName);

    const radioEvents = _.result(this, 'radioEvents');
    this.bindEvents(channel, radioEvents);

    const radioRequests = _.result(this, 'radioRequests');
    this.bindRequests(channel, radioRequests);

    this.on('destroy', this._destroyRadio);
  },

  _destroyRadio() {
    this._channel.stopReplying(null, null, this);
  },

  getChannel() {
    return this._channel;
  }
};
