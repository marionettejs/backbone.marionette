// Application
// -----------

import _ from 'underscore';
import Backbone from 'backbone';
import extend from './utils/extend';
import buildRegion from './common/build-region';
import triggerMethod from './common/trigger-method';
import CommonMixin from './mixins/common';
import DestroyMixin from './mixins/destroy';
import RadioMixin from './mixins/radio';
import Region from './region';

const ClassOptions = [
  'channelName',
  'radioEvents',
  'radioRequests',
  'region',
  'regionClass'
];

const Application = function(options) {
  this._setOptions(options, ClassOptions);
  this.cid = _.uniqueId(this.cidPrefix);
  this._initRegion();
  this._initRadio();
  this.initialize.apply(this, arguments);
};

Application.extend = extend;

// Application Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Application.prototype, Backbone.Events, CommonMixin, DestroyMixin, RadioMixin, {
  cidPrefix: 'mna',

  // This is a noop method intended to be overridden
  initialize() {},

  triggerMethod,

  // Kick off all of the application's processes.
  start(options) {
    this.triggerMethod('before:start', this, options);
    this.triggerMethod('start', this, options);
    return this;
  },

  regionClass: Region,

  _initRegion() {
    const region = this.region;

    if (!region) { return; }

    const defaults = {
      regionClass: this.regionClass
    };

    this._region = buildRegion(region, defaults);
  },

  getRegion() {
    return this._region;
  },

  showView(view, ...args) {
    const region = this.getRegion();
    region.show(view, ...args);
    return view;
  },

  getView() {
    return this.getRegion().currentView;
  }
});

export default Application;
