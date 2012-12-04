# Marionette functions

Marionette provides a set of utility / helper functions that are used to
facilitate common behaviors throughout the framework. These functions may
be useful to those that are building on top of Marionette, as the provide
a way to get the same behaviors and conventions from your own code.

## Documentation Index

* [Marionette.addEventBinder](#marionetteaddeventbinder)
* [Marionette.createObject](#marionettecreateobject)
* [Marionette.extend](#marionetteextend)
* [Marionette.getOption](#marionetteextend)
* [Marionette.triggerMethod](#marionettetriggermethod)
* [Marionette.bindEntityEvent](#marionettebindentityevents)

## Marionette.addEventBinder

Add a [Backbone.EventBinder](https://github.com/marionettejs/backbone.eventbinder)
instance to any target object. This method attaches an `eventBinder` to
the target object, and then copies the necessary methods to the target
while maintaining the event binder in it's own object. 

```js
myObj = {};

Marionette.addEventBinder(myObj);

myObj.bindTo(aModel, "foo", function(){...});
```

This allows the event binder's implementation to vary independently
of it being attached to the view. For example, the internal structure
used to store the events can change without worry about it interfering
with Marionette's views.

## Marionette.createObject

Marionette provides a method called `Marionette.createObject`. This method
is a simple wrapper around / shim for a native `Object.create`, allowing
simple prototypal inheritance for various purposes. 

There is an intended limitation of only allowing the first parameter for the 
[Object.create](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create)
method. Since ES "properties" cannot be back-filled in to old versions,
the second parameter is not supported.

### CAVEAT EMPTOR

This method is not intended to be a polyfill or shim used outside of
Marionette. Use at your own risk.

If you need a true polyfill or shim for older browser support, we recommend
you include one of the following in your project:

* [Modernizr](http://modernizr.com/)
* [cujojs/poly](https://github.com/cujojs/poly)
* [ES5-Shim](https://github.com/kriskowal/es5-shim)
* Any other proper shim / polyfill for backward compatibility

Be sure to include your preferred shim / polyfill BEFORE any other script
files in your app. This will ensure Marionette uses
your polyfill instead of the built in `Marionette.createObject`.

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

// Now Foo can be extended to create a new type, with methods
var Bar = Foo.extend({

  someMethod: function(){ ... }

  // ...
});

// Create an instance of Bar
var b = new Bar();
```

## Marionette.getOption

Retrieve an object's attribute either directly from the object, or from
the object's `this.options`, with `this.options` taking precedence.

```js
var M = Backbone.Model.extend({
  foo: "bar",

  initialize: function(){
    var f = Marionette.getOption(this, "foo");
    console.log(f);
  }
});

new M(); // => "bar"

new M({}, { foo: "quux" }); // => "quux"
```

This is useful when building an object that can have configuration set
in either the object definition or the object's constructor options.

## Marionette.triggerMethod

Trigger an event and a corresponding method on the target object.

When an event is triggered, the first letter of each section of the 
event name is capitalized, and the word "on" is tagged on to the front 
of it. Examples:

* `triggerMethod("render")` fires the "onRender" function
* `triggerMethod("before:close")` fires the "onBeforeClose" function

All arguments that are passed to the triggerMethod call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

`triggerMethod("foo", bar)` will call `onFoo: function(bar){...})`

## Marionette.bindEntityEvents

This method is used to bind a backbone "entity" (collection/model) 
to methods on a target object. 

```js
Backbone.View.extend({

  modelEvents: {
    "change:foo": "doSomething"
  },

  initialize: function(){
    Marionette.bindEntityEvents(this, this.model, this.modelEvents);
  },

  doSomething: function(){
    // the "change:foo" event was fired from the model
    // respond to it appropriately, here.
  }

});
```

The first paremter, `target`, must have a `bindTo` method from the
EventBinder object.

The second parameter is the entity (Backbone.Model or Backbone.Collection)
to bind the events from.

The third parameter is a hash of { "event:name": "eventHandler" }
configuration. Multiple handlers can be separated by a space. A
function can be supplied instead of a string handler name. 

