# Upgrade Guide

Marionette 3 introduces a number of breaking changes. This upgrade guide will go
through the major changes and describe how to change your application to
accommodate them.

An [upgrade tool](https://github.com/marionettejs/marionette-v3-compat) is available
and covers the breaking changes in detail.

Where possible, we will document how to make the changes in Marionette 2.x so
that your applications can continue to work and to ease the burden of upgrading
to Marionette 3.

## Views

The most noticeable change to Marionette 3 is the consolidation of `ItemView`
and `LayoutView` into `View`. In addition, `CompositeView` has been removed and
its functionality merged into `CollectionView` and `View`.

### Removing `LayoutView` and `ItemView`

Using separate `View` `LayoutView` and `ItemView` was complicating the API for
Marionette needlessly. The new `View` replaces all of this and sets a clear
recommendation for building layout trees.

#### Upgrading for Marionette 2.x

For updating in Marionette 2.x, it is recommended you change all instances of
`ItemView` to `LayoutView`.

#### Upgrading to Marionette 3

Change all instances of `LayoutView` and `ItemView` to `View`. Any views that
previously extended `View` with a custom `render` should work relatively
unchanged.

### Removing `CompositeView`

The `CompositeView` was deprecated in favor of using `View` and
`CollectionView`. The `CompositeView` will be completely removed in Marionette
4.

See [`CollectionView`](./marionette.collectionview.md#rendering-collectionviews)
for detail on upgrading to Marionette 3. This technique works in both Marionette
2.x and Marionette 3.

### Removing `CollectionView.getChildView()`

The `getChildView` method has been removed in favor of the `childView` property,
which now accepts a function.

#### Upgrading to Marionette 3

Simply replace all instances of `getChildView` with `childView`.

### Child event handlers

The `childEvents` attribute was renamed to `childViewEvents`.

Child event bubbling above one level is now removed in most instances and
deprecated pending removal everywhere else. This can no longer be relied upon.
To pass events further up the chain, you must explicitly using
`childViewTriggers` to convert the event from the child into an event on the
parent. These can be chained all the way up to the level you require them to be.

Bubbled child events no longer pass the `childView` implicitly and only pass the
arguments passed as part of `triggerMethod`. This means that the arguments
passed to `onEvent` and `onChildviewEvent` are now identical.

In Marionette 2, `childEvents` where bound on every event. In Marionette 3,
`childViewEvents` are bound once and cached. This means that you cannot add new
events after the view has been created.

### View `triggers`

The view `triggers` attribute no longer passes an `options` attribute to event
handlers, instead passing the view instance that triggered the event.

## Events

A number of lifecycle events were changed or removed from Marionette 3.
Information on which ones were removed, changed, or added will be found here
with recommendations on how to update your code.

### `show` and `before:show`

The `show` events were removed completely as they were redundant and were being
used incorrectly to show child regions. The `show` event was fired after the
view had been attached, meaning the DOM was being constantly updated, leading to
deteriorated performance.

#### Upgrading for Marionette 2.x

Replace all instances of `onShow`, `on('show')`, `onBeforeShow` and
`on('before:show')` to use the `render` and `before:render` events. This is the
recommendation for Marionette 3 and ensures the DOM tree is built in-memory
before modifying the DOM.

#### Upgrading to Marionette 3

Replace all instances of `show` and `before:show` with `render` and
`before:render`. If you want the view to be visible in the DOM, then listen to
the `dom:refresh` event.

### Changes to `region.show()`

The `region.show()` method (and by extension `showChildView()`) made a change to
how it displays views. Any HTML inside the region that *isn't* in a View will
not be removed from the region and the View's HTML will be appended after this
HTML. In Marionette 2, the `region.show()` method would call `$el.empty()`
before adding the new HTML.

## Templates

The biggest change to templates is renaming `templateHelpers` to
`templateContext` - the aim is to be more in-line with terminology from other
frameworks.

### Upgrading to Marionette 3

Simply replace all instances of `templateHelpers` with `templateContext`

## Regions

There are a number of changes to how regions behave - the biggest change being
the removal of the ability to access regions as attributes

### Removing `view.region`

The `view.<region_name>` syntax has been removed in favor of `view.getRegion()`,
`view.getChildView()` and `view.showChildView()`.

#### Upgrading for Marionette 2.x

Change all references to `view.region` to `view.getRegion('region')`. For
example, in Mn 2.x and below:

```javascript
var AnotherView = require('./anotherview');

var MyView = Mn.LayoutView.extend({
  regions: {
    myregion: '.regionname'
  },

  onRender: function() {
    this.myregion.show(new AnotherView());
  }
});
```

This does not work in Mn 3 - instead do:

```javascript
var AnotherView = require('./anotherview');

/* In Mn 2.x we can just use LayoutView */
var MyView = Mn.View.extend({
  regions: {
    myregion: '.regionname'
  },

  onRender: function() {
    this.showChildView('myregion', new AnotherView());
  }
});
```

See the documentation for [views](marionette.view.md#laying-out-views---regions)
to learn more about how to manage regions in Marionette 3.

## Modules

Marionette Modules have been completely removed in favor of using the more
standard JavaScript module loaders e.g.
[Webpack](./installation.md#quick-start-using-npm-and-webpack) or
[Browserify](./installation.md#quick-start-using-npm-and-browserify). See the
[installation](./installation.md) documentation for a list of potential options.
