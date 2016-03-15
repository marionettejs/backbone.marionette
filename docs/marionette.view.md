## [View the new docs](http://marionettejs.com/docs/marionette.view.html)

# Marionette.View

An `View` is a view that represents a single item. That item may be a
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is though, it
will be treated as a single item.

View extends directly from Marionette.AbstractView. Please see
[the Marionette.AbstractView documentation](marionette.abstractview.md)
for more information on available features and functionality.

Additionally, interactions with Marionette.Region
will provide features such as `onShow` callbacks, etc. Please see
[the Region documentation](./marionette.region.md) for more information.

## Documentation Index

* [View render](#itemview-render)
* [Rendering A Collection In An View](#rendering-a-collection-in-an-itemview)
* [Template-less View](#template-less-itemview)
* [Events and Callback Methods](#events-and-callback-methods)
  * ["before:render" / onBeforeRender event](#beforerender--onbeforerender-event)
  * ["render" / onRender event](#render--onrender-event)
  * ["before:destroy" / onBeforeDestroy event](#beforedestroy--onbeforedestroy-event)
  * ["destroy" / onDestroy event](#destroy--ondestroy-event)
* [View serializeData](#itemview-serializedata)
* [Organizing ui elements](#organizing-ui-elements)
* [modelEvents and collectionEvents](#modelevents-and-collectionevents)

## View render

Unlike Backbone Views, all Marionette views come with a powerful render method.
In fact, the primary differences between the views are the differences in their
render methods. It goes without saying that it is unwise to override the `render`
method of any Marionette view. Instead, you should use the [`onBeforeRender` and `onRender` callbacks](#events-and-callback-methods)
to layer in additional functionality to the rendering of your view.

The `View` defers to the `Marionette.Renderer` object to do the actual
rendering of the template.

The item view instance is passed as the third argument to the
`Renderer` object's `render` method, which is useful in custom
`Renderer` implementations.

You should provide a `template` attribute on the item view, which
will be either a jQuery selector:

```js
var MyView = Marionette.View.extend({
  template: "#some-template"
});

new MyView().render();
```

.. or a function taking a single argument: the object returned by [View.serializeData](#itemview-serializedata):

```js
var my_template_html = '<div><%= args.name %></div>'
var MyView = Marionette.View.extend({
  template : function(serialized_model) {
    var name = serialized_model.name;
    return _.template(my_template_html)({
        name : name,
        some_custom_attribute : some_custom_key
    });
  }
});

new MyView().render();
```

Note that using a template function allows passing custom arguments into the _.template function and allows for more control over how the _.template function is called.

For more information on the _.template function see the [Underscore docs](http://underscorejs.org/#template).

## Rendering A Collection In An View

While the most common way to render a Backbone.Collection is to use
a `CollectionView` or `CompositeView`, if you just need to render a
simple list that does not need a lot of interaction, it does not
always make sense to use these. A Backbone.Collection can be
rendered with a simple View, using the templates to iterate
over an `items` array.

```js
<script id="some-template" type="text/html">
  <ul>
    <% _.each(items, function(item){ %>
    <li> <%= item.someAttribute %> </li>
    <% }); %>
  </ul>
</script>
```

The important thing to note here, is the use of `items` as the
variable to iterate in the `_.each` call. This will always be the
name of the variable that contains your collection's items.

Then, from JavaScript, you can define and use an View with this
template, like this:

```js
var MyItemsView = Marionette.View.extend({
  template: "#some-template"
});

var view = new MyItemsView({
  collection: someCollection
});

// show the view via a region or calling the .render method directly
```

Rendering this view will convert the `someCollection` collection in to
the `items` array for your template to use.

For more information on when you would want to do this, and what options
you have for retrieving an individual item that was clicked or
otherwise interacted with, see the blog post on
[Getting The Model For A Clicked Element](http://lostechies.com/derickbailey/2011/10/11/backbone-js-getting-the-model-for-a-clicked-element/).

## Template-less View

An `View` can be attached to existing elements as well. The primary benefit of this is to attach behavior and events to static content that has been rendered by your server (typically for SEO purposes). To set up a template-less `View`, your `template` attribute must be `false`.

```html
<div id="my-element">
  <p>Hello World</p>
  <button class="my-button">Click Me</button>
</div>
```

```js
var MyView = Marionette.View.extend({
  el: '#my-element',

  template: false,

  ui: {
    paragraph: 'p',
    button: '.my-button'
  },

  events: {
    'click @ui.button': 'clickedButton'
  },

  clickedButton: function() {
    console.log('I clicked the button!');
  }
});

var view = new MyView();
view.render();

view.ui.paragraph.text();        // returns 'Hello World'
view.ui.button.trigger('click'); // logs 'I clicked the button!'
```

Another use case is when you want to attach a `Marionette.View` to a SVG graphic or canvas element, to provide a uniform view layer interface to non-standard DOM nodes. By not having a template this allows you to also use a view on pre-rendered DOM nodes, such as complex graphic elements.

## Events and Callback Methods

There are several events and callback methods that are called
for an View. These events and methods are triggered with the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) function, which
triggers the event and a corresponding "on{EventName}" method.

### "before:render" / onBeforeRender event

Triggered before an View is rendered.

```js
Marionette.View.extend({
  onBeforeRender: function(){
    // set up final bits just before rendering the view's `el`
  }
});
```

### "render" / onRender event

Triggered after the view has been rendered.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered.

```js
Marionette.View.extend({
  onRender: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### "before:destroy" / onBeforeDestroy event

Triggered just prior to destroying the view, when the view's `destroy()`
method has been called.

```js
Marionette.View.extend({
  onBeforeDestroy: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### "destroy" / onDestroy event

Triggered just after the view has been destroyed.

```js
Marionette.View.extend({
  onDestroy: function(){
    // custom destroying and cleanup goes here
  }
});
```

## View serializeData

This method is used to convert a View's `model` or `collection`
into a usable form for a template.

Item Views are called such because they process only a single item
at a time. Consequently, only the `model` **or** the `collection` will
be serialized. If both exist, only the `model` will be serialized.

By default, models are serialized by cloning the attributes of the model.

Collections are serialized into an object of this form:

```js
{
  items: [modelOne, modelTwo]
}
``

where each model in the collection will have its attributes cloned.

The result of `serializeData` is included in the data passed to
the view's template.

Let's take a look at some examples of how serializing data works.

```js
var myModel = new MyModel({foo: "bar"});

new MyView({
  template: "#myItemTemplate",
  model: myModel
});

MyView.render();
```

```html
<script id="myItemTemplate" type="template">
  Foo is: <%= foo %>
</script>
```

If the serialization is a collection, the results are passed in as an
`items` array:

```js
var myCollection = new MyCollection([{foo: "bar"}, {foo: "baz"}]);

new MyView({
  template: "#myCollectionTemplate",
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

If you need to serialize the View's `model` or `collection` in a custom way,
then you should override either `serializeModel` or `serializeCollection`.

On the other hand, you should not use this method to add arbitrary extra data
to your template. Instead, use [View.templateContext](./marionette.abstractview.md#viewtemplatecontext).

## Organizing UI Elements

As documented in [Marionette.AbstractView](./marionette.abstractview.md), you can specify a `ui` hash in your `view` that
maps UI elements by their jQuery selectors. This is especially useful if you access the
same UI element more than once in your view's code. Instead of
duplicating the selector, you can simply reference it by
`this.getUI('elementName')`:

You can also use the ui hash values from within events and trigger keys using the ```"@ui.elementName"```: syntax

```js
Marionette.View.extend({
  tagName: "tr",

  ui: {
    checkbox: "input[type=checkbox]"
  },

  onRender: function() {
    if (this.model.get('selected')) {
      this.getUI('checkbox').addClass('checked');
    }
  }
});
```

## modelEvents and collectionEvents

Views can bind directly to model events and collection events
in a declarative manner:

```js
Marionette.View.extend({
  modelEvents: {
    "change": "modelChanged"
  },

  collectionEvents: {
    "add": "modelAdded"
  }
});
```

For more information, see the [Marionette.AbstractView](./marionette.abstractview.md) documentation.
