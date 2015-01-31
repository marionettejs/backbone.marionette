## [View the new docs](http://marionettejs.com/docs/marionette.itemview.html)

# Marionette.ItemView

An `ItemView` is a view that represents a single item. That item may be a
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is though, it
will be treated as a single item.

ItemView extends directly from Marionette.View. Please see
[the Marionette.View documentation](./marionette.view.md)
for more information on available features and functionality.

Additionally, interactions with Marionette.Region
will provide features such as `onShow` callbacks, etc. Please see
[the Region documentation](./marionette.region.md) for more information.

## Documentation Index

* [ItemView render](#itemview-render)
* [Rendering A Collection In An ItemView](#rendering-a-collection-in-an-itemview)
* [Template-less ItemView](#template-less-itemview)
* [Events and Callback Methods](#events-and-callback-methods)
  * ["before:render" / onBeforeRender event](#beforerender--onbeforerender-event)
  * ["render" / onRender event](#render--onrender-event)
  * ["before:destroy" / onBeforeDestroy event](#beforedestroy--onbeforedestroy-event)
  * ["destroy" / onDestroy event](#destroy--ondestroy-event)
* [ItemView serializeData](#itemview-serializedata)
* [Organizing ui elements](#organizing-ui-elements)
* [modelEvents and collectionEvents](#modelevents-and-collectionevents)

## ItemView render

Unlike Backbone Views, all Marionette views come with a powerful render method.
In fact, the primary differences between the views are the differences in their
render methods. It goes without saying that it is unwise to override the `render`
method of any Marionette view. Instead, you should use the [`onBeforeRender` and `onRender` callbacks](#events-and-callback-methods)
to layer in additional functionality to the rendering of your view.

The `ItemView` defers to the `Marionette.Renderer` object to do the actual
rendering of the template.

The item view instance is passed as the third argument to the
`Renderer` object's `render` method, which is useful in custom
`Renderer` implementations.

You should provide a `template` attribute on the item view, which
will be either a jQuery selector:

```js
var MyView = Backbone.Marionette.ItemView.extend({
  template: "#some-template"
});

new MyView().render();
```

.. or a function taking a single argument: the object returned by [ItemView.serializeData](#itemview-serializedata):

```js
var my_template_html = '<div><%= args.name %></div>'
var MyView = Backbone.Marionette.ItemView.extend({
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

## Rendering A Collection In An ItemView

While the most common way to render a Backbone.Collection is to use
a `CollectionView` or `CompositeView`, if you just need to render a
simple list that does not need a lot of interaction, it does not
always make sense to use these. A Backbone.Collection can be
rendered with a simple ItemView, using the templates to iterate
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

Then, from JavaScript, you can define and use an ItemView with this
template, like this:

```js
var MyItemsView = Marionette.ItemView.extend({
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

## Template-less ItemView

An `ItemView` can be attached to existing elements as well. The primary benefit of this is to attach behavior and events to static content that has been rendered by your server (typically for SEO purposes). To set up a template-less `ItemView`, your `template` attribute must be `false`.

```html
<div id="my-element">
  <p>Hello World</p>
  <button class="my-button">Click Me</button>
</div>
```

```js
var MyView = Marionette.ItemView.extend({
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

Another use case is when you want to attach a `Marionette.ItemView` to a SVG graphic or canvas element, to provide a uniform view layer interface to non-standard DOM nodes. By not having a template this allows you to also use a view on pre-rendered DOM nodes, such as complex graphic elements.

## Events and Callback Methods

There are several events and callback methods that are called
for an ItemView. These events and methods are triggered with the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) function, which
triggers the event and a corresponding "on{EventName}" method.

### "before:render" / onBeforeRender event

Triggered before an ItemView is rendered.

```js
Backbone.Marionette.ItemView.extend({
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
Backbone.Marionette.ItemView.extend({
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
Backbone.Marionette.ItemView.extend({
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
Backbone.Marionette.ItemView.extend({
  onDestroy: function(){
    // custom destroying and cleanup goes here
  }
});
```

## ItemView serializeData

Item views will serialize a model or collection, by default, by
calling `.toJSON` on either the model or collection. If both a model
and collection are attached to an item view, the model will be used
as the data source. The results of the data serialization will be passed to the template
that is rendered.

If the serialization is a model, the results are passed in directly:

```js
var myModel = new MyModel({foo: "bar"});

new MyItemView({
  template: "#myItemTemplate",
  model: myModel
});

MyItemView.render();
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

new MyItemView({
  template: "#myCollectionTemplate",
  collection: myCollection
});

MyItemView.render();
```

```html
<script id="myCollectionTemplate" type="template">
  <% _.each(items, function(item){ %>
    Foo is: <%= foo %>
  <% }); %>
</script>
```

If you need custom serialization for your data, you can provide a
`serializeData` method on your view. It must return a valid JSON
object, as if you had called `.toJSON` on a model or collection.

```js
Backbone.Marionette.ItemView.extend({
  serializeData: function(){
    return {
      "some attribute": "some value"
    }
  }
});
```

## Organizing UI Elements

As documented in [Marionette.View](./marionette.view.md#viewbindentityevents), you can specify a `ui` hash in your `view` that
maps UI elements by their jQuery selectors. This is especially useful if you access the
same UI element more than once in your view's code. Instead of
duplicating the selector, you can simply reference it by
`this.ui.elementName`:

You can also use the ui hash values from within events and trigger keys using the ```"@ui.elementName"```: syntax

```js
Backbone.Marionette.ItemView.extend({
  tagName: "tr",

  ui: {
    checkbox: "input[type=checkbox]"
  },

  onRender: function() {
    if (this.model.get('selected')) {
      this.ui.checkbox.addClass('checked');
    }
  }
});
```

## modelEvents and collectionEvents

ItemViews can bind directly to model events and collection events
in a declarative manner:

```js
Marionette.ItemView.extend({
  modelEvents: {
    "change": "modelChanged"
  },

  collectionEvents: {
    "add": "modelAdded"
  }
});
```

For more information, see the [Marionette.View](./marionette.view.md#viewmodelevents-and-viewcollectionevents) documentation.
