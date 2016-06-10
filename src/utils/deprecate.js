/* global console */

import _ from 'underscore';

import Marionette from '../backbone.marionette';

const deprecate = function(message, test) {
  if (_.isObject(message)) {
    message = (
      message.prev + ' is going to be removed in the future. ' +
      'Please use ' + message.next + ' instead.' +
      (message.url ? ' See: ' + message.url : '')
    );
  }

  if (!Marionette.DEV_MODE) {
    return;
  }

  if ((test === undefined || !test) && !deprecate._cache[message]) {
    deprecate._warn('Deprecation warning: ' + message);
    deprecate._cache[message] = true;
  }
};

deprecate._console = typeof console !== 'undefined' ? console : {};
deprecate._warn = function() {
  const warn = deprecate._console.warn || deprecate._console.log || _.noop;
  return warn.apply(deprecate._console, arguments);
};
deprecate._cache = {};

export default deprecate;
