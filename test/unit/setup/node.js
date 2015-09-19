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

  global.document = jsdom('<html><head><script></script></head><body></body></html>', null, {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script'],
    MutationEvents           : '2.0',
    QuerySelector            : false
  });

  global.window = document.parentWindow;
  global.navigator = global.window.navigator;

  global.window.Node.prototype.contains = function(node) {
    return this.compareDocumentPosition(node) && 16;
  };
}

global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.$ = global.$;
global.Marionette = Backbone.Marionette = {};

requireHelper('features');
Marionette.FEATURES.class = true;

global.Metal = require('backbone-metal');

require('backbone.babysitter');
require('backbone.radio');
global.slice = Array.prototype.slice;
requireHelper('bind-entity-events');
requireHelper('radio-helpers');
requireHelper('trigger-method');

requireHelper('utils/extend');
requireHelper('utils/isNodeAttached');
requireHelper('utils/mergeOptions');
requireHelper('utils/getOption');
requireHelper('utils/proxyGetOption');
requireHelper('utils/_getValue');
requireHelper('utils/normalizeMethods');
requireHelper('utils/normalizeUIString');
requireHelper('utils/normalizeUIKeys');
requireHelper('utils/normalizeUIValues');
requireHelper('utils/actAsCollection');
requireHelper('utils/deprecate');

requireHelper('dom-refresh');
requireHelper('metal');
requireHelper('object');
requireHelper('app-router');
requireHelper('application');
requireHelper('renderer');
requireHelper('template-cache');
requireHelper('abstract-view');
requireHelper('view');
requireHelper('collection-view');
requireHelper('composite-view');
requireHelper('behavior');
requireHelper('behaviors');
requireHelper('region');
requireHelper('region-manager');
requireHelper('error');
