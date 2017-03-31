# Advanced NextCollectionView Usage

`NextCollectionView` provides a lot of possibilities to sort, filter and manages children.


## Documentation Index

* [NextCollectionView's children](#nextcollectionviews-children)
  * [NextCollectionView's `buildChildView`](#nextcollectionviews-buildchildview)
  * [NextCollectionView's `addChildView`](#nextcollectionviews-addchildview)
  * [NextCollectionView: Retrieve Child Views](#nextcollectionview-retrieve-child-views)
    * [NextCollectionView children's: `findByCid`](#nextcollectionview-children-findbycid)
    * [NextCollectionView children's: `findByModel`](#nextcollectionview-children-findbymodel)
    * [NextCollectionView children's: `findByModelCid`](#nextcollectionview-children-findbymodelcid)
    * [NextCollectionView children's: `findByIndex`](#nextcollectionview-children-findbyindex)
    * [NextCollectionView children's: `findIndexByView`](#nextcollectionview-children-findindexbyview)
  * [NextCollectionView's `removeChildView`](#nextcollectionviews-removechildview)
  * [NextCollectionView's `detachChildView`](#nextcollectionviews-detachchildview)
  * [NextCollectionView childView Iterators And Collection Functions](#nextcollectionview-childview-iterators-and-collection-functions)

* [NextCollectionView's `filter`](#nextcollectionviews-filter)
  * [NextCollectionView's `viewFilter`](#nextcollectionviews-viewfilter)
  * [NextCollectionView's `getFilter`](#nextcollectionviews-getfilter)
  * [NextCollectionView's `setFilter`](#nextcollectionviews-setfilter)
  * [NextCollectionView's `removeFilter`](#nextcollectionviews-removefilter)

* [NextCollectionView's `sort`](#nextcollectionviews-sort)
  * [NextCollectionView's `viewComparator`](#nextcollectionviews-viewcomparator)
  * [NextCollectionView's `getComparator`](#nextcollectionviews-getcomparator)
  * [NextCollectionView's `setComparator`](#nextcollectionviews-setcomparator)
  * [NextCollectionView's `removeComparator`](#nextcollectionviews-removecomparator)
  * [NextCollectionView's `sortWithCollection`](#nextcollectionviews-sortwithcollection)

* [Binding `ui`](#binding-ui)


## NextCollectionView's children

The `NextCollectionView` can store and manage its child views. This allows you to easily access
the views within the collection view, iterate them, find them by
a given indexer such as the view's model or collection, and more.

### NextCollectionView's `buildChildView`

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
Override this method when you need a more complicated build, but use [`childView`](./marionette.nextcollectionview.md#nextcollectionviews-childview)
if you need to determine _which_ View class to instantiate.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyNextCollectionView = Mn.NextCollectionView.extend({
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

### NextCollectionView's `addChildView`

The `addChildView` method can be used to add a view that is independent of your
`Backbone.Collection`. Note that this added view will be subject to filtering
and ordering and may be difficult to manage in complex situations. Use with
care.

This method takes two parameters, the child view instance and the index for
where it should be placed within the [NextCollectionView's children](#nextcollectionviews-children). It returns the added view.

```javascript
var Mn = require('backbone.marionette');
var buttonView = new ButtonView();
var MyCollectionView = Mn.NextCollectionView.extend({
  onRender: function() {
    this.addChildView(buttonView, this.collection.length);
  }
});

var myCollectionView = new MyCollectionView();

myCollectionView.render();
```

### NextCollectionView: Retrieve Child Views

You can retrieve a view by any of the index. If the findBy* method cannot find the view, it will return undefined.

#### NextCollectionView children's: `findByCid`
Find a view by it's cid.

```javascript
var bView = myCollectionView.children.findByCid(buttonView.cid);
```

#### NextCollectionView children's: `findByModel`
Find a view by model.

```javascript
var bView = myCollectionView.children.findByModel(buttonView.model);
```

#### NextCollectionView children's: `findByModelCid`
Find a view by model cid.

```javascript
var bView = myCollectionView.children.findByModelCid(buttonView.model.cid);
```

#### NextCollectionView children's: `findByIndex`

Find by numeric index (unstable)

```javascript
var bView = myCollectionView.children.findByIndex(0);
```

#### NextCollectionView children's: `findIndexByView`

Find the index of the view inside the children

```javascript
var index = myCollectionView.children.findIndexByView(bView);
```

### NextCollectionView's `removeChildView`

The `removeChildView` method is useful if you need to remove and destroy a view from the `NextCollectionView` without affecting the view's collection.  In most cases it is better to use the data to determine what the `NextCollectionView` should display.

This method accepts the child view instance to remove as its parameter. It returns the removed view;

```javascript
var Mn = require('backbone.marionette');

Mn.NextCollectionView.extend({
  onChildViewClose: function(childView, model) {
    // NOTE: we must wait for the server to confirm
    // the destroy PRIOR to removing it from the collection
    model.destroy({wait: true});

    // but go ahead and remove it visually
    this.removeChildView(childView);
  }
});
```

### NextCollectionView's `detachChildView`

This method is the same as [`removeChildView`](#nextcollectionviews-removechildview)
with the exception that the removed view is not destroyed.

### NextCollectionView childView Iterators And Collection Functions

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
* [partition](http://underscorejs.org/#partition)

These methods can be called directly on the container, to iterate and process
the views held by the container.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var collectionView = new Mn.NextCollectionView({
  collection: new Bb.Collection()
});

collectionView.render();

// iterate over all of the views and process them
collectionView.children.each(function(childView) {
  // process the `childView` here
});
```

## NextCollectionView's `filter`

The `filter` method will loop through the `NextCollectionView` `children`
and test them against the [`viewFilter`](#nextcollectionviews-viewfilter).
The views that pass the `viewFilter`are rendered if necessary and attached
to the CollectionView and the views that are filtered out will be detached.
If a `viewFilter` exists the `before:filter` and `filter` events will be triggered.
By default the NextCollectionView will refilter when views change or when the
NextCollectionView is sorted.

### NextCollectionView's `viewFilter`

`NextCollectionView` allows for a custom `viewFilter` option if you want to prevent
some of the underlying `children` from being attached to the DOM.
A `viewFilter` can be a function, predicate object. or string.

#### NextCollectionView's `viewFilter` as a function

The `viewFilter` function takes a view from the `children` and returns a truthy
value if the child should be attached, and a falsey value if it should not.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  childView: SomeChildView,
  emptyView: SomeEmptyView,
  collection: new Bb.Collection([
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 }
  ]),

  // Only show views with even values
  viewFilter: function (view, index, children) {
    return view.model.get('value') % 2 === 0;
  }
});

// renders the views with values '2' and '4'
cv.render();
```

#### NextCollectionView's `viewFilter` as a predicate object

The `viewFilter` predicate object will filter against the view's model attributes.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  childView: SomeChildView,
  emptyView: SomeEmptyView,
  collection: new Bb.Collection([
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 }
  ]),

  // Only show views with even values
  viewFilter: { value: 2 }
});

// renders the view with values '2'
cv.render();
```

#### NextCollectionView's `viewFilter` as a predicate object

The `viewFilter` string represents the view's model attribute and will filter
truthy values.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  childView: SomeChildView,
  emptyView: SomeEmptyView,
  collection: new Bb.Collection([
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: null },
    { value: 4 }
  ]),

   // Only show views 1,2, and 4
  viewFilter: 'value'
});

// renders the view with values '2'
cv.render();
```

### NextCollectionView's `getFilter`

Override this function to programatically decide which
`viewFilter` to use when `filter` is called.

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.NextCollectionView.extend({
  summaryFilter: function(view) {
    return view.model.get('type') === 'summary';
  },
  getFilter: function() {
    if(this.collection.length > 100) {
      return this.summaryFilter;
    }
    return this.viewFilter;
  }
});
```

### NextCollectionView's `setFilter`

The `setFilter` method modifies the `NextCollectionView`'s `viewFilter` attribute and filters.
Passing `{ preventRender: true }` in the options argument will prevent the view
being rendered.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  collection: someCollection
});

cv.render();

var newFilter = function(view, index, children) {
  return view.model.get('value') % 2 === 0;
};

// Note: the setFilter is preventing the automatic re-render
cv.setFilter(newFilter, { preventRender: true });

//Render the new state of the ChildViews instead of the whole DOM.
cv.render();
```

### NextCollectionView's `removeFilter`

This function is actually an alias of `setFilter(null, options)`. It is useful
for removing filters. `removeFilter` also accepts `preventRender` as a option.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  collection: someCollection
});

cv.render();

cv.setFilter(function(view, index, children) {
  return view.model.get('value') % 2 === 0;
});

//Remove the current filter without rendering again.
cv.removeFilter({ preventRender: true });
```

## NextCollectionView's `sort`

The `sort` method will loop through the `NextCollectionView` `children`
and sort them with the [`viewComparator`](#nextcollectionviews-viewcomparator).
By default, if a `viewComparator` is not set, the `NextCollectionView` will sort
the views by the order of the models in the collection.
This method is also triggered internally when rendering and `before:sort` and
`sort` events will be triggered before and after sorting.

By default the `NextCollectionView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sort: false}` on
initialize. The `sort` flag cannot be changed after instantiation.

### NextCollectionView's `viewComparator`

`NextCollectionView` allows for a custom `viewComparator` option if you want your
`NextCollectionView`'s children to be rendered with a different sort order than the
underlying Backbone collection uses.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  collection: someCollection,
  viewComparator: 'otherFieldToSortOn'
});
```

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

var mySortedColView = new Mn.NextCollectionView({
  //...
  collection: myCollection
});

var myUnsortedColView = new Mn.NextCollectionView({
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

The `viewComparator` can take any of the acceptable `Backbone.Collection`
[comparator formats](http://backbonejs.org/#Collection-comparator) -- a sortBy
(pass a function that takes a single argument), as a sort (pass a comparator
function that expects two arguments), or as a string indicating the attribute to
sort by.

### NextCollectionView's `getComparator`

Override this method to determine which `viewComparator` to use.

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.NextCollectionView.extend({
  sortAsc: function(model) {
    return -model.get('order');
  },
  sortDesc: function(model) {
    return model.get('order');
  },
  getComparator: function() {
    // The collectionView's model
    if (this.model.get('sorted') === 'ASC') {
      return this.sortAsc;
    }

    return this.sortDesc;
  }
});
```

### NextCollectionView's `setComparator`

The `setComparator` method modifies the `NextCollectionView`'s `viewComparator`
attribute and re-sorts. Passing `{ preventRender: true }` in the options argument
will prevent the view being rendered.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  collection: someCollection
});

cv.render();

// Note: the setComparator is preventing the automatic re-render
cv.setComparator('orderBy', { preventRender: true });

// Render the children ordered by the orderBy attribute
cv.render();
```

### NextCollectionView's `removeComparator`

This function is actually an alias of `setComparator(null, options)`. It is useful
for removing the comparator. `removeComparator` also accepts `preventRender` as a option.

```javascript
var Mn = require('backbone.marionette');

var cv = new Mn.NextCollectionView({
  collection: someCollection
});

cv.render();

cv.setComparator('orderBy');

//Remove the current comparator without rendering again.
cv.removeComparator({ preventRender: true });
```

### NextCollectionView's `sortWithCollection`

By default the `NextCollectionView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sortWithCollection: false}` on initialize or on the view definiton

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

var mySortedColView = new Mn.NextCollectionView({
  //...
  collection: myCollection
});

var myUnsortedColView = new Mn.NextCollectionView({
  //...
  collection: myCollection,
  sortWithCollection: false
});

mySortedColView.render(); // 1 4 3 2
myUnsortedColView.render(); // 1 4 3 2

// mySortedColView auto-renders 1 2 3 4
// myUnsortedColView has no change
myCollection.sort();
```

## Binding `ui`

By default, `NextCollectionView` will not bind the `ui` object. As it has no direct
`template` of its own to manage, this isn't usually an issue. There may be
instances where binding `ui` is helpful when you want to access elements inside
`NextCollectionView`s children with `getUI()`.

If you need to bind `ui` yourself, you can just run `bindUIElements` on the
collection:

```javascript
var Mn = require('backbone.marionette');

var MyCollectionView = Mn.NextCollectionView.extend({
  ...

  ui: {
    checkbox: 'input[type="checkbox"]'
  }
});

var collectionView = new MyCollectionView();

collectionView.bindUIElements();

console.log(collectionView.getUI('checkbox')); // Output all checkboxes.
```
