# Marionette.NextCollectionView

**Warning** *The NextCollectionView API is currently experimental and may change.*

This NextCollectionView is a possible replacement for the current [`CollectionView`](./marionette.collectionview.md)
in a future version of Marionette. This simplifies the logic flow of the CollectionView
as well as normalizes parts of the API. The result is a more performant CollectionView
with more consistent behavior. For more information check out [our blog post](https://medium.com/blog-marionettejs/next-collection-view-d335f5a9736a) on why this was introduced.

The `NextCollectionView` will loop through all of the models in the specified collection,
instantiating a view for each of them using a specified `childView`, and adding them to the `children`.
It will then sort the `children` by the `viewComparator` and filter them by the `viewFilter`.
The `el` of the child views that pass the filter will be rendered and appended to
the collection view's `el`. By default the `NextCollectionView` will maintain a
sorted collection's order in the DOM. This behavior can be disabled by specifying `{sortWithCollection: false}` on initialize.

`NextCollectionView` has the base functionality provided by the View Mixin.

## Documentation Index

* [NextCollectionView's `childView`](#nextcollectionviews-childview)
  * [NextCollectionView's `childViewOptions`](#nextcollectionviews-childviewoptions)
* [NextCollectionView's `emptyView`](#nextcollectionviews-emptyview)
  * [NextCollectionView's `emptyViewOptions`](#nextcollectionviews-emptyviewoptions)
  * [NextCollectionView's `isEmpty`](#nextcollectionviews-isempty)
* [NextCollectionView's `render`](#nextcollectionviews-render)
  * [Automatic Rendering](#automatic-rendering)
  * [Re-render the NextCollectionView](#re-render-the-nextcollectionview)
  * [NextCollectionView's `attachHtml`](#nextcollectionviews-attachhtml)
* [NextCollectionView's `destroy`](#nextcollectionviews-destroy)
* [Events](#events)
  * [Child Event Bubbling](#child-event-bubbling)
  * [Lifecycle Events](#lifecycle-events)
* [Advanced NextCollectionView Usage](#advanced-nextcollectionview-usage)
  * [Managing Children](#managing-children)
  * [Filtering](#filtering)
  * [Sorting](#sorting)


## NextCollectionView's `childView`

Specify a `childView` in your collection view definition. This must be
a Backbone view class definition, not an instance. It can be any
`Backbone.View` or be derived from `Marionette.View`.

```javascript
var Mn = require('backbone.marionette');

var MyChildView = Mn.View.extend({});

Mn.NextCollectionView.extend({
  childView: MyChildView
});
```

Child views must be defined before they are referenced by the
`childView` attribute in a collection view definition.

Alternatively, you can specify a `childView` in the options for
the constructor:

```javascript
var Mn = require('backbone.marionette');

var MyNextCollectionView = Mn.NextCollectionView.extend({...});

new MyNextCollectionView({
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

var MyNextCollectionView = Mn.NextCollectionView.extend({
  collection: new Bb.Collection(),
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

var collectionView = new MyNextCollectionView();
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

### NextCollectionView's `childViewOptions`

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

var NextCollectionView = Mn.NextCollectionView.extend({
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

var NextCollectionView = Mn.NextCollectionView.extend({
  childViewOptions: function(model, index) {
    // do some calculations based on the model
    return {
      foo: 'bar',
      childIndex: index
    }
  }
});
```

## NextCollectionView's `emptyView`

When a collection has no children, and you need to render a view other than
the list of childViews, you can specify an `emptyView` attribute on your
collection view. The `emptyView` just like the [`childView`](#nextcollectionviews-childview) can also be passed as an option on instantiation or can be a
function that returns the `emptyView`.

```javascript
var Mn = require('backbone.marionette');

var MyEmptyView = Mn.View.extend({
  template: _.template('Nothing to display.')
});

var MyNextCollectionView = Mn.NextCollectionView.extend({
  // ...

  emptyView: MyEmptyView
});
```

### NextCollectionView's `emptyViewOptions`

Similar to [`childView`](#nextcollectionviews-childview) and [`childViewOptions`](#nextcollectionviews-childviewoptions),
there is an `emptyViewOptions` property that will be passed to the `emptyView` constructor.
It can be provided as an object literal or as a function.

If `emptyViewOptions` aren't provided the `NextCollectionView` will default to passing the `childViewOptions` to the `emptyView`.

```javascript
var Mn = require('backbone.marionette');

var EmptyView = Mn.View({
  initialize: function(options){
    console.log(options.foo); // => "bar"
  }
});

var NextCollectionView = Mn.NextCollectionView({
  emptyView: EmptyView,

  emptyViewOptions: {
    foo: 'bar'
  }
});
```

### NextCollectionView's `isEmpty`

If you want to control when the empty view is rendered, you can override
`isEmpty`:

```javascript
var Mn = require('backbone.marionette');

var MyNextCollectionView = Mn.NextCollectionView.extend({
  isEmpty: function(allViewsFiltered) {
    // some logic to calculate if the view should be rendered as empty
    return this.collection.length < 2;
  }
});
```

In the normal lifecycle of a `NextCollectionView`, `isEmpty` will be called
twice. Once when a render begins, and twice after the [`viewFilter`](#filtering) is run. For the call after filtering, a boolean will be passed indicating if all
of the NextCollectionView's `children` were filtered.

## NextCollectionView's `render`

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
children in the collection and renders them individually as a
`childView`.

```javascript
var Mn = require('backbone.marionette');

var MyNextCollectionView = Mn.NextCollectionView.extend({...});

// all of the children views will now be rendered.
new MyNextCollectionView().render();
```

### Automatic Rendering

After the initial render the collection view binds to the `update` and
`reset` events of the collection that is specified.

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model into the children.

When a model is removed from a collection (or destroyed / deleted), the collection
view will destroy and remove that model's child view.

When the collection for the view is sorted, the view will automatically re-sort its child views unless the `sortWithCollection` attribute on the NextCollectionView is set to `false`.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var collection = new Bb.Collection();

var MyChildView = Mn.View.extend({
  template: _.noop
});

var MyNextCollectionView = Mn.NextCollectionView.extend({
  childView: MyChildView,
  collection: collection,
});

var myNextCollectionView = new MyNextCollectionView();

// Collection view will not re-render as it has not been rendered
collection.reset([{foo: 'foo'}]);

myNextCollectionView.render();

// Collection view will re-render displaying the new model
collection.reset([{foo: 'bar'}]);
```

### Re-render the NextCollectionView

If you need to re-render the entire collection, you can call the
`view.render` method. This method takes care of destroying all of
the child views that may have previously been opened.

### NextCollectionView's `attachHtml`

By default the NextCollectionView will append the HTML of each ChildView
into the element buffer, and then calls the DOM Mixin's [appendChildren](./dom.mixin.md#appendchildrenel-children) once at the
end to move the HTML into the collection view's `el`.

You can override this by specifying an `attachHtml` method in your
view definition. This method takes two parameters and has no return
value.

```javascript
var Mn = require('backbone.marionette');

Mn.NextCollectionView.extend({

  // The default implementation:
  attachHtml: function(collectionView, els){
    this.appendChildren(collectionView.el, els);
  }

});
```

The first parameter is the instance of the NextCollectionView that
will receive the HTML from the second parameter, the HTML buffer.

## NextCollectionView's `destroy`

`NextCollectionView` implements a `destroy` method which automatically
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

var myNextCollectionView = new Mn.NextCollectionView({
  childView: MyChildView,
  collection: new Bb.Collection([{ id: 1 }])
});

myNextCollectionView.render();

myNextCollectionView.destroy(); // logs "I will get destroyed"
```

## Events

The `NextCollectionView`, like `View`, is able to trigger and respond to events
occurring during their lifecycle. The [Documentation for Events](./events.md)
has the complete documentation for how to set and handle events on views.

### Child Event Bubbling

The collection view is able to monitor and act on events on any children they
own using [`childViewEvents`](./events.md#explicit-event-listeners) and [`childViewTriggers`](./events.md#triggering-events-on-child-events). Additionally when a child
view triggers an event, that [event will bubble up](./events.md#event-bubbling) one level to the parent
collection view. For an example:

```javascript
var Mn = require('backbone.marionette');

var Item = Mn.View.extend({
  tagName: 'li',

  triggers: {
    'click a': 'select:item'
  }
});

var Collection = Mn.NextCollectionView.extend({
  tagName: 'ul',

  onChildviewSelectItem: function(childView) {
    console.log('item selected: ' + childView.model.id);
  }
});
```

The event will receive a [`childview:` prefix](./events.md#a-child-views-event-prefix) before going through the magic
method binding logic. See the
[documentation for Child View Events](./events.md#child-view-events) for more
information.

### Lifecycle Events

The `NextCollectionView` contains its own lifecycle events, on top of the regular
`View` event lifecycle. For more information on what these are, and how to use
them, see the
[Documentation on `NextCollectionView` lifecycle events](./viewlifecycle.md#nextcollectionview-lifecycle)

## Advanced NextCollectionView Usage

For getting advanced information about filtering, sorting or managing `NextCollectionView` look at
[Advanced NextCollectionView usage](./marionette.nextcollectionviewadvanced.md)

### Managing Children

The `NextCollectionView` can store and manage its child views. This allows you to easily access
the views within the collection view, iterate them, find them by a given indexer such as the
view's model or collection, and more. [Additional Information...](./marionette.nextcollectionviewadvanced.md#nextcollectionviews-children)

### Filtering

`NextCollectionView` allows for a custom `viewFilter` option if you want to prevent some of the
child views from being rendered inside the NextCollectionView. [Additional Information...](./marionette.nextcollectionviewadvanced.md#nextcollectionviews-filter)

### Sorting

By default the `NextCollectionView` will maintain a sorted collection's order in the DOM.
[Additional Information...](./marionette.nextcollectionviewadvanced.md#nextcollectionviews-sort)
