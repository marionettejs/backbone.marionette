module.exports = function() {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var jQuery = require('jquery');
  Backbone.$ = jQuery;
  Backbone.ChildViewContainer = require('backbone.babysitter');
  Backbone.Radio = require('backbone.radio');
  var Marionette = require('../../src/backbone.marionette');

  Marionette = 'default' in Marionette ? Marionette.default : Marionette;

  global.$ = global.jQuery = jQuery;
  global._ = _;
  global.Backbone = Backbone;
  global.Marionette = Backbone.Marionette = Marionette;
  global.expect = global.chai.expect;

  var $fixtures;

  function setFixtures() {
    _.each(arguments, function(content) {
      $fixtures.append(content);
    });
  }

  function clearFixtures() {
    $fixtures.empty();
  }

  function checkProperties(block, blacklist) {
    blacklist = blacklist ? blacklist.push('cid') : 'cid';
    var props = _.partial(_.omit, _, blacklist);
    block.call(this, props);
  }

  before(function() {
    $fixtures = $('<div id="fixtures">');
    $('body').append($fixtures);
    this.checkProperties = checkProperties;
    this.setFixtures   = setFixtures;
    this.clearFixtures = clearFixtures;
  });

  beforeEach(function() {
    this.sinon = global.sinon.sandbox.create();
  });

  afterEach(function() {
    this.sinon.restore();
    window.location.hash = '';
    Backbone.history.stop();
    Backbone.history.handlers.length = 0;
    clearFixtures();
  });
};
