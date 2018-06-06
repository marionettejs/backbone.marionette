// View
// ---------

import _ from 'underscore';
import Backbone from 'backbone';
import monitorViewEvents from './common/monitor-view-events';
import ViewMixin from './mixins/view';
import RegionsMixin from './mixins/regions';
import { setDomApi } from './config/dom';
import { setRenderer } from './config/renderer';

const ClassOptions = [
  'behaviors',
  'childViewEventPrefix',
  'childViewEvents',
  'childViewTriggers',
  'collectionEvents',
  'events',
  'modelEvents',
  'regionClass',
  'regions',
  'template',
  'templateContext',
  'triggers',
  'ui'
];

// Used by _getImmediateChildren
function childReducer(children, region) {
  if (region.currentView) {
    children.push(region.currentView);
  }

  return children;
}

// The standard view. Includes view events, automatic rendering
// templates, nested views, and more.
const View = Backbone.View.extend({

  constructor(options) {
    this._setOptions(options, ClassOptions);

    monitorViewEvents(this);

    this._initBehaviors();
    this._initRegions();

    Backbone.View.prototype.constructor.apply(this, arguments);

    this.delegateEntityEvents();

    this._triggerEventOnBehaviors('initialize', this, options);
  },

  // Overriding Backbone.View's `setElement` to handle
  // if an el was previously defined. If so, the view might be
  // rendered or attached on setElement.
  setElement() {
    Backbone.View.prototype.setElement.apply(this, arguments);

    this._isRendered = this.Dom.hasContents(this.el);
    this._isAttached = this.Dom.hasEl(document.documentElement, this.el);

    if (this._isRendered) {
      this.bindUIElements();
    }

    return this;
  },

  // If a template is available, renders it into the view's `el`
  // Re-inits regions and binds UI.
  render() {
    const template = this.getTemplate();

    if (template === false || this._isDestroyed) { return this; }

    this.triggerMethod('before:render', this);

    // If this is not the first render call, then we need to
    // re-initialize the `el` for each region
    if (this._isRendered) {
      this._reInitRegions();
    }

    this._renderTemplate(template);
    this.bindUIElements();

    this._isRendered = true;
    this.triggerMethod('render', this);

    return this;
  },

  // called by ViewMixin destroy
  _removeChildren() {
    this.removeRegions();
  },

  _getImmediateChildren() {
    return _.reduce(this._regions, childReducer, []);
  }
}, {
  setRenderer,
  setDomApi
});

_.extend(View.prototype, ViewMixin, RegionsMixin);

export default View;
