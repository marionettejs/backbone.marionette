import Radio from 'backbone.radio';

import {
  bindRadioRequests,
  unbindRadioRequests
} from '../bind-radio-requests';

import {
  bindEntityEvents as bindRadioEvents,
  unbindEntityEvents as unbindRadioEvents
} from '../bind-entity-events';

export default {

  _initRadio: function() {
    var channelName = this.getValue(this.getOption('channelName'));

    if (!channelName) {
      return;
    }

    var channel = this._channel = Radio.channel(channelName);

    var radioEvents = this.getValue(this.getOption('radioEvents'));
    this.bindRadioEvents(channel, radioEvents);

    var radioRequests = this.getValue(this.getOption('radioRequests'));
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
