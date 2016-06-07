import _ from 'underscore';
import Radio from 'backbone.radio';

import {
  bindRadioRequests,
  unbindRadioRequests
} from '../bind-radio-requests';

import {
  bindEntityEvents as bindRadioEvents,
  unbindEntityEvents as unbindRadioEvents
} from '../bind-entity-events';

// MixinOptions
// - channelName
// - radioEvents
// - radioRequests

export default {

  _initRadio: function() {
    const channelName = _.result(this, 'channelName');

    if (!channelName) {
      return;
    }

    const channel = this._channel = Radio.channel(channelName);

    const radioEvents = _.result(this, 'radioEvents');
    this.bindRadioEvents(channel, radioEvents);

    const radioRequests = _.result(this, 'radioRequests');
    this.bindRadioRequests(channel, radioRequests);

    this.on('destroy', this._destroyRadio);
  },

  _destroyRadio: function() {
    this._channel.stopReplying(null, null, this);
  },

  getChannel: function() {
    return this._channel;
  },

  // Proxy `bindRadioEvents`
  bindRadioEvents: bindRadioEvents,

  // Proxy `unbindRadioEvents`
  unbindRadioEvents: unbindRadioEvents,

  // Proxy `bindRadioRequests`
  bindRadioRequests: bindRadioRequests,

  // Proxy `unbindRadioRequests`
  unbindRadioRequests: unbindRadioRequests

};
