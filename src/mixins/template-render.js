import _ from 'underscore';
import deprecate from '../utils/deprecate';
import Renderer from '../config/renderer';

// MixinOptions
// - template
// - templateContext

export default {

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
    this.Dom.setContents(this.el, html, this.$el);

    return this;
  }
};
