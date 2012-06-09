## Marionette.EventAggregator

An event aggregator is an application level pub/sub mechanism that allows various
pieces of an otherwise segmented and disconnected system to communicate with
each other. 

### Basic Usage

Backbone.Marionette provides an event aggregator with each application instance: 
`MyApp.vent`. You can also instantiate your own event aggregator:

```js
myVent = new Backbone.Marionette.EventAggregator();
```

Passing an object literal of options to the constructor function will extend the
event aggregator with those options:

```js
myVent = new Backbone.Marionette.EventAggregator({foo: "bar"});
myVent.foo // => "bar"
```

### BindTo

The `EventAggregator` extends from the `BindTo` object (see below) to easily track
and unbind all event callbacks, including inline callback functions. 

The `bindTo` method, though, has been proxied to only take 3 arguments. It assumes
that the object being bound to is the event aggregator directly, and does not allow
the bound object to be specified:

```js
vent = new Backbone.Marionette.EventAggregator();

vent.bindTo("foo", function(){
  alert("bar");
});

vent.unbindAll();

vent.trigger("foo"); // => nothing. all events have been unbound.
```

### Decoupling With An Event-Driven Architecture

You can use an event aggregator to communicate between various modules of your
application, ensuring correct decoupling while also facilitating functionality
that needs more than one of your application's modules.

```js
var vent = new Backbone.Marionette.EventAggregator();

vent.bind("some:event", function(){
  alert("Some event was fired!!!!");
});
  
vent.trigger("some:event");
```

For a more detailed discussion and example of using an event aggregator with
Backbone applications, see the blog post: [References, Routing, and The Event
Aggregator: Coordinating Views In Backbone.js](http://lostechies.com/derickbailey/2011/07/19/references-routing-and-the-event-aggregator-coordinating-views-in-backbone-js/)


