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
* [CollectionView's `emptyView`](#collectionviews-emptyview)
  * [CollectionView's `emptyViewOptions`](#collectionviews-emptyviewoptions)
  * [CollectionView's `isEmpty`](#collectionviews-isempty)
* [CollectionView's `render`](#collectionviews-render)
  * [Automatic Rendering](#automatic-rendering)
  * [Re-render the CollectionView](#re-render-the-collectionview)
  * [CollectionView's `attachHtml`](#collectionviews-attachhtml)
  * [CollectionView's `attachBuffer`](#collectionviews-attachbuffer)
* [CollectionView's `destroy`](#collectionviews-destroy)
* [Events](#events)
  * [Child Event Bubbling](#child-event-bubbling)
  * [Lifecycle Events](#lifecycle-events)
* [Rendering `CollectionView`s](#rendering-collectionviews)
  * [Rendering Lists](#rendering-lists)
  * [Rendering Tables](#rendering-tables)
    * [Tables Using Marionette 2](#tables-using-marionette-2)
    * [Tables Using Marionette 3](#tables-using-marionette-3)
  * [Rendering Trees](#rendering-trees)
    * [Trees in Marionette 2](#trees-in-marionette-2)
    * [Trees in Marionette 3](#trees-in-marionette-3)
* [Advanced CollectionView Usage](#advanced-collectionview-usage)
  * [Managing Children](#managing-children)
  * [Filtering](#filtering)
  * [Sorting](#sorting)


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

[Live example](https://jsfiddle.net/marionettejs/woe8yo99/)

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

[Live example](https://jsfiddle.net/marionettejs/7prtxfmu/)

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

[Live example](https://jsfiddle.net/marionettejs/cLrfdkvg/)

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

[Live example](https://jsfiddle.net/marionettejs/ydt01Lyq/)

### CollectionView's `emptyViewOptions`

Similar to [`childView`](#collectionviews-childview) and [`childViewOptions`](#collectionviews-childviewoptions),
there is an `emptyViewOptions` property that will be passed to the `emptyView` constructor.
It can be provided as an object literal or as a function.

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

[Live example](https://jsfiddle.net/marionettejs/wu6u00sn/)

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

[Live example](https://jsfiddle.net/marionettejs/3t9hLfpu/)

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

[Live example](https://jsfiddle.net/marionettejs/1wkc0p7o/)

For more information on rendering techiniques see: [Rendering `CollectionView`s](#rendering-collectionviews).

### Automatic Rendering

After the initial render the collection view binds to the `add`, `remove` and
`reset` events of the collection that is specified.

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of child views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will destroy and remove that model's child view.

When the collection for the view is sorted, the view will automatically re-sort its child views.
If the [`reorderOnSort`](./marionette.collectionviewadvanced.md#collectionviews-reorderonsort) option is set it will attempt to reorder the DOM and do this without a full re-render, otherwise it will re-render if the order has changed. Please Note that if you apply a filter to the collection view and the filtered views change during a sort then it will always re-render.

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var collection = new Bb.Collection();

var MyChildView = Mn.View.extend({
  template: _.noop
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

[Live example](https://jsfiddle.net/marionettejs/rk3x77ds/)

### Re-render the CollectionView

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

[Live example](https://jsfiddle.net/marionettejs/wnhd10jd/)

## Events

The `CollectionView`, like `View`, is able to trigger and respond to events
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

var Collection = Mn.CollectionView.extend({
  tagName: 'ul',

  onChildviewSelectItem: function(childView) {
    console.log('item selected: ' + childView.model.id);
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/5z1qcr4z/)

The event will receive a [`childview:` prefix](./events.md#a-child-views-event-prefix) before going through the magic
method binding logic. See the
[documentation for Child View Events](./events.md#child-view-events) for more
information.

### Lifecycle Events

The `CollectionView` contains its own lifecycle events, on top of the regular
`View` event lifecycle. For more information on what these are, and how to use
them, see the
[Documentation on `CollectionView` lifecycle events](./viewlifecycle.md#collectionview-lifecycle)

## Rendering `CollectionView`s

Marionette 3 has deprecated the `CompositeView` (for removal in v4) in favor of making the
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

var ListView = Mn.CollectionView.extend({
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

[Live example](https://jsfiddle.net/marionettejs/u448nhr2/)

### Rendering Tables

Marionette 3 introduced a major improvement to `View` to make it possible to
implement tables using only `View` and `CollectionView`. This section will
demonstrate how to build a table in Marionette 3, with the equivalent in
Marionette 2 using `CompositeView`.

#### Tables Using Marionette 2

**Note** _The following code is deprecated and for demonstration purposes only_

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

[Live example](https://jsfiddle.net/marionettejs/zr8gn69g/)

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
    var nodes = this.model.get('nodes');

    //show child nodes if they are present
    if (nodes.length) {
      var treeView = new TreeView({
        collection: new Bb.Collection(nodes)
      });

      this.showChildView('tree', treeView);
    }
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

[Live example](https://jsfiddle.net/marionettejs/uyoe84n5/)

This more explicit style gives us two major benefits:

* Fewer bugs - it's no longer possible to accidentally create a tree structure
* More regions to hook different views in, something that's impossible with
`CompositeView`

## Advanced CollectionView Usage

For getting advanced information about filtering, sorting or managing `CollectionView` look at
[Advanced CollectionView usage](./marionette.collectionviewadvanced.md)

### Managing Children

The `CollectionView` can store and manage its child views. This allows you to easily access
the views within the collection view, iterate them, find them by a given indexer such as the
view's model or collection, and more. [Additional Information...](./marionette.collectionviewadvanced.md#collectionviews-children)

### Filtering

`CollectionView` allows for a custom `filter` option if you want to prevent some of the
underlying `collection`'s models from being rendered as child views. [Additional Information...](./marionette.collectionviewadvanced.md#collectionviews-filter)

### Sorting

By default the `CollectionView` will maintain a sorted collection's order in the DOM.
[Additional Information...](./marionette.collectionviewadvanced.md#collectionviews-sort)
