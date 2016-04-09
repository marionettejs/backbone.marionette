## [View the new docs](http://marionettejs.com/docs/marionette.collectionview.html)

# Marionette.CollectionView

The `CollectionView` will loop through all of the models in the
specified collection, render each of them using a specified `childView`,
then append the results of the child view's `el` to the collection view's
`el`. By default the `CollectionView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sort: false}` on initialize.

CollectionView extends directly from Marionette.AbstractView. Please see
[the Marionette.AbstractView documentation](marionette.abstractview.md)
for more information on available features and functionality.

Additionally, interactions with Marionette.Region
will provide features such as `onShow` callbacks, etc. Please see
[the Region documentation](./marionette.region.md) for more information.

## Documentation Index

* [CollectionView's `childView`](#collectionviews-childview)
  * [CollectionView's `childViewOptions`](#collectionviews-childviewoptions)
  * [CollectionView's `childViewEventPrefix`](#collectionviews-childvieweventprefix)
  * [CollectionView's `childViewEvents`](#collectionviews-childviewevents)
  * [CollectionView's `buildChildView`](#collectionviews-buildchildview)
  * [CollectionView's `addChild`](#collectionviews-addchild)
  * [CollectionView's `setFilter`](#collectionviews-setfilter)
  * [CollectionView's `removeFilter`](#collectionviews-removefilter)
  * [CollectionView's `reorderOnSort`](#collectionviews-reorderonsort)
* [CollectionView's `emptyView`](#collectionviews-emptyview)
  * [CollectionView's `getEmptyView`](#collectionviews-getemptyview)
  * [CollectionView's `isEmpty`](#collectionviews-isempty)
  * [CollectionView's `emptyViewOptions`](#collectionviews-emptyviewoptions)
  * [CollectionView's `destroyChildren`](#collectionviews-destroychildren)
* [Rendering `CollectionView`s](#rendering-collectionviews)
  * [Rendering Lists](#rendering-lists)
  * [Rendering Tables](#rendering-tables)
    * [Tables Using Marionette 2](#tables-using-marionette-2)
    * [Tables Using Marionette 3](#tables-using-marionette-3)
  * [Rendering Trees](#rendering-trees)
    * [Trees in Marionette 2](#trees-in-marionette-2)
    * [Trees in Marionette 3](#trees-in-marionette-3)
* [Callback Methods](#callback-methods)
  * [onBeforeRender callback](#onbeforerender-callback)
  * [onRender callback](#onrender-callback)
  * [onBeforeReorder callback](#onbeforereorder-callback)
  * [onReorder callback](#onreorder-callback)
  * [onBeforeDestroy callback](#beforedestroy-callback)
  * [onDestroy callback](#ondestroy-callback)
  * [onBeforeAddChild callback](#onbeforeaddchild-callback)
  * [onAddChild callback](#onaddchild-callback)
  * [onBeforeRemoveChild callback](#onbeforeremovechild-callback)
  * [onRemoveChild callback](#onremovechild-callback)
* [CollectionView Events](#collectionview-events)
  * ["before:render" event](#beforerender-event)
  * ["render" event](#render-event)
  * ["before:apply:filter" / "apply:filter" event](#beforeapplyfilter--applyfilter-event)
  * ["before:reorder" / "reorder" event](#beforereorder--reorder-event)
  * ["before:destroy" event](#beforedestroy-event)
  * ["destroy" / "destroy:childen" event](#destroy--destroychildren-event)
  * ["before:add:child" / "add:child" event](#beforeaddchild--addchild-event)
  * ["before:remove:child event](#beforeremovechild-event)
  * ["remove:child" event](#removechild-event)
  * ["childview:\*" event bubbling from child views](#childview-event-bubbling-from-child-views)
  * ["before:render:children" event](#beforerenderchildren-event)
  * ["render:children" event](#renderchildren-event)
  * ["before:render:empty" event](#beforerenderempty-event)
  * ["render:empty" event](#renderempty-event)
  * ["before:remove:empty" event](#beforeremoveempty-event)
  * ["remove:empty" event](#removeempty-event)
* [CollectionView Child View Events](#collectionview-child-view-events)
* [CollectionView render](#collectionview-render)
* [CollectionView: Automatic Rendering](#collectionview-automatic-rendering)
* [CollectionView: Re-render Collection](#collectionview-re-render-collection)
* [CollectionView's attachHtml](#collectionviews-attachhtml)
* [CollectionView's resortView](#collectionviews-resortview)
* [CollectionView's viewComparator](#collectionviews-viewcomparator)
* [CollectionView's `filter`](#collectionviews-filter)
* [CollectionView's children](#collectionviews-children)
* [CollectionView destroy](#collectionview-destroy)

## CollectionView's `childView`

Specify a `childView` in your collection view definition. This must be
a Backbone view object definition, not an instance. It can be any
`Backbone.View` or be derived from `Marionette.View`.

```js
var MyChildView = Marionette.View.extend({});

Marionette.CollectionView.extend({
  childView: MyChildView
});
```

Child views must be defined before they are referenced by the
`childView` attribute in a collection view definition.

Alternatively, you can specify a `childView` in the options for
the constructor:

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

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

```js
var FooBar = Backbone.Model.extend({
  defaults: {
    isFoo: false
  }
});

var FooView = Marionette.View.extend({
  template: '#foo-template'
});
var BarView = Marionette.View.extend({
  template: '#bar-template'
});

var MyCollectionView = Marionette.CollectionView.extend({
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

```js
var ChildView = Marionette.View.extend({
  initialize: function(options) {
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Marionette.CollectionView.extend({
  childView: ChildView,

  childViewOptions: {
    foo: "bar"
  }
});
```

You can also specify the `childViewOptions` as a function, if you need to
calculate the values to return at runtime. The model will be passed into
the function should you need access to it when calculating
`childViewOptions`. The function must return an object, and the attributes
of the object will be copied to the `childView` instance's options.

```js
var CollectionView = Marionette.CollectionView.extend({
  childViewOptions: function(model, index) {
    // do some calculations based on the model
    return {
      foo: "bar",
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

```js
var CV = Marionette.CollectionView.extend({
  childViewEventPrefix: "some:prefix"
});

var c = new CV({
  collection: myCol
});

c.on("some:prefix:render", function(){
  // child view was rendered
});

c.render();
```

The `childViewEventPrefix` can be provided in the view definition or
in the constructor function call, to get a view instance.

### CollectionView's `childViewEvents`

A `childViewEvents` hash or method permits handling of child view events without manually setting bindings. The values of the hash can either be a function or a string method name on the collection view.

```js
// childViewEvents can be specified as a hash...
var MyCollectionView = Marionette.CollectionView.extend({

  childViewEvents: {
    // This callback will be called whenever a child is rendered or emits a `render` event
    render: function() {
      console.log('A child view has been rendered.');
    }
  }
});

// ...or as a function that returns a hash.
var MyCollectionView = Marionette.CollectionView.extend({

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

`childViewEvents` also catches custom events fired by a child view.  Take note that the first argument to a `childViewEvents` handler is the child view itself.

```js
// The child view fires a custom event, `show:message`
var ChildView = Marionette.View.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  // Triggers hash converts DOM events directly to view events catchable on the parent.
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
var ParentView = Marionette.CollectionView.extend({

  childView: ChildView,

  childViewEvents: {
    'show:message': 'onChildShowMessage',
    'submit:form': 'onChildSubmitForm'
  },

  onChildShowMessage: function (childView, message) {
    console.log('A child view fired show:message with ' + message);
  },

  onChildSubmitForm: function (childView) {
    console.log('A child view fired submit:form');
  }
});
```

### CollectionView's `buildChildView`

When a custom view instance needs to be created for the `childView` that
represents a child, override the `buildChildView` method. This method
takes three parameters and returns a view instance to be used as the
child view.

```js
buildChildView: function(child, ChildViewClass, childViewOptions){
  // build the final list of options for the childView class
  var options = _.extend({model: child}, childViewOptions);
  // create the child view instance
  var view = new ChildViewClass(options);
  // return it
  return view;
},
```

### CollectionView's `addChild`

The `addChild` method is responsible for rendering the `childViews` and adding them to the HTML for the `collectionView` instance. It is also responsible for triggering the events per `ChildView`. In most cases you should not override this method. However if you do want to short circuit this method, it can be accomplished via the following.

```js
Marionette.CollectionView.extend({
  addChild: function(child, ChildView, index){
    if (child.shouldBeShown()) {
      Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    }
  }
});
```

### CollectionView's `setFilter`

The `setFilter` method modifies the `CollectionView`'s filter attribute, and
renders the new `ChildViews` in a efficient way, instead of
rendering the whole DOM structure again. In addition, these changes are triggered with the `before:apply:filter` and `apply:filter` event.
A `preventRender` option will prevent the view to be rendered.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection
});

cv.render();

cv.setFilter(function(child, index, collection) {
  return child.get('value') % 2 === 0;
});

//Render the new state of the ChildViews instead of the whole DOM.
```

### CollectionView's `removeFilter`

This function is actually an alias of `setFilter(null, options)`. It is useful for removing filters.
`removeFilter` also accepts `preventRender` as a option.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection
});

cv.render();

cv.setFilter(function(child, index, collection) {
  return child.get('value') % 2 === 0;
});

cv.removeFilter({ prevent: true });
//Remove the current filter without rendering again.
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

## CollectionView's `emptyView`

When a collection has no children, and you need to render a view other than
the list of childViews, you can specify an `emptyView` attribute on your
collection view.

```js
var NoChildrenView = Marionette.View.extend({
  template: "#show-no-children-message-template"
});

Marionette.CollectionView.extend({
  // ...

  emptyView: NoChildrenView
});
```

### CollectionView's `getEmptyView`

If you need the `emptyView`'s class chosen dynamically, specify `getEmptyView`:

```js
Marionette.CollectionView.extend({
  // ...

  getEmptyView: function() {
    // custom logic
    return NoChildrenView;
  }
});
```

### CollectionView's `isEmpty`

If you want to control when the empty view is rendered, you can override
`isEmpty`:

```js
Marionette.CollectionView.extend({
  isEmpty: function(collection, options) {
    // some logic to calculate if the view should be rendered as empty
    return someBoolean;
  }
});
```

### CollectionView's `emptyViewOptions`

Similar to `childView` and `childViewOptions`, there is an `emptyViewOptions` property that will be passed to the `emptyView` constructor. It can be provided as an object literal or as a function.

If `emptyViewOptions` aren't provided the CollectionView will default to passing the `childViewOptions` to the `emptyView`.

```js
var EmptyView = Marionette.View({
  initialize: function(options){
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Marionette.CollectionView({
  emptyView: EmptyView,

  emptyViewOptions: {
    foo: "bar"
  }
});
```

### CollectionView's `destroyChildren`

`CollectionView` provides a `destroyChildren` method that will only destroy it's childViews. This can be useful when you would like to empty your view but keep the data in the `collection`. This method takes an optional `checkEmpty` parameter, by default it is set to `true`, if `false` it will disable the call to `checkEmpty` and `destroyChildren` will not show the `emptyView`.

```js
myView.destroyChildren(); // will show emptyView
myView.destroyChildren({checkEmpty: false}); // will not show emptyView

```

## Rendering `CollectionView`s

Marionette 3 has completely removed the `CompositeView` in favor making the
`View` and `CollectionView` a lot more flexible. This section will cover the
most common use cases for `CollectionView` and how to replace `CompositeView`.

### Rendering Lists

Lists are possibly the simplest use of `CollectionView` - simply set a
`childView` option:

```javascript
var ListItemView = Marionette.View.extend({
  tagName: 'li',
  template: '#list-item-text'
});

var ListView = Marionette.View.extend({
  tagName: 'ul',
  className: 'list-unstyled',

  childView: ListItemView
});

var list = new Backbone.Collection([
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
var RowView = Marionette.LayoutView.extend({
  tagName: 'tr',
  template: '#table-row'
});

var TableView = Marionette.CompositeView.extend({
  tagName: 'table',
  className: 'table table-hover',
  template: '#table',
  childView: RowView,
  childViewContainer: 'tbody'
});

var list = new Backbone.Collection([
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
var RowView = Marionette.View.extend({
  tagName: 'tr',
  template: '#row-template'
});

var TableBody = Marionette.CollectionView.extend({
  tagName: 'tbody',
  childView: RowView
});

var TableView = Marionette.View.extend({
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

var list = new Backbone.Collection([
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
var TreeView = Marionette.CompositeView.extend({
  tagName: 'ul',
  template: '#tree-template'
});

var TreeRoot = Marionette.CollectionView.extend({
  tagName: 'ul',
  childView: TreeView
});


var tree = new Backbone.Collection([
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
var TreeNode = Marionette.View.extend({
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
      collection: new Backbone.Collection(this.model.get('nodes'))
    }));
  }
});

var TreeView = Marionette.CollectionView.extend({
  tagName: 'ul',
  childView: TreeNode
});

var tree = new Backbone.Collection([
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

## Callback Methods

There are several callback methods that can be provided on a
`CollectionView`. If they are found, they will be called by the
view's base methods. These callback methods are intended to be
handled within the view definition directly.

### onBeforeRender callback

A `onBeforeRender` callback will be called just prior to rendering
the collection view.

```js
Marionette.CollectionView.extend({
  onBeforeRender: function(){
    // do stuff here
  }
});
```

### onRender callback

After the view has been rendered, a `onRender` method will be called.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered:

```js
Marionette.CollectionView.extend({
  onRender: function(){
    // do stuff here
  }
});
```

### onBeforeReorder callback

If `reorderOnSort` is set to `true`, `onBeforeReorder` will be called just
prior to reordering the collection view.

```js
Marionette.CollectionView.extend({
  onBeforeReorder: function(){
    // do stuff here
  }
});
```

### onReorder callback

If `reorderOnSort` is set to `true`, after the view has been reordered,
a `onReorder` method will be called.

```js
Marionette.CollectionView.extend({
  onReorder: function(){
    // do stuff here
  }
});
```

### onBeforeDestroy callback

This method is called just before destroying the view.

```js
Marionette.CollectionView.extend({
  onBeforeDestroy: function(){
    // do stuff here
  }
});
```

### onDestroy callback

This method is called just after destroying the view.

```js
Marionette.CollectionView.extend({
  onDestroy: function(){
    // do stuff here
  }
});
```

### onBeforeAddChild callback

This callback function allows you to know when a child / child view
instance is about to be added to the collection view. It provides access to
the view instance for the child that was added.

```js
Marionette.CollectionView.extend({
  onBeforeAddChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onAddChild callback

This callback function allows you to know when a child / child view
instance has been added to the collection view. It provides access to
the view instance for the child that was added.

```js
Marionette.CollectionView.extend({
  onAddChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onBeforeRemoveChild callback

This callback function allows you to know when a `childView`
instance is about to be removed from the `collectionView`. It provides access to
the view instance for the child that was removed.

```js
Marionette.CollectionView.extend({
  onBeforeRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

### onRemoveChild callback

This callback function allows you to know when a child / childView
instance has been deleted or removed from the
collection.

```js
Marionette.CollectionView.extend({
  onRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

## CollectionView Events

There are several events that will be triggered during the life
of a collection view. Each of these events is called with the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) function,
which calls a corresponding "on{EventName}" method on the
view instance (see [above](#callback-methods)).

### "before:render" event


Triggers just prior to the view being rendered. Also triggered as
"before:render:children" / `onBeforeRenderChildren`.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

### "render" event

A "render:children" / `onRenderChildren` event will also be fired. This allows you to
add more than one callback to execute after the view is rendered,
and allows parent views and other parts of the application to
know that the view was rendered.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("render", function(){
  alert("the collection view was rendered!");
});

myView.on("render:children", function(){
  alert("the collection view was rendered!");
});

myView.render();
```

### "before:apply:filter" / "apply:filter" events"

When `setFilter` modifies the `filter` attribute, these events
are fired respectfully just prior/just after the filtering of its
`ChildViews`.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();
myView.render();

var myFilter = function(child) {
  return child.get('foo') % 2 === 0;
};

myView.on("before:apply:filter", function(){
  alert("the collection view is about to be filtered");
});

myView.on("apply:filter", function(){
  alert("the collection view has been filtered following its filter attribute");
});

myView.setFilter(myFilter);
```

### "before:reorder" / "reorder" events

When `reorderOnSort` is set to `true`, these events are fired
respectfully just prior/just after the reordering of the collection.

```js
var MyView = Marionette.CollectionView.extend({...});

var myCol = new Backbone.Collection({ comparator: ... })
var myView = new MyView({ reorderOnSort: true });
myView.render();
myCol.comparator = function () { return this.get('foo'); };

myView.on("before:reorder", function(){
  alert("the collection view is about to be reordered");
});

myView.on("reorder", function(){
  alert("the collection view has been reordered following its collection");
});

myCol.sort()

```

### "before:destroy" event

Triggered just before destroying the view. A "before:destroy:childen" /
`onBeforeDestroyChildren` event will also be fired

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:destroy:childen", function(){
  alert("the collection view is about to be destroyed");
});

myView.destroy();
```

### "destroy" / "destroy:childen" event

Triggered just after destroying the view, both with corresponding
method calls.

```js
var MyView = Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("destroy:childen", function(){
  alert("the collection view is now destroyed");
});

myView.destroy();
```

### "before:add:child" / "add:child" event

The "before:add:child" event and corresponding `onBeforeAddChild`
method are triggered just after creating a new `childView` instance for
a child that was added to the collection, but before the
view is rendered and added to the DOM.

The "add:child" event and corresponding `onAddChild`
method are triggered after rendering the view and adding it to the
view's DOM element.

```js
var MyCV = Marionette.CollectionView.extend({
  // ...

  onBeforeAddChild: function(){
    // ...
  },

  onAddChild: function(){
    // ...
  }
});

var cv = new MyCV({...});

cv.on("before:add:child", function(viewInstance){
  // ...
});

cv.on("add:child", function(viewInstance){
  // ...
});
```

### "before:remove:child"

This is triggered after the childView instance has been
removed from the collection, but before it has been destroyed.

```js
cv.on("before:remove:child", function(childView){
  // ...
});
```

### "remove:child" event

Triggered after a childView instance has been destroyed and
removed, when its child was deleted or removed from the
collection.

```js
cv.on("remove:child", function(viewInstance){
  // ...
});
```

### "childview:\*" event bubbling from child views

When a child view within a collection view triggers an
event, that event will bubble up through the parent
collection view with "childview:" prepended to the event
name.

That is, if a child view triggers "do:something", the
parent collection view will then trigger "childview:do:something".

```js
// set up basic collection
var myModel = new MyModel();
var myCollection = new MyCollection();
myCollection.add(myModel);

var MyView = Marionette.View.extend({
  triggers: {
    'click button': 'do:something'
  }
});

// get the collection view in place
var colView = new CollectionView({
  collection: myCollection,
  childView: MyView,
  onChildviewDoSomething: function() {
    alert("I said, 'do something!'");
  }
});
colView.render();
```

Now, whenever the button inside the attached childView is clicked, an alert box
will appear that says: I said, 'do something!'

It's also possible to attach the event manually using the usual
`view.on('childview:do:something')`.

### before:render:children event

The `before:render:children` event is triggered before the `collectionView`'s children have been rendered and buffered. It differs from the `collectionsView`'s `before:render` in that it is __only__ emitted if the `collection` is not empty.

### render:children event

The `render:children` event is triggered after a `collectionView`'s children have been rendered and buffered. It differs from the `collectionViews`'s `render` event in that it happens __only__ if the `collection` is not not empty.

### "before:render:empty" event

The `"before:render:empty"` event is triggered just after creating a new empty view, but before the view is rendered and added to the DOM.

```js
var myEmptyView = Marionette.View.extend({
  template: false
});

var MyCollectionView = Marionette.CollectionView.extend({
  emptyView: myEmptyView
});

var myCollectionView = new MyCollectionView();

myCollectionView.on("before:render:empty", function(){
  alert("the empty view is now created");
});

myCollectionView.render()
```

### "render:empty" event

The `"render:empty"` event is triggered after rendering the empty view and adding it to the view's DOM element.

```js
var myEmptyView = Marionette.View.extend({
  template: false
});

var MyCollectionView = Marionette.CollectionView.extend({
  emptyView: myEmptyView
});

var myCollectionView = new MyCollectionView();

myCollectionView.on("render:empty", function(){
  alert("the empty view has been rendered");
});

myCollectionView.render()
```

### "before:remove:empty" event

This is triggered before the empty view instance has been removed and before it has been destroyed.

```js
var collection = new Backbone.Collection();

var myEmptyView = Marionette.View.extend({
  template: false
});

var myChildView = Marionette.View.extend({
  template: false
});

var MyCollectionView = Marionette.CollectionView.extend({
  childView: myChildView,
  collection: collection,
  emptyView: myEmptyView
});

var myCollectionView = new MyCollectionView();

myCollectionView.on("before:remove:empty", function(){
  alert("the empty view is now removed");
});

myCollectionView.render()

collection.add([{foo: 'bar'}]);
```

### "remove:empty" event

Triggered just after destroying the empty view from the DOM.

```js
var collection = new Backbone.Collection();

var myChildView = Marionette.View.extend({
  template: false
});

var myEmptyView = Marionette.View.extend({
  template: false
});

var MyCollectionView = Marionette.CollectionView.extend({
  childView: myChildView,
  collection: collection,
  emptyView: myEmptyView
});

var myCollectionView = new MyCollectionView();

myCollectionView.on("before:remove:empty", function(){
  alert("the empty view has been destroyed");
});

myCollectionView.render()
collection.add([{foo: 'bar'}])
```

## CollectionView Child View Events

The following events are raised on child views during rendering and destruction of child views, which is consistent with the view lifecycle experienced during `Region#show`.

* `before:render` / `onBeforeRender` - Called before the view is rendered.
* `render` / `onRender` - Called after the view is rendered, but before it is attached to the DOM.
* `before:show` / `onBeforeShow` - Called after the view has been rendered, but before it has been bound to the CollectionView.
* `before:attach` / `onBeforeAttach` - Called before the view is attached to the DOM.  This will not fire if the CollectionView itself is not attached.
* `attach` / `onAttach` - Called after the view is attached to the DOM.  This will not fire if the CollectionView itself is not attached.
* `show` / `onShow` - Called when the view has been rendered and bound to the CollectionView.
* `dom:refresh` / `onDomRefresh` - Called when the view is both rendered and shown, but only if it is attached to the DOM.  This will not fire if the CollectionView itself is not attached.
* `before:destroy` / `onBeforeDestroy` - Called before destroying a view.
* `destroy` / `onDestroy` - Called after destroying a view.

Note: `render`, `destroy`, and `dom:refresh` are triggered on pure Backbone Views during child view rendering, but for a complete implementation of these events the Backbone View should fire `render` within `render()` and `destroy` within `remove()` as well as set the following flags:

```js
view.supportsRenderLifecycle = true;
view.supportsDestroyLifecycle = true;
```

## CollectionView render

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
children in the collection and renders them individually as an
`childView`.

```js
var MyCollectionView = Marionette.CollectionView.extend({...});

// all of the children views will now be rendered.
new MyCollectionView().render();
```

## CollectionView: Automatic Rendering

After the initial render the collection view binds to the "add", "remove" and "reset" events of the
collection that is specified.

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of child views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will destroy and remove that model's child view.

When the collection for the view is sorted, the view will automatically re-sort its child views.
if the `reorderOnSort` option is set it will attempt to reorder the DOM and do this without a full re-render, otherwise it will re-render if the order has changed. Please Note that if you apply a filter to the collection view and the filtered views change during a sort then it will always re-render.

```js
var collection = new Backbone.Collection();

var myChildView = Marionette.View.extend({
  template: false
});

var MyCollectionView = Marionette.CollectionView.extend({
  childView: myChildView,
  collection: collection,
});

var myCollectionView = new MyCollectionView();

// Collection view will not re-render as it has not been rendered
collection.reset([{foo: 'foo'}]);

myCollectionView.render();

// Collection view will re-render displaying the new model
collection.reset([{foo: 'bar'}]);
```

## CollectionView: Re-render Collection

If you need to re-render the entire collection, you can call the
`view.render` method. This method takes care of destroying all of
the child views that may have previously been opened.

## CollectionView's attachHtml

By default the collection view will append the HTML of each ChildView
into the element buffer, and then call jQuery's `.append` once at the
end to move the HTML into the collection view's `el`.

You can override this by specifying an `attachHtml` method in your
view definition. This method takes three parameters and has no return
value.

```js
Marionette.CollectionView.extend({

	// The default implementation:
  attachHtml: function(collectionView, childView, index){
    if (collectionView.isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView._bufferedChildren.splice(index, 0, childView);
    }
    else {
      // If we've already rendered the main collection, append
      // the new child into the correct order if we need to. Otherwise
      // append to the end.
      if (!collectionView._insertBefore(childView, index)){
        collectionView._insertAfter(childView);
      }
    }
  },

  // Called after all children have been appended into the elBuffer
  attachBuffer: function(collectionView, buffer) {
    collectionView.$el.append(buffer);
  },

  // called on initialize and after attachBuffer is called
  initRenderBuffer: function() {
    this.elBuffer = document.createDocumentFragment();
  }

});
```

The first parameter is the instance of the collection view that
will receive the HTML from the second parameter, the current child
view instance.

The third parameter, `index`, is the index of the
model that this `childView` instance represents, in the collection
that the model came from. This is useful for sorting a collection
and displaying the sorted list in the correct order on the screen.

Overrides of `attachHtml` that don't take into account the element
buffer will work fine, but won't take advantage of the 60x performance
increase the buffer provides.

## CollectionView's resortView

By default the `CollectionView` will maintain the order of its `collection`
in the DOM. However on occasions the view may need to re-render to make this
possible, for example if you were to change the comparator on the collection.
By default `CollectionView` will call `render` when this happens, but there are
cases where this may not be suitable. For instance when sorting the `children`
in a `CompositeView`, you want to only render the internal collection.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection,
  resortView: function() {
    // provide custom logic for rendering after sorting the collection
  }
});
```

## CollectionView's viewComparator

CollectionView allows for a custom `viewComparator` option if you want your CollectionView's children to be rendered with a different sort order than the underlying Backbone collection uses.

```js
  var cv = new Marionette.CollectionView({
    collection: someCollection,
    viewComparator: 'otherFieldToSortOn'
  });
```

The `viewComparator` can take any of the acceptable `Backbone.Collection` [comparator formats](http://backbonejs.org/#Collection-comparator) -- a sortBy (pass a function that takes a single argument), as a sort (pass a comparator function that expects two arguments), or as a string indicating the attribute to sort by.

## CollectionView's `filter`

CollectionView allows for a custom `filter` option if you want to prevent some of the
underlying `collection`'s models from being rendered as child views.
The filter function takes a model from the collection and returns a truthy value if the child should be rendered,
and a falsey value if it should not.

```js
  var cv = new Marionette.CollectionView({
    childView: SomeChildView,
    emptyView: SomeEmptyView,
    collection: new Backbone.Collection([
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
  cv.filter = function (child, index, collection) {
    return child.get('value') % 2 !== 0;
  };

  // renders the views with values '1' and '3'
  cv.render();

  // remove the filter
  // note that using `delete cv.filter` will cause the prototype's filter to be used
  // which may be undesirable
  cv.filter = null;

  // renders all views
  cv.render();
```


## CollectionView's children

The CollectionView uses [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter)
to store and manage its child views. This allows you to easily access
the views within the collection view, iterate them, find them by
a given indexer such as the view's model or collection, and more.

```js
var cv = new Marionette.CollectionView({
  collection: someCollection
});

cv.render();


// retrieve a view by model
var v = cv.children.findByModel(someModel);

// iterate over all of the views and process them
cv.children.each(function(view){

  // process the `view` here

});
```

For more information on the available features and functionality of
the `.children`, see the [Backbone.BabySitter documentation](https://github.com/marionettejs/backbone.babysitter).

## CollectionView destroy

CollectionView implements a `destroy` method, which is called by the
region managers automatically. As part of the implementation, the
following are performed:

* unbind all `listenTo` events
* unbind all custom view events
* unbind all DOM events
* unbind all child views that were rendered
* remove `this.el` from the DOM
* call an `onDestroy` event on the view, if one is provided
* the `CollectionView` is returned

By providing an `onDestroy` event in your view definition, you can
run custom code for your view that is fired after your view has been
destroyed and cleaned up. This lets you handle any additional clean up
code without having to override the `destroy` method.

```js
Marionette.CollectionView.extend({
  onDestroy: function() {
    // custom cleanup or destroying code, here
  }
});
```
