# Marionette Configuration

Marionette has a few globally configurable settings that will
change how the system works. While many of these subjects are covered
in other docs, this configuration doc should provide a list of the
most common items to change.

## Documentation Index

* [Marionette.Deferred](#deferred)

## Marionette.Deferred <a name="deferred"></a>

By default, Marionette makes use of `Backbone.$.Deferred` to create
thenable objects.

### Overriding Marionette.Deferred

If you are using Marionette without jquery you must first shim `Backbone.$.Deferred` with a following object that adherses to these properties:

1. `promise`: a Promises/A+ thenable, or a function that returns one
2. `resolve`: a function that resolves the provided promise with a value

For example:

```js
var deferred = Marionette.Deferred();

_.result(deferred, 'promise').then(function (target) {
    console.log("Hello, " + target + "!");
});

deferred.resolve("world"); // asynchronous "Hello, world!"
```

If you wish to use a specific promise library, you can override the default via:

```js
Marionette.Deferred = myDeferredLib;
```
