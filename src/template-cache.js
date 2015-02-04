// Template Cache
// --------------

// Manage templates stored in `<script>` blocks,
// caching them for faster access.
Marionette.TemplateCache = Marionette.Class.extend({
  constructor: function(templateId) {
    this.templateId = templateId;
  },

  // Internal method to load the template
  load: function(options) {
    // Guard clause to prevent loading this template more than once
    if (this.compiledTemplate) {
      return this.compiledTemplate;
    }

    // Load the template and compile it
    var template = this.loadTemplate(this.templateId, options);
    this.compiledTemplate = this.compileTemplate(template, options);

    return this.compiledTemplate;
  },

  // Load a template from the DOM, by default. Override
  // this method to provide your own template retrieval
  // For asynchronous loading with AMD/RequireJS, consider
  // using a template-loader plugin as described here:
  // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
  loadTemplate: function(templateId, options) {
    var template = Backbone.$(templateId).html();

    if (!template || template.length === 0) {
      throw new Marionette.Error({
        name: 'NoTemplateError',
        message: 'Could not find template: "' + templateId + '"'
      });
    }

    return template;
  },

  // Pre-compile the template before caching it. Override
  // this method if you do not need to pre-compile a template
  // (JST / RequireJS for example) or if you want to change
  // the template engine used (Handebars, etc).
  compileTemplate: function(rawTemplate, options) {
    return _.template(rawTemplate, options);
  }
}, {
  templateCaches: {},

  // Get the specified template by id. Either
  // retrieves the cached version, or loads it
  // from the DOM.
  get: function(templateId) {
    var cachedTemplate = this.templateCaches[templateId];

    if (!cachedTemplate) {
      cachedTemplate = new Marionette.TemplateCache(templateId);
      this.templateCaches[templateId] = cachedTemplate;
    }

    return cachedTemplate.load();
  },

  // Clear templates from the cache. If no arguments
  // are specified, clears all templates:
  // `clear()`
  //
  // If arguments are specified, clears each of the
  // specified templates from the cache:
  // `clear("#t1", "#t2", "...")`
  clear: function() {
    var i;
    var args = _.toArray(arguments);
    var length = args.length;

    if (length > 0) {
      for (i = 0; i < length; i++) {
        delete this.templateCaches[args[i]];
      }
    } else {
      this.templateCaches = {};
    }
  }
});
