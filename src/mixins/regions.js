import _ from 'underscore';
import _invoke from '../utils/invoke';
import buildRegion from '../common/build-region';
import Region from '../region';

// MixinOptions
// - regions
// - regionClass

export default {
  regionClass: Region,

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this View.
  _initRegions() {

    // init regions hash
    this._regions = {};

    this.addRegions(_.result(this, 'regions', {}));
  },

  // Internal method to update the `el` that they point to after rendering
  _setRegionElements() {
    _.each(this._regions, this._setRegionElement.bind(this));
  },

  _setRegionElement(region) {
    if (!region._selector) { return; }

    const el = this.$(region._selector)[0];
    if (el) { region.setElement(el); }
  },

  // Add a single region, by name, to the View
  addRegion(name, definition) {
    const regions = {};
    regions[name] = definition;
    return this.addRegions(regions)[name];
  },

  // Add multiple regions as a {name: definition, name2: def2} object literal
  addRegions(regions) {
    // If there's nothing to add, stop here.
    if (_.isEmpty(regions)) {
      return;
    }

    // Normalize region selectors hash to allow
    // a user to use the @ui. syntax.
    regions = this.normalizeUIValues(regions, 'el');

    return this._addRegions(regions);
  },

  // internal method to build and add regions
  _addRegions(regionDefinitions) {
    return _.reduce(regionDefinitions, (regions, definition, name) => {
      const region = buildRegion(definition, this.regionClass);

      region._parentView = this;
      region._name = name;

      if (this._isRendered) {
        this._setRegionElement(region);
      }

      regions[name] = this._regions[name] = region;

      return regions;
    }, {});
  },

  // Remove a single region from the View, by name
  removeRegion(name) {
    const region = this._regions[name];

    region.destroy();

    return region;
  },

  // Remove all regions from the View
  removeRegions() {
    const regions = this._getRegions();

    _.each(this._regions, region => region.destroy());

    return regions;
  },

  // Called in a region's destroy
  _removeReferences(name) {
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
    return _.clone(this._regions);
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
