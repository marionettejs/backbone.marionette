// Template Cache
// --------------

import _               from 'underscore';
import Backbone        from 'backbone';
import MarionetteError from './error';

// Manage templates stored in `<script>` blocks,
// caching them for faster access.
var TemplateCache = function(templateId) {
  this.templateId = templateId;
};

// TemplateCache object-level methods. Manage the template
// caches from these method calls instead of creating
// your own TemplateCache instances
_.extend(TemplateCache, {
  templateCaches: {},

  // Get the specified template by id. Either
  // retrieves the cached version, or loads it
  // from the DOM.
  get: function(templateId, options) {
    var cachedTemplate = this.templateCaches[templateId];

    if (!cachedTemplate) {
      cachedTemplate = new TemplateCache(templateId);
      this.templateCaches[templateId] = cachedTemplate;
    }

    return cachedTemplate.load(options);
  },

  // Clear templates from the cache. If no arguments
  // are specified, clears all templates:
  // `clear()`
  //
  // If arguments are specified, clears each of the
  // specified templates from the cache:
  // `clear("#t1", "#t2", "...")`
  clear: function(...args) {
    var i;
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

// TemplateCache instance methods, allowing each
// template cache object to manage its own state
// and know whether or not it has been loaded
_.extend(TemplateCache.prototype, {

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
    var $template = Backbone.$(templateId);

    if (!$template.length) {
      throw new MarionetteError({
        name: 'NoTemplateError',
        message: 'Could not find template: "' + templateId + '"'
      });
    }
    return $template.html();
  },

  // Pre-compile the template before caching it. Override
  // this method if you do not need to pre-compile a template
  // (JST / RequireJS for example) or if you want to change
  // the template engine used (Handebars, etc).
  compileTemplate: function(rawTemplate, options) {
    return _.template(rawTemplate, options);
  }
});

export default TemplateCache;
