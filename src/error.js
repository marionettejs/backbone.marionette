// Error
// -----

var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];

Marionette.Error = Marionette.extend.call(Error, {
  urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/',

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
      Error.captureStackTrace(this, Marionette.Error);
    }
  },

  toString: function() {
    return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
  }
});

Marionette.Error.extend = Marionette.extend;
