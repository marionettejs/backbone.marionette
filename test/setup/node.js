var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiJq = require('chai-jq');
var requireHelper = require('./require-helper');

chai.use(sinonChai);
chai.use(chaiJq);

global.chai = chai;
global.sinon = sinon;

if (!global.document || !global.window) {
  var jsdom = require('jsdom').jsdom;

  global.document = jsdom('<html><head><script></script></head><body></body></html>', {
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script']
  });

  global.window = document.defaultView;
  global.navigator = global.window.navigator;

}

require('babel-core/register');
require('./setup')();

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
requireHelper('utils/deprecate');

requireHelper('dom-refresh');
requireHelper('metal');
requireHelper('object');
requireHelper('app-router');
requireHelper('application');
requireHelper('renderer');
requireHelper('template-cache');
requireHelper('region');
requireHelper('regions-mixin');
requireHelper('abstract-view');
requireHelper('view');
requireHelper('collection-view');
requireHelper('composite-view');
requireHelper('behavior');
requireHelper('behaviors');
requireHelper('error');
