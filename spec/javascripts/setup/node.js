var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiJq = require('chai-jq');
var requireHelper = require('./require_helper');

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

  global.window = document.createWindow();
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
requireHelper('marionette.bindEntityEvents');
requireHelper('marionette.callbacks');
requireHelper('marionette.triggermethod');
requireHelper('marionette.helpers');
requireHelper('marionette.domRefresh');
requireHelper('marionette.object');
requireHelper('marionette.controller');
requireHelper('marionette.approuter');
requireHelper('marionette.application');
requireHelper('marionette.module');
requireHelper('marionette.renderer');
requireHelper('marionette.templatecache');
requireHelper('marionette.view');
requireHelper('marionette.itemview');
requireHelper('marionette.layoutview');
requireHelper('marionette.collectionview');
requireHelper('marionette.compositeview');
requireHelper('marionette.behavior');
requireHelper('marionette.behaviors');
requireHelper('marionette.region');
requireHelper('marionette.regionManager');
requireHelper('marionette.error');
