# Marionette.View

Marionette has a base `Marionette.View` type that other views extend from.
This base view provides some common and core functionality for
other views to take advantage of.

**Note:** The `Marionette.View` type is not intended to be 
used directly. It exists as a base view for other view types
to be extended from, and to provide a common location for
behaviors that are shared across all views.

## Binding To View Events

Marionette.View extends `Marionette.BindTo`. It is recommended that you use
the `bindTo` method to bind model, collection, or other events from Backbone
and Marionette objects.

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

View implements a `close` method, which is called by the region
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

## View.triggers

Views can define a set of `triggers` as a hash, which will 
convert a DOM event in to a `view.trigger` event.

The left side of the hash is a standard Backbone.View DOM
event configuration, while the right side of the hash is the
view event that you want to trigger from the view.

```js
MyView = Backbone.Marionette.ItemView.extend({
  // ...

  triggers: {
    "click .do-something": "something:do:it"
  }
});

view = new MyView();
view.render();

view.on("something:do:it", function(){
  alert("I DID IT!");
});

// "click" the 'do-something' DOM element to 
// demonstrate the DOM event conversion
view.$(".do-something").trigger("click");
```

The result of this is an alert box that says, "I DID IT!"

You can also specify the `triggers` as a function that 
returns a hash of trigger configurations

```js
Backbone.Marionette.CompositeView.extend({
  triggers: function(){
    return {
      "click .that-thing": "that:i:sent:you"
    };
  }
});
```

Triggers work with all View types that extend from the base
Marionette.View.

## View.modelEvents and View.collectionEvents

Similar to the `events` hash, views can specify a configuration
hash for collections and models. The left side is the event on
the model or collection, and the right side is the name of the
method on the view.

```js
Backbone.Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": "nameChanged" // equivilent to view.bindTo(view.model, "change:name", view.nameChanged, view)
  },

  collectionEvents: {
    "add": "itemAdded" // equivalent to view.bindTo(view.collection, "add", collection.itemAdded, view)
  },

  // ... event handler methods
  nameChanged: function(){ /* ... */ },
  itemAdded: function(){ /* ... */ },

})
```

These will use the memory safe `bindTo`, and will set the context
(the value of `this`) in the handler to be the view. Events are
bound at the time of instantiation instanciation, and an exception will be thrown
if the handlers on the view do not exist.

## View.serializeData

The `serializeData` method will serialize a view's model or
collection - with precedence given to collections. That is,
if you have both a collection and a model in a view, calling
the `serializeData` method will return the serialized
collection.

## View.templateHelpers

There are times when a view's template needs to have some
logic in it, and the view engine itself will not provide an
easy way to accomplish this. For example, Underscore templates
do not provide a helper method mechanism while Handlebars
templates do.

A `templateHelpers` attribute can be applied to any View object
that uses the `serializeData` method - including ItemViews,
Layouts and CompositeViews. When this attribute is present,
it's contents will be mixed in to the data object that comes
back from the `serializeData` method for you. This will 
allow you to create helper methods that can be called from
within your templates.

## View.bindUIElements

In several cases you need to access ui elements inside the view
to retrieve their data or manipulate them. For example you have a
certain div element you need to show/hide based on some state,
or other ui element that you wish to set a css class to it.
Instead of having jQuery selectors hanging around in the view's code
you can define a `ui` hash that contains a mapping between the
ui element's name and its jQuery selector. Afterwards you can simply
access it via `this.ui.elementName`.
See ItemView documentation for examples.

This functionality is provided via the `bindUIElements` method.
Since View doesn't implement the render method, then if you directly extend
from View you will need to invoke this method from your render method.
In ItemView and CompositeView this is already taken care of.

## Change Which Template Is Rendered For A View

There may be some cases where you need to change the template that is
used for a view, based on some simple logic such as the value of a
specific attribute in the view's model. To do this, you can provide
a `getTemplate` function on your views and use this to return the
template that you need.

```js
MyView = Backbone.Marionette.ItemView.extend({
  getTemplate: function(){
    if (this.model.get("foo")){
      return "#some-template";
    } else {
      return "#a-different-template";
    }
  }
});
```

This applies to all view types.

### Basic Example

```html
<script id="my-template" type="text/html">
  I think that <%= showMessage() %>
</script>
```

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: "#my-template",

  templateHelpers: {
    showMessage: function(){
      return this.name + " is the coolest!"
    }
  }

});

model = new Backbone.Model({name: "Backbone.Marionette"});
view = new MyView({
  model: model
});

view.render(); //=> "I think that Backbone.Marionette is the coolest!";
```

### Accessing Data Within The Helpers

In order to access data from within the helper methods, you
need to prefix the data you need with `this`. Doing that will
give you all of the methods and attributes of the serialized
data object, including the other helper methods.

```js
templateHelpers: {
  something: function(){
    return "Do stuff with " + this.name + " because it's awesome.";
  }
}
```

### Object Or Function As `templateHelpers`

You can specify an object literal (as shown above), a reference
to an object literal, or a function as the `templateHelpers`. 

If you specify a function, the function will be invoked 
with the current view instance as the context of the 
function. The function must return an object that can be
mixed in to the data for the view.

```js
Backbone.Marionette.ItemView.extend({
  templateHelpers: function(){
    return {
      foo: function(){ /* ... */ }
    }
  }
});
```

