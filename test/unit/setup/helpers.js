var sinon = require('sinon');
var $ = require('jquery');

var $body = $(document.body);

var setFixtures = function() {
  _.each(arguments, function(content) {
    $body.append(content);
  });
};

var clearFixtures = function() {
  $body.empty();
};

before(function() {
  this.checkProperties = function(block, blacklist) {
    blacklist = blacklist ? blacklist.push('cid') : 'cid';
    var props = _.partial(_.omit, _, blacklist);
    block.call(this, props);
  };
});

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
  this.setFixtures   = setFixtures;
  this.clearFixtures = clearFixtures;
});

afterEach(function() {
  this.sinon.restore();
  window.location.hash = '';
  Backbone.history.stop();
  Backbone.history.handlers.length = 0;
  clearFixtures();
});
