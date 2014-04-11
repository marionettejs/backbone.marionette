# Marionette.Layout

A `Layout` is a hybrid of an `ItemView` and a collection of `Region` objects. They
are ideal for rendering application layouts with multiple sub-regions
managed by specified region managers.

A layout can also act as a composite-view to aggregate multiple
views and sub-application areas of the screen allowing applications to
attach multiple region managers to dynamically rendered HTML.

You can create complex views by nesting layout managers within `Regions`.

For a more in-depth discussion on Layouts, see the blog post
[Manage Layouts And Nested Views With Backbone.Marionette](http://lostechies.com/derickbailey/2012/03/22/managing-layouts-and-nested-views-with-backbone-marionette/)

Please see
[the Marionette.ItemView documentation](marionette.itemview.md)
for more information on available features and functionality.

Additionally, interactions with Marionette.Region
will provide features such as `onShow` callbacks, etc. Please see
[the Region documentation](marionette.region.md) for more information.

## Documentation Index

* [Basic Usage](#basic-usage)
* [Region Availability](#region-availability)
* [Re-Rendering A Layout](#re-rendering-a-layout)
  * [Avoid Re-Rendering The Entire Layout](#avoid-re-rendering-the-entire-layout)
* [Nested Layouts And Views](#nested-layouts-and-views)
* [Closing A Layout](#closing-a-layout)
* [Custom Region Type](#custom-region-type)
* [Region Naming](#region-naming)

## Basic Usage

The `Layout` extends directly from `ItemView` and adds the ability
to specify `regions` which become `Region` instances that are attached
to the layout.

```html
<script id="layout-template" type="text/template">
  <section>
    <navigation id="menu">...</navigation>
    <article id="content">...</article>
  </section>
</script>
```

```js
AppLayout = Backbone.Marionette.Layout.extend({
  template: "#layout-template",

  regions: {
    menu: "#menu",
    content: "#content"
  }
});

var layout = new AppLayout();
layout.render();
```

Once you've rendered the layout, you now have direct access
to all of the specified regions as region managers.

```js
layout.menu.show(new MenuView());

layout.content.show(new MainContentView());
```

### Specifying Regions As A Function

Regions can be specified on a Layout using a function that returns
an object with the region definitions. The returned object follow the
same rules for defining a region, as outlined above.

```js
Marionette.Layout.extend({
  // ...

  regions: function(options){
    return {
      fooRegion: "#foo-element"
    };
  },

  // ...
});
```

Note that the function recieves the view's `options` arguments that
were passed in to the view's constructor. `this.options` is not yet
available when the regions are first initialized, so the options
must be accessed through this parameter.

## Region Availability

Any defined regions within a layout will be available to the
layout or any calling code immediately after instantiating the
layout. This allows a layout to be attached to an existing
DOM element in an HTML page, without the need to call a render
method or anything else, to create the regions.

However, a region will only be able to populate itself if the
layout has access to the elements specified within the region
definitions. That is, if your view has not yet rendered, your
regions may not be able to find the element that you've
specified for them to manage. In that scenario, using the
region will result in no changes to the DOM.

## Re-Rendering A Layout

A layout can be rendered as many times as needed, but renders
after the first one behave differently than the initial render.

The first time a layout is rendered, nothing special happens. It just
delegates to the `ItemView` prototype to do the render. After the
first render has happened, though, the render function is modified to
account for re-rendering with regions in the layout.

After the first render, all subsequent renders will force every
region to close by calling the `close` method on them. This will
force every view in the region, and sub-views if any, to be closed
as well. Once the regions have been closed, the regions will be
reset so that they are no longer referencing the element of the previous
layout render.

Then after the Layout is finished re-rendering itself,
showing a view in the layout's regions will cause the regions to attach
themselves to the new elements in the layout.

### Avoid Re-Rendering The Entire Layout

There are times when re-rendering the entire layout is necessary. However,
due to the behavior described above, this can cause a large amount of
work to be needed in order to fully restore the layout and all of the
views that the layout is displaying.

Therefore, it is suggested that you avoid re-rendering the entire
layout unless absolutely necessary. Instead, if you are binding the
layout's template to a model and need to update portions of the layout,
you should listen to the model's "change" events and only update the
neccesary DOM elements.

## Nested Layouts And Views

Since the `Layout` extends directly from `ItemView`, it
has all of the core functionality of an item view. This includes
the methods necessary to be shown within an existing region manager.

```js
MyApp = new Backbone.Marionette.Application();
MyApp.addRegions({
  mainRegion: "#main"
});

var layout = new AppLayout();
MyApp.mainRegion.show(layout);

layout.show(new MenuView());
```

You can nest layouts into region managers as deeply as you want.
This provides for a well organized, nested view structure.

## Closing A Layout

When you are finished with a layout, you can call the
`close` method on it. This will ensure that all of the region managers
within the layout are closed correctly, which in turn
ensures all of the views shown within the regions are closed correctly.

If you are showing a layout within a parent region manager, replacing
the layout with another view or another layout will close the current
one, the same it will close a view.

All of this ensures that layouts and the views that they
contain are cleaned up correctly.

## Custom Region Type

If you have the need to replace the `Region` with a region class of
your own implementation, you can specify an alternate class to use
with the `regionType` property of the `Layout`.

```js
MyLayout = Backbone.Marionette.Layout.extend({
  regionType: SomeCustomRegion
});
```

You can also specify custom `Region` classes for each `region`:

```js
AppLayout = Backbone.Marionette.Layout.extend({
  template: "#layout-template",

  regionType: SomeDefaultCustomRegion,

  regions: {
    menu: {
      selector: "#menu",
      regionType: CustomRegionTypeReference
    },
    content: {
      selector: "#content",
      regionType: CustomRegionType2Reference
    }
  }
});
```

## Adding And Removing Regions

Regions can be added and removed as needed, in a
Layout instance. Use the following methods:

* `addRegion`
* `addRegions`
* `removeRegion`

addRegion:

```js
var layout = new MyLayout();

// ...

layout.addRegion("foo", "#foo");
layout.foo.show(new someView());
```

addRegions:

```js
var layout = new MyLayout();

// ...

layout.addRegions({
  foo: "#foo",
  bar: "#bar"
});
```

removeRegions:

```js
var layout = new MyLayout();

// ...

layout.removeRegion("foo");
```

Any region can be removed, whether it was defined
in the `regions` attribute of the region definition,
or added later.

For more information on using these methods, see
the `regionManager` documentation.

## Region Naming

A Layouts' Regions are attached directly to the Layout instance with the name of the region
as the key and the region itself as the value. Because of this, you need to be careful
to avoid conflicts with existing properties on the Layout when you name your Region.

The prototype chain of Layouts is:

`Backbone.View > Marionette.View > Marionette.ItemView > Marionette.Layout`

Consequently, every property on each of those Classes must be avoided as Region names. The most
common issue people run into is trying to name their Region *"attributes"*. Be aware
that you are **not** able to do this.

The following is an abbreviated list of other names that can't be used as Region names. For a more
complete list refer to the API documentation for each Class on the prototype chain:

* attributes
* constructor
* regionType
* render
* close
* addRegion
* addRegions
* removeRegion

*Note: this is a known issue that is flagged for being fixed in v2*
