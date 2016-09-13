# Marionette Events

The Marionette Event system provides a system for objects to communicate with
each other in a uniform way. In Marionette, this typically involves objects
(models, collections, and views) triggering events that other objects
(typically views) listen to and act on.

This section will mostly deal with View events and the semantics and methods of
responding to events.

**This section will not cover events from models and collections. See the
[documentation for View](./marionette.view.md#model-and-collection-events).**

## Documentation Index

* [Triggering and Listening to Events](#triggering-and-listening-to-events)
  * [View `triggerMethod`](#view-triggermethod)
  * [Listening to Events](#listening-to-events)
    * [Magic Method Binding](#magic-method-binding)
  * [View events and triggers](#view-events-and-triggers)
* [Child View Events](#child-view-events)
  * [Event Bubbling](#event-bubbling)
  * [Explicit Event Listeners](#explicit-event-listeners)
  * [Triggering Events on Child Events](#triggering-events-on-child-events)
* [Lifecycle Events](#lifecycle-events)

## Triggering and Listening to Events

The traditional [event handling system in Backbone](http://backbonejs.org/#Events)
is also supported in Marionette. Marionette, however, provides an alternative
event system using the `triggerMethod` method on `Marionette.Object` - the key
difference between the two is that `triggerMethod` triggers magically named
event handlers on views. This section covers how `triggerMethod` works and how
listeners are set up to handle it.

### View `triggerMethod`

The `triggerMethod` method fires the named event on the view - any listeners
will then be triggered on the event. If there are no listeners, this call will
still succeed. All arguments after the first argument will be passed to all
event handlers.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  callMethod: function(myString) {
    console.log(myString + ' was passed');
  }
});

var myView = new MyView();
/* See Backbone.listenTo */
myView.on('something:happened', myView.callMethod, myView);

/* Calls callMethod('foo'); */
myView.triggerMethod('something:happened', 'foo');
```

[Live example](https://jsfiddle.net/marionettejs/whvgao7o/)

**The `triggerMethod` call comes from the `trigger-method` mixin that is also
part of `Marionette.Object` and its subclasses like `Marionette.Application`.
This documentation also applies.**

### Listening to Events

Marionette's event triggers work just like regular Backbone events - you can
use `view.on` and `view.listenTo` to act on events:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  initialize: function() {
    this.on('event:happened', this.logCall);
  },

  logCall: function(myVal) {
    console.log(myVal);
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/90Larbty/)

You can also use `listenTo` as in Backbone:

```javascript
var Mn = require('backbone.marionette');

var OtherView = Mn.View.extend({
  initialize: function(someView) {
    this.listenTo(someView, 'event:happened', this.logCall);
  },

  logCall: function(myVal) {
    console.log(myVal);
  }
});

var MyView = Mn.View.extend();

var myView = new MyView();

var otherView = new OtherView(myView);
```

[Live examples](https://jsfiddle.net/marionettejs/cm2rczqz/)

As in [Backbone](http://backbonejs.org/#Events), `listenTo` will pass the object
it is called on in as the context variable. These behave exactly as in Backbone,
so using `object.on` will require you to unhook any event handlers yourself to
prevent memory leaks. Marionette, however, does provide extra helpers as part of
the view lifecycle that bind and unbind event handlers for you. this is the
core of Magic Method Binding.

#### Magic Method Binding

The major difference between `Backbone.trigger` and `View.triggerMethod` is
that `triggerMethod` can fire specially named events on the attached view. For
instance, a view that has been rendered will fire `view.triggerMethod('render')`
and call `onRender` - providing a handy way to add behavior to your views.

Determining what method an event will call is easy, we will outline this with an
example using `before:dom:refresh` though this also works with any custom events
you want to fire:

1. Split the words around the `:` characters - so `before`, `dom`, `refresh`
2. Capitalize the first letter of each word - `Before`, `Dom`, `Refresh`
3. Add a leading `on` - `on`, `Before`, `Dom`, `Refresh`
4. Mash it into a single call - `onBeforeDomRefresh`

Using this process, `before:dom:refresh` will call the `onBeforeDomRefresh`
method. Let's see it in action with a custom event:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  onMyEvent: function(myVal) {
    console.log(myVal);
  }
});

var myView = new MyView();

myView.triggerMethod('my:event', 'someValue'); // Logs 'someValue'
```

[Live example](https://jsfiddle.net/marionettejs/oc8wwcnx/)

As before, all arguments passed into `triggerMethod` will make their way into
the event handler. Using this method ensures there will be no unexpected
memory leaks.

### View events and triggers

Views can automatically bind DOM events to methods and View events with `events`
and `triggers` respectively:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  events: {
    'click a': 'showModal'
  },

  triggers: {
    'keyup input': 'data:entered'
  },

  showModal: function(event) {
    console.log('Show the modal');
  },

  onDataEntered: function() {
    console.log('Data was entered');
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/pq4xfchk/)

For more information, see the [view documentation](./marionette.view.md#binding-to-user-input).

## Child View Events

The [`View`](marionette.view.md) and [`CollectionView`](marionette.collectionview.md)
are able to monitor and act on events on any children they own. Any events fired
on a view are automatically propagated to their direct parents as well. Let's
see a quick example:

```javascript
var Mn = require('backbone.marionette');

var Item = Mn.View.extend({
  tagName: 'li',

  triggers: {
    'click a': 'select:item'
  }
});

var Collection = Mn.CollectionView.extend({
  tagName: 'ul',

  childViewEvents: {
    'select:item': 'itemSelected'
  },

  itemSelected: function(childView) {
    console.log('item selected: ' + childView.model.id);
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/opyfvsfx/)

### Event Bubbling

Events fired on a view bubble up to their direct parent views, calling any
magic methods using the `childview:` prefix (more on that shortly) and any
methods bound to the `childViewEvents` attribute. This works for built-in
events, custom events fired with `triggerMethod` and bound events using
`triggers`.

When using implicit listeners, the `childview:*` event prefix is used which
needs to be included as part of the handler:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  triggers: {
    click: 'click:view'
  },

  doSomething: function() {
    this.triggerMethod('did:something');
  }
});

var ParentView = Mn.View.extend({
  regions: {
    foo: '.foo-hook'
  },

  onRender: function() {
    this.showChildView('foo', new MyView());
  },

  onChildviewClickView: function(childView) {
    console.log('View clicked ' + childView);
  },

  onChildviewDidSomething: function(childView) {
    console.log('Something was done to ' + childView);
  }
})
```

[Live example](https://jsfiddle.net/marionettejs/oquea4uy/)

The `view` gets passed into the handlers as the first argument.

#### Using `CollectionView`

This works exactly the same way for the `CollectionView` and its `childView`:

```javascript
var Mn = require('backbone.marionette');

var MyChild = Mn.View.extend({
  triggers: {
    click: 'click:child'
  }
});

var MyList = Mn.CollectionView.extend({
  onChildviewClickChild: function(childView) {
    console.log('Childview ' + childView + ' was clicked');
  }
});
```

[Live examples](https://jsfiddle.net/marionettejs/za27jys1/)

Just like with the `View` and its regions, the event handler will receive the
`view` that triggered the event as its first argument.

### Explicit Event Listeners

To call specific functions on event triggers, use the `childViewEvents`
attribute to map child events to methods on the parent view. This takes events
fired on child views - _without the `childview:` prefix_ - and calls the
method referenced or attached function.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  triggers: {
    click: 'view:clicked'
  }
});

var ParentView = Mn.View.extend({
  regions: {
    foo: '.foo-hook'
  },

  childViewEvents: {
    'view:clicked': 'displayMessage'
  },

  onRender: function() {
    this.showChildView('foo', new MyView());
  },

  displayMessage: function(childView) {
    console.log('Displaying message for ' + childView);
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/y92r99p2/)

#### Attaching Functions

The `childViewEvents` attribute can also attach functions directly to be event
handlers:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  triggers: {
    click: 'view:clicked'
  }
});

var ParentView = Mn.View.extend({
  regions: {
    foo: '.foo-hook'
  },

  childViewEvents: {
    'view:clicked': function(childView) {
      console.log('Function called for ' + childView);
    }
  },

  onRender: function() {
    this.showChildView('foo', new MyView());
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/pnp1dd8j/)

### Triggering Events on Child Events

Marionette 3 adds a new feature that allows selected events to fire events
directly, allowing them to be propagated up the view hierarchy more easily and
explicitly. The values of the hash should be a string of the event to trigger on
the parent.

```javascript
// The child view fires a custom event, `show:message`
var ChildView = Marionette.View.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    // Both `trigger` and `triggerMethod` events will be caught by parent.
    this.trigger('show:message', 'foo');
    this.triggerMethod('show:message', 'bar');
  }
});

// The parent uses childViewEvents to catch the child view's custom event
var ParentView = Marionette.CollectionView.extend({
  childView: ChildView,

  childViewTriggers: {
    'show:message': 'child:show:message',
    'submit:form': 'child:submit:form'
  },

  onChildShowMessage: function (message) {
    console.log('A child view fired show:message with ' + message);
  },

  onChildSubmitForm: function (childView) {
    console.log('A child view fired submit:form');
  }
});

var GrantParentView = Marionette.View.extend({
  regions: {
    list: '.list'
  },

  onRender: function() {
    this.showChildView('list', new ParentView({
      collection: this.collection
    }));
  },

  childViewEvents: {
    'child:show:message': 'showMessage'
  },

  showMessage: function(childView) {
    console.log('A child (' + childView + ') fired an event');
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/8eq7vca5/)

## Lifecycle Events

Marionette Views fire events during their creation and destruction lifecycle.
For more information see the documentation covering the
[`View` Lifecycle](./viewlifecycle.md).
