# Marionette.ItemView

An `ItemView` is a view that represents a single item. That item may be a 
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is though, it
will be treated as a single item. 

## Documentation Index

* [ItemView render](#itemview-render)
* [Rendering A Collection In An ItemView](#rendering-a-collection-in-an-itemview)
* [Events and Callback Methods](#events-and-callback-methods)
  * ["before:render" / onBeforeRender event](#beforerender--onbeforerender-event)
  * ["render" / onRender event](#render--onrender-event)
  * ["before:close" / onBeforeClose event](#beforeclose--onbeforeclose-event)
  * ["close" / onClose event](#close--onclose-event)
* [ItemView serializeData](#itemview-serializedata)
* [Organizing ui elements](#organizing-ui-elements)
* [modelEvents and collectionEvents](#modelevents-and-collectionevents)

## ItemView render

An item view has a `render` method built in to it, and uses the
`Renderer` object to do the actual rendering.

You should provide a `template` attribute on the item view, which
will be either a jQuery selector:

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: "#some-template"
});

new MyView().render();
```

.. or a function taking a single argument: the object returned by [ItemView.serializeData](#itemview-serializedata):

```js
my_template_html = '<div><%= args.name %></div>'
MyView = Backbone.Marionette.ItemView.extend({
  template : function(serialized_model) {
    var name = serialized_model.name;
    return _.template(my_template_html, {
        name : name,
        some_custom_attribute : some_custom_key
    }, {variable: 'args'});
  }
});

new MyView().render();
```

Note that using a template function allows passing custom arguments into the _.template function,
including a third "settings" argument, as used in the example above.

According to the [Underscore docs](http://underscorejs.org/#template), using the "variable" setting
"can significantly improve the speed at which a template is able to render." Using this setting
also requires you to read data arguments from an object, as demonstrated in the example above.

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
    <%= _.each(items, function(item){ %>
    <li> item.someAttribute </li>
    <% } %>
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

## Events and Callback Methods

There are several events and callback methods that are called
for an ItemView. These events and methods are triggered with the
[Marionette.triggerMethod](./marionette.functions.md) function, which
triggers the event and a corresponding "on{EventName}" method.

### "before:render" / onBeforeRender event

Triggered before an ItemView is rendered. Also triggered as
"item:before:render" / `onItemBeforeRender`.

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

Also triggered as "item:rendered" / `onItemRender`.

```js
Backbone.Marionette.ItemView.extend({
  onRender: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### "before:close" / onBeforeClose event

Triggered just prior to closing the view, when the view's `close()`
method has been called. Also triggered as "item:before:close" /
`onItemBeforeClose`.

```js
Backbone.Marionette.ItemView.extend({
  onBeforeClose: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### "close" / onClose event

Triggered just after the view has been closed. Also triggered
as "item:closed" / `onItemClose`.

```js
Backbone.Marionette.ItemView.extend({
  onClose: function(){
    // custom closing and cleanup goes here
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

As documented in [Marionette.View](./marionette.view.md), you can specify a `ui` hash in your `view` that
maps UI elements by their jQuery selectors. This is especially useful if you access the
same UI element more than once in your view's code. Instead of
duplicating the selector, you can simply reference it by
`this.ui.elementName`:

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

For more information, see the [Marionette.View](./marionette.view.md) documentation.
