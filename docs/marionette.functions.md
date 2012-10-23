# Marionette functions

Marionette provides a set of utility / helper functions that are used to
facilitate common behaviors throughout the framework. These functions may
be useful to those that are building on top of Marionette, as the provide
a way to get the same behaviors and conventions from your own code.

## Documentation Index

* [Marionette.triggerMethod](#marionettetriggermethod)
* [Marionette.addEventBinder](#marionetteaddeventbinder)
* [Marionette.extend](#marionetteextend)

## Marionette.triggerMethod

Trigger an event and a corresponding method on the target object.

When an event is triggered, the first letter of each section of the 
event name is capitalized, and the word "on" is tagged on to the front 
of it. Examples:

* `triggerMethod("render")` fires the "onRender" function
* `triggerMethod("before:close")` fires the "onBeforeClose" function

All arguments that are passed to the triggerMethod call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

`triggerMethod("foo", bar)` will call `onFoo: function(bar){...})`

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
