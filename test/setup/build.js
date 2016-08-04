require('./_node-env');
var Backbone = require('backbone');

require('babel-register');
require('./setup')();

require('../../lib/backbone.marionette.min');

global.Marionette = Backbone.Marionette;
