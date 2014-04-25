# Marionette.Controller

A multi-purpose object to use as a controller for
modules and routers, and as a mediator for workflow
and coordination of other objects, views, and more.

## Documentation Index

* [Basic Use](#basic-use)
* [Destroying A Controller](#destroying-a-controller)
* [On The Name 'Controller'](#on-the-name-controller)

## Basic Use

A `Marionette.Controller` can be extended, like other
Backbone and Marionette objects. It supports the standard
`initialize` method, has a built-in `EventBinder`, and
can trigger events, itself.

```js
// define a controller
var MyController = Marionette.Controller.extend({

  initialize: function(options){
    this.stuff = options.stuff;
  },

  doStuff: function(){
    this.trigger("stuff:done", this.stuff);
  }

});

// create an instance
var c = new MyController({
  stuff: "some stuff"
});

// use the built in EventBinder
c.listenTo(c, "stuff:done", function(stuff){
  console.log(stuff);
});

// do some stuff
c.doStuff();
```

## Destroying A Controller

Each Controller instance has a built in `destroy` method that handles
unbinding all of the events that are directly attached to the controller
instance, as well as those that are bound using the EventBinder from
the controller.

Invoking the `destroy` method will trigger a "destroy" event and corresponding
`onDestroy` method call. These calls will be passed any arguments `destroy`
was invoked with.

```js
// define a controller with an onDestroy method
var MyController = Marionette.Controller.extend({

  onDestroy: function(arg1, arg2){
    // put custom code here, to destroy this controller
  }

});

// create a new controller instance
var contr = new MyController();

// add some event handlers
contr.on("destroy", function(arg1, arg2){ ... });
contr.listenTo(something, "bar", function(){...});

// destroy the controller: unbind all of the
// event handlers, trigger the "destroy" event and
// call the onDestroy method
contr.destroy(arg1, arg2);
```

## On The Name 'Controller'

The name `Controller` is bound to cause a bit of confusion, which is
rather unfortunate. There was some discussion and debate about what to
call this object, the idea that people would confuse this with an
MVC style controller came up a number of times. In the end, we decided
to call this a controller anyway--as the typical use case is to control
the workflow and process of an application and/or module.

But the truth is, this is a very generic, multi-purpose object that can
serve many different roles, in many different scenarios. We are always open
to suggestions, with good reason and discussion, on renaming objects to
be more descriptive and less confusing. If you would like to suggest a
different name, please do so in either the mailing list or in the Github
Issues list.
