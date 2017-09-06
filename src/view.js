// View
// ---------

import _ from 'underscore';
import Backbone from 'backbone';
import isNodeAttached from './common/is-node-attached';
import monitorViewEvents from './common/monitor-view-events';
import TemplateRenderMixin from './mixins/template-render';
import ViewMixin from './mixins/view';
import RegionsMixin from './mixins/regions';
import { setDomApi } from './config/dom';

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

// The standard view. Includes view events, automatic rendering
// of Underscore templates, nested views, and more.
const View = Backbone.View.extend({

  constructor(options) {
    this.render = _.bind(this.render, this);

    this._setOptions(options);

    this.mergeOptions(options, ClassOptions);

    monitorViewEvents(this);

    this._initBehaviors();
    this._initRegions();

    const args = Array.prototype.slice.call(arguments);
    args[0] = this.options;
    Backbone.View.prototype.constructor.apply(this, args);

    this.delegateEntityEvents();

    this._triggerEventOnBehaviors('initialize', this);
  },

  // Overriding Backbone.View's `setElement` to handle
  // if an el was previously defined. If so, the view might be
  // rendered or attached on setElement.
  setElement() {
    const hasEl = !!this.el;

    Backbone.View.prototype.setElement.apply(this, arguments);

    if (hasEl) {
      this._isRendered = this.Dom.hasContents(this.el);
      this._isAttached = isNodeAttached(this.el);
    }

    if (this._isRendered) {
      this.bindUIElements();
    }

    return this;
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  // Subsequent renders after the first will re-render all nested
  // views.
  render() {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:render', this);

    // If this is not the first render call, then we need to
    // re-initialize the `el` for each region
    if (this._isRendered) {
      this._reInitRegions();
    }

    this._renderTemplate();
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
    return _.chain(this._getRegions())
      .map('currentView')
      .compact()
      .value();
  }
}, {
  // Sets the renderer for the Marionette.View class
  setRenderer(renderer) {
    this.prototype._renderHtml = renderer;
    return this;
  },

  setDomApi
});

_.extend(View.prototype, ViewMixin, RegionsMixin, TemplateRenderMixin);

export default View;
