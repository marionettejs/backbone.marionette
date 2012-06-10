# Marionette.TemplateCache

The `TemplateCache` provides a cache for retrieving templates
from script blocks in your HTML. This will improve
the speed of subsequent calls to get a template.

## Basic Usage

To use the `TemplateCache`, call the `get` method on TemplateCache directly.
Internally, instances of the TemplateCache type will be created and stored
but you do not have to manually create these instances yourself.

```js
var promise = Backbone.Marionette.TemplateCache.get("#my-template");
promise.done(function(template){
 // use the template here
});
```

Making multiple calls to get the same template will retrieve the
template from the cache on subsequence calls.

## Override Template Retrieval

The default template retrieval is to select the template contents
from the DOM using jQuery. If you wish to change the way this
works, you can override the `loadTemplate` method on the
`TemplateCache` object.

```js
Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
  // load your template here, returning a compiled template or function
  // that returns the rendered HTML
  var myTemplate = compileMyTemplate("some template");

  // send the template back
  return myTemplate;
}
```

## Clear Items From cache

You can clear one or more, or all items from the cache using the
`clear` method. Clearing a template from the cache will force it
to re-load from the DOM (or from the overriden `loadTemplate`
function) the next time it is retrieved.

If you do not specify any parameters, all items will be cleared
from the cache:

```js
Backbone.Marionette.TemplateCache.get("#my-template");
Backbone.Marionette.TemplateCache.get("#this-template");
Backbone.Marionette.TemplateCache.get("#that-template");

// clear all templates from the cache
Backbone.Marionette.TemplateCache.clear()
```

If you specify one or more parameters, these parameters are assumed
to be the `templateId` used for loading / caching:

```js
Backbone.Marionette.TemplateCache.get("#my-template");
Backbone.Marionette.TemplateCache.get("#this-template");
Backbone.Marionette.TemplateCache.get("#that-template");

// clear 2 of 3 templates from the cache
Backbone.Marionette.TemplateCache.clear("#my-template", "#this-template")
```


