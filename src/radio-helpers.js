(function(Marionette, Radio) {

  //Proxy Radio message handling to enable declarative interactions with radio channels
  var radioAPI = {
    'radioEvents' : {
      startMethod: 'on',
      stopMethod: 'off'
    },
    'radioRequests' : {
      startMethod: 'reply',
      stopMethod: 'stopReplying'
    }
  };

  function proxyRadioHandlers() {
    unproxyRadioHandlers.apply(this);
    _.each(radioAPI, function(commands, radioType) {
      var hash = _.result(this, radioType);
      if (!hash) {
        return;
      }
      _.each(hash, function(handler, radioMessage) {
        handler = normalizeHandler.call(this, handler);
        var messageComponents = radioMessage.split(' ');
        var channel = messageComponents[0];
        var messageName = messageComponents[1];
        proxyRadioHandler.call(this, channel, radioType, messageName, handler);
      }, this);
    }, this);
  }

  function proxyRadioHandler(channel, radioType, messageName, handler) {
    var method = radioAPI[radioType].startMethod;
    this._radioChannels = this._radioChannels || [];
    if (!_.contains(this._radioChannels, channel)) {
      this._radioChannels.push(channel);
    }

    Radio[method](channel, messageName, handler, this);
  }

  function unproxyRadioHandlers() {
    _.each(this._radioChannels, function(channel) {
      _.each(radioAPI, function(commands) {
        Radio[commands.stopMethod](channel, null, null, this);
      }, this);
    }, this);
  }

  function normalizeHandler(handler) {
    if (!_.isFunction(handler)) {
      handler = this[handler];
    }
    return handler;
  }

  Marionette.proxyRadioHandlers = proxyRadioHandlers;
  Marionette.unproxyRadioHandlers = unproxyRadioHandlers;

})(Marionette, Backbone.Radio);
