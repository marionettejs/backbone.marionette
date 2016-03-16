import _                    from 'underscore';
import _invoke              from '../utils/_invoke';
import Region               from '../region';
import MarionetteError      from '../error';

export default {
  regionClass: Region,

  // Internal method to initialize the regions that have been defined in a
  // `regions` attribute on this View.
  _initRegions: function() {

    // init regions hash
    this.regions =  this.regions || {};
    this._regions = {};

    this.addRegions(this.getValue(this.getOption('regions')));
  },

  // Internal method to re-initialize all of the regions by updating
  // the `el` that they point to
  _reInitRegions: function() {
    _invoke(this._regions, 'reset');
  },

  // Add a single region, by name, to the View
  addRegion: function(name, definition) {
    var regions = {};
    regions[name] = definition;
    return this.addRegions(regions)[name];
  },

  // Add multiple regions as a {name: definition, name2: def2} object literal
  addRegions: function(regions) {
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
  _addRegions: function(regionDefinitions) {
    return _.reduce(regionDefinitions, (regions, definition, name) => {
      regions[name] = this._buildRegion(definition);
      this._addRegion(regions[name], name);
      return regions;
    }, {});
  },

  // return the region instance from the definition
  _buildRegion: function(definition) {
    if (definition instanceof Region) {
      return definition;
    }

    return this._buildRegionFromDefinition(definition);
  },

  _buildRegionFromDefinition: function(definition) {
    if (_.isString(definition)) {
      return this._buildRegionFromObject({el: definition});
    }

    if (_.isFunction(definition)) {
      return this._buildRegionFromRegionClass(definition);
    }

    if (_.isObject(definition)) {
      return this._buildRegionFromObject(definition);
    }

    throw new MarionetteError({
      message: 'Improper region configuration type.',
      url: 'marionette.region.html#region-configuration-types'
    });
  },

  _buildRegionFromObject: function(definition) {
    var RegionClass = definition.regionClass || this.getOption('regionClass');

    var options = _.omit(definition, 'regionClass');

    _.defaults(options, {
      el: definition.selector,
      parentEl: _.partial(_.result, this, 'el')
    });

    return new RegionClass(options);
  },

  // Build the region directly from a given `RegionClass`
  _buildRegionFromRegionClass: function(RegionClass) {
    return new RegionClass({
      parentEl: _.partial(_.result, this, 'el')
    });
  },

  _addRegion: function(region, name) {
    this.triggerMethod('before:add:region', name, region);

    region._parent = this;

    this._regions[name] = region;

    this.triggerMethod('add:region', name, region);
  },

  // Remove a single region from the View, by name
  removeRegion: function(name) {
    var region = this._regions[name];

    this._removeRegion(region, name);

    return region;
  },

  // Remove all regions from the View
  removeRegions: function() {
    var regions = this.getRegions();

    _.each(this._regions, _.bind(this._removeRegion, this));

    return regions;
  },

  _removeRegion: function(region, name) {
    this.triggerMethod('before:remove:region', name, region);

    region.empty();
    region.stopListening();

    delete this.regions[name];
    delete this._regions[name];

    this.triggerMethod('remove:region', name, region);
  },

  // Empty all regions in the region manager, but
  // leave them attached
  emptyRegions: function() {
    var regions = this.getRegions();
    _invoke(regions, 'empty');
    return regions;
  },

  // Checks to see if view contains region
  // Accepts the region name
  // hasRegion('main')
  hasRegion: function(name) {
    return !!this.getRegion(name);
  },

  // Provides access to regions
  // Accepts the region name
  // getRegion('main')
  getRegion: function(name) {
    return this._regions[name];
  },

  // Get all regions
  getRegions: function() {
    return _.clone(this._regions);
  },

  showChildView: function(name, view, ...args) {
    var region = this.getRegion(name);
    return region.show(view, ...args);
  },

  getChildView: function(name) {
    return this.getRegion(name).currentView;
  }

};
