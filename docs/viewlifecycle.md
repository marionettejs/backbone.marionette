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
* [`NextCollectionView` Lifecycle](#nextcollectionview-lifecycle)
  * [NextCollectionView Creation Lifecycle](#nextcollectionview-creation-lifecycle)
  * [NextCollectionView Destruction Lifecycle](#nextcollectionview-destruction-lifecycle)
  * [NextCollectionView Creation Events](#nextcollectionview-creation-events)
  * [NextCollectionView Destruction Events](#nextcollectionview-destruction-events)
  * [NextCollectionView EmptyView Events](#nextcollectionview-emptyview-events)
* [Lifecycle State Methods](#lifecycle-state-methods)
  * [`isRendered()`](#isrendered)
  * [`isAttached()`](#isattached)
* [Views associated with previously rendered or attached DOM](#views-associated-with-previously-rendered-or-attached-dom)
* [`Region`s and the View Lifecycle](#regions-and-the-view-lifecycle)
  * [Show View Events](#show-view-events)
  * [Empty Region Events](#empty-region-events)

## `View` Lifecycle
Marionette views define a number of events during the creation and destruction
lifecycle - when the view is displayed in and emptied from a region. In the
documentation, we will reference the event name, though
[`onEvent` handling](./events.md#onevent-binding) can be used.

All automatically fired events pass the triggering view to all event handlers as
the first argument.

### View Creation Lifecycle

When a view is initialized and then displayed inside a region (using
`showChildView()`) a set of events will be called in a specific order.

| Order |      Event      |          Arguments           |
| :---: |-----------------|------------------------------|
|   1   | `before:render` | `view` - view being rendered |
|   2   | `render`        | `view` - view being rendered |
|   3*  | `before:attach` | `view` - view being attached |
|   4*  | `attach`        | `view` - view being attached |
|   5*  | `dom:refresh`   | `view` - view being rendered |

The events marked with "\*" only fire if/when the region's `el` is attached to the DOM.

### View Destruction Lifecycle

When  `region.empty()` is called, the view will be destroyed, calling events as
part of the destruction lifecycle.

| Order |       Event       |                 Arguments                 |
| :---: |-------------------|-------------------------------------------|
|   1   |  `before:destroy` |       `view` - view being destroyed       |
|       |                   | `...args` - arguments passed to `destroy` |
|   2*  |  `before:detach`  |       `view` - view being detached        |
|   3*  |  `dom:remove`     |       `view` - view being detached        |
|   4*  |  `detach`         |       `view` - view being detached        |
|   5   |  `destroy`        |       `view` - view being destroyed       |
|       |                   | `...args` - arguments passed to `destroy` |

The events marked with "\*" only fire if/when the view was attached to the DOM.

#### ChildView Destruction Lifecycle

The order of the destruction events is dependent on when the view (or a parent view)
is detached. When a parent attached view is destroyed it will receive the events
as listed above, but its children will receive both detach events first when the parent
is detached and the children will be destroyed after the detach is complete.

| Order |       Event       |                 Arguments                 |
| :---: |-------------------|-------------------------------------------|
|   1   |  `before:detach`  |       `view` - view being detached        |
|   2*  |  `dom:remove`     |       `view` - view being detached        |
|   3*  |  `detach`         |       `view` - view being detached        |
|   4*  |  `before:destroy` |       `view` - view being destroyed       |
|       |                   | `...args` - arguments passed to `destroy` |
|   5   |  `destroy`        |       `view` - view being destroyed       |
|       |                   | `...args` - arguments passed to `destroy` |

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

This is the optimal event for handling child views.

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

This is the optimal event to handle when the view's `el` must be in the DOM.
Clean up any added handlers in [`before:detach`](#view-beforedetach).

Triggered once the View has been bound into the DOM. This is only triggered
once - the first time the View is attached to the DOM. If you are re-rendering
your view after it has been shown, you most likely want to listen to the
`dom:refresh` event.

#### View `dom:refresh`

This is the optimal event to handle when the view's contents must be in the DOM.
Clean up any added handlers in [`dom:remove`](#view-domremove).

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
  dom:refresh
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

This is the optimal event for cleaning up anything added in [`onAttach`](#view-attach).

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

#### View `dom:remove`

This is the optimal event for cleaning up anything added in [`onDomRefresh`](#view-domrefresh).

The `dom:remove` event is fired in two separate places:

1. Before the view is detached from the DOM (after the `before:detach` event)
2. Each time the `render` method is called if the view is already rendered.

```javascript
const myView = new Mn.View({
  template: _.template('<span><%= count %><span>'),
  templateContext: function() {
    this.count = (this.count || 0) + 1;
    return {
      count: this.count
    };
  },

  onBeforeRender: function() {
    console.log('before:render');
  },

  onRender: function() {
    console.log('render');
  },

  onBeforeDetach: function() {
    console.log('before:detach');
  },

  onDetach: function() {
    console.log('detach');
  },

  onDomRemove: function() {
    console.log('dom:remove');
  }
});

// some layout view
layout.showChildView('myRegion', myView);

myView.render();
/*
  Output:
  before:render
  dom:remove
  render
*/

myView.destroy();
/*
  Output:
  before:detach
  dom:remove
  detach
*/
```

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

| Order |           Event          |                     Arguments                     |
| :---: |--------------------------|---------------------------------------------------|
|   1   |      `before:render`     | `collectionview` - collection view being rendered |
|  2*   |  `before:render:empty`   | `collectionview` - collection view being rendered |
|       |                          |         `view` - empty view being rendered        |
|  2+   | `before:render:children` | `collectionview` - collection view being rendered |
|   3   |    `before:add:child`    | `collectionview` - collection view being rendered |
|       |                          |         `child` - child view being rendered       |
|   4   |       `add:child`        | `collectionview` - collection view being rendered |
|       |                          |         `child` - child view being rendered       |
|  5*   |      `render:empty`      | `collectionview` - collection view being rendered |
|       |                          |         `view` - empty view being rendered        |
|  5+   |     `render:children`    | `collectionview` - collection view being rendered |
|   6   |          `render`        | `collectionview` - collection view being rendered |
|   7   |      `before:attach`     | `collectionview` - collection view being rendered |
|   8   |         `attach`         | `collectionview` - collection view being rendered |
|   9   |       `dom:refresh`      | `collectionview` - collection view being rendered |

The events marked with "\*" only fire on empty collections and events marked
with "+" fire on collections with items.

### Collection Destruction Lifecycle

When a `CollectionView` is destroyed it fires a series of events in order to
reflect the different stages of the destruction process.

| Order |             Event            |                       Arguments                     |
| :---: |------------------------------|-----------------------------------------------------|
|   1   |        `before:destroy`      |  `collectionview` - collection view being destroyed |
|       |                              |      `...args` - arguments passed to `destroy`      |
|   2   |        `before:detach`       |  `collectionview` - collection view being destroyed |
|   3   |           `detach`           |  `collectionview` - collection view being destroyed |
|   4   |  `before:destroy:children`   |  `collectionview` - collection view being destroyed |
|  5*   |      `before:remove:empty`   |  `collectionview` - collection view being destroyed |
|  5+   |      `before:remove:child`   |  `collectionview` - collection view being destroyed |
|       |                              |         `view` - child view being destroyed         |
|  6*   |         `remove:child`       |  `collectionview` - collection view being destroyed |
|       |                              |         `view` - child view being destroyed         |
|  6+   |         `remove:empty`       |  `collectionview` - collection view being destroyed |
|   7   |           `destroy`          |  `collectionview` - collection view being destroyed |
|       |                              |      `...args` - arguments passed to `destroy`      |

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
  'reorder': function() {
    console.log('the collection view has been reordered following its collection');
  },
  'before:reorder': function() {
    console.log('the collection view is about to be reordered');
  }
});

myCol.sort()
```

## `NextCollectionView` Lifecycle

The `NextCollectionView` has its own lifecycle around the standard `View` event
rendering lifecycle. This section covers the events that get triggered and what
they indicate.

### NextCollectionView Creation Lifecycle

The `NextCollectionView` creation lifecycle can go down two paths depending on
whether the collection is populated or empty. The below table shows the order of
rendering events firing:

| Order |           Event          |                     Arguments                     |
| :---: |--------------------------|---------------------------------------------------|
|   1*  |      `before:render`     | `collectionview` - collection view being rendered |
|   2   |  `before:remove:child`   | `collectionview` - collection view being rendered |
|       |                          |         `child` - child view being rendered       |
|   3   |     `remove:child`       | `collectionview` - collection view being rendered |
|       |                          |         `child` - child view being rendered       |
|   4   |    `before:add:child`    | `collectionview` - collection view being rendered |
|       |                          |         `child` - child view being rendered       |
|   5   |       `add:child`        | `collectionview` - collection view being rendered |
|       |                          |         `child` - child view being rendered       |
|       |                          |         `view` - empty view being rendered        |
|   6+  |       `before:sort `     | `collectionview` - collection view being rendered |
|   7   |          `sort`          | `collectionview` - collection view being rendered |
|   8#  |      `before:filter`     | `collectionview` - collection view being rendered |
|   9#  |         `filter`         | `collectionview` - collection view being rendered |
|  10   | `before:render:children` | `collectionview` - collection view being rendered |
|  11   |     `render:children`    | `collectionview` - collection view being rendered |
|  12*  |          `render`        | `collectionview` - collection view being rendered |
|  13** |      `before:attach`     | `collectionview` - collection view being rendered |
|  14** |         `attach`         | `collectionview` - collection view being rendered |
|  15** |       `dom:refresh`      | `collectionview` - collection view being rendered |

"\*" only fire if the `NextCollectionView` is fully rendering from either `collectionView.render()` or `collectionView.collection.reset()`.
"+" including and after this point only occur if there are some children to render.
"#" only fires if a `viewFilter` is defined.
"\*\*" fires from use in the parent when a CollectionView is shown in a Region or
as a childView of another CollectionView.


### NextCollectionView Destruction Lifecycle

When a `NextCollectionView` is destroyed it fires a series of events in order to
reflect the different stages of the destruction process.

| Order |             Event            |                       Arguments                     |
| :---: |------------------------------|-----------------------------------------------------|
|   1   |        `before:destroy`      |  `collectionview` - collection view being destroyed |
|       |                              |      `...args` - arguments passed to `destroy`      |
|   2   |        `before:detach`       |  `collectionview` - collection view being destroyed |
|   3   |           `detach`           |  `collectionview` - collection view being destroyed |
|   4   |  `before:destroy:children`   |  `collectionview` - collection view being destroyed |
|   5+  |      `before:remove:child`   |  `collectionview` - collection view being destroyed |
|       |                              |         `view` - child view being destroyed         |
|   6+  |         `remove:child`       |  `collectionview` - collection view being destroyed |
|       |                              |         `view` - child view being destroyed         |
|   7   |      `destroy:children`      |  `collectionview` - collection view being destroyed |
|   8   |           `destroy`          |  `collectionview` - collection view being destroyed |
|       |                              |      `...args` - arguments passed to `destroy`      |

The events marked with "+" only fire  on collections with children.

### NextCollectionView Creation Events

#### NextCollectionView `before:render`

Triggers before the `NextCollectionView` render process starts. See the
[`before:render` Documentation](#view-before-render) for an
example.

#### NextCollectionView `before:add:child`

This event fires before each child is added to the children.

#### NextCollectionView `add:child`

This event fires after each child is added to the children. This fires once for each
item in the attached collection.

#### NextCollectionView `before:sort`

This event fires just before sorting the children in the `NextCollectionView`.
By default this only fires if the collectionView has at least one child.

#### NextCollectionView `sort`

This event fires after sorting the children in the `NextCollectionView`.
By default this only fires if the collectionView has at least one child.

#### NextCollectionView `before:filter`

This event fires just before filtering the children in the `NextCollectionView`.
By default this only fires if the collectionView has at least one child and has a `viewFilter`.

#### NextCollectionView `filter`

This event fires after filtering the children in the `NextCollectionView`.
By default this only fires if the collectionView has at least one child and has a `viewFilter`.

#### NextCollectionView `before:render:children`

This event fires just before rendering the children in the `NextCollectionView`.
By default this only fires if the collectionView has at least one view not filtered out.

#### NextCollectionView `render:children`

This event fires once all the collection's child views have been rendered.
By default this only fires if the collectionView has at least one view not filtered out.

```
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyView = Mn.NextCollectionView.extend({
  onRenderChildren: function({
    console.log('The collectionview children have been rendered');
  })
});

var myView = new MyView({
  collection: new Bb.Collection([{ id: 1 }]);
});

myView.render();
```

#### NextCollectionView `render`

Fires when the collection has completely finished rendering. See the
[`render` Documentation](#view-render) for more information.

### NextCollectionView Destruction Events

#### NextCollectionView `before:destroy`

Fires as the destruction process is beginning. This is best used to perform any
necessary cleanup within the `NextCollectionView`.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.NextCollectionView.extend({
  onBeforeDestroy: function() {
    console.log('The CollectionView is about to be destroyed');
  }
});

var myView = new MyView();

myView.destroy();
```

#### NextCollectionView `before:detach`

Fires just before the `NextCollectionView` is removed from the DOM. If you need to
remove any event handlers or UI modifications, this would be the best time to do
that.

#### NextCollectionView `detach`

Fires just after the `NextCollectionView` is removed from the DOM. The view's
elements will still exist in memory if you need to access them.

#### NextCollectionView `before:destroy:children`

This is triggered just before the `childView` items are destroyed.

Triggered when the `NextCollectionView` is destroyed or before the `NextCollectionView`'s children are re-rendered.

#### NextCollectionView `before:remove:child`

This is triggered for each `childView` that is removed from the
`NextCollectionView`. This can *only* fire if the `collection` contains items.

Each item in the `NextCollectionView` will undergo the
[destruction lifecycle](#view-destruction-lifecycle)

#### NextCollectionView `remove:child`

Fired for each view that is removed from the `NextCollectionView`. This can only
fire if the `collection` has items.

#### NextCollectionView `destroy:children`

This is triggered just after the `childView` items are destroyed.

Triggered when the `NextCollectionView` is destroyed or before the `NextCollectionView`'s children are re-rendered.

#### NextCollectionView `destroy`

Fired once the `NextCollectionView` has been destroyed and no longer exists.

### NextCollectionView EmptyView Events

The `NextCollectionView` uses a region internally that can be used to know when the empty view is show or destroyed.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.NextCollectionView.extend({
  emptyView: MyEmptyView
});

var myView = new MyView();

myView.emptyRegion.on({
  show: function() {
    console.log('CollectionView is empty!');
  },
  empty: function() {
    console.log('CollectionView is removing the emptyView');
  }
});

myView.render();
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

## Views associated with previously rendered or attached DOM

When a view is instantiated, if the View's `el` is set to an existing node
the view's [`isRendered()`](#isrendered) will return `true` and `before:render`
and `render` events will not be fired when the view is shown in a Region.

Similarly if the `el` is attached to a node in the DOM the view's [`isAttached()`](#isattached)
will return `true` and `before:attach`, `attach` and `dom:refresh` will not be fired
when the view is shown in a Region.

## `Region`s and the View Lifecycle

When you show a view inside a region - either using [`region.show(view)`](./marionette.region.md#showing-a-view) or
[`showChildView('region', view)`](./marionette.view.md#showing-a-view) - the `Region` will emit events around the view
events that you can hook into.

### Show View Events

When showing a view inside a region, the region emits a number of events:

| Order |                   Event                    |                 Arguments                 |
| :---: |--------------------------------------------|-------------------------------------------|
|   1   |               `before:show`                | `region` - region showing the child view  |
|       |                                            |  `view` - view being shown in the region  |
|       |                                            |  `options` - options passed to `show()`   |
|   2   | [View Creation Lifecycle](#view-creation-lifecycle) |                                  |
|   3   |                   `show`                   | `region` - region showing the child view  |
|       |                                            |  `view` - view being shown in the region  |
|       |                                            |  `options` - options passed to `show()`   |

#### Region `before:show`

Emitted on `region.show(view)`, before the view lifecycle begins. At this point,
none of the view rendering will have been performed.

#### Region `show`

Emitted after the view has been rendered and attached to the DOM (if this
region is already attached to the DOM). This can be used to handle any
extra manipulation that needs to occur.

### Empty Region Events

When [emptying a region](./marionette.region.md#emptying-a-region), it will emit destruction events around the view's
destruction lifecycle:

| Order |                     Event                     |            Arguments            |
| :---: |-----------------------------------------------|---------------------------------|
|   1   |                `before:empty`                 | `region` - region being emptied |
|       |                                               |   `view` - view being removed   |
|   2   | [View Destruction Lifecycle](#view-destruction-lifecycle) |                     |
|   3   |                    `empty`                    | `region` - region being emptied |
|       |                                               |   `view` - view being removed   |

#### Region `before:empty`

Emitted before the view's destruction process begins. This can occur either by
calling `region.empty()` or by running `region.show(view)` on a region that's
displaying another view. It will also trigger if the view in the region is
destroyed.

#### Region `empty`

Fired after the entire destruction process is complete. At this point, the view
has been removed from the DOM completely.
