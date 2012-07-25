# Marionette.PropertyView

A `PropertyView` is a view that represents the property of a single `Backbone.Model`. It is a convenient shorthand that
avoids the need to have a template for rendering `CollectionView` items.

You need to provide a `property` attribute when extending the view, which is passed to `Model.get` during rendering:

```js
var MyView = Backbone.Marionette.ItemView.extend({
  property: "foo",
  className: "item",
  tagName: "li"
});

var MyCollectionView = Marionette.CollectionView.extend({
    itemView: MyView,
    tagName: "ul"
});

new MyCollectionView();
```

