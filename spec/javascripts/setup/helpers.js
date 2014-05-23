var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var $ = require('jquery');

var $body = $(document.body);

var setFixtures = function () {
  _.each(arguments, function (content) {
    $body.append(content);
  });
};

var loadFixtures = function () {
  _.each(arguments, function (fixture) {
    var file = path.resolve('./spec/javascripts/fixtures/', fixture);
    setFixtures(fs.readFileSync(file).toString());
  });
};

var clearFixtures = function () {
  $body.empty();
};

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
  this.setFixtures   = setFixtures;
  this.loadFixtures  = loadFixtures;
  this.clearFixtures = clearFixtures;
});

afterEach(function () {
  this.sinon.restore();
  clearFixtures();
  window.location.hash = '';
  Backbone.history.stop();
  Backbone.history.handlers.length = 0;
});
