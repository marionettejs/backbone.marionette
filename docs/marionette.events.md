**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

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

**The `triggerMethod` call actually comes from
[`Marionette.Object`](./marionette.object.md) - anything extending it will also
have access to this method**

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

As before, all arguments passed into `triggerMethod` will make their way into
the event handler. Using this method ensures there will be no unexpected
memory leaks.

### View events and triggers

Using this,

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

  childEvents: {
    'select:item': 'itemSelected'
  },

  itemSelected: function(view) {
    console.log('item selected: ' + view.model.id);
  }
});
```

### Event Bubbling

Events called on a view bubble up to their direct parent views, calling any
methods
