## [View the new docs](http://marionettejs.com/docs/marionette.application.html)

# Marionette.Application

The **Application** is a container for the rest of your code. It is recommended
that every Marionette app have at least one instance of Application.

By creating an Application you get three important things:

- A `start` method to kick off your application.
  This allows you an opportunity to do things that may need to occur before, say, you
  begin routing. An example would be making an AJAX call to request data that your app
  needs before starting.

- A namespace to keep things off of the `window`.
  If you are not using a module loader like ES6 modules, CommonJS, or AMD, then
  you can use the Application to store your Javascript objects. And if you are
  using one of those module systems, then you can still attach things to the
  application to aid in debugging.

- Integration with the Marionette Inspector. The Marionette Inspector is a fantastic tool
  that makes it easy to understand and debug your application. Using the Application Class
  will automatically hook up your application to that extension.

Note that the Application is undergoing many changes to become more lightweight. While it
still includes many more features beyond what has been listed here, such as a Radio Channel and Regions,
these features are now deprecated. Refer to the relevant sections below to learn what to use
instead of these deprecated features.

## Documentation Index

* [Getting Started](#getting-started)
* [initialize](#initialize)
* [Application Events](#application-events)
* [Starting An Application](#starting-an-application)
* [Application.getOption](#applicationgetoption)
* [Adding Initializers (deprecated)](#adding-initializers)

### Getting Started

A common pattern in Backbone apps is the following:

```js
var app = {};
```

Two notable examples of this pattern are
[DocumentCloud's source](https://github.com/documentcloud/documentcloud/blob/master/public/javascripts/application.js#L3) and
[Backbone Boilerplate](https://github.com/backbone-boilerplate/backbone-boilerplate/blob/master/app/app.js#L1-L6). DocumentCloud
is notable because it is the codebase that Backbone was abstracted from. If such a thing as a quintessential Backbone application
existed, then that app would certainly be a candidate. Backbone Boilerplate is notable as perhaps the most popular library
for bootstrapping a Backbone application. Do note that in the Backbone Boilerplate code the exported object is implicit.

The pattern of creating a Javascript object is so popular because it provides you with a location to
put the pieces of your application. For instance, attaching a Router to this object is common practice.

Using a raw Javascript object is great, but Marionette provides a light wrapper for a plain Javascript object, which is the
Application. One benefit to using the Application is that it comes with a `start` method. This can be used to accomplish
tasks before the rest of your application begins. Let's take a quick look at an example:

```js
// Create our Application
var app = new Mn.Application();

// Start history when our application is ready
app.on('start', function() {
  Backbone.history.start();
});

// Load some initial data, and then start our application
loadInitialData().then(app.start);
```

In the simple example above, we could have just as easily started history after our initial data had loaded. This
pattern becomes more useful as the startup phase of your application becomes more complex.

### Initialize

Like other objects in Backbone and Marionette, Applications have an `initialize` method.
It is called immediately after the Application has been instantiated, and is invoked with
the same arguments that the constructor received.

```js
var app = Marionette.Application.extend({
  initialize: function(options) {
    console.log('My container:', options.container);
  }
});

// Although applications will not do anything
// with a `container` option out-of-the-box, you
// could build an Application Class that does use
// such an option.
var app = new app({container: '#app'});
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
