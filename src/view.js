// View
// ---------

import _ from 'underscore';
import Backbone from 'backbone';
import deprecate from './utils/deprecate';
import isNodeAttached from './common/is-node-attached';
import monitorViewEvents from './common/monitor-view-events';
import ViewMixin from './mixins/view';
import RegionsMixin from './mixins/regions';
import Renderer from './config/renderer';

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

  // Serialize the view's model *or* collection, if
  // it exists, for the template
  serializeData() {
    if (!this.model && !this.collection) {
      return {};
    }

    // If we have a model, we serialize that
    if (this.model) {
      return this.serializeModel();
    }

    // Otherwise, we serialize the collection,
    // making it available under the `items` property
    return {
      items: this.serializeCollection()
    };
  },

  // Prepares the special `model` property of a view
  // for being displayed in the template. By default
  // we simply clone the attributes. Override this if
  // you need a custom transformation for your view's model
  serializeModel() {
    if (!this.model) { return {}; }
    return _.clone(this.model.attributes);
  },

  // Serialize a collection by cloning each of
  // its model's attributes
  serializeCollection() {
    if (!this.collection) { return {}; }
    return this.collection.map(function(model) { return _.clone(model.attributes); });
  },

  // Overriding Backbone.View's `setElement` to handle
  // if an el was previously defined. If so, the view might be
  // rendered or attached on setElement.
  setElement() {
    const hasEl = !!this.el;

    Backbone.View.prototype.setElement.apply(this, arguments);

    if (hasEl) {
      this._isRendered = !!this.$el.length;
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

  // Internal method to render the template with the serialized data
  // and template context via the `Marionette.Renderer` object.
  _renderTemplate() {
    const template = this.getTemplate();

    // Allow template-less views
    if (template === false) {
      deprecate('template:false is deprecated.  Use _.noop.');
      return;
    }

    // Add in entity data and template context
    const data = this.mixinTemplateContext(this.serializeData());

    // Render and add to el
    const html = this._renderHtml(template, data);
    this.attachElContent(html);
  },

  // Renders the data into the template
  _renderHtml(template, data) {
    return Renderer.render(template, data, this);
  },

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate() {
    return this.template;
  },

  // Mix in template context methods. Looks for a
  // `templateContext` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateContext(target = {}) {
    const templateContext = _.result(this, 'templateContext');
    return _.extend(target, templateContext);
  },

  // Attaches the content of a given view.
  // This method can be overridden to optimize rendering,
  // or to render in a non standard way.
  //
  // For example, using `innerHTML` instead of `$el.html`
  //
  // ```js
  // attachElContent(html) {
  //   this.el.innerHTML = html;
  //   return this;
  // }
  // ```
  attachElContent(html) {
    this.setInnerContent(this.el, html);

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
  }
});

_.extend(View.prototype, ViewMixin, RegionsMixin);

export default View;
