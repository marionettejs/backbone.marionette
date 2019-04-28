import _ from 'underscore';
import _invoke from '../utils/invoke';
import normalizeRegion from '../common/normalize-region';
import Region from '../region';

// Performant startsWith
function startsWithUi(el) {
  return el[0] === '@' &&
         el[1] === 'u' &&
         el[2] === 'i' &&
         el[3] === '.';
}

// MixinOptions
// - regions
// - regionClass

export default {
  regionClass: Region,

  // Internal method to initialize the regions attributes
  _initRegions() {

    // init regions instance hash
    this._regions = {};
    // init regions definition hash
    this.regions = _.extend({}, _.result(this, 'regions'));
  },

  // Adds or rebinds all regions associated with the view
  _bindRegions() {
    const regions = this.addRegions(_.extend({}, this.regions));

    this.triggerMethod('bind:regions', this, regions);
  },

  // Finds an existing ui with `@ui.` or finds the `el` on the DOM
  _findEl(el) {
    if (_.isString(el) && startsWithUi(el)) {
      return this.ui[el.slice(4)];
    }

    return this.Dom.findEl(this.el, el);
  },

  _buildRegion(name, RegionClass, options) {
    const region = new RegionClass(options);

    region._parentView = this;
    region._name = name;

    this._regions[name] = region;

    return region;
  },

  // Add a single region, by name, to the View
  addRegion(name, definition) {
    const currentRegion = this.getRegion(name);
    definition = normalizeRegion(definition, this.regionClass);

    this.regions[name] = definition;

    const options = _.extend({}, definition);
    options.el = this._findEl(options.el);

    if (currentRegion) {
      return currentRegion.setElement(options.el);
    }

    const RegionClass = options.regionClass;
    delete options.regionClass;

    return this._buildRegion(name, RegionClass, options);
  },

  // Add multiple region definitions
  addRegions(regionDefinitions) {
    return _.map(regionDefinitions, (definition, name) => {
      return this.addRegion(name, definition);
    });
  },

  // Remove a single region from the View, by name
  removeRegion(name) {
    return this.getRegion(name).destroy();
  },

  // Remove all regions from the View
  removeRegions() {
    const regions = this._getRegions();
    _invoke(regions, 'destroy');
    return regions;
  },

  // Called in a region's destroy
  _removeReferences(name) {
    delete this.regions[name];
    delete this._regions[name];
  },

  // Empty all regions in the region manager, but
  // leave them attached
  emptyRegions() {
    const regions = this.getRegions();
    _invoke(regions, 'empty');
    return regions;
  },

  // Checks to see if view contains region
  // Accepts the region name
  // hasRegion('main')
  hasRegion(name) {
    return !!this.getRegion(name);
  },

  // Provides access to regions
  // Accepts the region name
  // getRegion('main')
  getRegion(name) {
    if (!this._isRendered) {
      this.render();
    }
    return this._regions[name];
  },

  _getRegions() {
    return _.extend({}, this._regions);
  },

  // Get all regions
  getRegions() {
    if (!this._isRendered) {
      this.render();
    }
    return this._getRegions();
  },

  showChildView(name, view, options) {
    const region = this.getRegion(name);
    region.show(view, options);
    return view;
  },

  detachChildView(name) {
    return this.getRegion(name).detachView();
  },

  getChildView(name) {
    return this.getRegion(name).currentView;
  }
};
