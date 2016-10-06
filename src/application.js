// Application
// -----------
import buildRegion from './common/build-region';
import MarionetteObject from './object';
import Region from './region';

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
