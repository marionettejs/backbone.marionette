# Marionette.Callbacks

The `Callbacks` object assists in managing a collection of callback
methods, and executing them, in an async-safe manner.

There are only two methods:

* `add`
* `run`

The `add` method adds a new callback to be executed later. If passed
callback is asynchronous it should return JQuery Deferred's Promise object.

The `run` method executes all current callbacks in, using the
specified context for each of the callbacks, and supplying the
provided options to the callbacks. Also it returns JQuery Deferred's Promise
object that will be resolved after all callbacks are done.

## Documentation Index

* [Basic Usage](#basic-usage)
* [Specify Context Per-Callback](#specify-context-per-callback)
* [Advanced / Async Use](#advanced--async-use)

## Basic Usage

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  console.log("I'm a callback with " + options.value + "!");
});

callbacks.add(function(options){
  var defer = $.Deferred();

  setTimeout(function(){
    console.log("Async callback is done");
    defer.resolve();
  }, 1000);

  return defer.promise();
});

callbacks.run({value: "options"}, someContext).then(function(){
  console.log("Runing is finished");
});
```

This example will display an message in the console "I'm a callback
with options!". And after one second "Async callback is done" and
"Runing is finished" will be displayed. The executing context for each of the callback
methods has been set to the `someContext` object, which is an optional
parameter that can be any valid JavaScript object.

## Specify Context Per-Callback

You can optionally specify the context that you want each callback to be
executed with, when adding a callback:

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  alert("I'm a callback with " + options.value + "!");

   // specify callback context as second parameter
}, myContext);


// the `someContext` context is ignored by the above callback
callbacks.run({value: "options"}, someContext);
```

This will run the specified callback with the `myContext` object set as
`this` in the callback, instead of `someContext`.

## Advanced / Async Use

The `Callbacks` executes each callback in an async-friendly
manner, and can be used to facilitate async callbacks.
The `Marionette.Application` object uses `Callbacks`
to manage initializers (see above).

It can also be used to guarantee callback execution in an event
driven scenario, much like the application initializers.

