# Marionette.CollectionView

The `CollectionView` will loop through all of the models in the
specified collection, render each of them using a specified `childView`,
then append the results of the child view's `el` to the collection view's
`el`. By default the `CollectionView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sort: false}` on initialize.

`CollectionView` has the base functionality provided by the View Mixin.

## Documentation Index

* [CollectionView's `childView`](#collectionviews-childview)
  * [CollectionView's `childViewOptions`](#collectionviews-childviewoptions)
  * [CollectionView's `childViewEventPrefix`](#collectionviews-childvieweventprefix)
  * [CollectionView's `childViewEvents`](#collectionviews-childviewevents)
  * [CollectionView's `childViewTriggers`](#collectionviews-childviewtriggers)
* [CollectionView's `emptyView`](#collectionviews-emptyview)
  * [CollectionView's `emptyViewOptions`](#collectionviews-emptyviewoptions)
  * [CollectionView's `isEmpty`](#collectionviews-isempty)
* [CollectionView's `render`](#collectionviews-render)
  * [CollectionView: Automatic Rendering](#collectionview-automatic-rendering)
  * [CollectionView: Re-render Collection](#collectionview-re-render-collection)
  * [CollectionView's `attachHtml`](#collectionviews-attachhtml)
  * [CollectionView's `attachBuffer`](#collectionviews-attachbuffer)
* [CollectionView's `destroy`](#collectionviews-destroy)
* [CollectionView's `filter`](#collectionviews-filter)
  * [CollectionView's `setFilter`](#collectionviews-setfilter)
  * [CollectionView's `removeFilter`](#collectionviews-removefilter)
* [CollectionView's `sort`](#collectionviews-sort)
  * [CollectionView's `viewComparator`](#collectionviews-viewcomparator)
  * [CollectionView's `getViewComparator`](#collectionviews-getviewcomparator)
  * [CollectionView's `reorderOnSort`](#collectionviews-reorderonsort)
  [CollectionView's `reorder`](#collectionviews-reorder)
  * [CollectionView's `resortView`](#collectionviews-resortview)
* [Events](#collectionview-events)
  * [Child Event Bubbling](#child-event-bubbling)
  * [Lifecycle Events](#lifecycle-events)
    * [Creation Lifecycle](#creation-lifecycle)
    * [Destruction Lifecycle](#destruction-lifecycle)
    * [Creation Events](#creation-events)
    * [Destruction Events](#destruction-events)
    * [Other Events](#other-events)
* [Rendering `CollectionView`s](#rendering-collectionviews)
  * [Rendering Lists](#rendering-lists)
  * [Rendering Tables](#rendering-tables)
    * [Tables Using Marionette 2](#tables-using-marionette-2)
    * [Tables Using Marionette 3](#tables-using-marionette-3)
  * [Rendering Trees](#rendering-trees)
    * [Trees in Marionette 2](#trees-in-marionette-2)
    * [Trees in Marionette 3](#trees-in-marionette-3)



## CollectionView's `childView`

Specify a `childView` in your collection view definition. This must be
a Backbone view class definition, not an instance. It can be any
`Backbone.View` or be derived from `Marionette.View`.

```javascript
var Mn = require('backbone.marionette');

var MyChildView = Mn.View.extend({});

Mn.CollectionView.extend({
  childView: MyChildView
});
```

Child views must be defined before they are referenced by the
`childView` attribute in a collection view definition.

Alternatively, you can specify a `childView` in the options for
the constructor:

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({...});

new MyCollectionView({
  childView: MyChildView
});
```

If you do not specify a `childView`, an exception will be thrown
stating that you must specify a `childView`.

You can also define `childView` as a function. In this form, the value
returned by this method is the `ChildView` class that will be instantiated
when a `Model` needs to be initially rendered. This method also gives you
the ability to customize per `Model` `ChildViews`.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var FooBar = Bb.Model.extend({
  defaults: {
    isFoo: false
  }
});

var FooView = Mn.View.extend({
  template: '#foo-template'
});
var BarView = Mn.View.extend({
  template: '#bar-template'
});

var MyCollectionView = Mn.CollectionView.extend({
  childView: function(item) {
    // Choose which view class to render,
    // depending on the properties of the item model
    if  (item.get('isFoo')) {
      return FooView;
    }
    else {
      return BarView;
    }
  }
});

var collectionView = new MyCollectionView();
var foo = new FooBar({
  isFoo: true
});
var bar = new FooBar({
  isFoo: false
});

// Renders a FooView
collectionView.collection.add(foo);

// Renders a BarView
collectionView.collection.add(bar);
```

### CollectionView's `childViewOptions`

There may be scenarios where you need to pass data from your parent
collection view in to each of the childView instances. To do this, provide
a `childViewOptions` definition on your collection view as an object
literal. This will be passed to the constructor of your childView as part
of the `options`.

```javascript
var Mn = require('backbone.marionette');

var ChildView = Mn.View.extend({
  initialize: function(options) {
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Mn.CollectionView.extend({
  childView: ChildView,

  childViewOptions: {
    foo: 'bar'
  }
});
```

You can also specify the `childViewOptions` as a function, if you need to
calculate the values to return at runtime. The model will be passed into
the function should you need access to it when calculating
`childViewOptions`. The function must return an object, and the attributes
of the object will be copied to the `childView` instance's options.

```javascript
var Mn = require('backbone.marionette');

var CollectionView = Mn.CollectionView.extend({
  childViewOptions: function(model, index) {
    // do some calculations based on the model
    return {
      foo: 'bar',
      childIndex: index
    }
  }
});
```

### CollectionView's `childViewEventPrefix`

You can customize the event prefix for events that are forwarded
through the collection view. To do this, set the `childViewEventPrefix`
on the collection view. For more information on the `childViewEventPrefix` see
["childview:*" event bubbling from child views](#childview-event-bubbling-from-child-views)

```javascript
var Mn = require('backbone.marionette');

var CV = Mn.CollectionView.extend({
  childViewEventPrefix: 'some:prefix'
});

var c = new CV({
  collection: myCol
});

c.on('some:prefix:render', function(){
  // child view was rendered
});

c.render();
```

The `childViewEventPrefix` can be provided in the view definition or
in the constructor function call, to get a view instance.

### CollectionView's `childViewEvents`

A `childViewEvents` hash or method permits handling of child view events without
manually setting bindings. The values of the hash can either be a function or a string
method name on the collection view.

```javascript
var Mn = require('backbone.marionette');

// childViewEvents can be specified as a hash...
var MyCollectionView = Mn.CollectionView.extend({

  childViewEvents: {
    // This callback will be called whenever a child is rendered or emits a `render` event
    render: function() {
      console.log('A child view has been rendered.');
    }
  }
});

// ...or as a function that returns a hash.
var MyCollectionView = Mn.CollectionView.extend({

  childViewEvents: function() {
    return {
      render: this.onChildRendered
    }
  },

  onChildRendered: function () {
    console.log('A child view has been rendered.');
  }
});
```

`childViewEvents` also catches custom events fired by a child view.

```javascript
var Mn = require('backbone.marionette');

// The child view fires a custom event, `show:message`
var ChildView = Mn.View.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  // Triggers hash converts DOM events directly to view events catchable on the parent.
  // Note that `triggers` automatically pass the first argument as the child view.
  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    // Both `trigger` and `triggerMethod` events will be caught by parent.
    this.trigger('show:message', 'foo');
    this.triggerMethod('show:message', 'bar');
  }
});

// The parent uses childViewEvents to catch the child view's custom event
var ParentView = Mn.CollectionView.extend({

  childView: ChildView,

  childViewEvents: {
    'show:message': 'onChildShowMessage',
    'submit:form': 'onChildSubmitForm'
  },

  onChildShowMessage: function (message) {
    console.log('A child view fired show:message with ' + message);
  },

  onChildSubmitForm: function (childView) {
    console.log('A child view fired submit:form');
  }
});
```

### CollectionView's `childViewTriggers`

A `childViewTriggers` hash or method permits proxying of child view events without manually
setting bindings. The values of the hash should be a string of the event to trigger on the parent.

`childViewTriggers` is sugar on top of [`childViewEvents`](#collectionviews-childviewevents) much
in the same way that [View `triggers`](#abstractviewtriggers) are sugar for [View `events`](#abstractviewevents).

```javascript
var Mn = require('backbone.marionette');

// The child view fires a custom event, `show:message`
var ChildView = Mn.View.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  // Triggers hash converts DOM events directly to view events catchable on the parent.
  // Note that `triggers` automatically pass the first argument as the child view.
  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    // Both `trigger` and `triggerMethod` events will be caught by parent.
    this.trigger('show:message', 'foo');
    this.triggerMethod('show:message', 'bar');
  }
});

// The parent uses childViewEvents to catch the child view's custom event
var ParentView = Mn.CollectionView.extend({

  childView: ChildView,

  childViewTriggers: {
    'show:message': 'child:show:message',
    'submit:form': 'child:submit:form'
  },

  onChildShowMessage: function (message) {
    console.log('A child view fired show:message with ' + message);
  },

  onChildSubmitForm: function (childView) {
    console.log('A child view fired submit:form');
  }
});
```

## CollectionView's `emptyView`

When a collection has no children, and you need to render a view other than
the list of childViews, you can specify an `emptyView` attribute on your
collection view. The `emptyView` just like the [`childView`](#collectionviews-childview) can also be passed as an option on instantiation or can be a
function that returns the `emptyView`.

```javascript
var Mn = require('backbone.marionette');

var MyEmptyView = Mn.View.extend({
  template: _.template('Nothing to display.')
});

var MyCollectionView = Mn.CollectionView.extend({
  // ...

  emptyView: MyEmptyView
});
```

### CollectionView's `emptyViewOptions`

Similar to [`childView`](#collectionviews-childview) and [`childViewOptions`](#collectionviews-childviewoptions), there is an `emptyViewOptions` property that will be passed to the `emptyView` constructor. It can be provided as an object literal or as a function.

If `emptyViewOptions` aren't provided the `CollectionView` will default to passing the `childViewOptions` to the `emptyView`.

```javascript
var Mn = require('backbone.marionette');

var EmptyView = Mn.View({
  initialize: function(options){
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Mn.CollectionView({
  emptyView: EmptyView,

  emptyViewOptions: {
    foo: 'bar'
  }
});
```

### CollectionView's `isEmpty`

If you want to control when the empty view is rendered, you can override
`isEmpty`:

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({
  isEmpty: function(options) {
    // some logic to calculate if the view should be rendered as empty
    return this.collection.length < 2;
  }
});
```

## CollectionView's `render`

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
children in the collection and renders them individually as a
`childView`. By default when a `collectionView` is fully rendered it buffers the DOM changes for a single [`attachBuffer`](#collectionviews-attachbuffer) DOM change.

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({...});

// all of the children views will now be rendered.
new MyCollectionView().render();
```

For more information on rendering techiniques see: [Rendering `CollectionView`s](#rendering-collectionviews).

### CollectionView: Automatic Rendering

After the initial render the collection view binds to the "add", "remove" and
"reset" events of the collection that is specified.

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of child views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will destroy and remove that model's child view.

When the collection for the view is sorted, the view will automatically re-sort its child views.
If the [`reorderOnSort`](#collectionviews-reorderonsort) option is set it will attempt to reorder the DOM and do this without a full re-render, otherwise it will re-render if the order has changed. Please Note that if you apply a filter to the collection view and the filtered views change during a sort then it will always re-render.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var collection = new Bb.Collection();

var MyChildView = Mn.View.extend({
  template: false
});

var MyCollectionView = Mn.CollectionView.extend({
  childView: MyChildView,
  collection: collection,
});

var myCollectionView = new MyCollectionView();

// Collection view will not re-render as it has not been rendered
collection.reset([{foo: 'foo'}]);

myCollectionView.render();

// Collection view will re-render displaying the new model
collection.reset([{foo: 'bar'}]);
```

### CollectionView: Re-render Collection

If you need to re-render the entire collection, you can call the
`view.render` method. This method takes care of destroying all of
the child views that may have previously been opened.

### CollectionView's `attachHtml`

By default the collection view will append the HTML of each ChildView
into the element buffer, and then call jQuery's `.append` once at the
end to move the HTML into the collection view's `el`.

You can override this by specifying an `attachHtml` method in your
view definition. This method takes three parameters and has no return
value.

```javascript
var Mn = require('backbone.marionette');

Mn.CollectionView.extend({

  // The default implementation:
  attachHtml: function(collectionView, childView, index){
    if (collectionView._isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView._bufferedChildren.splice(index, 0, childView);
    } else {
      // If we've already rendered the main collection, append
      // the new child into the correct order if we need to. Otherwise
      // append to the end.
      if (!collectionView._insertBefore(childView, index)){
        collectionView._insertAfter(childView);
      }
    }
  }

});
```

The first parameter is the instance of the collection view that
will receive the HTML from the second parameter, the current child
view instance.

The third parameter, `index`, is the index of the
model that this `childView` instance represents, in the collection
that the model came from. This is useful for understanding the sort order of the children.

Overrides of `attachHtml` that don't take into account the element
buffer will work fine, but won't take advantage of the 60x performance
increase the buffer provides.

### CollectionView's `attachBuffer`

When overriding [`attachHtml`](#collectionviews-attachhtml) it may be necessary to also override how the buffer is attached. This method receives two parameters. The `collectionView` and the buffer HTML of all of the child views.

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({
  // The default implementation:
  // Called after all children have been appended into the buffer
  attachBuffer: function(collectionView, buffer) {
    collectionView.$el.append(buffer);
  }
});
```

## CollectionView's `destroy`

`CollectionView` implements a `destroy` method which automatically
destroys its children and cleans up listeners.


```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyChildView = Mn.View.extend({
  template: _.template('ChildView'),
  onDestroy: function() {
    console.log('I will get destroyed');
  }
})

var myCollectionView = new Mn.CollectionView({
  childView: MyChildView,
  collection: new Bb.Collection([{ id: 1 }])
});

myCollectionView.render();

myCollectionView.destroy(); // logs "I will get destroyed"
```

## CollectionView's `filter`

`CollectionView` allows for a custom `filter` option if you want to prevent some of the
underlying `collection`'s models from being rendered as child views.
The filter function takes a model from the collection and returns a truthy value if the child should be rendered,
and a falsey value if it should not.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var cv = new Mn.CollectionView({
  childView: SomeChildView,
  emptyView: SomeEmptyView,
  collection: new Bb.Collection([
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 }
  ]),

  // Only show views with even values
  filter: function (child, index, collection) {
    return child.get('value') % 2 === 0;
  }
});

// renders the views with values '2' and '4'
cv.render();

// change the filter
// renders the views with values '1' and '3'
cv.setFilter(function (child, index, collection) {
  return child.get('value') % 2 !== 0;
});

// renders all views
cv.removeFilter();
```

### CollectionView's `setFilter`

The `setFilter` method modifies the `CollectionView`'s filter attribute, and
renders the new `ChildViews` in a efficient way, instead of
rendering the whole DOM structure again.
Passing `{ preventRender: true }` in the options argument will prevent the view being rendered.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.CollectionView({
  collection: someCollection
});

cv.render();

var newFilter = function(child, index, collection) {
  return child.get('value') % 2 === 0;
};

// Note: the setFilter is preventing the automatic re-render
cv.setFilter(newFilter, { preventRender: true });

//Render the new state of the ChildViews instead of the whole DOM.
cv.render();
```

### CollectionView's `removeFilter`

This function is actually an alias of `setFilter(null, options)`. It is useful for removing filters.
`removeFilter` also accepts `preventRender` as a option.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.CollectionView({
  collection: someCollection
});

cv.render();

cv.setFilter(function(child, index, collection) {
  return child.get('value') % 2 === 0;
});

//Remove the current filter without rendering again.
cv.removeFilter({ preventRender: true });
```

## CollectionView's `sort`

By default the `CollectionView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sort: false}` on initialize. The `sort` flag cannot be changed after instantiation.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var myCollection = new Bb.Collection([
  { id: 1 },
  { id: 4 },
  { id: 3 },
  { id: 2 }
]);

myCollection.comparator = 'id';

var mySortedColView = new Mn.CollectionView({
  //...
  collection: myCollection
});

var myUnsortedColView = new Mn.CollectionView({
  //...
  collection: myCollection,
  sort: false
});

mySortedColView.render(); // 1 4 3 2
myUnsortedColView.render(); // 1 4 3 2

// mySortedColView auto-renders 1 2 3 4
// myUnsortedColView has no change
myCollection.sort();
```

### CollectionView's `viewComparator`

`CollectionView` allows for a custom `viewComparator` option if you want your `CollectionView`'s children to be rendered with a different sort order than the underlying Backbone collection uses.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.CollectionView({
  collection: someCollection,
  viewComparator: 'otherFieldToSortOn'
});
```

The `viewComparator` can take any of the acceptable `Backbone.Collection`
[comparator formats](http://backbonejs.org/#Collection-comparator) -- a sortBy
(pass a function that takes a single argument), as a sort (pass a comparator
function that expects two arguments), or as a string indicating the attribute to
sort by.

### CollectionView's `getViewComparator`

Override this method to determine which `viewComparator` to use.

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({
  sortAsc: function(model) {
    return -model.get('order');
  },
  sortDesc: function(model) {
    return model.get('order');
  },
  getViewComparator: function() {
    // The collectionView's model
    if (this.model.get('sorted') === 'ASC') {
      return this.sortAsc;
    }

    return this.sortDesc;
  }
});
```

### CollectionView's `reorderOnSort`

This option is useful when you have performance issues when you resort your `CollectionView`.
Without this option, your `CollectionView` will be completely re-rendered, which can be
costly if you have a large number of elements or if your `ChildView`s are complex. If this option
is activated, when you sort your `Collection`, there will be no re-rendering, only the DOM nodes
will be reordered. This can be a problem if your `ChildView`s use their collection's index
in their rendering. In this case, you cannot use this option as you need to re-render each
`ChildView`.

If you combine this option with a [filter](#collectionviews-filter) that changes the views that are
to be displayed, `reorderOnSort` will be bypassed to render new children and remove those that are rejected by the filter.

### CollectionView's `reorder`

If [`reorderOnSort`](#collectionviews-reorderonsort) is set to true, this function will be used instead of re-rendering all children.  It can be called directly to prevent the collection from being completely re-rendered. This may only be useful if models are added or removed silently or if [`sort`](#collectionviews-sort) was set to false on the `CollectionView`.

### CollectionView's `resortView`

[By default](#collectionviews-sort) the `CollectionView` will maintain the order of its `collection`
in the DOM. However on occasions the view may need to re-render to make this
possible, for example if you were to change the comparator on the collection.
The `CollectionView` will re-render its children or [`reorder`](#collectionviews-reorder) them depending on [`reorderOnSort`](#collectionviews-reorderonsort).
Override this function if you need further customization.

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({
  resortView: function() {
    // provide custom logic for rendering after sorting the collection
  }
});
```

## Events

The `CollectionView`, like `View`, is able to trigger and respond to events
occurring during their lifecycle. The [Documentation for Events](./events.md)
has the complete documentation for how to set and handle events on views.

### Child Event Bubbling

When a child view triggers an event, that event will bubble up one level to the
parent collection view. For an example:

```javascript
var Mn = require('backbone.marionette');

var Item = Mn.View.extend({
  tagName: 'li',

  triggers: {
    'click a': 'select:item'
  }
});

var Collection = Mn.CollectionView.extend({
  tagName: 'ul',

  onChildviewSelectItem: function(childView) {
    console.log('item selected: ' + childView.model.id);
  }
});
```

The event will receive a `childview:` prefix before going through the magic
method binding logic. See the
[Documentation for Child View Events](./events.md#child-view-events) for more
information.

### Lifecycle Events

The `CollectionView` has its own lifecycle around the standard `View` event
rendering lifecycle. This section covers the events that get triggered and what
they indicate.

#### Creation Lifecycle

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

#### Destruction Lifecycle

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

#### Creation Events

##### CollectionView `before:render`

Triggers before the `CollectionView` render process starts. See the
[`before:render` Documentation](#marionette.view.md#view-before-render) for an
example.

##### CollectionView `before:render:empty`

Triggers just before rendering a collection `emptyView`. This won't be fired if
the collection has 1 or more elements in.

##### CollectionView `before:render:children`

This event fires just before rendering the children in the `CollectionView`.
This only fires if the collection has at least one item.

##### CollectionView `before:add:child`

This event fires before each child is added to the view. If the collection is
empty, this fires exactly once for the `emptyView`.

##### CollectionView `add:child`

This event fires after each child is added to the view. This fires once for each
item in the attached collection.

If the collection is empty, this event fires exactly once for the `emptyView`.

##### CollectionView `render:empty`

This event fires once the `emptyView` has been rendered. This will only fire if
the attached collection is empty.

##### CollectionView `render:children`

This event fires once all the collection's child views have been rendered.  This
only fires if the collection has at least one item. This may also fire when
[`reorderOnSort`](#collectionviews-reorderonsort) is false:

```javascript
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

##### CollectionView `render`

Fires when the collection has completely finished rendering. See the
[`render` Documentation](./marionette.view.md#view-render) for more information.

#### Destruction Events

##### CollectionView `before:destroy`

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

##### CollectionView `before:detach`

Fires just before the `CollectionView` is removed from the DOM. If you need to
remove any event handlers or UI modifications, this would be the best time to do
that.

##### CollectionView `detach`

Fires just after the `CollectionView` is removed from the DOM. The view's
elements will still exist in memory if you need to access them.

##### CollectionView `before:destroy:children`

This is triggered just before the `childView` items are destroyed.

Triggered when the `collectionView` is destroyed or before the `collectionView`'s children are re-rendered.

##### CollectionView `before:remove:empty`

This is triggered just before the `emptyView` is removed from the
`CollectionView`. *This only fires if the attached `collection` has no items.*

The `emptyView` will then go through the its own
[destruction lifecycle](./marionette.view.md#view-destruction-lifecycle)

##### CollectionView `before:remove:child`

This is triggered for each `childView` that is removed from the
`CollectionView`. This can *only* fire if the `collection` contains items.

Each item in the `CollectionView` will undergo the
[destruction lifecycle](./marionette.view.md#view-destruction-lifecycle)

##### CollectionView `remove:empty`

Fired after the `emptyView` has been removed and its destruction lifecycle has
been completed. *This only fires if the attached `collection` has no items.*

##### CollectionView `remove:child`

Fired for each view that is removed from the `CollectionView`. This can only
fire if the `collection` has items.

##### CollectionView `destroy`

Fired once the `CollectionView` has been destroyed and no longer exists.

#### Other Events

Collection views can fire other events as part of their normal use.

##### "reorder" / "before:reorder" events

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

## Rendering `CollectionView`s

Marionette 3 has completely removed the `CompositeView` in favor of making the
`View` and `CollectionView` a lot more flexible. This section will cover the
most common use cases for `CollectionView` and how to replace `CompositeView`.

### Rendering Lists

Lists are possibly the simplest use of `CollectionView` - simply set a
`childView` option:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var ListItemView = Mn.View.extend({
  tagName: 'li',
  template: '#list-item-text'
});

var ListView = Mn.View.extend({
  tagName: 'ul',
  className: 'list-unstyled',

  childView: ListItemView
});

var list = new Bb.Collection([
  {id: 1, text: 'My text'},
  {id: 2, text: 'Another Item'}
]);

var listView = new ListView({
  collection: list
});

listview.render();
```

With the template:

```
<%- text %>
```

This will render the following:

```html
<ul class="list-unstyled">
  <li>My text</li>
  <li>Another Item</li>
</ul>
```

### Rendering Tables

Marionette 3 introduced a major improvement to `View` to make it possible to
implement tables using only `View` and `CollectionView`. This section will
demonstrate how to build a table in Marionette 3, with the equivalent in
Marionette 2 using `CompositeView`.

#### Tables Using Marionette 2

**_The following code is deprecated and for demonstration purposes only _**

To build a table in Marionette 2 requires the `CompositeView` which we'll build
as such:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var RowView = Mn.LayoutView.extend({
  tagName: 'tr',
  template: '#table-row'
});

var TableView = Mn.CompositeView.extend({
  tagName: 'table',
  className: 'table table-hover',
  template: '#table',
  childView: RowView,
  childViewContainer: 'tbody'
});

var list = new Bb.Collection([
  {id: 1, text: 'My text'},
  {id: 2, text: 'Another Item'}
]);

var myTable = new TableView({
  collection: list
});

myTable.render();
```

Given the following `#table` and `#table-row` templates:

```html
<thead>
  <tr>
    <th>ID</th>
    <th>Body</th>
  </tr>
</thead>
<tbody></tbody>
```

```html
<td><%- id %></td>
<td><%- text %></td>
```

Will render the following:

```html
<table class="table table-hover">
  <thead>
    <tr>
      <th>ID</th>
      <th>Body</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>My text</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Another Item</td>
    </tr>
  </tbody>
</table>
```
###
A major downside of this method was that it was impossible to add extra regions
inside the `CompositeView` - if a header item needed to be re-rendered based on
user input, then the entire table must be re-rendered, or the DOM must be
manipulated with `ui` items.

To resolve this issue, Marionette 3 improves the `View` to make it possible to
build tables without `CompositeView`.

#### Tables Using Marionette 3

Marionette 3 doesn't use `CompositeView` any more. We now build tables using
`View`s and `regions`. The following code will render the same table as in
[Marionette 2](#tables-using-marionette-2):

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var RowView = Mn.View.extend({
  tagName: 'tr',
  template: '#row-template'
});

var TableBody = Mn.CollectionView.extend({
  tagName: 'tbody',
  childView: RowView
});

var TableView = Mn.View.extend({
  tagName: 'table',
  className: 'table table-hover',
  template: '#table',

  regions: {
    body: {
      el: 'tbody',
      replaceElement: true
    }
  },

  onRender: function() {
    this.showChildView('body', new TableBody({
      collection: this.collection
    }));
  }
});

var list = new Bb.Collection([
  {id: 1, text: 'My text'},
  {id: 2, text: 'Another Item'}
]);

var myTable = new TableView({
  collection: list
});

myTable.render();
```

We can leave the templates as-is for this example. The major advantage of this
style is that we can create a region in any part of `TableView` as well as in
`RowView` and treat it just as any independent widget.

### Rendering Trees

Tree structures are extremely useful layouts for nesting the same type of data
over and over. A common example of this would be the Windows Explorer file
picker.

#### Trees in Marionette 2

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var TreeView = Mn.CompositeView.extend({
  tagName: 'ul',
  template: '#tree-template'
});

var TreeRoot = Mn.CollectionView.extend({
  tagName: 'ul',
  childView: TreeView
});


var tree = new Bb.Collection([
  {
    id: 5,
    nodes: [
      {id: 9, nodes: []},
      {id: 1, nodes: [...]}
    ],
  },
  {
    id: 12,
    nodes: []
  }
]);

new TreeRoot({
  collection: tree
});
```

In Marionette 2, the `CompositeView` defaults to setting `childView` to itself.
While good for building tree structures, this behavior changed for Marionette 3
with the introduction of a more general view.

#### Trees in Marionette 3

As in tables, trees in Marionette 3 require us to combine `View` and
`CollectionView` to build up the tree in a more explicit manner than the
implicit version provided by Marionette 2.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var TreeNode = Mn.View.extend({
  tagName: 'li',
  template: '#tree-template',

  regions: {
    tree: {
      el: 'ul',
      replaceElement: true
    }
  },

  onRender: function() {
    this.showChildView('tree', new TreeView({
      collection: new Bb.Collection(this.model.get('nodes'))
    }));
  }
});

var TreeView = Mn.CollectionView.extend({
  tagName: 'ul',
  childView: TreeNode
});

var tree = new Bb.Collection([
  {
    id: 5,
    nodes: [
      {id: 9, nodes: []},
      {id: 1, nodes: [...]}
    ],
  },
  {
    id: 12,
    nodes: []
  }
]);

new TreeView({
  collection: tree
});
```

This more explicit style gives us two major benefits:

* Fewer bugs - it's no longer possible to accidentally create a tree structure
* More regions to hook different views in, something that's impossible with
`CompositeView`

For getting advanced information about filtering, sorting or managing `CollectionView` look at
[Advanced CollectionView usage](./marionette.collectionviewadvanced.md)
