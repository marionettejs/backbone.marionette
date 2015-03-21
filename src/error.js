// Error
// -----

import _       from 'underscore';
import helpers from './helpers';

var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];

var exports = {
  Error: helpers.extend.call(Error, {
    urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/', // trusktr TODO: handle VERSION.

    constructor: function(message, options) {
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
        Error.captureStackTrace(this, exports.Error);
      }
    },

    toString: function() {
      return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
    }
  })

};

exports.Error.extend = helpers.extend;

export default exports;
