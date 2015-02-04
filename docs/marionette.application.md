## [View the new docs](http://marionettejs.com/docs/marionette.application.html)

# Marionette.Application

The `Backbone.Marionette.Application` object is the hub of your composite
application. It organizes, initializes and coordinates the various pieces of your
app. It also provides a starting point for you to call into from your HTML
script block, or directly from your JavaScript files if you prefer to go that
route.

The `Application` is meant to be instantiated directly, although you can extend
it to add your own functionality.

```js
var MyApp = new Backbone.Marionette.Application();
```

## Documentation Index

* [initialize](#initialize)
* [Application Events](#application-events)
* [Starting An Application](#starting-an-application)
* [Application.getOption](#applicationgetoption)
* [Adding Initializers (deprecated)](#adding-initializers)

### Initialize
Initialize is called immediately after the Application has been instantiated,
and is invoked with the same arguments that the constructor received.

```js
var MyApp = Marionette.Application.extend({
  initialize: function(options) {
    console.log(options.container);
  }
});

var myApp = new MyApp({container: '#app'});
```

## Application Events

The `Application` object raises a few events during its lifecycle, using the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) function. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start
`Backbone.history`.

The events that are currently triggered, are:

* **"before:start" / `onBeforeStart`**: fired just before the `Application` starts and before the initializers are executed.
* **"start" / `onStart`**: fires after the `Application` has started and after the initializers have been executed.

```js
MyApp.on("before:start", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!";
});

MyApp.on("start", function(options){
  if (Backbone.history){
    Backbone.history.start();
  }
});
```

The `options` parameter is passed through the `start` method of the application
object (see below).

## Starting An Application

Once you have your application configured, you can kick everything off by
calling: `MyApp.start(options)`.

This function takes a single optional parameter. This parameter will be passed
to each of your initializer functions, as well as the initialize events. This
allows you to provide extra configuration for various parts of your app throughout the
initialization sequence.

```js
var options = {
  something: "some value",
  another: "#some-selector"
};

MyApp.start(options);
```

### Application.getOption
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md#marionettegetoption)

## Adding Initializers

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in version 3 of Marionette. Instead
> of Initializers, you should use events to manage start-up logic. The `start` event is an ideal
> substitute for Initializers.
>
> If you were relying on the deferred nature of Initializers in your app, you should instead
> use Promises. This might look something like the following:
>
> ```js
> doAsyncThings().then(app.start);
> ```
>

Your application needs to do useful things, like displaying content in your
regions, starting up your routers, and more. To accomplish these tasks and
ensure that your `Application` is fully configured, you can add initializer
callbacks to the application.

```js
MyApp.addInitializer(function(options){
  // do useful stuff here
  var myView = new MyView({
    model: options.someModel
  });
  MyApp.rootView.mainRegion.show(myView);
});

MyApp.addInitializer(function(options){
  new MyAppRouter();
  Backbone.history.start();
});
```

These callbacks will be executed when you start your application,
and are bound to the application object as the context for
the callback. In other words, `this` is the `MyApp` object inside
of the initializer function.

The `options` argument is passed from the `start` method (see below).

Initializer callbacks are guaranteed to run, no matter when you
add them to the app object. If you add them before the app is
started, they will run when the `start` method is called. If you
add them after the app is started, they will run immediately.
