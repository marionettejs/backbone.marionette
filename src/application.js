// Application
// -----------
import _                from 'underscore';
import MarionetteObject from './object';
import Region           from './region';

// A container for a Marionette application.
var Application = MarionetteObject.extend({
  cidPrefix: 'mna',

  constructor: function(options) {
    options = options || {};

    this._initRegion(options);

    MarionetteObject.prototype.constructor.apply(this, arguments);
  },

  regionClass: Region,

  _initRegion: function(options) {
    var region = options.region || this.region;
    var RegionClass = options.regionClass || this.regionClass;

    // if the region is a string expect an el or selector
    // and instantiate a region
    if (_.isString(region)) {
      this._region = new RegionClass({
        el: region
      });
      return;
    }

    this._region = region;
  },

  getRegion: function() {
    return this._region;
  },

  showView: function(view, ...args) {
    var region = this.getRegion();
    return region.show(region, ...args);
  },

  getView: function() {
    return this.getRegion().currentView;
  },

  // kick off all of the application's processes.
  start: function(options) {
    this.triggerMethod('before:start', options);
    this.triggerMethod('start', options);
  }

});

export default Application;
