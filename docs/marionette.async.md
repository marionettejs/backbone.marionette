# Marionette.Async

Add async / deferred rendering and template loading to Backbone.Marionette

## Download

To add support for asynchronously loading templates and rendering views, 
you need to download and include one of the following `marionette.async`
builds in your project:

Development: [backbone.marionette.async.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.async.js)

Production: [backbone.marionette.async.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.async.min.js)

## AMD/RequireJS Support

Note that there is no AMD/RequireJS build for Marionette.Async. 
AMD/RequireJS are asynchronous by definition: **A**synchronous 
**M**odule **D**efinition. Providing an AMD/RequireJS version of 
Marionette.Async would be redundant.

## Basic Usage

To use Marionette.Async, you must include one of the above downloads in
your project, after Marionette has been included:

```html
<script src="/js/underscore.js"></script>
<script src="/js/jquery.js"></script>
<script src="/js/json2.js"></script>
<script src="/js/backbone.js"></script>
<script src="/js/backbone.marionette.js"></script>
<script src="/js/backbone.marionette.async.js"></script>
```

Once that has been included, you must call the `init` method on the 
`Async` module. This will re-write all of the correct functions on the
Marionette objects, to support asynchronous template loading and
rendering.

```js
// configure Marionette to render asynchronously
Backbone.Marionette.Async.init();
```

## Marionette.Async.Region

The region manager `show` method takes advantage of jQuery's
deferred cababilities, allowing for some very advanced techniques
to be used for rendering views.

To use a deferred, a view that is shown via a region manager
must return a jQuery deferred object from the `render` method:

```js
DeferredView = Backbone.View.extend({
  render: function(){
    var that = this;
    var data = this.serializeData();
    var dfd = jQuery.Deferred();

    this.getTemplate(function(template){
      var html = that.renderTemplate(template, data);

      that.$el.html(html);

      if (that.onRender){
        that.onRender();
      }

      dfd.resolve();
    });

    return dfd.promise();
  }
});

var view = new DeferredView();
MyApp.mainRegion.show(view);
```

The region manager will wait until the deferred object is resolved
before it attached the view's `el` to the DOM and displays it.

## Marionette.Async.ItemView

The `render` method returns a jQuery deferred object, allowing
you to know when the rendering completes. 

## Marionette.Async.CollectionView

The `render` method returns a jQuery deferred object, allowing
you to know when the rendering completes. This deferred object
is resolved after all of the child views have been rendered.

## Marionette.Async.CompositeView

A composite view returns a jQuery deferred object from the
`render` method. This allows you to know when the rendering for
the entire composite structure has been completed.

```js
MyComp = Backbone.Marionette.CompositeView.extend({...});

myComp = new MyComp().render().done(function(){
  // the entire composite is now rendered. do stuff here
});
```

## Marionette.Async.TemplateCache

The default template retrieval is to select the template contents
from the DOM using jQuery. If you wish to change the way this
works, you can override the `loadTemplate` method on the
`TemplateCache` object.

```js
Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId, callback){
  // load your template here, returning it or a deferred
  // object that resolves with the template as the only param
  var myTemplate = ...;

  // send the template back
  callback(myTemplate);
}
```

For example, if you want to load templates asychronously from the
server, instead of from the DOM, you could replace 
`loadTemplate` function.

If a "template.html" file exists on the server, with this in it:

```html
<script id="my-template" type="text/template">
  <div>some template stuff</div>
</script>
```

Then the `loadTemplate` implementation may look like this:

```js
Backbone.Marionette.TemplateCache.loadTemplate = function(templateId, callback){
  var that = this;
  var url = templateId + ".html";

  $.get(url, function(templateHtml){
    var template = $(tmplateHtml).find(templateId);
    callback(template);
  });
}
```

This will use jQuery to asynchronously retrieve the template from
the server. When the `get` completes, the callback function will
select the template from the resulting HTML and then call the
`callback` function to send it in to the template cache and allow
it to be used for rendering.

