// Application
// -----------
import _                from 'underscore';
import MarionetteObject from './object';
import Region           from './region';

const ClassOptions = [
  'region',
  'regionClass'
];

// A container for a Marionette application.
const Application = MarionetteObject.extend({
  cidPrefix: 'mna',

  constructor(options) {
    this._setOptions(options);

    this.mergeOptions(options, ClassOptions);

    this._initRegion();

    MarionetteObject.prototype.constructor.apply(this, arguments);
  },

  regionClass: Region,

  _initRegion(options) {
    const region = this.region;
    const RegionClass = this.regionClass;

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

  getRegion() {
    return this._region;
  },

  showView(view, ...args) {
    const region = this.getRegion();
    return region.show(view, ...args);
  },

  getView() {
    return this.getRegion().currentView;
  },

  // kick off all of the application's processes.
  start(options) {
    this.triggerMethod('before:start', this, options);
    this.triggerMethod('start', this, options);
    return this;
  }

});

export default Application;
