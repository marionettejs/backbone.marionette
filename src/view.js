// View
// ---------

import _                  from 'underscore';
import Backbone           from 'backbone';
import ViewMixin          from './mixins/view';
import RegionsMixin       from './mixins/regions';
import BehaviorsMixin     from './mixins/behaviors';
import UIMixin            from './mixins/ui';
import CommonMixin        from './mixins/common';
import MonitorViewEvents  from './dom-refresh';
import Renderer           from './renderer';

// The standard view. Includes view events, automatic rendering
// of Underscore templates, nested views, and more.
var View = Backbone.View.extend({

  constructor: function(options) {
    this.render = _.bind(this.render, this);

    this._setOptions(options);

    MonitorViewEvents(this);

    this._initBehaviors();
    this._initRegions();

    Backbone.View.prototype.constructor.call(this, this.options);

    this.delegateEntityEvents();
  },

  // Serialize the view's model *or* collection, if
  // it exists, for the template
  serializeData: function() {
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
  serializeModel: function() {
    if (!this.model) { return {}; }
    return _.clone(this.model.attributes);
  },

  // Serialize a collection by cloning each of
  // its model's attributes
  serializeCollection: function() {
    if (!this.collection) { return {}; }
    return this.collection.map(function(model) { return _.clone(model.attributes); });
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  // Subsequent renders after the first will re-render all nested
  // views.
  render: function() {
    this._ensureViewIsIntact();

    this.triggerMethod('before:render', this);

    // If this is not the first render call, then we need to
    // re-initialize the `el` for each region
    if (this._isRendered) {
      this._reInitRegions();
    }

    this._renderTemplate();
    this._isRendered = true;
    this.bindUIElements();

    this.triggerMethod('render', this);

    return this;
  },

  // Internal method to render the template with the serialized data
  // and template context via the `Marionette.Renderer` object.
  _renderTemplate: function() {
    var template = this.getTemplate();

    // Allow template-less views
    if (template === false) {
      return;
    }

    // Add in entity data and template context
    var data = this.mixinTemplateContext(this.serializeData());

    // Render and add to el
    var html = Renderer.render(template, data, this);
    this.attachElContent(html);
  },

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function() {
    return this.getOption('template');
  },

  // Attaches the content of a given view.
  // This method can be overridden to optimize rendering,
  // or to render in a non standard way.
  //
  // For example, using `innerHTML` instead of `$el.html`
  //
  // ```js
  // attachElContent: function(html) {
  //   this.el.innerHTML = html;
  //   return this;
  // }
  // ```
  attachElContent: function(html) {
    this.$el.html(html);

    return this;
  },

  // called by ViewMixin destroy
  _removeChildren: function() {
    this.removeRegions();
  }
});

_.extend(View.prototype, ViewMixin);
_.extend(View.prototype, RegionsMixin);
_.extend(View.prototype, BehaviorsMixin);
_.extend(View.prototype, UIMixin);
_.extend(View.prototype, CommonMixin);

export default View;
