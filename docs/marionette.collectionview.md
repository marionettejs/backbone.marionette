# Marionette.CollectionView

The `CollectionView` will loop through all of the models in the
specified collection, render each of them using a specified `childView`,
then append the results of the child view's `el` to the collection view's
`el`. By default the `CollectionView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sort: false}` on initialize.

CollectionView extends directly from Marionette.View. Please see
[the Marionette.View documentation](marionette.view.md)
for more information on available features and functionality.

Additionally, interactions with Marionette.Region
will provide features such as `onShow` callbacks, etc. Please see
[the Region documentation](marionette.region.md) for more information.

## Documentation Index

* [CollectionView's `childView`](#collectionviews-childview)
  * [CollectionView's `getChildView`](#collectionviews-getchildview)
  * [CollectionView's `childViewOptions`](#collectionviews-childviewoptions)
  * [CollectionView's `childViewEventPrefix`](#collectionviews-childvieweventprefix)
  * [CollectionView's `childEvents`](#collectionviews-childevents)
  * [CollectionView's `buildChildView`](#collectionviews-buildchildview)
  * [CollectionView's `addChild`](#collectionviews-addchild)
* [CollectionView's `emptyView`](#collectionviews-emptyview)
  * [CollectionView's `getEmptyView`](#collectionviews-getemptyview)
  * [CollectionView's `emptyViewOptions`](#collectionviews-emptyviewoptions)
* [Callback Methods](#callback-methods)
  * [onBeforeRender callback](#onbeforerender-callback)
  * [onRender callback](#onrender-callback)
  * [onBeforeDestroy callback](#beforedestroy-callback)
  * [onDestroy callback](#ondestroy-callback)
  * [onBeforeAddChild callback](#onbeforeaddchild-callback)
  * [onAddChild callback](#onaddchild-callback)
  * [onBeforeRemoveChild callback](#onbeforeremovechild-callback)
  * [onRemoveChild callback](#onremovechild-callback)
* [CollectionView Events](#collectionview-events)
  * ["before:render" event](#beforerender-event)
  * ["render" event](#render-event)
  * ["before:destroy" event](#beforedestroy-event)
  * ["destroy" / "destroy:collection" event](#destroy--destroycollection-event)
  * ["before:add:child" / "add:child" event](#beforeaddchild--addchild-event)
  * ["before:remove:child event](#beforeremovechild-event)
  * ["remove:child" event](#removechild-event)
  * ["childview:\*" event bubbling from child views](#childview-event-bubbling-from-child-views)
* [CollectionView render](#collectionview-render)
* [CollectionView: Automatic Rendering](#collectionview-automatic-rendering)
* [CollectionView: Re-render Collection](#collectionview-re-render-collection)
* [CollectionView's attachHtml](#collectionviews-attachhtml)
* [CollectionView's resortView](#collectionviews-resortview)
* [CollectionView's children](#collectionviews-children)
* [CollectionView destroy](#collectionview-destroy)

## CollectionView's `childView`

Specify a `childView` in your collection view definition. This must be
a Backbone view object definition, not an instance. It can be any
`Backbone.View` or be derived from `Marionette.ItemView`.

```js
var MyChildView = Backbone.Marionette.ItemView.extend({});

Backbone.Marionette.CollectionView.extend({
  childView: MyChildView
});
```

Child views must be defined before they are referenced by the
`childView` attribute in a collection view definition. Use `getChildView`
to lookup the definition as child views are instantiated.

Alternatively, you can specify a `childView` in the options for
the constructor:

```js
var MyCollectionView = Backbone.Marionette.CollectionView.extend({...});

new MyCollectionView({
  childView: MyChildView
});
```

If you do not specify a `childView`, an exception will be thrown
stating that you must specify a `childView`.

### CollectionView's `getChildView`
The value returned by this method is the `ChildView` class that will be instantiated when a `Model` needs to be initially rendered.
This method also gives you the ability to customize per `Model` `ChildViews`.

```js
var FooBar = Backbone.Model.extend({
  defaults: {
    isFoo: false
  }
});

var FooView = Backbone.Marionette.ItemView.extend({
  template: '#foo-template'
});
var BarView = Backbone.Marionette.ItemView.extend({
  template: '#bar-template'
});

var MyCollectionView = Backbone.Marionette.CollectionView.extend({
  getChildView: function(item) {
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
var ChildView = Backbone.Marionette.ItemView({
  initialize: function(options) {
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Backbone.Marionette.CollectionView({
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
var CollectionView = Backbone.Marionette.CollectionView({
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
on the collection view.

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

### CollectionView's `childEvents`

You can specify a `childEvents` hash or method which allows you to capture all bubbling childEvents without having to manually set bindings. The keys of the hash can either be a function or a string that is the name of a method on the collection view.

```js
// childEvents can be specified as a hash...
var MyCollectionView = Marionette.CollectionView.extend({

  // This callback will be called whenever a child is rendered or emits a `render` event
  childEvents: {
    render: function() {
      console.log("a childView has been rendered");
    }
  }
});

// ...or as a function that returns a hash.
var MyCollectionView = Marionette.CollectionView.extend({

  childEvents: function() {
    return {
      render: this.onChildRendered
    }
});
```

This also works for custom events that you might fire on your child views.

```js
// The child view fires a custom event, `show:message`
var ChildView = new Marionette.ItemView.extend({
  events: {
    'click .button': 'showMessage'
  },

  showMessage: function () {
    console.log('The button was clicked.');

    this.trigger('show:message');
  }
});

// The parent uses childEvents to catch that custom event on the child view
var ParentView = new Marionette.CollectionView.extend({
  childView: ChildView,

  childEvents: {
    'show:message': function () {
      console.log('The show:message event bubbled up to the parent.');
    }
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

The `addChild` method is responsible for rendering the `childViews` and adding them to the HTML for the `collectionView` instance. It is also responsible for triggering the events per `ChildView`. In most cases you should not override this method. However if you do want to short circut this method, it can be accomplished via the following.

```js
Backbone.Marionette.CollectionView.extend({
  addChild: function(child, ChildView, index){
    if (child.shouldBeShown()) {
      Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    }
  }
});
```

## CollectionView's `emptyView`

When a collection has no children, and you need to render a view other than
the list of childViews, you can specify an `emptyView` attribute on your
collection view.

```js
var NoChildsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-children-message-template"
});

Backbone.Marionette.CollectionView.extend({
  // ...

  emptyView: NoChildsView
});
```

### CollectionView's `getEmptyView`

If you need the `emptyView`'s class chosen dynamically, specify `getEmptyView`:

```js
Backbone.Marionette.CollectionView.extend({
  // ...

  getEmptyView: function() {
    // custom logic
    return NoChildsView;
  }
```

This will render the `emptyView` and display the message that needs to
be displayed when there are no children.

If you want to control when the empty view is rendered, you can override
`isEmpty`:

```js
Backbone.Marionette.CollectionView.extend({
  isEmpty: function(collection) {
    // some logic to calculate if the view should be rendered as empty
    return someBoolean;
  }
});
```

### CollectionView's `emptyViewOptions`

Similar to `childView` and `childViewOptions`, there is an `emptyViewOptions` property that will be passed to the `emptyView` constructor. It can be provided as an object literal or as a function.

If `emptyViewOptions` aren't provided the CollectionView will default to passing the `childViewOptions` to the `emptyView`.

```js
var EmptyView = Backbone.Marionette.ItemView({
  initialize: function(options){
    console.log(options.foo); // => "bar"
  }
});

var CollectionView = Backbone.Marionette.CollectionView({
  emptyView: EmptyView,

  emptyViewOptions: {
    foo: "bar"
  }
});
```

## Callback Methods

There are several callback methods that can be provided on a
`CollectionView`. If they are found, they will be called by the
view's base methods. These callback methods are intended to be
handled within the view definition directly.

### onBeforeRender callback

A `onBeforeRender` callback will be called just prior to rendering
the collection view.

```js
Backbone.Marionette.CollectionView.extend({
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
Backbone.Marionette.CollectionView.extend({
  onRender: function(){
    // do stuff here
  }
});
```

### onBeforeDestroy callback

This method is called just before destroying the view.

```js
Backbone.Marionette.CollectionView.extend({
  onBeforeDestroy: function(){
    // do stuff here
  }
});
```

### onDestroy callback

This method is called just after destroying the view.

```js
Backbone.Marionette.CollectionView.extend({
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
Backbone.Marionette.CollectionView.extend({
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
Backbone.Marionette.CollectionView.extend({
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
Backbone.Marionette.CollectionView.extend({
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
Backbone.Marionette.CollectionView.extend({
  onRemoveChild: function(childView){
    // work with the childView instance, here
  }
});
```

## CollectionView Events

There are several events that will be triggered during the life
of a collection view. Each of these events is called with the
[Marionette.triggerMethod](./marionette.functions.md) function,
which calls a corresponding "on{EventName}" method on the
view instance (see [above](#callback-methods)).

### "before:render" event


Triggers just prior to the view being rendered. Also triggered as
"collection:before:render" / `onCollectionBeforeRender`.

```js
var MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

### "render" event

A "collection:rendered" / `onCollectionRendered` event will also be fired. This allows you to
add more than one callback to execute after the view is rendered,
and allows parent views and other parts of the application to
know that the view was rendered.

```js
var MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("render", function(){
  alert("the collection view was rendered!");
});

myView.on("collection:rendered", function(){
  alert("the collection view was rendered!");
});

myView.render();
```

### "before:destroy" event

Triggered just before destroying the view. A "before:destroy:collection" /
`onBeforeDestroyCollection` event will also be fired

```js
var MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("before:destroy:collection", function(){
  alert("the collection view is about to be destroyed");
});

myView.destroy();
```

### "destroy" / "destroy:collection" event

Triggered just after destroying the view, both with corresponding
method calls.

```js
var MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("destroy:collection", function(){
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

// get the collection view in place
var colView = new CollectionView({
  collection: myCollection
});
colView.render();

// bind to the collection view's events that were bubbled
// from the child view
colView.on("childview:do:something", function(childView, msg){
  alert("I said, '" + msg + "'");
});

// hack, to get the child view and trigger from it
var childView = colView.children[myModel.cid];
childView.trigger("do:something", "do something!");
```

The result of this will be an alert box that says
"I said, 'do something!'".

Also note that you would not normally grab a reference to
the child view the way this is showing. I'm merely using
that hack as a way to demonstrate the event bubbling.
Normally, you would have your child view listening to DOM
events or model change events, and then triggering an event
of its own based on that.

## CollectionView render

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
children in the collection and renders them individually as an
`childView`.

```js
var MyCollectionView = Backbone.Marionette.CollectionView.extend({...});

// all of the children views will now be rendered.
new MyCollectionView().render();
```

## CollectionView: Automatic Rendering

The collection view binds to the "add", "remove" and "reset" events of the
collection that is specified.

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of child views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will destroy and remove that model's child view.

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
Backbone.Marionette.CollectionView.extend({

	// The default implementation:
  attachHtml: function(collectionView, childView, index){
    if (collectionView.isBuffering) {
      // buffering happens on reset events and initial renders
      // in order to reduce the number of inserts into the
      // document, which are expensive.
      collectionView.elBuffer.appendChild(childView.el);
    }
    else {
      // If we've already rendered the main collection, just
      // append the new children directly into the element.
      collectionView.$el.append(childView.el);
    }
  },

  // Called after all children have been appended into the elBuffer
  appendHtml: function(collectionView, buffer) {
    collectionView.$el.append(buffer);
  },

  // called on initialize and after appendHtml is called
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

By providing an `onDestroy` event in your view definition, you can
run custom code for your view that is fired after your view has been
destroyed and cleaned up. This lets you handle any additional clean up
code without having to override the `destroy` method.

```js
Backbone.Marionette.CollectionView.extend({
  onDestroy: function() {
    // custom cleanup or destroying code, here
  }
});
```
