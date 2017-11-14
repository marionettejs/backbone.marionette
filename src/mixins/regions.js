import _ from 'underscore';
import _invoke from '../utils/invoke';
import buildRegion from '../common/build-region';
import MarionetteError from '../error';
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
    this.regions = this.regions || {};
    this._regions = {};

    this.addRegions(_.result(this, 'regions'));
  },

  // Internal method to re-initialize all of the regions by updating
  // the `el` that they point to
  _reInitRegions() {
    _invoke(this._regions, 'reset');
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
    regions = this.normalizeUIValues(regions, ['selector', 'el']);

    // Add the regions definitions to the regions property
    this.regions = _.extend({}, this.regions, regions);

    return this._addRegions(regions);
  },

  // internal method to build and add regions
  _addRegions(regionDefinitions) {
    const defaults = {
      regionClass: this.regionClass,
      parentEl: _.partial(_.result, this, 'el')
    };

    return _.reduce(regionDefinitions, (regions, definition, name) => {
      regions[name] = buildRegion(definition, defaults);
      this._addRegion(regions[name], name);
      return regions;
    }, {});
  },

  _addRegion(region, name) {
    this.triggerMethod('before:add:region', this, name, region);

    region._parentView = this;
    region._name = name;

    this._regions[name] = region;

    this.triggerMethod('add:region', this, name, region);
  },

  // Remove a single region from the View, by name
  removeRegion(name) {
    const region = this._regions[name];

    this._removeRegion(region, name);

    return region;
  },

  // Remove all regions from the View
  removeRegions() {
    const regions = this._getRegions();

    _.each(this._regions, this._removeRegion.bind(this));

    return regions;
  },

  _removeRegion(region, name) {
    this.triggerMethod('before:remove:region', this, name, region);

    region.destroy();

    this.triggerMethod('remove:region', this, name, region);
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
  getRegion(name, options) {
    if (!this._isRendered) {
      this.render();
    }
    const region = this._regions[name];
    if (region && region.el) {
      return region;
    } else {
      return this.autoAddRegion(region, name, options);
    }
  },

  // Get all regions
  _getRegions() {
    return _.clone(this._regions);
  },

  getRegions() {
    if (!this._isRendered) {
      this.render();
    }
    return this._getRegions();
  },

  showChildView(name, view, ...args) {
    const region = this.getRegion(name, ...args);
    region.show(view, ...args);
    return view;
  },

  detachChildView(name) {
    return this.getRegion(name).detachView();
  },

  getChildView(name) {
    return this.getRegion(name).currentView;
  },

  // allow the user to provide its own selector
  getRegionsSelector() {
    return '[data-region]';
  },

  // allow the user to provide its own selector
  getRegionSelector(name) {
    return `[data-region="${name}"]`;
  },

  findRegionElement(name) {
    return this.Dom.findEl(`[data-view-cid="${this.cid}"]${this.getRegionSelector(name)}`);
  },

  // allow the user to add more
  // default options from el data attribute
  getRegionDefaultOption(name, el) {
    return {el};
  },

  idRegionElements() {
    const regionEls = this.Dom.findEl(this.el, this.getRegionSelector());
    if (regionEls.length > 0) {
      regionEls.forEach(el => el.setAttribute('data-view-cid', this.cid));
    }
  },

  autoAddRegion(region, name, options) {
    let regionEl = this.findRegionElement(name);

    if (!regionEl || regionEl.length === 0) {
      throw new MarionetteError({
        name: 'NoMatchingRegion',
        message: 'Cannot find a region named ${name} in the view ${this.cid}'
      });
    }

    if (region) {
      region._initEl = region.el = region.options.el = regionEl;
      region.$el = region.getEl(regionEl);
    } else {
      region = this.addRegion(name, _.extend({}, this.getRegionDefaultOption(name, regionEl), options));
      // temporary fixes missing aggressive reset
      // https://github.com/marionettejs/backbone.marionette/issues/3540
      const superReset = region.reset;
      region.reset = function reset(opts) {
        superReset.call(region, opts);
        region.el = null;
        return region;
      };
      return region;
    }
  },

};
