# View Lifecycle

The Marionette views use an event lifecycle, triggering events on any listeners
to act at different points inside the creation and destruction of views and
their children.

## Documentation Index

* [`View` Lifecycle](#view-lifecycle)
  * [View Creation Lifecycle](#view-creation-lifecycle)
  * [View Destruction Lifecycle](#view-destruction-lifecycle)
  * [View Creation Events](#view-creation-events)
  * [View Destruction Events](#view-destruction-events)
  * [Other View Events](#other-view-events)
* [`CollectionView` Lifecycle](#collectionview-lifecycle)
  * [Collection Creation Lifecycle](#collection-creation-lifecycle)
  * [Collection Destruction Lifecycle](#collection-destruction-lifecycle)
  * [Collection Creation Events](#collection-creation-events)
  * [Collection Destruction Events](#collection-destruction-events)
  * [Other Collection Events](#other-collection-events)
* [Lifecycle State Methods](#lifecycle-state-methods)
  * [`isRendered()`](#isrendered)
  * [`isAttached()`](#isattached)
* [`Region` Lifecycle](#region-lifecycle)
  * [Show View Lifecycle](#show-view-lifecycle)
  * [Region Lifecycle events](#region-lifecycle-events)
* [Views associated with previously rendered or attached DOM](#views-associated-with-previously-rendered-or-attached-dom)

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
|   3*  | `before:attach` |
|   4*  | `attach`        |
|   5*  | `dom:refresh`   |

The events marked with "\*" only fire if/when the region's `el` is attached to the DOM.

### View Destruction Lifecycle

When  `region.empty()` is called, the view will be destroyed, calling events as
part of the destruction lifecycle.

| Order |       Event       |
| :---: |-------------------|
|   1   |  `before:destroy` |
|   2*  |  `before:detach`  |
|   3*  |  `detach`         |
|   4   |  `destroy`        |

The events marked with "\*" only fire if/when the view was attached to the DOM.

#### ChildView Destruction Lifecycle

The order of the destruction events is dependent on when the view (or a parent view)
is detached. When a parent attached view is destroyed it will receive the events
as listed above, but its children will receive both detach events first when the parent
is detached and the children will be destroyed after the detach is complete.

| Order |       Event       |
| :---: |-------------------|
|   1   |  `before:detach`  |
|   2*  |  `detach`         |
|   3*  |  `before:destroy` |
|   4   |  `destroy`        |

The events marked with "\*" only fire if/when the view was attached to the DOM.

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
into the page DOM. This will only be triggered once per `region.show()`. If
you are re-rendering your view after it has been shown, you most likely want to
listen to the `render` or `dom:refresh` events.

#### View `attach`

Triggered once the View has been bound into the DOM. This is only triggered
once - the first time the View is attached to the DOM. If you are re-rendering
your view after it has been shown, you most likely want to listen to the
`dom:refresh` event.

#### View `dom:refresh`

The `dom:refresh` event is fired in two separate places:

1. After the view is attached to the DOM (after the `attach` event)
2. Every time the `render` method is called

```javascript
const myView = new Mn.View({
  template: _.template('<span><%= count %><span>'),
  templateContext: function() {
    this.count = (this.count || 0) + 1;
    return {
      count: this.count
    };
  },

  onRender: function() {
    console.log('render');
  },

  onAttach: function() {
    console.log('attach');
  },

  onDomRefresh: function() {
    console.log('dom:refresh');
  }
});

// some layout view
layout.showChildView('myRegion', myView);
/*
  Output:
  render
  attach
  dom:refreh
*/

myView.render();
/*
  Output:
  render
  dom:refresh
*/
```

### View Destruction Events

These events are fired during the view's destruction and removal from a region.

#### View `before:destroy`

Triggered just prior to destroying the view, when the view's `destroy()` method has been called.
The view may or may not be in the DOM at this point.

```javascript
var Mn = require('backbone.marionette');

Mn.View.extend({
  onBeforeDestroy: function() {
    // custom destroying and non-DOM related cleanup goes here
  }
});
```

#### View `before:detach`

The `View` will trigger the `before:detach` event when the view is rendered and
is about to be removed from the DOM.
If the view has not been attached to the DOM, this event will not be fired.

```javascript
var Mn = require('backbone.marionette');

Mn.View.extend({
  onBeforeDetach: function() {
    // custom destroying and DOM related cleanup goes here
  }
});
```

#### View `detach`

The `View` will trigger the `detach` event when the view was rendered and has
just been removed from the DOM.

#### View `destroy`

Triggered just after the view has been destroyed. At this point, the view has
been completely removed from the DOM.

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

The `View` will trigger a `before:remove:region`
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
myView.removeRegion('foo');
```

#### View `remove:region`

The `View` will trigger a `remove:region`
event when a region is removed from the view.
This allows you to use the region instance one last
time, or remove the region from an object that has a
reference to it:

```javascript
var Mn = require('backbone.marionette');

var view = new Mn.View();

view.on('remove:region', function(name, region) {
  // add the region instance to an object
  delete myObject[name];
});

view.addRegion('foo', '#bar');

view.removeRegion('foo');
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
[`before:render` Documentation](#view-before-render) for an
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
[`reorderOnSort`](./collectionviewadvanced.md#collectionviews-reorderonsort) is false:

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
[`render` Documentation](#view-render) for more information.

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
[destruction lifecycle](#view-destruction-lifecycle)

#### CollectionView `before:remove:child`

This is triggered for each `childView` that is removed from the
`CollectionView`. This can *only* fire if the `collection` contains items.

Each item in the `CollectionView` will undergo the
[destruction lifecycle](#view-destruction-lifecycle)

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

#### `reorder` / `before:reorder` events

When [`reorderOnSort`](./collectionviewadvanced.md#collectionviews-resortview) is set to `true`, these
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

## Lifecycle State Methods

Both `View` and `CollectionView` share methods for checking if the view is attached or rendered.

### `isRendered()`

This function will return a boolean value reflecting if the view has been rendered.

### `isAttached()`

This function will return a boolean value reflecting if the view believes it is attached.
This is maintained when attaching a view with a `Region` or during [View instantiation](#views-associated-with-previously-rendered-or-attached-dom).
If a view is attached by other means this function may not reflect the actual state of attachment.
To be certain use [`Marionette.isNodeAttached`](./marionette.functions.md#marionetteisnodeattached).

## `Region` Lifecycle

When you show a view inside a region - either using `region.show(view)` or
`showChildView('region', view)` - the `Region` will emit events around the view
events that you can hook into.

### Show View Lifecycle

When showing a view inside a region, the region emits a number of events:

| Order |                   Event                    |
| :---: |--------------------------------------------|
|   1   |               `before:show`                |
|   2   | [View Lifecycle](#view-creation-lifecycle) |
|   3   |                   `show`                   |

#### Empty Region Lifecycle

When emptying a region, it will emit destruction events around the view's
destruction lifecycle:

| Order |                     Event                     |
| :---: |-----------------------------------------------|
|   1   |                `before:empty`                 |
|   2   | [View Lifecycle](#view-destruction-lifecycle) |
|   3   |                    `empty`                    |

### Region Lifecycle Events

#### Region `before:show`

Emitted on `region.show(view)`, before the view lifecycle begins. At this point,
none of the view rendering will have been performed.

#### Region `show`

Emitted after the view has been rendered and attached to the DOM. This can be
used to handle any extra manipulation that needs to occur.

#### Region `before:empty`

Emitted before the view's destruction process begins. This can occur either by
calling `region.empty()` or by running `region.show(view)` on a region that's
displaying another view.

#### Region `empty`

Fired after the entire destruction process is complete. At this point, the view
has been removed from the DOM completely.

## Views associated with previously rendered or attached DOM

When a view is instantiated, if the View's `el` is set to an existing node
the view's [`isRendered()`](#isrendered) will return `true` and `before:render`
and `render` events will not be fired when the view is shown in a Region.

Similarly if the `el` is attached to a node in the DOM the view's [`isAttached()`](#isattached)
will return `true` and `before:attach`, `attach` and `dom:refresh` will not be fired
when the view is shown in a Region.
