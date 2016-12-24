# Template Rendering

The Marionette View's primary purpose is to render your model and collection
data into the template you assign it. The basic syntax for setting a template
is similar to the syntax for
[Backbone.js View `template`](http://backbonejs.org/#View-template):

```javascript
var Mn = require('backbone.marionette');
var _ = require('underscore');

var MyView = Mn.View.extend({
  tagName: 'h1',
  template: _.template('Contents')
});

var myView = new MyView();
myView.render();
```

This will cause the contents of the `template` attribute to be rendered inside
a `<h1>` tag.

[Live example](https://jsfiddle.net/marionettejs/h762zjua/)

## Documentation Index

* [Rendering a Template](#rendering-a-template)
  * [jQuery Selector](#jquery-selector)
  * [Template Function](#template-function)
  * [The `getTemplate` function](#the-gettemplate-function)
* [Models and Collections](#models-and-collections)
  * [Rendering a Model](#rendering-a-model)
  * [Rendering a Collection](#rendering-a-collection)
  * [User Interaction with Collections](#user-interaction-with-collections)
  * [Model/Collection Rendering Rules](#modelcollection-rendering-rules)
* [Template Context](#template-context)
  * [Context Object](#context-object)
  * [Binding of `this`](#binding-of-this)
* [Serializing Model and Collection Data](#serializing-model-and-collection-data)

## Rendering a Template

### jQuery Selector

If your index page contains a template element formatted for Underscore, you can
simply pass in the jQuery selector for it to `template` and Marionette will look
it up:

```javascript
var Mn = require('backbone.marionette');

export.MyView = Mn.View.extend({
  template: '#template-layout'
});
```

```html
<script id="template-layout" type="x-template/underscore">
<h1>Hello, world</h1>
</script>
```

[Live example](https://jsfiddle.net/marionettejs/z4sd7ssh/)

Marionette compiles the template above using `_.template` and renders it for
you when `MyView` gets rendered.

### Template Function

A more common way of setting a template is to assign a function to `template`
that renders its argument. This will commonly be the `_.template` function:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

export.MyView = Mn.View.extend({
  template: _.template('<h1>Hello, world</h1>')
});
```

This doesn't have to be an underscore template, you can pass your own rendering
function:

```javascript
var Mn = require('backbone.marionette');
var Handlebars = require('handlebars');

var MyView = Mn.View.extend({
  template: function(data) {
    return Handlebars.compile('<h1>Hello, {{ name }}')(data);
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/ep0e4qkt/)

Using a custom function can give you a lot of control over the output of your
view after its context is calculated. If this logic is common, you may be best
[overriding your renderer](./marionette.renderer.md) to change your default
template renderer.

### The `getTemplate` function

The `getTemplate` function is used to choose the template to render after the
view has been instantiated. You can use this to change the template based on
some simple logic such as the value of a specific attribute in the view's model.
The returned value can be either a jQuery selector or a compiled template
function that will be called with the view's data and context.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  getTemplate: function(){
    if (this.model.get('is_active')){
      return '#template-when-active';
    } else {
      return '#template-when-inactive';
    }
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/9k5v4p92/)

This differs from setting `template` as this method must be executed and
calculated when the view is rendered. If your template is always the same, use
the `template` attribute directly.

## Models and Collections

### Rendering a Model

Marionette will happily render a template without a model. This won't give us a
particularly interesting result. As with Backbone, we can attach a model to our
views and render the data they represent:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyModel = Bb.Model.extend({
  defaults: {
    name: 'world'
  }
});

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- name %></h1>')
});

var myView = new MyView({model: new MyModel()});
```

[Live example](https://jsfiddle.net/marionettejs/warfa6rL/)

Now our template has full access to the attributes on the model passed into the
view.

### Rendering a Collection

The `Marionette.View` also provides a simple tool for rendering collections into
a template. Simply pass in the collection as `collection` and Marionette will
provide an `items` attribute to render:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyCollection = Bb.Collection.extend({
});

var MyView = Mn.View.extend({
  template: '#hello-template'
});

var collection = new MyCollection([
  {name: 'Steve'}, {name: 'Helen'}
]);

var myView = new MyView({collection: collection});
```

For clarity, we've moved the template into this script tag:

```html
<script id="hello-template" type="x-template/underscore">
<ul>
  <% _.each(items, function(item) { %>
  <li><%- item.name %></li>
  <% }) %>
</ul>
</script>
```

[Live example](https://jsfiddle.net/marionettejs/qyodkakf/)

As you can see, `items` is provided to the template representing each record in
the collection.

### User Interaction with Collections

While possible, reacting to user interaction with individual items in your
collection is tricky with just a `View`. If you want to act on individual items,
it's recommended that you use [`CollectionView`](./marionette.collectionview.md)
and handle the behavior at the individual item level.

### Model/Collection Rendering Rules

Marionette uses a simple method to determine whether to make a model or
collection available to the template:

1. If `view.model` is set, the attributes from `model`
2. If `view.model` is not set, but `view.collection` is, set `items` to the
  individual items in the collection
3. If neither are set, an empty object is used

The result of this is mixed into the
[`templateContext` object](#template-context) and made available to your
template. Using this means you can setup a wrapper `View` that can act on
`collectionEvents` but will render its `model` attribute - if your `model` has
an `items` attribute then that will always be used. If your view needs to serialize
by different rules override [`serializeData()`](#serializing-model-and-collection-data).

## Template Context

The `Marionette.View` provides a `templateContext` attribute that is used to add
extra information to your templates. This can be either an object, or a function
returning an object. The keys on the returned object will be mixed into the
model or collection keys and made available to the template.

### Context Object

Using the context object, simply attach an object to `templateContext` as so:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey %></h1>'),

  templateContext: {
    contextKey: 'world'
  }
});

var myView = new MyView();
```

[Live example](https://jsfiddle.net/marionettejs/rw09r7e6/)

The `myView` instance will be rendered without errors even though we have no
model or collection - `contextKey` is provided by `templateContext`.

The `templateContext` attribute can also
[take a function](./basics.md#functions-returning-values).

### Context Function

The `templateContext` object can also be a [function returning an object](basics.md#functions-returning-values).
This is useful when you want to access [information from the surrounding view](#binding-of-this)
(e.g. model methods).

To use a `templateContext`, simply assign a function:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey %></h1>'),

  templateContext: function() {
    return {
      contextKey: this.getOption('contextKey')
    }
  }
});

var myView = new MyView({contextKey: 'world'});
```

[Live example](https://jsfiddle.net/marionettejs/4qxk99ya/)

Here, we've passed an option that can be accessed from the `templateContext`
function using `getOption()`. More information on `getOption` can be found in
the [documentation for `Marionette.Object`](./marionette.object.md#getoption).

### Binding of `this`

When using functions in the `templateContext` it's important to know that `this`
is _bound to the result of [`serializeData()`](#serializing-model-and-collection-data) and **not the view**_. An
illustrative example:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey() %></h1>'),

  templateContext: {
    contextKey: function() {
      return this.getOption('contextKey');  // ERROR
    }
  }
});

var myView = new MyView({contextKey: 'world'});
```

The above code will fail because the context object in the template
_cannot see_ the view's `getOption`. This would also apply to functions
returned by a `templateContext` function, even though the function itself is
bound to the view context. The following example should provide some clarity:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey() %></h1>'),

  templateContext: function() {
    return {
      contextKeyVar: this.getOption('contextKey'),  // OK - "this" refers to view
      contextKeyFunction: function() {
        return this.getOption('contextKey');  // ERROR - "this" refers to data
      }
    };

  }
});

var myView = new MyView({contextKey: 'world'});
```

[Live example](https://jsfiddle.net/scott_walton/g941km9u/1/)

## Serializing Model and Collection Data

The `serializeData` method is used to convert a View's `model` or `collection`
into a usable form for a template. It follows the [Model/Collection Rendering Rules](#modelcollection-rendering-rules)
to determine how to serialize the data.

The result of `serializeData` is included in the data passed to
the view's template.

Let's take a look at some examples of how serializing data works.

```javascript
var myModel = new MyModel({foo: 'bar'});

new MyView({
  template: '#myItemTemplate',
  model: myModel
});

MyView.render();
```

```html
<script id="myItemTemplate" type="template">
  Foo is: <%= foo %>
</script>
```

[Live example](https://jsfiddle.net/marionettejs/brp0t7pq/)

If the serialization is a collection, the results are passed in as an
`items` array:

```javascript
var myCollection = new MyCollection([{foo: 'bar'}, {foo: 'baz'}]);

new MyView({
  template: '#myCollectionTemplate',
  collection: myCollection
});

MyView.render();
```

```html
<script id="myCollectionTemplate" type="template">
  <% _.each(items, function(item){ %>
    Foo is: <%= foo %>
  <% }); %>
</script>
```

[Live example](https://jsfiddle.net/marionettejs/yv3hrvkf/)

If you need to serialize the View's `model` or `collection` in a custom way,
then you should override either `serializeModel` or `serializeCollection`.

On the other hand, you should not use this method to add arbitrary extra data
to your template. Instead, use [View.templateContext](./template.md#templatecontext).
