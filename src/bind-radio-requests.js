// Bind/Unbind Radio Requests
// -----------------------------------------
//
// These methods are used to bind/unbind a backbone.radio request
// to methods on a target object.
//
// The first parameter, `target`, will set the context of the reply method
//
// The second parameter is the `Radio.channel` to bind the reply to.
//
// The third parameter is a hash of { "request:name": "replyHandler" }
// configuration. A function can be supplied instead of a string handler name.

import _ from 'underscore';
import normalizeMethods from './utils/normalizeMethods';
import MarionetteError from './error';

function iterateReplies(target, channel, bindings, actionName) {
  if (!channel || !bindings) { return; }

  // type-check bindings
  if (!_.isObject(bindings)) {
    throw new MarionetteError({
      message: 'Bindings must be an object.',
      url: 'marionette.functions.html#marionettebindradiorequests'
    });
  }

  const normalizedRadioRequests = normalizeMethods.call(target, bindings);

  channel[actionName](normalizedRadioRequests, target);
}

function bindRadioRequests(channel, bindings) {
  iterateReplies(this, channel, bindings, 'reply');
  return this;
}

function unbindRadioRequests(channel, bindings) {
  iterateReplies(this, channel, bindings, 'stopReplying');
  return this;
}

export {
  bindRadioRequests,
  unbindRadioRequests
};
