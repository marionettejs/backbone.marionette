## [View the new docs](http://marionettejs.com/docs/marionette.controller.html)

# Marionette.Controller

> Warning: deprecated. The Controller object is deprecated. Instead of using the Controller
> class with the AppRouter, you should specify your callbacks on a plain Javascript object.

A Controller is an object used in the Marionette Router. Controllers are where you store
your Router's callbacks.

## Documentation Index

* [Basic Use](#basic-use)
* [Destroying A Controller](#destroying-a-controller)
* [mergeOptions](#mergeoptions)
* [getOption](#getoption)
* [Prior Usage](#prior-usage)

## Basic Use

A `Marionette.Controller` is intended to solely be used within the Router.

```js

// Create a Controller, giving it the callbacks for our Router.
var MyController = Marionette.Controller.extend({
  home: function() {},
  profile: function() {}
});

// Instantiate it
var myController = new MyController();

// Pass it into the Router
var myRouter = new Marionette.AppRouter({
  controller: myController,
  appRoutes: {
    "home": "home",
    "profile": "profile"
  }
});
```

## mergeOptions

Merge keys from the `options` object directly onto the instance. This is the preferred way to access options
passed into the Controller.

More information at [mergeOptions](./marionette.functions.md#marionettemergeoptions)

## getOption

Retrieve an object's attribute either directly from the object, or from the object's this.options, with this.options taking precedence.

More information [getOption](./marionette.functions.md#marionettegetoption)

## Destroying A Controller

Each Controller instance has a built in `destroy` method that handles
unbinding all of the events that are directly attached to the controller
instance, as well as those that are bound using the EventBinder from
the controller.

Invoking the `destroy` method will trigger the "before:destroy" and "destroy" events and the
corresponding `onBeforeDestory` and `onDestroy` method calls. These calls will be passed any arguments `destroy`
was invoked with.

```js
// define a controller with an onDestroy method
var MyController = Marionette.Controller.extend({

  onBeforeDestroy: function(arg1, arg2){
    // put custom code here, before destroying this controller
  }

  onDestroy: function(arg1, arg2){
    // put custom code here, to destroy this controller
  }

});

// create a new controller instance
var contr = new MyController();

// add some event handlers
contr.on("before:destroy", function(arg1, arg2){ ... });
contr.on("destroy", function(arg1, arg2){ ... });
contr.listenTo(something, "bar", function(){...});

// destroy the controller: unbind all of the
// event handlers, trigger the "destroy" event and
// call the onDestroy method
contr.destroy(arg1, arg2);
```

## Prior Usage

Before Marionette 2.1, the Controller had another use, which was a general-purpose, white-label object. This was confusing given its other use within the Router, and its name, which carries so much meaning in the context of MVC frameworks.

As of v2.1, a new Class is available for your use: Marionette.Object. We recommend using Marionette.Object instead of Marionette.Controller in all situations outside of the Router.
