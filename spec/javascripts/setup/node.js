var fs = require('fs');
var path = require('path');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.sinon = sinon;
global.expect = chai.expect;

if (!global.document || !global.window) {
  var jsdom = require('jsdom').jsdom;

  global.document = jsdom('<html><head><script></script></head><body></body></html>', null, {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script'],
    MutationEvents           : '2.0',
    QuerySelector            : false
  });

  global.window = document.createWindow();
  global.navigator = global.window.navigator;

  global.window.Node.prototype.contains = function (node) {
    return this.compareDocumentPosition(node) & 16;
  };
}

global.$ = global.jQuery = require('jquery');

var chaiJq = require('chai-jq');
chai.use(chaiJq);

global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.Marionette = require('../../../tmp/backbone.marionette');

var $body = $(document.body);

global.setFixtures = function () {
  _.each(arguments, function (content) {
    $body.append(content);
  });
};

global.loadFixtures = function () {
  _.each(arguments, function (fixture) {
    var file = path.resolve('./spec/javascripts/fixtures/', fixture);
    global.setFixtures(fs.readFileSync(file).toString());
  });
};

global.clearFixtures = function () {
  $body.empty();
};

global.setup = function () {
  this.sinon = sinon.sandbox.create();
};

global.teardown = function () {
  this.sinon.restore();
  global.clearFixtures();
  window.location.hash = '';
  Backbone.history.stop();
  Backbone.history.handlers.length = 0;
};
