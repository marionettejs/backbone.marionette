require('./_node-env');
var Backbone = require('backbone');

require('babel-register');
require('./setup')();

var Marionette = require('../../lib/backbone.marionette');

global.Marionette = Backbone.Marionette = Marionette;
