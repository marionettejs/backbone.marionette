// Error
// -----

import _      from 'underscore';
import extend from './utils/extend';

var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];

var MarionetteError = extend.call(Error, {
  // TODO: handle VERSION.
  urlRoot: 'http://marionettejs.com/docs/v' + '<%= version %>' + '/',

  constructor: function MarionetteError(message, options) {
    if (_.isObject(message)) {
      options = message;
      message = options.message;
    } else if (!options) {
      options = {};
    }

    var error = Error.call(this, message);
    _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));

    this.captureStackTrace();

    if (options.url) {
      this.url = this.urlRoot + options.url;
    }
  },

  captureStackTrace: function() {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MarionetteError);
    }
  },

  toString: function() {
    return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
  }
});

MarionetteError.extend = extend;

export default MarionetteError;
