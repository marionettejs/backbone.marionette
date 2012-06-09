## Marionette.Renderer

The `Renderer` object was extracted from the `ItemView` rendering
process, in order to create a consistent and re-usable method of
rendering a template with or without data.

### Basic Usage

The basic usage of the `Renderer` is to call the `render` method.
This method returns a jQuery `promise` object, which will provide
the HTML that was rendered when it resolves.

```js
var template = "#some-template";
var data = {foo: "bar"};
var render = Backbone.Marionette.Renderer.render(template, data);

render.done(function(html){
  // do something with the HTML here
});
```

### Custom Template Selection And Rendering

By default, the renderer will take a jQuery selector object as
the first parameter, and a JSON data object as the optional
second parameter. It then uses the `TemplateCache` to load the
template by the specified selector, and renders the template with
the data provided (if any) using Underscore.js templates.

If you wish to override the way the template is loaded, see
the `TemplateCache` object. 

If you wish to override the template engine used, change the 
`renderTemplate` method to work however you want:

```js
Backbone.Marionette.Renderer.render = function(template, data){
  return $(template).tmpl(data);
});
```

This implementation will replace the default Underscore.js 
rendering with jQuery templates rendering.

### Using Pre-compiled Templates

You can easily replace the standard template rendering functionality
with a pre-compiled template, such as those provided by the JST or TPL
plugins for AMD/RequireJS. 

To do this, just override the `render` method to return your executed 
template with the data.

```js
Backbone.Marionette.Renderer.render = function(template, data){
  return template(data);
});
```

Then you can specify the pre-compiled template function as your view's
`template` attribute:

```js
var myPrecompiledTemplate = _.template("<div>some template</div>");

Backbone.Marionette.ItemView.extend({
  template: myPrecompiledTemplate
});
```


