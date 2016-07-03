**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Marionette.Renderer

The `Renderer` object was extracted from the `View` rendering
process, in order to create a consistent and re-usable method of
rendering a template with or without data.

## Documentation Index

* [Basic Usage](#basic-usage)
* [Pre-compiled Templates](#pre-compiled-templates)
* [Custom Template Selection And Rendering](#custom-template-selection-and-rendering)
* [Using Pre-compiled Templates](#using-pre-compiled-templates)
* [TemplateContext](#templatecontext)
  * [Basic Example](#basic-example)
  * [Accessing Data Within The Template Context](#accessing-data-within-the-template-context)
  * [Object Or Function As `templateContext`](#object-or-function-as-templatecontext)
* [Change Which Template Is Rendered For A View](#change-which-template-is-rendered-for-a-view)

## Basic Usage

The basic usage of the `Renderer` is to call the `render` method.
This method returns a string containing the result of applying the
template using the `data` object as the context.

```js
var Mn = require('backbone.marionette');
var template = '#some-template';
var data = {foo: 'bar'};
var html = Mn.Renderer.render(template, data);

// do something with the HTML here
```

If you pass a `template` that coerces to a falsey value, the
`render` method will throw an exception stating that there was no
template provided.

## Pre-compiled Templates

If the `template` parameter of the `render` function is itself a function,
the renderer treats this as a pre-compiled template and does not try to
compile it again. This allows any view that supports a `template` parameter
to specify a pre-compiled template function as the `template` setting.

```js
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

By default, the renderer will take a jQuery selector object as
the first parameter, and a JSON data object as the optional
second parameter. It then uses the `TemplateCache` to load the
template by the specified selector, and renders the template with
the data provided (if any) using Underscore.js templates.

If you wish to override the way the template is loaded, see
the `TemplateCache` object.

If you wish to override the template engine used, change the
`render` method to work however you want:

```js
var Mn = require('backbone.marionette');

Mn.Renderer.render = function(template, data){
  return $(template).tmpl(data);
};
```

This implementation will replace the default Underscore.js
rendering with jQuery templates rendering.

If you override the `render` method and wish to use the
`TemplateCache` mechanism, remember to include the code necessary to
fetch the template from the cache in your `render` method:

```js
var Mn = require('backbone.marionette');

Mn.Renderer.render = function(template, data){
  var template = Mn.TemplateCache.get(template);
  // Do something with the template here
};
```

## Using Pre-compiled Templates

You can easily replace the standard template rendering functionality
with a pre-compiled template, such as those provided by the JST or TPL
plugins for AMD/RequireJS.

To do this, just override the `render` method to return your executed
template with the data.

```js
var Mn = require('backbone.marionette');

Mn.Renderer.render = function(template, data){
  return template(data);
};
```

Then you can specify the pre-compiled template function as your view's
`template` attribute:

```js
var Mn = require('backbone.marionette');
var myPrecompiledTemplate = _.template('<div>some template</div>');

Mn.View.extend({
  template: myPrecompiledTemplate
});
```

## TemplateContext

There are times when a view's template needs to have some logic in it and the view engine
itself will not provide an easy way to accomplish this. For example, Underscore templates
do not provide a context method mechanism while Handlebars templates do.

A `templateContext` attribute can be applied to any View object that renders a template.
When this attribute is present its contents will be mixed in to the data object that comes back
from the `serializeData` method. This will allow you to create context methods that can be called
from within your templates. This is also a good place to add data not returned from `serializeData`,
such as calculated values.

### Basic Example

```html
<script id="my-template" type="text/html">
  I <%= percent %>% think that <%= showMessage() %>
</script>
```

```js
var Mn = require('backbone.marionette');
var Bb = require('backbone');

var MyView = Mn.View.extend({
  template: '#my-template',

  templateContext: function () {
    return {
      showMessage: function(){
        return this.name + ' is the coolest!';
      },

      percent: this.model.get('decimal') * 100
    };
  }
});

var model = new Bb.Model({
  name: 'Marionette',
  decimal: 1
});
var view = new MyView({
  model: model
});

view.render(); //=> "I 100% think that Marionette is the coolest!";
```

The `templateContext` can also be provided as a constructor parameter for any Marionette
view class that supports the context methods.

```js
var Mn = require('backbone.marionette');
var MyView = Mn.View.extend({
  // ...
});

new MyView({
  templateContext: {
    doFoo: function(){ /* ... */ }
  }
});
```

### Accessing Data Within The Template Context

In order to access data from within the context methods, you need to prefix the data you
need with `this`. Doing that will give you all of the methods and attributes of the serialized
data object, including the other context methods.

```js
templateContext: {
  something: function(){
    return 'Do stuff with ' + this.name + ' because it\'s awesome.';
  }
}
```

### Object Or Function As `templateContext`

You can specify an object literal (as shown above), a reference to an object literal, or
a function as the `templateContext`.

If you specify a function, the function will be invoked with the current view instance
as the context of the function. The function must return an object that can be mixed in to
the data for the view.

```js
var Mn = require('backbone.marionette');

Mn.View.extend({
  templateContext: function(){
    return {
      foo: function(){ /* ... */ }
    }
  }
});
```

## Change Which Template Is Rendered For A View

There may be some cases where you need to change the template that is used for a view,
 based on some simple logic such as the value of a specific attribute in the view's model.
 To do this, you can provide a `getTemplate` function on your views and use this to return
 the template that you need.

```js
var Mn = require('backbone.marionette');
var MyView = Mn.View.extend({
  getTemplate: function(){
    if (this.model.get('foo')){
      return '#some-template';
    } else {
      return '#a-different-template';
    }
  }
});
```

This applies to all view classes.
