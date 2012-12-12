# Marionette.Controller

A multi-purpose object to use as a controller for
modules and routers, and as a mediator for workflow
and coordination of other objects, views, and more.

## Documentation Index

* [Basic Use](#basic-use)
* [Closing A Controller](#closing-a-controller)
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
c.bindTo(c, "stuff:done", function(stuff){
  console.log(stuff);
});

// do some stuff
c.doStuff();
```

## Closing A Controller

Each Controller instance has a built in `close` method that handles
unbinding all of the events that are directly attached to the controller
instance, as well as those that are bound using the EventBinder from
the controller.

The `close` method will trigger a "close" event and corresponding
`onClose` method call:

```js
// define a controller with an onClose method
var MyController = Marionette.Controller.extend({

  onClose: function(){
    // put custom code here, to close this controller
  }

})

// create a new controller instance
var contr = new MyController();

// add some event handlers
contr.on("close", function(){ ... });
contr.bindTo(something, "bar", function(){...});

// close the controller: unbind all of the
// event handlers, trigger the "close" event and 
// call the onClose method
controller.close();
```

## On The Name 'Controller'

The name `Controller` is bound to cause a bit of confusion, which is
rather unfortunate. There was some discussion and debate about what to
call this object, the idea that people would confuse this with an 
MVC style controller came up a number of times. In the end, we decided
to call this a controller anyways, as the typical use case is to control
the workflow and process of an application and / or module. 

But the truth is, this is a very generic, multi-purpose object that can
serve many different roles in many different scenarios. We are always open
to suggestions, with good reason and discussion, on renaming objects to
be more descriptive, less confusing, etc. If you would like to suggest a
different name, please do so in either the mailing list or the github
issues list.

