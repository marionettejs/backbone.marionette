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

The most notable example of this pattern is
[DocumentCloud's source](https://github.com/documentcloud/documentcloud/blob/master/public/javascripts/application.js#L3). DocumentCloud
is notable because it is the codebase that Backbone was abstracted from. If such a thing as a quintessential Backbone application
existed, then that app would certainly be a candidate.

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
