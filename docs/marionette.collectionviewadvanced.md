# Advanced CollectionView Usage

`CollectionView` provides a lot of possibilities to sort, filter and manages children.


## Documentation Index

* [CollectionView's children](#collectionviews-children)
  * [CollectionView's `buildChildView`](#collectionviews-buildchildview)
  * [CollectionView's `addChildView`](#collectionviews-addchildview)
  * [CollectionView: Retrieve Child Views](#collectionview-retrieve-child-views)
    * [CollectionView childView's: `findByCid`](#collectionview-childviews-findbycid)
    * [CollectionView childView's: `findByModel`](#collectionview-childviews-findbymodel)
    * [CollectionView childView's: `findByModelCid`](#collectionview-childviews-findbymodelcid)
    * [CollectionView childView's: `findByCustom`](#collectionview-childviews-findbycustom)
    * [CollectionView childView's: `findByIndex`](#collectionview-childviews-findbyindex)
  * [CollectionView's `removeChildView`](#collectionviews-removechildview)
  * [CollectionView childView Iterators And Collection Functions](#collectionview-childview-iterators-and-collection-functions)

* [CollectionView's `filter`](#collectionviews-filter)
  * [CollectionView's `setFilter`](#collectionviews-setfilter)
  * [CollectionView's `removeFilter`](#collectionviews-removefilter)

* [CollectionView's `sort`](#collectionviews-sort)
  * [CollectionView's `viewComparator`](#collectionviews-viewcomparator)
  * [CollectionView's `getViewComparator`](#collectionviews-getviewcomparator)
  * [CollectionView's `reorderOnSort`](#collectionviews-reorderonsort)
  * [CollectionView's `reorder`](#collectionviews-reorder)
  * [CollectionView's `resortView`](#collectionviews-resortview)

* [Binding `ui`](#binding-ui)


## CollectionView's children

The `CollectionView` can store and manage its child views. This allows you to easily access
the views within the collection view, iterate them, find them by
a given indexer such as the view's model or collection, and more.

### CollectionView's `buildChildView`

The `buildChildView` is responsible for taking the ChildView class and
instantiating it with the appropriate data. This method takes three
parameters and returns a view instance to be used as thechild view.

```javascript
buildChildView: function(child, ChildViewClass, childViewOptions){
  // build the final list of options for the childView class
  var options = _.extend({model: child}, childViewOptions);
  // create the child view instance
  var view = new ChildViewClass(options);
  // return it
  return view;
},
```
Override this method when you need a more complicated build, but use [`childView`](./marionette.collectionview.md#collectionviews-childview)
if you need to determine _which_ View class to instantiate.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({
  childView: function(child) {
    if (child.get('type') === 'list') {
      return MyListView;
    }

    return MyView;
  },
  buildChildView: function(child, ChildViewClass, childViewOptions) {
    var options = {};

    if (child.get('type') === 'list') {
      var childList = new Bb.Collection(child.get('list'));
      options = _.extend({collection: childList}, childViewOptions);
    } else {
      options = _.extend({model: child}, childViewOptions);
    }

    // create the child view instance
    var view = new ChildViewClass(options);
    // return it
    return view;
  }

});

```

### CollectionView's `addChildView`

The `addChildView` method can be used to add a view that is independent of your
`Backbone.Collection`. Note that this added view will be subject to filtering
and ordering and may be difficult to manage in complex situations. Use with
care.

This method takes two parameters, the child view instance and the index for
where it should be placed within the [CollectionView's children](#collectionviews-children).

```javascript
var Mn = require('backbone.marionette');
var buttonView = new ButtonView();
var MyCollectionView = Mn.CollectionView.extend({
  onRender: function() {
    this.addChildView(buttonView, this.collection.length);
  }
});

var myCollectionView = new MyCollectionView();

myCollectionView.render();
```

### CollectionView: Retrieve Child Views

You can retrieve a view by any of the index. If the findBy* method cannot find the view, it will return undefined.

#### CollectionView childView's: `findByCid`
Find a view by it's cid.

```javascript
var bView = myCollectionView.children.findByCid(buttonView.cid);
```

#### CollectionView childView's: `findByModel`
Find a view by model.

```javascript
var bView = myCollectionView.children.findByModel(buttonView.model);
```

#### CollectionView childView's: `findByModelCid`
Find a view by model cid.

```javascript
var bView = myCollectionView.children.findByModelCid(buttonView.model.cid);
```

#### CollectionView childView's: `findByCustom`
Find by custom key.

```javascript
var bView = myCollectionView.children.findByCustom('custom_key');
```

#### CollectionView childView's: `findByIndex`

Find by numeric index (unstable)

```javascript
var bView = myCollectionView.children.findByIndex(0);
```

### CollectionView's `removeChildView`

The `removeChildView` method is useful if you need to remove a view from the `CollectionView` without affecting the view's collection.  In most cases it is better to use the data to determine what the `CollectionView` should display.

This method the child view instance to remove as its parameter.

```javascript
var Mn = require('backbone.marionette');

Mn.CollectionView.extend({
  onChildViewClose: function(childView, model) {
    // NOTE: we must wait for the server to confirm
    // the destroy PRIOR to removing it from the collection
    model.destroy({wait: true});

    // but go ahead and remove it visually
    this.removeChildView(childView);
  }
});
```

### CollectionView childView Iterators And Collection Functions

The container object borrows several functions from
[Underscore.js](http://underscorejs.org/), to provide iterators and other
collection functions, including:

* [each](http://underscorejs.org/#each)
* [map](http://underscorejs.org/#map)
* [reduce](http://underscorejs.org/#reduce)
* [find](http://underscorejs.org/#find)
* [filter](http://underscorejs.org/#filter)
* [reject](http://underscorejs.org/#reject)
* [every](http://underscorejs.org/#every)
* [some](http://underscorejs.org/#some)
* [contains](http://underscorejs.org/#contains)
* [invoke](http://underscorejs.org/#invoke)
* [toArray](http://underscorejs.org/#toArray)
* [first](http://underscorejs.org/#first)
* [initial](http://underscorejs.org/#initial)
* [rest](http://underscorejs.org/#rest)
* [last](http://underscorejs.org/#last)
* [without](http://underscorejs.org/#without)
* [isEmpty](http://underscorejs.org/#isEmpty)
* [pluck](http://underscorejs.org/#pluck)

These methods can be called directly on the container, to iterate and process
the views held by the container.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var collectionView = new Mn.CollectionView({
  collection: new Bb.Collection()
});

collectionView.render();

// iterate over all of the views and process them
collectionView.children.each(function(childView) {
  // process the `childView` here
});
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

## Binding `ui`

By default, `CollectionView` will not bind the `ui` object. As it has no direct
`template` of its own to manage, this isn't usually an issue. There may be
instances where binding `ui` is helpful when you want to access elements inside
`CollectionView`s children with `getUI()`.

If you need to bind `ui` yourself, you can just run `bindUIElements` on the
collection:

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.CollectionView.extend({
  ...

  ui: {
    checkbox: 'input[type="checkbox"]'
  }
});

var collectionView = new MyCollectionView();

collectionView.bindUIElements();

console.log(collectionView.getUI('checkbox')); // Output all checkboxes.
```
