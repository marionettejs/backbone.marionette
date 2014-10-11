## [View the new docs](http://marionettejs.com/docs/marionette.configuration.html)

# Marionette Configuration

Marionette has a few globally configurable settings that will
change how the system works. While many of these subjects are covered
in other docs, this configuration doc should provide a list of the
most common items to change.

## Marionette.Deferred

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in version 3 of Marionette. It is used to configure
> `Marionette.Callbacks`, which is also deprecated and scheduled to be removed in version 3. Instead of proxying
> the `Deferred` property on Marionette, use the native `Promise` object directly, and include a polyfill such as
> https://github.com/jakearchibald/es6-promise if you are supporting older browsers. `$.Deferred` can also be used, but
> it is not compliant with the ES6 Promise and is not recommended.

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
