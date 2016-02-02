var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiJq = require('chai-jq');
var requireHelper = require('./require-helper');

chai.use(sinonChai);
chai.use(chaiJq);

global.expect = chai.expect;
global.sinon = sinon;

if (!global.document || !global.window) {
  var jsdom = require('jsdom').jsdom;
  global.document = jsdom('<html><head><script></script></head><body></body></html>', {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script'],
    MutationEvents           : '2.0',
    QuerySelector            : false
  });

  global.window = document.defaultView;
  global.navigator = global.window.navigator;

  global.window.Node.prototype.contains = function (node) {
    return this.compareDocumentPosition(node) & 16;
  };
}

global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.Marionette = Backbone.Marionette = {};
require('backbone.wreqr');
require('backbone.babysitter');
global.slice = Array.prototype.slice;
Marionette.Deferred = global.Backbone.$.Deferred;
requireHelper('bind-entity-events');
requireHelper('callbacks');
requireHelper('trigger-method');
requireHelper('helpers');
requireHelper('dom-refresh');
requireHelper('object');
requireHelper('features');
requireHelper('controller');
requireHelper('app-router');
requireHelper('application');
requireHelper('module');
requireHelper('renderer');
requireHelper('template-cache');
requireHelper('view');
requireHelper('item-view');
requireHelper('layout-view');
requireHelper('collection-view');
requireHelper('composite-view');
requireHelper('behavior');
requireHelper('behaviors');
requireHelper('region');
requireHelper('region-manager');
requireHelper('error');
