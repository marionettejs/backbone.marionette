## [View the new docs](http://marionettejs.com/docs/marionette.compositeview.html)

# Marionette.CompositeView

A `CompositeView` extends from `CollectionView` to be used as a
composite view for scenarios where it should represent both a
branch and leaf in a tree structure, or for scenarios where a
collection needs to be rendered within a wrapper template. By default the
`CompositeView` will maintain a sorted collection's order
in the DOM. This behavior can be disabled by specifying `{sort: false}` on initialize.

Please see
[the Marionette.CollectionView documentation](./marionette.collectionview.md)
for more information on available features and functionality.

Additionally, interactions with Marionette.Region
will provide features such as `onShow` callbacks, etc. Please see
[the Region documentation](./marionette.region.md) for more information.

## Example Usage: Tree View

For example, if you're rendering a tree-view control, you may
want to render a collection view with a model and template so
that it will show a parent child with children in the tree.

You can specify a `modelView` to use for the model. If you don't
specify one, it will default to the `Marionette.ItemView`.

```js
var CompositeView = Backbone.Marionette.CompositeView.extend({
  template: "#leaf-branch-template"
});

new CompositeView({
  model: someModel,
  collection: someCollection
});
```

For more examples, see my blog post on
[using the composite view.](http://lostechies.com/derickbailey/2012/04/05/composite-views-tree-structures-tables-and-more/)

## Documentation Index

* [Composite Model `template`](#composite-model-template)
* [CompositeView's `childView`](#compositeviews-childview)
* [CompositeView's `childViewContainer`](#compositeviews-childviewcontainer)
* [CompositeView's `attachHtml`](#compositeviews-attachhtml)
* [Recursive By Default](#recursive-by-default)
* [Model And Collection Rendering](#model-and-collection-rendering)
* [Events And Callbacks](#events-and-callbacks)
* [Organizing UI elements](#organizing-ui-elements)
* [modelEvents and collectionEvents](#modelevents-and-collectionevents)

## Composite Model `template`

When a `CompositeView` is rendered, the `model` will be rendered
with the `template` that the view is configured with. You can
override the template by passing it in as a constructor option:

```js
new MyComp({
  template: "#some-template"
});
```

The `collection` option is not passed to the template context by
default. If your `template` needs access to the collection, you'll
need to pass it via `templateHelpers`:

```js
new MyComp({
  template: "#some-template",
  templateHelpers: function() {
    return { items: this.collection.toJSON() };
  }
})
```

## CompositeView's `childView`

Each childView will be rendered using the `childView`'s template. The `CompositeView`'s
template is rendered and the childView's templates are added to this.

```js
var ChildView = Backbone.Marionette.ItemView.extend({});

var CompView = Backbone.Marionette.CompositeView.extend({
  childView: ChildView
});
```

## CompositeView's `childViewContainer`

By default the composite view uses the same `attachHtml` method that the
collection view provides. This means the view will call jQuery's `.append`
to move the HTML contents from the child view instance in to the collection
view's `el`.

This is typically not very useful as a composite view will usually render
a container DOM element in which the child views should be placed.

For example, if you are building a table view, and want to append each
child from the collection in to the `<tbody>` of the table, you might
do this with a template:

```html
<script id="row-template" type="text/html">
  <td><%= someData %></td>
  <td><%= moreData %></td>
  <td><%= stuff %></td>
</script>

<script id="table-template" type="text/html">
  <table>
    <thead>
      <tr>
        <th>Some Column</th>
        <th>Another Column</th>
        <th>Still More</th>
      </tr>
    </thead>

    <!-- want to insert collection children, here -->
    <tbody></tbody>

    <tfoot>
      <tr>
        <td colspan="3">some footer information</td>
      </tr>
    </tfoot>
  </table>
</script>
```

To get your childView instances to render within the `<tbody>` of this
table structure, specify an `childViewContainer` in your composite view,
like this:

```js
var RowView = Backbone.Marionette.ItemView.extend({
  tagName: "tr",
  template: "#row-template"
});

var TableView = Backbone.Marionette.CompositeView.extend({
  childView: RowView,

  // specify a jQuery selector to put the `childView` instances into
  childViewContainer: "tbody",

  template: "#table-template"
});
```

This will put all of the `childView` instances into the `<tbody>` tag of
the composite view's rendered template, correctly producing the table
structure.

Alternatively, you can specify a function as the `childViewContainer`. This
function needs to return a jQuery selector string, or a jQuery selector
object.

```js
var TableView = Backbone.Marionette.CompositeView.extend({
  // ...

  childViewContainer: function(){
    return "#tbody"
  }
});
```

Using a function allows for logic to be used for the selector. However,
only one value can be returned. Upon returning the first value, it will
be cached and that value will be used for the remainder of that view
instance' lifecycle.

Alternatively, the `childViewContainer` can be supplied in the constructor
function options:

```js
var myComp = new Marionette.CompositeView({
  // ...,

  childViewContainer: "#tbody"
});
```

## CompositeView's `attachHtml`

Sometimes the `childViewContainer` configuration is insufficient for
specifying where the `childView` instance should be placed. If this is the
case, you can override the `attachHtml` method with your own implementation.

For more information on this method, see the [CollectionView's documentation](./marionette.collectionview.md#collectionviews-attachhtml).

## CompositeView's `childView` container selection

The `getChildViewContainer` method is passed a second `childView` parameter which, when overridden, allows for a finer tuned container selection by being able to access the `childView` which is about to be appended to the `containerView` returned by `getChildViewContainer`.

## Recursive By Default

The default rendering mode for a `CompositeView` assumes a
hierarchical, recursive structure. If you configure a composite
view without specifying an `childView`, you'll get the same
composite view class rendered for each child in the collection.

## Model And Collection Rendering

The model and collection for the composite view will re-render
themselves under the following conditions:

* When the collection's "reset" event is fired, it will only re-render the collection within the composite, and not the wrapper template
* When the collection has a model added to it (the "add" event is fired), it will render that one child into the list
* When the collection has a model removed (the "remove" event is fired), it will remove that one child from the rendered list

As with item view instances, the composite view instance is passed as the
third argument to the `Renderer` object's `render` method, which is
useful in custom `Renderer` implementations.

## Events And Callbacks

During the course of rendering a composite, several events will
be triggered. These events are triggered with the [Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod)
function, which calls a corresponding "on{EventName}" method on the view.

* "before:render:template" / `onBeforeRenderTemplate` - before the `model` has been rendered
* "render:template" / `onRenderTemplate` - after the `model` has been rendered
* "before:render:collection" / `onBeforeRenderCollection` - before the collection of models is rendered
* "render:collection" / `onRenderCollection` - after the collection of models has been rendered
* "before:render" / `onBeforeRender` - before anything has been rendered
* "render" / `onRender` - after everything has been rendered

Additionally, after the composite view has been rendered, an
`onRender` method will be called. You can implement this in
your view to provide custom code for dealing with the view's
`el` after it has been rendered:

```js
Backbone.Marionette.CompositeView.extend({
  onRender: function(){
    // do stuff here
  }
});
```

## Organizing UI elements

Similar to ItemView, you can organize the UI elements inside the
CompositeView by specifying them in the `UI` hash. It should be
noted that the elements that can be accessed via this hash are
the elements that are directly rendered by the composite view
template, not those belonging to the collection.

The UI elements will be accessible as soon as the composite view
template is rendered (and before the collection is rendered),
which means you can even access them in the `onBeforeRender` method.

## modelEvents and collectionEvents

CompositeViews can bind directly to model events and collection events
in a declarative manner:

```js
Marionette.CompositeView.extend({
  modelEvents: {
    "change": "modelChanged"
  },

  collectionEvents: {
    "add": "modelAdded"
  }
});
```

For more information, see the [Marionette.View](./marionette.view.md) documentation.
