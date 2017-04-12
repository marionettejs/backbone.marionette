module.exports = function() {

  if (process.env.USE_LODASH) {
    var pathScore = require.resolve('underscore');
    var pathDash = require.resolve('lodash');
    require(pathDash);

    require.cache[pathScore] = require.cache[pathDash];
  }

  var lib = process.env.USE_LODASH ? 'lodash' : 'underscore';

  var _ = require('underscore');

  console.log('Using ' + lib + ': ' + _.VERSION);

  var Backbone = require('backbone');
  var jQuery = require('jquery');
  Backbone.$ = jQuery;
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

  before(function() {
    $fixtures = $('<div id="fixtures">');
    $('body').append($fixtures);
    this.setFixtures = setFixtures;
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
