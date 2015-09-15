## [View the new docs](http://marionettejs.com/docs/marionette.abstractview.html)

# Marionette.AbstractView

The `Marionette.AbstractView` is a base view class that other views extend from.
This base view provides some common and core functionality for other views to take
advantage of.

Unlike the other views, it is unlikely that you will need to interface with the
AbstractView directly.

## Documentation Index

* [Binding To View Events](#binding-to-view-events)
* [AbstractView onShow](#abstractview-onshow)
* [AbstractView destroy](#abstractview-destroy)
* [AbstractView onBeforeDestroy](#abstractview-onbeforedestroy)
* [AbstractView "attach" / onAttach event](#abstractview-attach--onattach-event)
* [AbstractView "before:attach" / onBeforeAttach event](#abstractview-beforeattach--onbeforeattach-event)
* [AbstractView "dom:refresh" / onDomRefresh event](#abstractview-domrefresh--ondomrefresh-event)
* [AbstractView.triggers](#abstractviewtriggers)
* [AbstractView.events](#abstractviewevents)
* [AbstractView.modelEvents and AbstractView.collectionEvents](#abstractviewmodelevents-and-abstractviewcollectionevents)
* [AbstractView.serializeModel](#abstractviewserializemodel)
* [AbstractView.bindUIElements](#abstractviewbinduielements)
* [AbstractView.getUI](#abstractviewgetui)
* [AbstractView.mergeOptions](#abstractviewmergeoptions)
* [AbstractView.getOption](#abstractviewgetoption)
* [AbstractView.bindEntityEvents](#abstractviewbindentityevents)
* [AbstractView.templateContext](#abstractviewtemplatecontext)
  * [Basic Example](#basic-example)
  * [Accessing Data Within The Template Context](#accessing-data-within-the-template-context)
  * [Object Or Function As `templateContext`](#object-or-function-as-templatecontext)
* [Change Which Template Is Rendered For A View](#change-which-template-is-rendered-for-a-view)
* [UI Interpolation](#ui-interpolation)

## Binding To View Events

Marionette.AbstractView extends `Backbone.View`. It is recommended that you use
the `listenTo` method to bind model, collection, or other events from Backbone
and Marionette objects.

```js
var MyView = Marionette.View.extend({
  initialize: function(){
    this.listenTo(this.model, "change:foo", this.modelChanged);
    this.listenTo(this.collection, "add", this.modelAdded);
  },

  modelChanged: function(model, value){
  },

  modelAdded: function(model){
  }
});
```

The context (`this`) will automatically be set to the view. You can
optionally set the context by using `_.bind`.

```js
// Force the context of the "reconcileCollection" callback method to be the collection
// itself, for this event handler only (does not affect any other use of the
// "reconcileCollection" method)
this.listenTo(this.collection, "add", _.bind(this.reconcileCollection, this.collection));
```

## AbstractView onShow

* "show" / `onShow` - Called on the view instance when the view has been rendered and displayed.

This event can be used to react to when a view has been shown via a [region](marionette.region.md).
All `views` that inherit from the base `Marionette.AbstractView` class have this functionality, notably `View`, `CollectionView`, `CompositeView`, and `LayoutView`.

```js
Marionette.View.extend({
  onShow: function(){
    // react to when a view has been shown
  }
});
```

A common use case for the `onShow` method is to use it to add children views.

```js
var LayoutView = Marionette.LayoutView.extend({
   regions: {
     Header: 'header',
     Section: 'section'
   },
   onShow: function() {
      this.Header.show(new Header());
      this.Section.show(new Section());
   }
});
```

## AbstractView destroy

View implements a `destroy` method, which is called by the region
managers automatically. As part of the implementation, the following
are performed:

* call an `onBeforeDestroy` event on the view, if one is provided
* call an `onDestroy` event on the view, if one is provided
* unbind all custom view events
* unbind all DOM events
* remove `this.el` from the DOM
* unbind all `listenTo` events
* returns the view.

By providing an `onDestroy` method in your view definition, you can
run custom code for your view that is fired after your view has been
destroyed and cleaned up. The `onDestroy` method will be passed any arguments
that `destroy` was invoked with. This lets you handle any additional clean
up code without having to override the `destroy` method.

```js
var MyView = Marionette.View.extend({
  onDestroy: function(arg1, arg2){
    // custom cleanup or destroying code, here
  }
});

var v = new MyView();
v.destroy(arg1, arg2);
```

## AbstractView onBeforeDestroy

When destroying a view, an `onBeforeDestroy` method will be called, if it
has been provided, just before the view destroys. It will be passed any arguments
that `destroy` was invoked with.

### AbstractView "attach" / onAttach event

Every view in Marionette has a special event called "attach," which is triggered anytime that showing
the view in a Region causes it to be attached to the `document`. Like other Marionette events, it also
executes a callback method, `onAttach`, if you've specified one. The `"attach"` event is great for jQuery
plugins or other logic that must be executed *after* the view is attached to the `document`.

The `attach` event is only fired when the view becomes a child of the `document`. If the Region you're showing the view in is not a child of the `document` at the time that you call `show` then the `attach` event will not fire until the Region is a child of the `document`.

This event is unique in that it propagates down the view tree. For instance, when a CollectionView's
`attach` event is fired, all of its children views will have the `attach` event fired as well. In
addition, deeply nested Layout View structures will all have their `attach` event fired at the proper
time, too.

For more on efficient, deeply-nested view structures, refer to the LayoutView docs.

### AbstractView "before:attach" / onBeforeAttach event

This is just like the attach event described above, but it's triggered right before the view is
attached to the document.

### AbstractView "dom:refresh" / onDomRefresh event

Triggered after the view has been rendered, has been shown in the DOM via a Marionette.Region, and has been
re-rendered.

This event / callback is useful for
[DOM-dependent UI plugins](http://lostechies.com/derickbailey/2012/02/20/using-jquery-plugins-and-ui-controls-with-backbone/) such as
[jQueryUI](http://jqueryui.com/) or [KendoUI](http://kendoui.com).

```js
Marionette.View.extend({
  onDomRefresh: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

For more information about integration Marionette w/ KendoUI (also applicable to jQueryUI and other UI
widget suites), see [this blog post on KendoUI + Backbone](http://www.kendoui.com/blogs/teamblog/posts/12-11-26/backbone_and_kendo_ui_a_beautiful_combination.aspx).

## AbstractView.events
Since Views extend from backbone`s view class, you gain the benefits of the [events hash](http://backbonejs.org/#View-delegateEvents).

Some preprocessing sugar is added on top to add the ability to cross utilize the ```ui``` hash.

```js
var MyView = Marionette.View.extend({
  // ...

  ui: {
    "cat": ".dog"
  },

  events: {
    "click @ui.cat": "bark" //is the same as "click .dog":
  }
});
```

## AbstractView.triggers

Views can define a set of `triggers` as a hash, which will
convert a DOM event into a
[`view.triggerMethod`](./marionette.functions.md#marionettetriggermethod) call.

The left side of the hash is a standard Backbone.View DOM
event configuration, while the right side of the hash is the
view event that you want to trigger from the view.

```js
var MyView = Marionette.View.extend({
  // ...

  triggers: {
    "click .do-something": "something:do:it"
  }
});

var view = new MyView();
view.render();

view.on("something:do:it", function(args){
  alert("I DID IT!");
});

// "click" the 'do-something' DOM element to
// demonstrate the DOM event conversion
view.$(".do-something").trigger("click");
```

The result of this is an alert box that says, "I DID IT!" Triggers can also be
executed using the 'on{EventName}' attribute.

By default all triggers are stopped with `preventDefault` and
`stopPropagation` methods. But you can manually configure the triggers using
hash instead of event name. Example below triggers an event and prevents
default browser behaviour using `preventDefault` method.

```js
Marionette.CompositeView.extend({
  triggers: {
    "click .do-something": {
      event: "something:do:it",
      preventDefault: true, // this param is optional and will default to true
      stopPropagation: false
    }
  }
});
```

You can also specify the `triggers` as a function that
returns a hash of trigger configurations

```js
Marionette.CompositeView.extend({
  triggers: function(){
    return {
      "click .that-thing": "that:i:sent:you"
    };
  }
});
```

Trigger keys can be configured to cross utilize the ```ui``` hash.

```js
Marionette.View.extend({
  ui: {
     'monkey': '.guybrush'
  },
  triggers: {
    'click @ui.monkey': 'see:LeChuck' // equivalent of "click .guybrush"
  }
});
```

Triggers work with all View classes that extend from the base
Marionette.AbstractView.

### Trigger Handler Arguments

A `trigger` event handler will receive a single argument that
includes the following:

* view
* model
* collection

These properties match the `view`, `model`, and `collection` properties of the view that triggered the event.

```js
var MyView = Marionette.View.extend({
  // ...

  triggers: {
    "click .do-something": "some:event"
  }
});

var view = new MyView();

view.on("some:event", function(args){
  args.view; // => the view instance that triggered the event
  args.model; // => the view.model, if one was set on the view
  args.collection; // => the view.collection, if one was set on the view
});
```

Having access to these allows more flexibility in handling events from
multiple views. For example, a tab control or expand/collapse widget such
as a panel bar could trigger the same event from many different views
and be handled with a single function.

## AbstractView.modelEvents and View.collectionEvents

Similar to the `events` hash, views can specify a configuration
hash for collections and models. The left side is the event on
the model or collection, and the right side is the name of the
method on the view.

```js
Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": "nameChanged" // equivalent to view.listenTo(view.model, "change:name", view.nameChanged, view)
  },

  collectionEvents: {
    "add": "itemAdded" // equivalent to view.listenTo(view.collection, "add", view.itemAdded, view)
  },

  // ... event handler methods
  nameChanged: function(){ /* ... */ },
  itemAdded: function(){ /* ... */ },

})
```

These will use the memory safe `listenTo`, and will set the context
(the value of `this`) in the handler to be the view. Events are
bound at the time of instantiation, and an exception will be thrown
if the handlers on the view do not exist.

The `modelEvents` and `collectionEvents` will be bound and
unbound with the Backbone.View `delegateEntityEvents` and `undelegateEntityEvents`
method calls. `delegateEntityEvents` is called in the View's `constructor` and
entity events are unbound during the View's `destroy`.

### Multiple Callbacks

Multiple callback functions can be specified by separating them with a
space.

```js
Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": "nameChanged thatThing"
  },

  nameChanged: function(){ },

  thatThing: function(){ },
});
```

This works in both `modelEvents` and `collectionEvents`.

### Callbacks As Function

A single function can be declared directly in-line instead of specifying a
callback via a string method name.

```js
Marionette.CompositeView.extend({

  modelEvents: {
    "change:name": function(){
      // handle the name changed event here
    }
  }

});
```

This works for both `modelEvents` and `collectionEvents`.

### Event Configuration As Function

A function can be used to declare the event configuration as long as
that function returns a hash that fits the above configuration options.

```js
Marionette.CompositeView.extend({

  modelEvents: function(){
    return { "change:name": "someFunc" };
  }

});
```

This works for both `modelEvents` and `collectionEvents`.

## AbstractView.serializeModel

This method is used internally during a view's rendering phase. It
will serialize the View's `model` property, adding it to the data
that is ultimately passed to the template.

If you would like to serialize the View's `model` in a special way,
then you should override this method. With that said, **do not** override
this if you're simply adding additional data to your template, like computed
fields. Use [templateContext](#viewtemplatecontext) instead.

## AbstractView.bindUIElements

In several cases you need to access ui elements inside the view
to retrieve their data or manipulate them. For example you have a
certain div element you need to show/hide based on some state,
or other ui element that you wish to set a css class to it.
Instead of having jQuery selectors hanging around in the view's code
you can define a `ui` hash that contains a mapping between the
ui element's name and its jQuery selector. Afterwards you can simply
access it via `this.getUI('elementName')`.
See View documentation for examples.

This functionality is provided via the `bindUIElements` method.
Since View doesn't implement the render method, then if you directly extend
from View you will need to invoke this method from your render method.
In View and CompositeView this is already taken care of.

## AbstractView.getUI

The `getUI` method is is a “stable” interface to the `ui` hash, this helps when
attempting to gain access a `ui` property when the view is in a destroyed state. Doing
so will throw a `ViewDestroyedError`.

## View.mergeOptions
The preferred way to manage your view's options is with `mergeOptions`. It accepts two arguments: the `options` object
and the keys to merge onto the instance directly.

```js
var ProfileView = Marionette.View.extend({
  profileViewOptions: ['user', 'age'],

  initialize: function(options) {
    this.mergeOptions(options, this.profileViewOptions);

    console.log('The merged options are:', this.user, this.age);
  }
});
```

More information [mergeOptions](./marionette.functions.md#marionettemergeoptions)

## AbstractView.getOption
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md#marionettegetoption)

## AbstractView.bindEntityEvents
Helps bind a backbone "entity" to methods on a target object. bindEntityEvents is used to support `modelEvents` and `collectionEvents`.

More information [bindEntityEvents](./marionette.functions.md#marionettebindentityevents)

## AbstractView.templateContext

There are times when a view's template needs to have some
logic in it and the view engine itself will not provide an
easy way to accomplish this. For example, Underscore templates
do not provide a context method mechanism while Handlebars
templates do.

A `templateContext` attribute can be applied to any View object that
renders a template. When this attribute is present its contents
will be mixed in to the data object that comes back from the
`serializeData` method. This will allow you to create context methods
that can be called from within your templates. This is also a good place
to add data not returned from `serializeData`, such as calculated values.

### Basic Example

```html
<script id="my-template" type="text/html">
  I <%= percent %>% think that <%= showMessage() %>
</script>
```

```js
var MyView = Marionette.View.extend({
  template: "#my-template",

  templateContext: function () {
    return {
      showMessage: function(){
        return this.name + " is the coolest!";
      },

      percent: this.model.get('decimal') * 100
    };
  }
});

var model = new Backbone.Model({
  name: "Marionette",
  decimal: 1
});
var view = new MyView({
  model: model
});

view.render(); //=> "I 100% think that Marionette is the coolest!";
```

The `templateContext` can also be provided as a constructor parameter
for any Marionette view class that supports the context methods.

```js
var MyView = Marionette.View.extend({
  // ...
});

new MyView({
  templateContext: {
    doFoo: function(){ /* ... */ }
  }
});
```

### Accessing Data Within The Template Context

In order to access data from within the context methods, you
need to prefix the data you need with `this`. Doing that will
give you all of the methods and attributes of the serialized
data object, including the other context methods.

```js
templateContext: {
  something: function(){
    return "Do stuff with " + this.name + " because it's awesome.";
  }
}
```

### Object Or Function As `templateContext`

You can specify an object literal (as shown above), a reference
to an object literal, or a function as the `templateContext`.

If you specify a function, the function will be invoked
with the current view instance as the context of the
function. The function must return an object that can be
mixed in to the data for the view.

```js
Marionette.View.extend({
  templateContext: function(){
    return {
      foo: function(){ /* ... */ }
    }
  }
});
```

## Change Which Template Is Rendered For A View

There may be some cases where you need to change the template that is
used for a view, based on some simple logic such as the value of a
specific attribute in the view's model. To do this, you can provide
a `getTemplate` function on your views and use this to return the
template that you need.

```js
var MyView = Marionette.View.extend({
  getTemplate: function(){
    if (this.model.get("foo")){
      return "#some-template";
    } else {
      return "#a-different-template";
    }
  }
});
```

This applies to all view classes.

## UI Interpolation

Marionette UI offers a convenient way to reference jQuery elements.
UI elements can also be interpolated into event and region selectors.

In this example, the buy button is referenced in a DOM event and the checkout section is referenced in the region selector.


```js
var MyView = Marionette.ItemView.extend({

  ui: {
    buyButton: '.buy-button',
    checkoutSection: '.checkout-section'
  },

  events: {
    'click @ui.buyButton': 'onClickBuyButton'
  },

  regions: {
    checkoutSection: '@ui.checkoutSection'
  },

  onShow: function() {
    this.getRegion('checkoutSection').show(new CheckoutSection({
      model: this.checkoutModel
    }));
  }
});
```
