# View Lifecycle

The Marionette views use an event lifecycle, triggering events on any listeners
to act at different points inside the creation and destruction of views and
their children.

## Documentation Index

* [`View` Lifecycle](#view-lifecycle)
  * [View Creation Lifecycle](#view-creation-lifecycle)
  * [View Destruction Lifecycle](#view-destruction-lifecycle)
  * [View Creation Events](#view-creation-events)
  * [View Destruction Events](#view-destruction-events-events)
  * [Other View Events](#other-view-events)
* [`CollectionView` Lifecycle](#collectionview-lifecycle)
  * [Collection Creation Lifecycle](#collection-creation-lifecycle)
  * [Collection Destruction Lifecycle](#collection-destruction-lifecycle)
  * [Collection Creation Events](#collection-creation-events)
  * [Collection Destruction Events](#collection-destruction-events-events)
  * [Other Collection Events](#other-collection-events)

## `View` Lifecycle
Marionette views defined a number of events during the creation and destruction
lifecycle - when the view is displayed in and emptied from a region. In the
documentation, we will reference the event name, though `onEvent` handling can
be used.

### View Creation Lifecycle

When a view is initialized and then displayed inside a region (using
`showChildView()`) a set of events will be called in a specific order.

| Order |      Event      |
| :---: |-----------------|
|   1   | `before:render` |
|   2   | `render`        |
|   3   | `before:attach` |
|   4   | `attach`        |
|   5   | `dom:refresh`   |

### View Destruction Lifecycle

When  `region.empty()` is called, the view will be destroyed, calling events as
part of the destruction lifecycle.

| Order |       Event       |
| :---: |-------------------|
|   1   |  `before:destroy` |
|   2   |  `before:detach`  |
|   3   |  `detach`         |
|   4   |  `destroy`        |

### View Creation Events

These events are fired during the view's creation and rendering in a region.

#### View `before:render`

Triggered before a View is rendered.

```javascript
var Mn = require('backbone.marionette');

Mn.View.extend({
  onBeforeRender: function() {
    // set up final bits just before rendering the view's `el`
  }
});
```

#### View `render`

Triggered after the view has been rendered.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered.

```javascript
var Mn = require('backbone.marionette');

Mn.View.extend({
  onRender: function() {
    console.log('el exists but is not visible in the DOM');
  }
});
```

#### View `before:attach`

Triggered after the View has been rendered but just before it is first bound
into the page DOM. This will only be triggered once per `region.show()` - if
you want something that will be triggered every time the DOM changes,
you may want `render` or `before:render`.

#### View `attach`

Triggered once the View has been bound into the DOM. This is only triggered
once - the first time the View is attached to the DOM. If you want an event that
triggers every time the DOM changes visibly, you may want `dom:refresh`

#### View `dom:refresh`

Triggered after the first `attach` event fires _and_ every time the visible DOM
changes.

**Note for upgrading from Marionette 2** If you were using the `show` event -
the `dom:refresh` event may be a better event than `attach` when you want to be
sure something will run once your `el` has been attached to the DOM and updates.

### View Destruction Events

These events are fired during the view's destruction and removal from a region.

#### View `before:destroy`

Triggered just prior to destroying the view, when the view's `destroy()` method has been called.

```javascript
var Mn = require('backbone.marionette');

Mn.View.extend({
  onBeforeDestroy: function() {
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

#### View `before:detach`

The `View` will trigger the "before:detach" event when the view is rendered and
is about to be removed from the DOM.
If the view has not been rendered before, this event will not be fired.

#### View `detach`
The `View` will trigger the "detach" event when the view was rendered and has
just been destroyed.

#### View `destroy`

Triggered just after the view has been destroyed. At this point, the view has
been completely removed from the DOM.

```javascript
var Mn = require('backbone.marionette');

Mn.View.extend({
  onDestroy: function() {
    // custom destroying and cleanup goes here
  }
});
```

### Other View Events

These events are fired on specific actions performed on the view.

#### View `before:add:region`

When you add a region to a view - through `addRegion()` - the
`before:add:region` event will fire just before the region is actually added.

#### View `add:region`

When a region is added to a view - through `addRegion()` - the `add:region`
event will be fired. This happens just after the region is added and is
available to use on the view.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  onAddRegion: function(name, region) {
    console.log('Region called ' + name + ' was added');
  }
});

var myView = new MyView();
myView.addRegion('regionName', '#selector');
```

#### View `before:remove:region`

The `View` will trigger a "before:remove:region"
event before a region is removed from the view.
This allows you to perform any cleanup operations before the region is removed.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  onBeforeRemoveRegion: function(name) {
    console.log('Region called ' + name + ' is about to be removed');
  },

  regions: {
    regionName: '#selector'
  }
});

var myView = new MyView();
myView.removeRegion("foo");
```

#### View `remove:region`

The `View` will trigger a "remove:region"
event when a region is removed from the view.
This allows you to use the region instance one last
time, or remove the region from an object that has a
reference to it:

```javascript
var Mn = require('backbone.marionette');

var view = new Mn.View();

view.on("remove:region", function(name, region) {
  // add the region instance to an object
  delete myObject[name];
});

view.addRegion("foo", "#bar");

view.removeRegion("foo");
```

## `CollectionView` Lifecycle

The `CollectionView` has its own lifecycle around the standard `View` event
rendering lifecycle. This section covers the events that get triggered and what
they indicate.

### Collection Creation Lifecycle

The `CollectionView` creation lifecycle can go down two paths depending on
whether the collection is populated or empty. The below table shows the order of
rendering events firing:

| Order |           Event          |
| :---: |--------------------------|
|   1   |      `before:render`     |
|  2*   |  `before:render:empty`   |
|  2+   | `before:render:children` |
|   3   |    `before:add:child`    |
|   4   |       `add:child`        |
|  5*   |      `render:empty`      |
|  5+   |     `render:children`    |
|   6   |          `render`        |
|   7   |      `before:attach`     |
|   8   |         `attach`         |
|   9   |       `dom:refresh`      |

The events marked with "\*" only fire on empty collections and events marked
with "+" fire on collections with items.

### Collection Destruction Lifecycle

When a `CollectionView` is destroyed it fires a series of events in order to
reflect the different stages of the destruction process.

| Order |             Event            |
| :---: |------------------------------|
|   1   |        `before:destroy`      |
|   2   |        `before:detach`       |
|   3   |           `detach`           |
|   4   |  `before:destroy:children`   |
|  5*   |      `before:remove:empty`   |
|  5+   |      `before:remove:child`   |
|  6*   |         `remove:child`       |
|  6+   |         `remove:empty`       |
|   7   |           `destroy`          |

The events marked with "\*" only fire on empty collections and events marked
with "+" fire on collections with items.

### Collection Creation Events

#### CollectionView `before:render`

Triggers before the `CollectionView` render process starts. See the
[`before:render` Documentation](#marionette.view.md#view-before-render) for an
example.

#### CollectionView `before:render:empty`

Triggers just before rendering a collection `emptyView`. This won't be fired if
the collection has 1 or more elements in.

#### CollectionView `before:render:children`

This event fires just before rendering the children in the `CollectionView`.
This only fires if the collection has at least one item.

#### CollectionView `before:add:child`

This event fires before each child is added to the view. If the collection is
empty, this fires exactly once for the `emptyView`.

#### CollectionView `add:child`

This event fires after each child is added to the view. This fires once for each
item in the attached collection.

If the collection is empty, this event fires exactly once for the `emptyView`.

#### CollectionView `render:empty`

This event fires once the `emptyView` has been rendered. This will only fire if
the attached collection is empty.

#### CollectionView `render:children`

This event fires once all the collection's child views have been rendered.  This
only fires if the collection has at least one item. This may also fire when
[`reorderOnSort`](#collectionviews-reorderonsort) is false:

```
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyView = Mn.CollectionView.extend({
  onRenderChildren: function({
    console.log('The collectionview children have been rendered');
  })
});

var myView = new MyView({
  collection: new Bb.Collection([{ id: 1 }]);
});

myView.render();
```

#### CollectionView `render`

Fires when the collection has completely finished rendering. See the
[`render` Documentation](./marionette.view.md#view-render) for more information.

### Collection Destruction Events

#### CollectionView `before:destroy`

Fires as the destruction process is beginning. This is best used to perform any
necessary cleanup within the `CollectionView`.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.CollectionView.extend({
  onBeforeDestroy: function() {
    console.log('The CollectionView is about to be destroyed');
  }
});

var myView = new MyView();

myView.destroy();
```

#### CollectionView `before:detach`

Fires just before the `CollectionView` is removed from the DOM. If you need to
remove any event handlers or UI modifications, this would be the best time to do
that.

#### CollectionView `detach`

Fires just after the `CollectionView` is removed from the DOM. The view's
elements will still exist in memory if you need to access them.

#### CollectionView `before:destroy:children`

This is triggered just before the `childView` items are destroyed.

Triggered when the `collectionView` is destroyed or before the `collectionView`'s children are re-rendered.

#### CollectionView `before:remove:empty`

This is triggered just before the `emptyView` is removed from the
`CollectionView`. *This only fires if the attached `collection` has no items.*

The `emptyView` will then go through the its own
[destruction lifecycle](./marionette.view.md#view-destruction-lifecycle)

#### CollectionView `before:remove:child`

This is triggered for each `childView` that is removed from the
`CollectionView`. This can *only* fire if the `collection` contains items.

Each item in the `CollectionView` will undergo the
[destruction lifecycle](./marionette.view.md#view-destruction-lifecycle)

#### CollectionView `remove:empty`

Fired after the `emptyView` has been removed and its destruction lifecycle has
been completed. *This only fires if the attached `collection` has no items.*

#### CollectionView `remove:child`

Fired for each view that is removed from the `CollectionView`. This can only
fire if the `collection` has items.

#### CollectionView `destroy`

Fired once the `CollectionView` has been destroyed and no longer exists.

### Other Collection Events

Collection views can fire other events as part of their normal use.

#### "reorder" / "before:reorder" events

When [`reorderOnSort`](#collectionviews-resortview) is set to `true`, these
events are fired for the reordering of the collection.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyView = Mn.CollectionView.extend({...});

var myCol = new Bb.Collection({ comparator: ... })
var myView = new MyView({ reorderOnSort: true });

myView.render();
myCol.comparator = function () { return this.get('foo'); };

myView.on({
  'remove:empty': function() {
    console.log('the collection view has been reordered following its collection');
  },
  'before:remove:empty': function() {
    console.log('the collection view is about to be reordered');
  }
});

myCol.sort()
```
