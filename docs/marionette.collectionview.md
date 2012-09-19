# Marionette.CollectionView

The `CollectionView` will loop through all of the models in the
specified collection, render each of them using a specified `itemView`,
then append the results of the item view's `el` to the collection view's
`el`.

## CollectionView's `itemView`

Specify an `itemView` in your collection view definition. This must be
a Backbone view object definition (not instance). It can be any 
`Backbone.View` or be derived from `Marionette.ItemView`.

```js
MyItemView = Backbone.Marionette.ItemView.extend({});

Backbone.Marionette.CollectionView.extend({
  itemView: MyItemView
});
```

Alternatively, you can specify an `itemView` in the options for
the constructor:

```js
MyCollectionView = Backbone.Marionette.CollectionView.extend({...});

new MyCollectionView({
  itemView: MyItemView
});
```

If you do not specify an `itemView`, an exception will be thrown
stating that you must specify an `itemView`.

## CollectionView's `itemViewOptions`

There may be scenarios where you need to pass data from your parent
collection view in to each of the itemView instances. To do this, provide
a `itemViewOptions` definition on your collection view as an object
literal. This will be passed to the constructor of your itemView as part
of the `options`.

```js
ItemView = Backbone.Marionette.ItemView({
  initialize: function(options){
    console.log(options.foo); // => "bar"
  }
});

CollectionView = Backbone.Marionette.CollectionView({
  itemView: ItemView,

  itemViewOptions: {
    foo: "bar"
  } 
});
```

You can also specify the `itemViewOptions` as a function, if you need to
calculate the values to return at runtime. The model will be passed into
the function should you need access to it when calculating
`itemViewOptions`. The function must return an object, and the attributes 
of the object will be copied to the itemView instance' options.

```js
CollectionView = Backbone.Marionette.CollectionView({
  itemViewOptions: function(model) {
    // do some calculations based on the model
    return {
      foo: "bar"
    }   
  }  
});
```

## CollectionView's `emptyView`

When a collection has no items, and you need to render a view other than
the list of itemViews, you can specify an `emptyView` attribute on your
collection view.

```js
NoItemsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-items-message-template"
});

Backbone.Marionette.CollectionView.extend({
  // ...

  emptyView: NoItemsView
});
```

This will render the `emptyView` and display the message that needs to
be displayed when there are no items.

## Callback Methods

There are several callback methods that can be provided on a
`CollectionView`. If they are found, they will be called by the
view's base methods. These callback methods are intended to be
handled within the view definition directly.

### beforeRender callback

A `beforeRender` callback will be called just prior to rendering
the collection view.

```js
Backbone.Marionette.CollectionView.extend({
  beforeRender: function(){
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

### onItemAdded callback

This callback function allows you to know when an item / item view
instance has been added to the collection view. It provides access to
the view instance for the item that was added.

```js
Backbone.Marionette.CollectionView.extend({
  onItemAdded: function(itemView){
    // work with the itemView instance, here
  }
});
```

### beforeClose callback

This method is called just before closing the view.

```js
Backbone.Marionette.CollectionView.extend({
  beforeClose: function(){
    // do stuff here
  }
});
```

### onClose callback

This method is called just after closing the view.

```js
Backbone.Marionette.CollectionView.extend({
  onClose: function(){
    // do stuff here
  }
});
```

## CollectionView Events

There are several events that will be triggered during the life
of a collection view. These are intended to be handled from code
external to the view.

### "collection:before:render" event

Triggers just prior to the view being rendered

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("collection:before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

### "render" / "collection:rendered" event

A "collection:rendered" event will also be fired. This allows you to
add more than one callback to execute after the view is rendered,
and allows parent views and other parts of the application to
know that the view was rendered.

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("render", function(){
  alert("the collection view was rendered!");
});

myView.on("collection:rendered", function(){
  alert("the collection view was rendered!");
});

myView.render();
```

### "collection:before:close" event

Triggered just before closing the view.

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("collection:before:close", function(){
  alert("the collection view is about to be closed");
});

myView.close();
```

### "collection:closed" event

Triggered just after closing the view.

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("collection:closed", function(){
  alert("the collection view is now closed");
});

myView.close();
```

### "itemview:\*" event bubbling from child views

When an item view within a collection view triggers an
event, that event will bubble up through the parent 
collection view, with "itemview:" prepended to the event
name. 

That is, if a child view triggers "do:something", the 
parent collection view will then trigger "itemview:do:something".

```js
// set up basic collection
var myModel = new MyModel();
var myCollection = new MyCollection();
myCollection.add(myModel);

// get the collection view in place
colView = new CollectionView({
  collection: myCollection
});
colView.render();

// bind to the collection view's events that were bubbled
// from the child view
colView.on("itemview:do:something", function(childView, msg){
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
Normally, you would have your item view listening to DOM
events or model change events, and then triggering an event
of it's own based on that.

## CollectionView render

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
items in the collection and renders them individually as an
`itemView`.

```js
MyCollectionView = Backbone.Marionette.CollectionView.extend({...});

new MyCollectionView().render().done(function(){
  // all of the children are now rendered. do stuff here.
});
```

## CollectionView: Automatic Rendering

The collection view binds to the "add", "remove" and "reset" events of the
collection that is specified. 

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of item views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will close and remove that model's item view.

## CollectionView: Re-render Collection

If you need to re-render the entire collection, you can call the
`view.render` method. This method takes care of closing all of
the child views that may have previously been opened.

## CollectionView's appendHtml

By default the collection view will call jQuery's `.append` to
move the HTML contents from the item view instance in to the collection
view's `el`. 

You can override this by specifying an `appendHtml` method in your 
view definition. This method takes two parameters and has no return
value.

```js
Backbone.Marionette.CollectionView.extend({

  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.prepend(itemView.el);
  }

});
```

The first parameter is the instance of the collection view that 
will receive the HTML from the second parameter, the current item
view instance. 

The third parameter, `index`, is the index of the
model that this itemView instance represents, in the collection 
that the model came from. This is useful for sorting a collection
and displaying the sorted list in the correct order on the screen.

## CollectionView close

CollectionView implements a `close` method, which is called by the 
region managers automatically. As part of the implementation, the 
following are performed:

* unbind all `bindTo` events
* unbind all custom view events
* unbind all DOM events
* unbind all item views that were rendered
* remove `this.el` from the DOM
* call an `onClose` event on the view, if one is provided

By providing an `onClose` event in your view definition, you can
run custom code for your view that is fired after your view has been
closed and cleaned up. This lets you handle any additional clean up
code without having to override the `close` method.

```js
Backbone.Marionette.CollectionView.extend({
  onClose: function(){
    // custom cleanup or closing code, here
  }
});
```


