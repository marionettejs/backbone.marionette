# Marionette.ItemView

An `ItemView` is a view that represents a single item. That item may be a 
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is, though, it
will be treated as a single item. 

## ItemView render

An item view has a `render` method built in to it, and uses the
`Renderer` object to do the actual rendering.

The `render` function of the item view will return a jQuery 
`promise` object.

You should provide a `template` attribute on the item view, which
will be either a jQuery selector:

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: "#some-template"
});

new MyView().render().done(function(){
  // the view is done rendering. do stuff here
});
```

## Callback Methods

There are several callback methods that are called
for an ItemView. These methods are intended to be handled within
the view definition, directly.

### beforeRender callback

Before an ItemView is rendered a `beforeRender` method will be called
on the view.

```js
Backbone.Marionette.ItemView.extend({
  beforeRender: function(){
    // set up final bits just before rendering the view's `el`
  }
});
```

### onRender callback

After the view has been rendered, a `onRender` method will be called.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered:

```js
Backbone.Marionette.ItemView.extend({
  onRender: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### beforeClose callback

A `beforeClose` method will be called on the view, just prior
to closing it:

```js
Backbone.Marionette.ItemView.extend({
  beforeClose: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### onClose callback

An `onClose` method will be called on the view, after closing it.

```js
Backbone.Marionette.ItemView.extend({
  onClose: function(){
    // custom closing and cleanup goes here
  }
});
```

## View Events

There are several events that are triggers by an `ItemView`, which
allow code outside of a view to respond to what's happening with
the view.

## "item:before:render" event

An "item:before:render" event will be triggered just before the
view is rendered

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:before:render", function(){
  alert("the view is about to be rendered");
});
```

### "render" / "item:rendered" event

An "item:rendered" event will be triggered just after the view 
has been rendered.

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:rendered", function(){
  alert("the view was rendered!");
});

myView.on("render", function(){
  alert("the view was rendered!");
});
```

### "item:before:close" event

An "item:before:close" event will be triggered just prior to the
view closing itself. This event fires when the `close` method of
the view is called.

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:before:close", function(){
  alert("the view is about to be closed");
});

myView.close();
```

### "item:closed" event

An "item:closed" event will be triggered just after the
view closes. This event fires when the `close` method of
the view is called.

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:closed", function(){
  alert("the view is closed");
});

myView.close();
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

## Binding To ItemView Events

ItemView extends `Marionette.BindTo`. It is recommended that you use
the `bindTo` method to bind model and collection events. 

```js
MyView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    this.bindTo(this.model, "change:foo", this.modelChanged);
    this.bindTo(this.collection, "add", this.modelAdded);
  },

  modelChanged: function(model, value){
  },

  modelAdded: function(model){
  }
});
```

The context (`this`) will automatically be set to the view. You can
optionally set the context by passing in the context object as the
4th parameter of `bindTo`.

## ItemView close

ItemView implements a `close` method, which is called by the region
managers automatically. As part of the implementation, the following
are performed:

* unbind all `bindTo` events
* unbind all custom view events
* unbind all DOM events
* remove `this.el` from the DOM
* call an `onClose` event on the view, if one is provided

By providing an `onClose` event in your view definition, you can
run custom code for your view that is fired after your view has been
closed and cleaned up. This lets you handle any additional clean up
code without having to override the `close` method.

```js
Backbone.Marionette.ItemView.extend({
  onClose: function(){
    // custom cleanup or closing code, here
  }
});
```


