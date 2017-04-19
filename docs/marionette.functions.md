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
* [Marionette.noConflict](#marionettenoconflict)

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
All Marionette Classes, such as the Views, come with this method.

```javascript
var Mn = require('backbone.marionette');

var options = {
  color: 'red',
  size: 'small',
  shape: 'square',
  weight: 'light'
}

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

var myView = new MyView(options);

Marionette.mergeOptions(myView, options, ['shape', 'weight']);

myView.getOption('color');   // red
myView.getOption('size');    // small
myView.getOption('country'); // undefined
myView.getOption('shape');   // square
myView.getOption('weight');  // light
```

[Live example](https://jsfiddle.net/marionettejs/gv5psrdu/)

## Marionette.getOption

Retrieve an object's attribute either directly from the object, or from
the object's `this.options`, with `this.options` taking precedence.
All Marionette Classes, such as the Views, come with this method.
`this.getOption` is used for instance of Marionette class.
`Marionette.getOption` is used for instance of Backbone class.

```javascript
var Mn = require('backbone.marionette');

var Obj = Mn.Object.extend({
  foo: 'bar',

  initialize: function(){
    var foo = this.getOption('foo');
    console.log(foo);
  }
});

var obj1 = new Obj(); // => 'bar'
var obj2 = new Obj({ foo: 'quux' }); // => 'quux'
```

[Live example](https://jsfiddle.net/marionettejs/271nn9ht/)


```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var Model = Bb.Model.extend({
  foo: 'bar',

  initialize(attributes, options) {
    this.options = options;
    var foo = Mn.getOption(this, 'foo');
    console.log(foo);
  }
});

var model1 = new Model(); // => 'bar'
var model2 = new Model({}, { foo: 'quux' }); // => 'quux'
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
All Marionette Classes, such as the Views, come with this method.

When an event is triggered, the first letter of each section of the
event name is capitalized, and the word "on" is tagged on to the front
of it. Examples:

* `triggerMethod('foo')` fires the "onFoo" function
* `triggerMethod('before:foo')` fires the "onBeforeFoo" function

All arguments that are passed to the `triggerMethod` call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

`triggerMethod('foo', bar)` will call `onFoo: function(bar){...})`


```javascript
var Mn = require('backbone.marionette');

var MyObject = Mn.Object.extend({
  initialize: function(){
    this.triggerMethod('foo', 'baz');
  },
  onFoo: function(bar){
    console.log(bar);
  }
});

var myObj = new MyObject(); // console.log "baz"

Mn.triggerMethod(myObj, 'foo', 'qux'); // console.log "qux"
```

*Note*: Some Marionette classes such as Views have an overridden `triggerMethod`. Using `Mn.triggerMethod` with a view will break event proxying. If you need to run `triggerMethod` on a Marionette class [`triggerMethodOn`](#marionette-triggermethodon) is recommended.

## Marionette.triggerMethodOn

Invoke `triggerMethod` on a specific context.

This is useful when it's not clear that the object has `triggerMethod` defined. In the case of views, `Marionette.View` defines `triggerMethod`, but `Backbone.View` does not.

```javascript
var Mn = require('backbone.marionette');

Mn.triggerMethodOn(ctx, 'foo', bar);
// will invoke `onFoo: function(bar){...})`
// will trigger "foo" on ctx
```

## Marionette.bindEvents

This method is used to bind a backbone "entity" (e.g. collection/model)
to methods on a target object. This will work with any class that works
with the `Backbone.Events` API.
All Marionette Classes, such as the Views, come with this method.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyView = Bb.View.extend({

  modelEvents: {
    'change:foo': 'doSomething'
  },

  initialize: function(){
    Mn.bindEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
    this.trigger('something');
  }

});

var model = new Bb.Model();

var myView = new MyView({ model: model });

var MyObject = Mn.Object.extend({
  initialize: function() {
    this.bindEvents(myView, this.myEvents);
  },
  myEvents: {
    'something': 'onViewSomething'
  },
  onViewSomething: function() {
    console.log('view something');
  }
});

new MyObject();

model.set('foo')
```

[Live example](https://jsfiddle.net/marionettejs/L640ecac/)

The first parameter, `target`, must have the Backbone.Events module mixed in.

The second parameter is the `entity` (Backbone.Model, Backbone.Collection or
any object that has Backbone.Events mixed in) to bind the events from.

The third parameter is a hash of { 'event:name': 'eventHandler' }
configuration. Multiple handlers can be separated by a space. A
function can be supplied instead of a string handler name.

## Marionette.unbindEvents

This method can be used to unbind callbacks from entities' (e.g. collection/model) events. It's
the opposite of bindEvents, described above. Consequently, the APIs are identical for each method.
All Marionette Classes, such as the Views, come with this method.

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

This method is used to bind a radio requests to methods on a target object.
All Marionette Objects come with this method.

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

The third parameter is a hash either { 'event:name': 'eventHandler' } or
{ 'event:name': 'eventHandler', 'event:otherName': 'otherEventHandler', ...} of
configuration.

## Marionette.unbindRequests

This method is used to unbind a radio requests to methods on a target object.
All Marionette Objects come with this method.

```javascript
var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');

var MyView = Mn.View.extend({
  channelName: 'myChannelName',

  radioRequests: {
    'foo:bar': 'fooBar'
  },

  onAttach: function() {
    var channel = Radio.channel(this.channelName);
    Mn.bindRequests(this, channel, this.radioRequests);
  },

  onDetach: function() {
    var channel = Radio.channel(this.channelName);
    Mn.unbindRequests(this, channel, this.radioRequests);
  }
 });

```

[Live examples](https://jsfiddle.net/marionettejs/r5kmwwke/)

The first parameter, `this`, is a context of current entity.

The second parameter, `channel`, reference to a channel by name.

The third parameter is a hash either { 'event:name': 'eventHandler' } or
{ 'event:name': 'eventHandler', 'event:otherName': 'otherEventHandler', ...} of
configuration.

## Marionette.normalizeMethods

Receives a hash of event names and functions and/or function names, and returns the
same hash with the function names replaced with the function references themselves.
All Marionette Classes, such as the Views, come with this method.

```javascript
var Mn = require('backbone.marionette');

var View = Mn.View.extend({

  initialize: function() {
    var hash = {
      'action:one': 'handleActionOne', // This will become a reference to `this.handleActionOne`
      'action:two': this.handleActionTwo
    };

    this.normalizedHash = this.normalizeMethods(hash);
    // or equivalent Mn.normalizeMethods(this, hash);
  },

  do: function(action) {
    this.normalizedHash[action]();
  },

  handleActionOne: function() {
    console.log('action:one was fired');
  },

  handleActionTwo: function() {
    console.log('action:two was fired');
  }

});

var myView = new MyView();
myView.do('action:one');
myView.do('action:two');
```

[Live example](https://jsfiddle.net/marionettejs/zzjhm4p1/)

## Marionette.noConflict

Allows you to run multiple instances of Marionette in the same application. After loading the new version, call `noConflict()` to get a reference to it. At the same time the old version will be returned to Backbone.Marionette.

```javascript
var Mn = require('backbone.marionette');

var MnV3 = require('backbone.marionette/v3');

// Creates non-conflicting reference to secondary Marionette instance
MnV3 = MnV3.noConflict()

```
