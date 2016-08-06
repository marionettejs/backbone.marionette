**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Regions

Regions provide consistent methods to manage, show and destroy
views in your applications and layouts. You can use a jQuery selector to
identify where your region must be displayed.

See the documentation for [View](./marionette.view.md) for an introduction in
managing regions throughout your application.

## Documentation Index

* [Defining the Application Region](#defining-the-application-region)
* [Defining Regions](#defining-regions)
  * [String Selector](#string-selector)
  * [Additional Options](#additional-options)
  * [Specifying regions as a Function](#specifying-regions-as-a-function)
  * [Adding Regions](#adding-regions)
* [Showing a View](#showing-a-view)
  * [Hiding a View](#hiding-a-view)
  * [Preserving Existing Views](#preserving-existing-views)
* [Checking whether a region is showing a view](#checking-whether-a-region-is-showing-a-view)
* [`reset` A Region](#reset-a-region)
* [Set How View's `el` Is Attached](#set-how-views-el-is-attached)
* [Attach Existing View](#attach-existing-view)
  * [Set `currentView` On Initialization](#set-currentview-on-initialization)
  * [Call `attachView` On Region](#call-attachview-on-region)
* [Region Events And Callbacks](#region-events-and-callbacks)
  * [Events Raised on the Region During `show`](#events-raised-on-the-region-during-show)
  * [Events Raised on the View During `show`](#events-raised-on-the-view-during-show)
  * [Example Event Handlers](#example-event-handlers)
* [Custom Region Classes](#custom-region-classes)
  * [Attaching Custom Region Classes](#attaching-custom-region-classes)
  * [Instantiate Your Own Region](#instantiate-your-own-region)

## Defining the Application Region

The Application defines a single region `el` using the `region` attribute. This
can be accessed through `getRegion()` or have a view displayed directly with
`showView()`. Below is a short example:

```javascript
var Mn = require('backbone.marionette');
var SomeView = require('./view');

var App = Mn.Application.extend({
  region: '#main-content',

  onStart: function() {
    var main = this.getRegion();  // Has all the properties of a `Region`
    main.show(new SomeView());
  }
});
```

For more information, see the
[Application docs](./marionette.application.md#root-layout).

## Defining Regions

Marionette supports multiple ways to define regions on your `Application` or
`View`. This section will document the different types as applied to `View`,
although they will work for `Application` as well - just replace `regions` with
`region` in your definition.

### String Selector

You can use a jQuery string selector to define regions.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  regions: {
    mainRegion: '#main'
  }
});
```

### Additional Options

You can define regions with an object literal. Object literal definitions expect
an `el` property - the jQuery selector string to hook the region into. The
object literal is the most common way to define whether showing the region
overwrites the `el` or just overwrites the content (the default behavior).

To overwrite the parent `el` of the region with the rendered contents of the
inner View, use `replaceElement` as so:

```javascript
var Mn = require('backbone.marionette');

var OverWriteView = Mn.View.extend({
  className: '.new-class'
});

var MyView = Mn.View.extend({
  regions: {
    main: {
      el: '.overwrite-me',
      replaceElement: true
    }
  }
});
var view = new MyView();
view.render();

console.log(view.$('.overwrite-me').length); // 1
console.log(view.$('.new-class').length); // 0

view.showChildView('main', new OverWriteView());

console.log(view.$('.overwrite-me').length); // 0
console.log(view.$('.new-class').length); // 1
```

When the instance of `MyView` is rendered, the `.overwrite-me` element will be
removed from the DOM and replaced with an element of `.new-class` - this lets
us do things like rendering views inside `table` or `select` more easily -
these elements are usually very strict on what content they will allow.

### Specifying regions as a Function

The `regions` attribute on a view can be a
[function returning an object](./basics.md#functions-returning-values):

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  regions: function(options){
    return {
      firstRegion: '#first-region'
    };
  }
});
```

The `options` argument contains the options passed to the view on instantiation.
As the view has not been constructed yet, `this.getOption()` is not able to
return any options from the view - use `options` instead.

### Adding Regions

To add regions to a view after it has been instantiated, simply use the
`addRegion` method:

```javascript
var MyView = require('./myview');

myView = new MyView();
myView.addRegion('thirdRegion', '#third-region');
```

Now we can access `thirdRegion` as we would the others.

## Showing a View

Once a region is defined, you can call its `show`
and `empty` methods to display and shut-down a view:

```javascript
var myView = new MyView();
var childView = new MyChildView();
var mainRegion = myView.getRegion('main');

// render and display the view
mainRegion.show(childView);
```

This is equivalent to a view's `showChildView` which can be used as:

```javascript
var myView = new MyView();
var childView = new MyChildView();

// render and display the view
myView.showChildView('main', childView);
```

Both forms take an `options` object that will be passed to the
[events fired during `show`](#events-raised-during-show).

For more information on `showChildView` and `getChildView`, see the
[Documentation for Views](./marionette.view.md#managing-sub-views)

### Hiding a View

You can remove a view from a region (effectively "unshowing" it) with
`region.empty()` on a region:

```javascript
var myView = new MyView();

myView.showChildView('main', new OtherView());
var mainRegion = myView.getRegion('main');
mainRegion.empty();
```

This will destroy the view, cleaning up any event handlers and remove it from
the DOM.

### Preserving Existing Views

If you replace the current view with a new view by calling `show`,
by default it will automatically destroy the previous view.
You can prevent this behavior by passing `{preventDestroy: true}` in the options
parameter. Several events will also be triggered on the views; see
[Region Events And Callbacks](#region-events-and-callbacks) for details.

```javascript
// Show the first view.
var myView = new MyView();
var childView = new MyChildView();

var mainRegion = myView.getRegion('main');

mainRegion.show(childView);

// Replace the view with another. The
// `destroy` method is called for you
var anotherView = new AnotherView();
mainRegion.show(anotherView);

// Replace the view with another.
// Prevent `destroy` from being called
var anotherView2 = new AnotherView();
mainRegion.show(anotherView2, {preventDestroy: true});
mainRegion.empty({preventDestroy: true});
```

**NOTE** When using `preventDestroy: true` you must be careful to cleanup your
old views manually to prevent memory leaks.

#### onBeforeAttach & onAttach

Regions that are attached to the document when you execute `show` are special in
that the views that they show will also become attached to the document. These
regions fire a pair of triggerMethods on *all* of the views that are about to be
attached – even the nested ones. This can cause a performance issue if you're
rendering hundreds or thousands of views at once.

If you think these events might be causing some lag in your app, you can
selectively turn them off with the `triggerBeforeAttach` and `triggerAttach`
properties or `show()` options.

```javascript
// No longer trigger attach
myRegion.triggerAttach = false;
```

You can override this on a per-show basis by passing it in as an option to show.

```javascript
// This region won't trigger beforeAttach...
myRegion.triggerBeforeAttach = false;

// Unless we tell it to
myRegion.show(myView, {triggerBeforeAttach: true});
```

Or you can leave the events on by default but disable them for a single show.

```javascript
// This region will trigger attach events by default but not for this particular show.
myRegion.show(myView, {triggerBeforeAttach: false, triggerAttach: false});
```

#### `renderView`

In order to add conditional logic when rendering a view you can override the `renderView` method. This could be useful if you don't want the region to re-render views that aren't destroyed. By default this method will call `view.render`.

```javascript
var Mn = require('backbone.marionette');

var CachingRegion = Mn.Region.extend({
  shouldDestroyView: function(view, options) { return false; },
  renderView: function(view, options) {
    if (!view.isRendered) { view.render(); }
  }
});
```

#### `shouldDestroyView`

In order to add conditional logic around whether the current view should be destroyed when showing a new one you can override the `shouldDestroyView` method. This is particularly useful as an alternative to the `preventDestroy` option when you wish to prevent destroy on all views that are shown in the region.

```javascript
var Mn = require('backbone.marionette');

var CachingRegion = Mn.Region.extend({
  shouldDestroyView: function(view, options) { return false; }
});
```

### Checking whether a region is showing a view

If you wish to check whether a region has a view, you can use the `hasView`
function. This will return a boolean value depending whether or not the region
is showing a view.

```javascript
var myView = new MyView();
var mainRegion = myView.getRegion('main');

mainRegion.hasView() // false
mainRegion.show(new OtherView());
mainRegion.hasView() // true
```

### `reset` A Region

A region can be `reset` at any time. This destroys any existing view
being displayed, and deletes the cached `el`. The next time the
region shows a view, the region's `el` is queried from
the DOM.

```javascript
var myView = new MyView();
myView.showChildView('main', new OtherView());
var mainRegion = myView.getRegion('main');
myRegion.reset();
```

This can be useful in unit testing your views.

### Set How View's `el` Is Attached

Override the region's `attachHtml` method to change how the view is attached
to the DOM. This method receives one parameter - the view to show.

The default implementation of `attachHtml` is:

```javascript
var Mn = require('backbone.marionette');

Mn.Region.prototype.attachHtml = function(view){
  this.$el.empty().append(view.el);
}
```

This replaces the contents of the region with the view's
`el` / content. You can override `attachHtml` for transition effects and more.

```javascript
var Mn = require('backbone.marionette');

Mn.Region.prototype.attachHtml = function(view){
  this.$el.hide();
  this.$el.html(view.el);
  this.$el.slideDown("fast");
}
```

It is also possible to define a custom render method for a single region by
extending from the Region class and including a custom attachHtml method.

This example will make a view slide down from the top of the screen instead of just
appearing in place:

```javascript
var Mn = require('backbone.marionette');

var ModalRegion = Mn.Region.extend({
  attachHtml: function(view){
    // Some effect to show the view:
    this.$el.empty().append(view.el);
    this.$el.hide().slideDown('fast');
  }
});

var MyView = Mn.View.extend({
  regions: {
    mainRegion: '#main-region',
    modalRegion: {
      regionClass: ModalRegion,
      el: '#modal-region'
    }
  }
});
```

## Region Events And Callbacks

A region will raise a few events on itself and on the target view when showing and destroying views.

### Events Raised on the Region During `show()`

* `before:show` / `onBeforeShow` - Called after the view has been rendered, but before its been displayed.
* `show` / `onShow` - Called when the view has been rendered and displayed.
* `before:empty` / `onBeforeEmpty` - Called before the view has been emptied.
* `empty` / `onEmpty` - Called when the view has been emptied.

```javascript
view.supportsRenderLifecycle = true;
view.supportsDestroyLifecycle = true;
```

## Custom Region Classes

You can define a custom region by extending from
`Region`. This allows you to create new functionality,
or provide a base set of functionality for your app.

### Attaching Custom Region Classes

Once you define a region class, you can attach the
new region class by specifying the region class as the
value. In this case, `addRegions` expects the constructor itself, not an instance.

```javascript
var Mn = require('backbone.marionette');

var FooterRegion = Mn.Region.extend({
  el: "#footer"
});

var MyView = Mn.View.extend({
  regions: {
    footerRegion: FooterRegion
  }
});
```

You can also specify a selector for the region by using
an object literal for the configuration.

```javascript
var Mn = require('backbone.marionette');

var FooterRegion = Mn.Region.extend({
  el: "#footer"
});

var MyView = Mn.View.extend({
  regions: {
    footerRegion: {
      regionClass: FooterRegion
      el: "#footer",
    }
  }
});
```

Note that a region must have an element to attach itself to. If you
do not specify a selector when attaching the region instance to your
Application or LayoutView, the region must provide an `el` either in its
definition or constructor options.

### Instantiate Your Own Region

There may be times when you want to add a region to your
view after your app is up and running. To do this, you'll
need to extend from `Region` as shown above and then use
that constructor function on your own:

```javascript
var Mn = require('backbone.marionette');

var SomeRegion = Mn.Region.extend({
  el: "#some-div",

  initialize: function(options){
    // your init code, here
  }
});

myView.someRegion = new SomeRegion();

myView.someRegion.show(someView, options);
```

You can optionally add an `initialize` function to your Region
definition as shown in this example. It receives the `options`
that were passed to the constructor of the Region, similar to
a `Backbone.View`.
