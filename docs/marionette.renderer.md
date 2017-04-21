# Marionette Renderer

The renderer that Marionette uses to render data into a template can now be set
per `Marionette.View` class via the [`Marionette.View.setRenderer` function](#setting-a-renderer).
This feature supersedes modifying the external [`Marionette.Renderer`](#deprecated-marionette-renderer).
The default renderer is still the `Marionette.Renderer.render` method so that
documentation still applies.

## Documentation Index

* [Deprecated Marionette.Renderer](#deprecated-marionette-renderer)
* [Setting a Renderer](#setting-a-renderer)
* [Basic Usage](#basic-usage)
* [Pre-compiled Templates](#pre-compiled-templates)
* [Custom Template Selection And Rendering](#custom-template-selection-and-rendering)
* [Using Pre-compiled Templates](#using-pre-compiled-templates)

## Deprecated Marionette.Renderer

Customizing the `Renderer` object has been deprecated in favor of the [`setRenderer` method](#setting-a-renderer).

The `Renderer` object was extracted from the `View` rendering process, in order
to create a consistent and re-usable method of rendering a template with or
without data.

## Setting a Renderer

You can set the renderer for a View Class by using the class method `setRenderer`.
The renderer accepts two arguments. The first is the template passed to the view,
and the second argument is the data to be rendered into the template. The renderer
should return a string containing the result of applying the data to the template.

```javascript
Marionette.View.setRenderer(function(template, data) {
  return _.template(template)(data);
});

var myView = new Marionette.View({
  template: 'Hello <%- name %>!',
  model: new Backbone.Model({ name: 'World' })
});

myView.render();

myView.el === '<div>Hello World!</div>';
```

The renderer can also be customized separately on any extended View.

```javascript
var MyHBSView = Marionette.View.extend();

MyHBSView.setRenderer(function(template, data) {
  return Handlebars.compile(template)(data);
});

var myHBSView = new MyHBSView({
  template: 'Hello {{ name }}!',
  model: new Backbone.Model({ name: 'World' })
});

myHBSView.render();

myHBSView.el === '<div>Hello World!</div>';
```

## Basic Usage

The basic usage of the `Renderer` is to call the `render` method. This method
returns a string containing the result of applying the Underscore template
using the `data` object as the context.

```javascript
var Mn = require('backbone.marionette');
var template = '#some-template';
var data = {foo: 'bar'};
var html = Mn.Renderer.render(template, data);

// do something with the HTML here
```

If you pass a `template` that coerces to a falsy value the `render`
method will throw an exception stating that there was no template provided.

## Pre-compiled Templates

If the `template` parameter of the `render` function is itself a function,
the renderer treats this as a pre-compiled template and does not try to
compile it again. This allows any view that supports a `template` parameter
to specify a pre-compiled template function as the `template` setting.

```javascript
var Mn = require('backbone.marionette');
var myTemplate = _.template('<div>foo</div>');

Mn.View.extend({
  template: myTemplate
});
```

The template function does not have to be any specific template engine. It
only needs to be a function that returns valid HTML as a string from the
`data` parameter passed to the function.

## Custom Template Selection And Rendering

By default, the renderer will take either a [precompiled template](#pre-compiled-templates)
or a jQuery selector object as the first parameter, and a JSON data object as the optional
second parameter, and View object or CompositeView object as the optional third
parameter. If the first parameter is not precompiled it then uses the `TemplateCache`
to load the template by the specified selector, and renders the template with the
data provided (if any) using underscore templates.

If you wish to override the way the template is loaded, see the `TemplateCache`
object.

If you wish to override the template engine used, change the `render` method to
work however you want:

```javascript
var Mn = require('backbone.marionette');

Mn.Renderer.render = function(template, data, view){
  template += view.getState();
  return $(template).tmpl(data);
};
```

This implementation will replace the default underscore rendering with jQuery
templates rendering.

If you override the `render` method and wish to use the `TemplateCache`
mechanism, remember to include the code necessary to fetch the template from the
cache in your `render` method:

```javascript
var Mn = require('backbone.marionette');

Mn.Renderer.render = function(template, data){
  var template = Mn.TemplateCache.get(template);
  // Do something with the template here
};
```

See the [Documentation for `TemplateCache`](./marionette.templatecache.md) for
more detailed information.

For more information on templates in general, see the
[Documentation for templates](./template.md).
