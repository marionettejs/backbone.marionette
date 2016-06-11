**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Marionette functions

Marionette provides a set of utility / helper functions that are used to
facilitate common behaviors throughout the framework. These functions may
be useful to those that are building on top of Marionette, as they provide
a way to get the same behaviors and conventions from your own code.

## Documentation Index

* [Marionette.extend](#marionetteextend)
* [Marionette.isNodeAttached](#marionetteisnodeattached)
* [Marionette.mergeOptions](#marionettemergeoptions)
* [Marionette.getOption](#marionettegetoption)
* [Marionette.triggerMethod](#marionettetriggermethod)
* [Marionette.bindEvents](#marionettebindevents)
* [Marionette.bindRequests](#marionettebindrequests)
* [Marionette.unbindRequests](#marionetteunbindrequests)
* [Marionette.triggerMethodOn](#marionettetriggermethodon)
* [Marionette.unbindEvents](#marionetteunbindevents)
* [Marionette.normalizeMethods](#marionettenormalizemethods)

## Marionette.extend

Backbone's `extend` function is a useful utility to have, and is used in
various places in Marionette. To make the use of this method more consistent,
Backbone's `extend` has been aliased to `Marionette.extend`. This allows
you to get the extend functionality for your object without having to
decide if you want to use Backbone.View or Backbone.Model or another
Backbone object to grab the method from.

```js
var Foo = function(){};

// use Marionette.extend to make Foo extendable, just like other
// Backbone and Marionette objects
Foo.extend = Marionette.extend;

// Now Foo can be extended to create a new class, with methods
var Bar = Foo.extend({

  someMethod: function(){ ... }

  // ...
});

// Create an instance of Bar
var b = new Bar();
```

## Marionette.isNodeAttached

Determines whether the passed-in node is a child of the `document` or not.

```js
var div = document.createElement('div');
Marionette.isNodeAttached(div);
// => false

$('body').append(div);
Marionette.isNodeAttached(div);
// => true
```

## Marionette.mergeOptions

A handy function to pluck certain `options` and attach them directly to an instance.
Most Marionette Classes, such as the Views, come with this method.

```js
var MyView = Marionette.View.extend({
  myViewOptions: ['color', 'size', 'country'],

  initialize: function(options) {
    this.mergeOptions(options, this.myViewOptions);
  },

  onRender: function() {
    // The merged options will be attached directly to the prototype
    this.$el.addClass(this.color);
  }
});
```

## Marionette.getOption

Retrieve an object's attribute either directly from the object, or from
the object's `this.options`, with `this.options` taking precedence.

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(attributes, options){
    this.options = options;
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

new M({}, { foo: "quux" }); // => "quux"
```

This is useful when building an object that can have configuration set
in either the object definition or the object's constructor options.

### Falsey values

The `getOption` function will return any falsey value from the `options`,
other than `undefined`. If an object's options has an undefined value, it will
attempt to read the value from the object directly.

For example:

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(){
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

var f;
new M({}, { foo: f }); // => "bar"
```

In this example, "bar" is returned both times because the second
example has an undefined value for `f`.

## Marionette.triggerMethod

Trigger an event and a corresponding method on the target object.

When an event is triggered, the first letter of each section of the
event name is capitalized, and the word "on" is tagged on to the front
of it. Examples:

* `triggerMethod("render")` fires the "onRender" function
* `triggerMethod("before:destroy")` fires the "onBeforeDestroy" function

All arguments that are passed to the triggerMethod call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

`triggerMethod("foo", bar)` will call `onFoo: function(bar){...})`

Note that `triggerMethod` can be called on objects that do not have
`Backbone.Events` mixed in to them. These objects will not have a `trigger`
method, and no attempt to call `.trigger()` will be made. The `on{Name}`
callback methods will still be called, though.

## Marionette.triggerMethodOn

Invoke `triggerMethod` on a specific context.

This is useful when it's not clear that the object has `triggerMethod` defined. In the case of views, `Marionette.AbstractView` defines `triggerMethod`, but `Backbone.View` does not.

```js
Marionette.triggerMethodOn(ctx, "foo", bar);
// will invoke `onFoo: function(bar){...})`
// will trigger "foo" on ctx
```

## Marionette.triggerMethodMany

Invokes `triggerMethod` on many contexts.

This is useful when you want to trigger an event on many different objects.

```js
var views = getManyViews();
var context = this;
Marionette.triggerMethodMany(views, context, "foo", bar);
// will call `onFoo: function(view, context, bar){...})` for each view
// will trigger "foo" on each of the views
```


## Marionette.bindEvents

This method is used to bind a backbone "entity" (e.g. collection/model)
to methods on a target object.

```js
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
  }

});
```

The first parameter, `target`, must have the Backbone.Events module mixed in.

The second parameter is the `entity` (Backbone.Model, Backbone.Collection or
any object that has Backbone.Events mixed in) to bind the events from.

The third parameter is a hash of { "event:name": "eventHandler" }
configuration. Multiple handlers can be separated by a space. A
function can be supplied instead of a string handler name.

## Marionette.unbindEvents

This method can be used to unbind callbacks from entities' (e.g. collection/model) events. It's
the opposite of bindEvents, described above. Consequently, the APIs are identical for each method.

```js
// Just like the above example we bind our model events.
// This time, however, we unbind them on close.
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
  },

  onClose: function() {
    Marionette.unbindEvents(this, this.model, this.modelEvents);
  }

});
```

## Marionette.bindRequests

This method is used to bind a radio requests
to methods on a target object.

```js
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');

var MyView = Mn.View.extend({
  channelName: 'myChannelName',

  radioRequests: {
    'foo:bar': 'fooBar'
  },

  initialize: function() {
    var channel = Radio.channel(this.channelName);
    Mn.bindRequests(this, channel, this.radioRequests);
  },

  fooBar: function() {
  	console.log('foo:bar event was called')
  }
 });

var myView = new MyView();
var channel = Radio.channel('myChannelName');
channel.request('foo:bar'); // Logs 'foo:bar event was called'
```

The first parameter, `this`, is a context of current entity.

The second parameter, `channel`, reference to a channel by name.

The third parameter is a hash either { "event:name": "eventHandler" } or
{ "event:name": "eventHandler", "event:otherName": "otherEventHandler", ...} of
configuration.

## Marionette.unbindRequests

This method is used to unbind a radio requests
to methods on a target object.

```js
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');

var MyView = Mn.View.extend({
	channelName: 'myChannelName',

  radioRequests: {
    'foo:bar': 'fooBar'
  },

  initialize: function() {
    var channel = Radio.channel(this.channelName);
    Mn.bindRadioRequests(this, channel, this.radioRequests);
  },

  onDestroy: function() {
    var channel = Radio.channel(this.channelName);
    Mn.unbindRequests(this, channel, this.radioRequests);
  }
 });

var myView = new MyView();
myView.destroy();
```

The first parameter, `this`, is a context of current entity.

The second parameter, `channel`, reference to a channel by name.

The third parameter is a hash either { "event:name": "eventHandler" } or
{ "event:name": "eventHandler", "event:otherName": "otherEventHandler", ...} of
configuration.

## Marionette.normalizeMethods

Receives a hash of event names and functions and/or function names, and returns the
same hash with the function names replaced with the function references themselves.

This function is attached to the `Marionette.AbstractView` prototype by default. To use it from non-View classes you'll need to attach it yourself.

```js
var View = Marionette.View.extend({

  initialize: function() {
    this.someFn = function() {};
    this.someOtherFn = function() {};
    var hash = {
      eventOne: "someFn", // This will become a reference to `this.someFn`
      eventTwo: this.someOtherFn
    };
    this.normalizedHash = this.normalizeMethods(hash);
  }

});
```
