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
* [Marionette.triggerMethodOn](#marionettetriggermethodon)
* [Marionette.bindEvents](#marionettebindevents)
* [Marionette.unbindEvents](#marionetteunbindevents)
* [Marionette.bindRequests](#marionettebindrequests)
* [Marionette.unbindRequests](#marionetteunbindrequests)
* [Marionette.normalizeMethods](#marionettenormalizemethods)

## Marionette.extend

Backbone's `extend` function is a useful utility to have, and is used in
various places in Marionette. To make the use of this method more consistent,
Backbone's `extend` has been aliased to `Marionette.extend`. This allows
you to get the extend functionality for your object without having to
decide if you want to use Backbone.View or Backbone.Model or another
Backbone object to grab the method from.

```javascript
var Mn = require('backbone.marionette');

var Foo = function(){};

// use Marionette.extend to make Foo extendable, just like other
// Backbone and Marionette objects
Foo.extend = Mn.extend;

// Now Foo can be extended to create a new class, with methods
var Bar = Foo.extend({

  someMethod: function(){ ... }

  // ...
});

// Create an instance of Bar
var b = new Bar();
```

[Live example](https://jsfiddle.net/marionettejs/w5avq89r/)

## Marionette.isNodeAttached

Determines whether the passed-in node is a child of the `document` or not.

```javascript
var Mn = require('backbone.marionette');

var div = document.createElement('div');
Mn.isNodeAttached(div);
// => false

$('body').append(div);
Mn.isNodeAttached(div);
// => true
```

[Live example](https://jsfiddle.net/marionettejs/azn1fo3z/)

## Marionette.mergeOptions

A handy function to pluck certain `options` and attach them directly to an instance.
Most Marionette Classes, such as the Views, come with this method.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
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

[Live example](https://jsfiddle.net/marionettejs/gv5psrdu/)

## Marionette.getOption

Retrieve an object's attribute either directly from the object, or from
the object's `this.options`, with `this.options` taking precedence.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var Model = Bb.Model.extend({
  foo: 'bar',

  initialize: function(attributes, options){
    this.options = options;
    var foo = Mn.getOption(this, 'foo');
    console.log(foo);
  }
});

var model1 = new Model(); // => "bar"

var model2 = new Model({}, { foo: 'quux' }); // => "quux"
```

[Live example](https://jsfiddle.net/marionettejs/4rt6exaq/)

This is useful when building an object that can have configuration set
in either the object definition or the object's constructor options.

### Falsey values

The `getOption` function will return any falsey value from the `options`,
other than `undefined`. If an object's options has an undefined value, it will
attempt to read the value from the object directly.

For example:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var Model = Bb.Model.extend({
  foo: 'bar',

  initialize: function(){
    var foo = Mn.getOption(this, 'foo');
    console.log(foo);
  }
});

var model1 = new Model(); // => "bar"

var foo;
var model2 = new Model({}, { foo: foo }); // => "bar"
```

[Live example](https://jsfiddle.net/marionettejs/2ddk28ap/)

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

```javascript
var Mn = require('backbone.marionette');

Mn.triggerMethodOn(ctx, "foo", bar);
// will invoke `onFoo: function(bar){...})`
// will trigger "foo" on ctx
```

## Marionette.bindEvents

This method is used to bind a backbone "entity" (e.g. collection/model)
to methods on a target object.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

Bb.View.extend({

  modelEvents: {
    'change:foo': 'doSomething'
  },

  initialize: function(){
    Mn.bindEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
  }

});
```

[Live example](https://jsfiddle.net/marionettejs/L640ecac/)

The first parameter, `target`, must have the Backbone.Events module mixed in.

The second parameter is the `entity` (Backbone.Model, Backbone.Collection or
any object that has Backbone.Events mixed in) to bind the events from.

The third parameter is a hash of { "event:name": "eventHandler" }
configuration. Multiple handlers can be separated by a space. A
function can be supplied instead of a string handler name.

## Marionette.unbindEvents

This method can be used to unbind callbacks from entities' (e.g. collection/model) events. It's
the opposite of bindEvents, described above. Consequently, the APIs are identical for each method.

```javascript
// Just like the above example we bind our model events.
// This time, however, we unbind them on close.
var Bb = require('backbone');
var Mn = require('backbone.marionette');

Bb.View.extend({

  modelEvents: {
    'change:foo': 'doSomething'
  },

  initialize: function(){
    Mn.bindEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
  },

  onClose: function() {
    Mn.unbindEvents(this, this.model, this.modelEvents);
  }

});
```

[Live example](https://jsfiddle.net/marionettejs/yvsfm65c/)

## Marionette.bindRequests

This method is used to bind a radio requests
to methods on a target object.

```javascript
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

[Live example](https://jsfiddle.net/marionettejs/hmjgkg7w/)

The first parameter, `this`, is a context of current entity.

The second parameter, `channel`, reference to a channel by name.

The third parameter is a hash either { "event:name": "eventHandler" } or
{ "event:name": "eventHandler", "event:otherName": "otherEventHandler", ...} of
configuration.

## Marionette.unbindRequests

This method is used to unbind a radio requests
to methods on a target object.

```javascript
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

[Live examples](https://jsfiddle.net/marionettejs/r5kmwwke/)

The first parameter, `this`, is a context of current entity.

The second parameter, `channel`, reference to a channel by name.

The third parameter is a hash either { "event:name": "eventHandler" } or
{ "event:name": "eventHandler", "event:otherName": "otherEventHandler", ...} of
configuration.

## Marionette.normalizeMethods

Receives a hash of event names and functions and/or function names, and returns the
same hash with the function names replaced with the function references themselves.

```javascript
var Mn = require('backbone.marionette');

var View = Mn.View.extend({

  initialize: function() {
    var hash = {
      'event:one': 'handleEventOne', // This will become a reference to `this.someFn`
      'event:two': this.someOtherFn
    };

    this.normalizedHash = this.normalizeMethods(hash);

    Mn.bindEvents(this, this, this.normalizedHash);
  },

  destroy: function() {
      Mn.unbindEvents(this, this, this.normalizedHash);
  },

  handleEventOne: function() {
    console.log('event:one was fired');
  },

  handleEventTwo: function() {
    console.log('event:two was fired');
  }

});
```

[Live example](https://jsfiddle.net/marionettejs/zzjhm4p1/)
