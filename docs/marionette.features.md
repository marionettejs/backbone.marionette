# Features

Marionette Features are opt-in functionality. That you can enable by setting `Marionette.FEATURES` in your app.
It is a good practice to set these flags only once prior to instantiating any Marionette class.

```javascript
Marionette.setEnabled('fooFlag', true);

var myApp = new MyApp({
  region: '#app-hook'
});

myApp.start();
```

##### Goals:
+ make it possible to add breaking changes in a minor release
+ give community members a chance to provide feedback for new functionality

## `childViewEventPrefix`

This flag is set to `true` by default.

This flag indicates whether [`childViewEventPrefix`](./events.md#a-child-views-event-prefix)
for all views will return the default value of `'childview'` or if it will return `false`
disabling [automatic event bubbling](./events.md#event-bubbling).

## `triggersPreventDefault`

This flag is set to `true` by default.

It indicates the whether or not [`View.triggers` will call `event.preventDefault()`](./marionette.view.md#view-triggers-event-object) if not explicitly defined by the trigger.
In v2 and v3 the default has been true, but for v4 [`false` is being considered](https://github.com/marionettejs/backbone.marionette/issues/2926).

## `triggersStopPropagating`

This flag is set to `true` by default.

It indicates the whether or not [`View.triggers` will call `event.stopPropagating()`](./marionette.view.md#view-triggers-event-object) if not explicitly defined by the trigger.
In v2 and v3 the default has been true, but for v4 [`false` is being considered](https://github.com/marionettejs/backbone.marionette/issues/2926).
