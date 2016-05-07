require('./_node-env');
var Backbone = require('backbone');

require('babel-register');
require('./setup')();

require('../../lib/core/backbone.marionette');

global.Marionette = Backbone.Marionette;
