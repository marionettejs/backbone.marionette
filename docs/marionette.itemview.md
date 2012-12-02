# Marionette.ItemView

An `ItemView` is a view that represents a single item. That item may be a 
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is, though, it
will be treated as a single item. 

## Documentation Index

* [ItemView render](#itemview-render)
* [Events and Callback Methods](#events-and-callback-methods)
  * ["before:render" / onBeforeRender event](#beforerender--onbeforerender-event)
  * ["render" / onRender event](#render--onrender-event)
  * ["dom:refresh" / onDomRefresh event](#render--onrenderupdate-event)
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

## Events and Callback Methods

There are several events and callback methods that are called
for an ItemView. These events and methods are triggered with the
[Marionette.triggerMethod](./marionette.functions.md) function, which
triggers the event and a corresponding "on{EventName}" method.

### "before:render" / onBeforeRender event

Triggered before an ItemView is rendered. Also triggered as
"item:before:render" / `onItemBeforeRemder`.

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

Also triggered as "item:render" / `onItemRender`.

```js
Backbone.Marionette.ItemView.extend({
  onRender: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### "dom:refresh" / onDomRefresh event

Triggered after the view has been rendered, has been shown in the DOM via a Marionette.Region, and has been
re-rendered.

This event / callback is useful for 
[DOM-dependent UI plugins](http://lostechies.com/derickbailey/2012/02/20/using-jquery-plugins-and-ui-controls-with-backbone/) such as 
[jQueryUI](http://jqueryui.com/)
 or 
[KendoUI](http://kendoui.com)
.

```js
Backbone.Marionette.ItemView.extend({
  onDomRefresh: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

For more information about integration Marionette w/ KendoUI (also applicable to jQueryUI and other UI
widget suites), see [this blog post on KendoUI + Backbone](http://www.kendoui.com/blogs/teamblog/posts/12-11-26/backbone_and_kendo_ui_a_beautiful_combination.aspx).

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
as "item:close" / `onItemClose`.

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

## Organizing ui elements

As documented in View, you can specify a `ui` hash in your view that
maps between a ui element's name and its jQuery selector, similar to
how regions are organized. This is especially useful if you access the
same ui element more than once in your view's code, so instead of
duplicating the selector you can simply reference it by
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
