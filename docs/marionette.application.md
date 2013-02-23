# Marionette.Application

The `Backbone.Marionette.Application` object is the hub of your composite 
application. It organizes, initializes and coordinates the various pieces of your
app. It also provides a starting point for you to call into, from your HTML 
script block or from your JavaScript files directly if you prefer to go that 
route.

The `Application` is meant to be instantiated directly, although you can extend
it to add your own functionality.

```js
MyApp = new Backbone.Marionette.Application();
```

## Documentation Index

* [Adding Initializers](#adding-initializers)
* [Application Event](#application-event)
* [Starting An Application](#starting-an-application)
* [app.vent: Event Aggregator](#appvent-event-aggregator)
* [Regions And The Application Object](#regions-and-the-application-object)
  * [jQuery Selector](#jquery-selector)
  * [Custom Region Type](#custom-region-type)
  * [Custom Region Type And Selector](#custom-region-type-and-selector)
  * [Removing Regions](#removing-regions)

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
the callback. In other words, `this` is the `MyApp` object, inside
of the initializer function.

The `options` parameters is passed from the `start` method (see below).

Initializer callbacks are guaranteed to run, no matter when you
add them to the app object. If you add them before the app is
started, they will run when the `start` method is called. If you
add them after the app is started, they will run immediately.

## Application Event

The `Application` object raises a few events during its lifecycle, using the
[Marionette.triggerMethod](./marionette.functions.md) function. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start the
`Backbone.history`.

The events that are currently triggered, are:

* **"initialize:before" / `onInitializeBefore`**: fired just before the initializers kick off
* **"initialize:after" / `onInitializeAfter`**: fires just after the initializers have finished
* **"start" / `onStart`**: fires after all initializers and after the initializer events

```js
MyApp.on("initialize:before", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
});

MyApp.on("initialize:after", function(options){
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
allows you to provide extra configuration for various parts of your app, at
initialization/start of the app, instead of just at definition.

```js
var options = {
  something: "some value",
  another: "#some-selector"
};

MyApp.start(options);
```

## app.vent: Event Aggregator

Every application instance comes with an instance of `Backbone.Wreqr.EventAggregator` 
called `app.vent`.

```js
MyApp = new Backbone.Marionette.Application();

MyApp.vent.on("foo", function(){
  alert("bar");
});

MyApp.vent.trigger("foo"); // => alert box "bar"
```

See the [`Backbone.Wreqr`](https://github.com/marionettejs/backbone.wreqr) documentation for more details.

## Regions And The Application Object

Marionette's `Region` objects can be directly added to an application by
calling the `addRegions` method.

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

### Custom Region Type

The second is to specify a custom region type, where the region type has
already specified a selector:

```js
MyCustomRegion = Marionette.Region.extend({
  el: "#foo"
});

MyApp.addRegions({
  someRegion: MyCustomRegion
});
```

### Custom Region Type And Selector

The third method is to specify a custom region type, and a jQuery selector
for this region instance, using an object literal:

```js
MyCustomRegion = Marionette.Region.extend({});

MyApp.addRegions({

  someRegion: {
    selector: "#foo",
    regionType: MyCustomRegion
  },

  anotherRegion: {
    selector: "#bar",
    regionType: MyCustomRegion
  }

});
```

### Removing Regions

Regions can also be removed with the `removeRegion` method, passing in 
the name of the region to remove as a string value:

```js
MyApp.removeRegion('someRegion');
```

Removing a region will properly close it before removing it from the
application object.

For more information on regions, see [the region documentation](./marionette.region.md)
