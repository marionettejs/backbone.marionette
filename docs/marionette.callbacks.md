## Marionette.Callbacks

The `Callbacks` object assists in managing a collection of callback
methods, and executing them, in an async-safe manner.

There are only two methods: 

* `add`
* `run`

The `add` method adds a new callback to be executed later. 

The `run` method executes all current callbacks in, using the
specified context for each of the callbacks, and supplying the
provided options to the callbacks.

### Basic Usage

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  alert("I'm a callback with " + options.value + "!");
});

callbacks.run({value: "options"}, someContext);
```

This example will display an alert box that says "I'm a callback
with options!". The executing context for each of the callback
methods has been set to the `someContext` object, which is an optional
parameter that can be any valid JavaScript object.

### Specify Context Per-Callback

You can optionally specify the context that you want each callback to be
executed with, when adding a callback:

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  alert("I'm a callback with " + options.value + "!");

   // specify callback context as second parameter
}, myContext);


// the `someContext` context is ignore by the above callback
callbacks.run({value: "options"}, someContext);
```

This will run the specified callback with the `myContext` object set as
`this` in the callback, instead of `someContext`.

### Advanced / Async Use

The `Callbacks` executes each callback in an async-friendly 
manner, and can be used to facilitate async callbacks. 
The `Marionette.Application` object uses `Callbacks`
to manage initializers (see above). 

It can also be used to guarantee callback execution in an event
driven scenario, much like the application initializers.

