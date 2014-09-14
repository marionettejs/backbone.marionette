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

* [Initialize](#initialize)
* [Adding Initializers](#adding-initializers)
* [Application Event](#application-event)
* [Starting An Application](#starting-an-application)
* [The Application Channel](#the-application-channel)
  * [Event Aggregator](#event-aggregator)
  * [Request Response](#request-response)
  * [Commands](#commands)
  * [Accessing the Application Channel](#accessing-the-application-channel)
* [Regions And The Application Object](#regions-and-the-application-object)
  * [jQuery Selector](#jquery-selector)
  * [Custom Region Class](#custom-region-class)
  * [Custom Region Class And Selector](#custom-region-class-and-selector)
  * [Region Options](#region-options)
  * [Overriding the default RegionManager](#overriding-the-default-regionmanager)
  * [Get Region By Name](#get-region-by-name)
  * [Removing Regions](#removing-regions)
* [Application.getOption](#applicationgetoption)

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

## Adding Initializers

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
  MyApp.mainRegion.show(myView);
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

## Application Event

The `Application` object raises a few events during its lifecycle, using the
[Marionette.triggerMethod](./marionette.functions.md) function. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start
`Backbone.history`.

The events that are currently triggered, are:

* **"before:start" / `onBeforeStart`**: fired just before the `Application` starts and before the initializers are executed.
* **"start" / `onStart`**: fires after the `Application` has started and after the initializers have been executed.

```js
MyApp.on("before:start", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
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

## The Application Channel

Marionette Applications come with a [messaging system](http://en.wikipedia.org/wiki/Message_passing) to facilitate communications within your app.

The messaging system on the Application is the radio channel from Backbone.Wreqr, which is actually comprised of three distinct systems.

Marionette Applications default to the 'global' channel, but the channel can be configured.

```js
var MyApp = new Marionette.Application({ channelName: 'appChannel' });
```

This section will give a brief overview of the systems; for a more in-depth look you are encouraged to read
the [`Backbone.Wreqr` documentation](https://github.com/marionettejs/backbone.wreqr).

### Event Aggregator

The Event Aggregator is available through the `vent` property. `vent` is convenient for passively sharing information between
pieces of your application as events occur.

```js
var MyApp = new Backbone.Marionette.Application();

// Alert the user on the 'minutePassed' event
MyApp.vent.on("minutePassed", function(someData){
  alert("Received", someData);
});

// This will emit an event with the value of window.someData every minute
window.setInterval(function() {
  MyApp.vent.trigger("minutePassed", window.someData);
}, 1000 * 60);
```

### Request Response

Request Response is a means for any component to request information from another component without being tightly coupled. An instance of Request Response is available on the Application as the `reqres` property.

```js
var MyApp = new Backbone.Marionette.Application();

// Set up a handler to return a todoList based on type
MyApp.reqres.setHandler("todoList", function(type){
  return this.todoLists[type];
});

// Make the request to get the grocery list
var groceryList = MyApp.reqres.request("todoList", "groceries");

// The request method can also be accessed directly from the application object
var groceryList = MyApp.request("todoList", "groceries");
```

### Commands

Commands are used to make any component tell another component to perform an action without a direct reference to it. A Commands instance is available under the `commands` property of the Application.

Note that the callback of a command is not meant to return a value.

```js
var MyApp = new Backbone.Marionette.Application();

MyApp.model = new Backbone.Model();

// Set up the handler to call fetch on the model
MyApp.commands.setHandler("fetchData", function(reset){
  MyApp.model.fetch({reset: reset});
});

// Order that the data be fetched
MyApp.commands.execute("fetchData", true);

// The execute function is also available directly from the application
MyApp.execute("fetchData", true);
```

### Accessing the Application Channel

To access this application channel from other objects within your app you are encouraged to get a handle of the systems
through the Wreqr API instead of the Application instance itself.

```js
// Assuming that we're in some class within your app,
// and that we are using the default 'global' channel
// it is preferable to access the channel like this:
var globalCh = Backbone.Wreqr.radio.channel('global');
globalCh.vent;

// This is discouraged because it assumes the name of your application
window.app.vent;
```

## Regions And The Application Object

Application instances have an API that allow you to manage [Regions](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md).
These Regions are typically the means through which your views become attached to the `document`.

You can create Regions through the `addRegions` method by passing in an object
literal or a function that returns an object literal.

There are three syntax forms for adding a region to an application object.

### jQuery Selector

The first is to specify a jQuery selector as the value of the region
definition. This will create an instance of a Marionette.Region directly,
and assign it to the selector:

```js
MyApp.addRegions({
  someRegion: "#some-div",
  anotherRegion: "#another-div"
});
```

### Custom Region Class

The second is to specify a custom region class, where the region class has
already specified a selector:

```js
var MyCustomRegion = Marionette.Region.extend({
  el: "#foo"
});

MyApp.addRegions(function() {
  return {
    someRegion: MyCustomRegion
  };
});
```

### Custom Region Class And Selector

The third method is to specify a custom region class, and a jQuery selector
for this region instance, using an object literal:

```js
var MyCustomRegion = Marionette.Region.extend({});

MyApp.addRegions({

  someRegion: {
    selector: "#foo",
    regionClass: MyCustomRegion
  },

  anotherRegion: {
    selector: "#bar",
    regionClass: MyCustomRegion
  }

});
```

### Region Options

You can also specify regions per `Application` instance.

```js
new Marionette.Application({
  regions: {
    fooRegion: '#foo-region'
  }
});
```

### Overriding the default `RegionManager`

If you need the `RegionManager`'s class chosen dynamically, specify `getRegionManager`:

```js
Marionette.Application.extend({
  // ...

  getRegionManager: function() {
    // custom logic
    return new MyRegionManager();
  }
```

This can be useful if you want to attach `Application`'s regions to your own instance of `RegionManager`.

### Get Region By Name

A region can be retrieved by name, using the `getRegion` method:

```js
var app = new Marionette.Application();
app.addRegions({ r1: "#region1" });

var myRegion = app.getRegion('r1');
```

Regions are also attached directly to the Application instance, **but this is not recommended usage**.

### Removing Regions

Regions can also be removed with the `removeRegion` method, passing in
the name of the region to remove as a string value:

```js
MyApp.removeRegion('someRegion');
```

Removing a region will properly empty it before removing it from the
application object.

For more information on regions, see [the region documentation](./marionette.region.md) Also, the API that Applications use to
manage regions comes from the RegionManager Class, which is documented [over here](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.regionmanager.md).

### Application.getOption
Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md)
