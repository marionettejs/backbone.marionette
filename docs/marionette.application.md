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


## Documentation Index

* [What is the Application?](#what-is-the-application)
* [Root Layout](#root-layout)
* [Initialize](#initialize)
* [Application Events](#application-events)
* [Starting An Application](#starting-an-application)
* [Application.getOption](#applicationgetoption)

## What is the Application?

The `Application` is used to model your Marionette application under a single
entry point. The application provides:

* An obvious entry point to your app
* A clear hook for global events e.g. the `AppRouter`
* An interface to let you inject variables from the wider context into your app

The Application is that it comes with a `start` method. This can be used to
accomplish tasks before the rest of your application begins. Let's take a quick
look at an example:

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

In the simple example above, we could have just as easily started history after
our initial data had loaded. This pattern becomes more useful as the startup
phase of your application becomes more complex.

## Root Layout

As the `Application` is the entry point to your app, it makes sense that it will
hold a reference to the root entry of your View tree. Marionette 3 has added
this with the `region` attribute and `showView`. This example demonstrates how
we can use this:

```js
var RootView = require('./views/root');


var App = Marionette.Application.extend({
  region: '#root-element',

  onStart: function() {
    this.showView(new RootView());
  }
});

var myApp = new App();
myApp.start();
```

This will immediately render `RootView` and fire the usual triggers such as
`before:attach` and `attach` in addition to the `before:render` and `render`
triggers.

## Initialize

Like other objects in Backbone and Marionette, Applications have an `initialize`
method. It is called immediately after the Application has been instantiated,
and is invoked with the same arguments that the constructor received.

```js
var App = Marionette.Application.extend({
  initialize: function(options) {
    console.log('My value:', options.model.get('key'));
  }
});

// Although applications will not do anything
// with a `container` option out-of-the-box, you
// could build an Application Class that does use
// such an option.
var app = new App({model: new Backbone.Model({key: 'value'})});
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

### Application.mergeOptions
Merge keys from the `options` object directly onto the Application instance.

```js
var MyApp = Marionette.Application.extend({
  initialize: function(options) {
    this.mergeOptions(options, ['myOption']);

    console.log('The option is:', this.myOption);
  }
})
```

More information at [mergeOptions](./marionette.functions.md#marionettemergeoptions)

### Application.getOption
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md#marionettegetoption)
