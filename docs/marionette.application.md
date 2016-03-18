## [View the new docs](http://marionettejs.com/docs/marionette.application.html)

# Marionette.Application

The `Application` is used to model your Marionette application under a single
entry point. The application provides:

* An obvious entry point to your app
* A clear hook for global events e.g. the `AppRouter`
* An interface to let you inject variables from the wider context into your app

The Application comes with a `start` method. This can be used to accomplish
tasks before the rest of your application begins. Let's take a quick look at an
example:

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

## Documentation Index

* [Root Layout](#root-layout)
* [Initialize](#initialize)
* [Application Events](#application-events)
* [Starting An Application](#starting-an-application)
* [Application Methods](#application-methods)

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

// The application won't attach a model by default - this merely passes it into
// the options object to be, potentially, passed into views.
var app = new App({model: new Backbone.Model({key: 'value'})});
```

## Application Triggers

The `Application` object will fire two triggers:

### `before:start`

Fired just before the application is started. Use this to prepare the
application with anything it will need to start, for example setting up
routers, models, and collections.

### `start`

Fired as part of the application startup. This is where you should be showing
your views and starting `Backbone.history`.

### Application Lifecycle

```js
var Backbone = require('backbone');

var MyModel = require('./mymodel');
var MyView = require('./myview');

var App = Marionette.Application.extend({
  initialize: function(options) {
    console.log('My value:', options.model.get('key'));
  },

  onBeforeStart: function(options) {
    this.model = new MyModel(options.data);
  },

  onStart: function(options) {
    this.showView(new MyView({model: this.model}));
    Backbone.history.start();
  }
});
```

As we'll see below, the `options` object is passed into the Application as an
argument to `start`.

## Starting An Application

Once you have your application configured, you can kick everything off by
calling: `MyApp.start(options)`.

This function takes a single optional parameter. This parameter will be passed
to each of your initializer functions, as well as the initialize events. This
allows you to provide extra configuration for various parts of your app throughout the
initialization sequence.

```js
var app = new App();

app.start({
  data: {
    id: 1,
    text: 'value'
  }
});
```

## Method Reference

The Marionette Application provides helper methods for managing its attached
region.

### `getRegion()`

Return the attached [region object](./marionette.region.md) for the Application.

### `showView(View)`

Display `View` in the region attached to the Application. This runs the same
view lifecycle as [`View.showChildView`]('./marionette.view.md').

### `getView()`

Return the view currently being displayed in the Application's attached
`region`. If the Application is not currently displaying a view, this method
returns `undefined`.

### Marionette.Object Methods

`Marionette.Application` extends `Marionette.Object` and, as such, implements
the same method interface. See the [`Object`](./marionette.object.md)
reference for the full list.
