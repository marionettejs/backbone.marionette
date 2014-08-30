var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

var errorUrls = {
  fooBar: 'www.moose.com'
};

Marionette.Error = Marionette.extend.call(Error, {
    name: 'Error',

    constructor: function(message, code) {
        var tmp = Error.apply(this, arguments);
        this.captureStackTrace();
        _.extend(this, _.pick(tmp, errorProps));
        this.url = errorUrls[code];
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
