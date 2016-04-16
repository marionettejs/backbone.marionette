# Upgrade Guide

Marionette 3 introduces a number of breaking changes. This upgrade guide will go
through the major changes and describe how to change your application to
accommodate them.

Where possible, we will document how to make the changes in Marionette 2.4.5 so
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

#### Upgrading for Marionette 2.4.5

For updating in Marionette 2.4.5, it is recommended you change all instances of
`ItemView` to `LayoutView`.

#### Upgrading to Marionette 3

Change all instances of `LayoutView` and `ItemView` to `View`. Any views that
previously extended `View` with a custom `render` should work relatively
unchanged.

### Removing `CompositeView`

The `CompositeView` was removed in favor of using `View` and `CollectionView`.

See [`CollectionView`](./marionette.collectionview.md#rendering-collectionviews)
for detail on upgrading to Marionette 3. This technique works in both Marionette
2.4.5 and Marionette 3.

## Events

A number of lifecycle events were changed or removed from Marionette 3.
Information on which ones were removed, changed, or added will be found here
with recommendations on how to update your code.

### `show` and `before:show`

The `show` events were removed completely as they were redundant and were being
used incorrectly to show child regions. The `show` event was fired after the
view had been attached, meaning the DOM was being constantly updated, leading to
deteriorated performance.

#### Upgrading for Marionette 2.4.5

Replace all instances of `onShow`, `on('show')`, `onBeforeShow` and
`on('before:show')` to use the `render` and `before:render` events. This is the
recommendation for Marionette 3 and ensures the DOM tree is built in-memory
before modifying the DOM.

#### Upgrading to Marionette 3

Replace all instances of `show` and `before:show` with `render` and
`before:render`. If you want the view to be visible in the DOM, then listen to
the `attach` event.
