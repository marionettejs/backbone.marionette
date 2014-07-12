# Marionette.Region

Regions provide consistent methods to manage, show and destroy
views in your applications and layouts. They use a jQuery selector
to show your views in the correct place.

Using the `LayoutView` class you can create nested regions.

## Documentation Index

* [Defining An Application Region](#defining-an-application-region)
* [Initialize A Region With An `el`](#initialize-a-region-with-an-el)
* [Basic Use](#basic-use)
* [Showing a view](#showing-a-view)
* [`reset` A Region](#reset-a-region)
* [Set How View's `el` Is Attached](#set-how-views-el-is-attached)
* [Attach Existing View](#attach-existing-view)
  * [Set `currentView` On Initialization](#set-currentview-on-initialization)
  * [Call `attachView` On Region](#call-attachview-on-region)
* [Region Events And Callbacks](#region-events-and-callbacks)
  * [Events raised during `show`](#events-raised-during-show)
* [Custom Region Classes](#custom-region-classes)
  * [Attaching Custom Region Classes](#attaching-custom-region-classes)
  * [Instantiate Your Own Region](#instantiate-your-own-region)

## Defining An Application Region

You can add regions to your applications by calling the `addRegions` method on
your application instance. This method expects a single hash parameter, with
named regions and either jQuery selectors or `Region` objects. You may
call this method as many times as you like, and it will continue adding regions
to the app.

```js
MyApp.addRegions({
  mainRegion: "#main-content",
  navigationRegion: "#navigation"
});
```

As soon as you call `addRegions`, your regions are available on your
app object. In the above, example `MyApp.mainRegion` and `MyApp.navigationRegion`
would be available for use immediately.

If you specify the same region name twice, the last one in wins.

You can also add regions via `LayoutView`s:

```js
var AppLayoutView = Backbone.Marionette.LayoutView.extend({
  template: "#layout-view-template",

  regions: {
    menu: "#menu",
    content: "#content"
  }
});
var layoutView = new AppLayoutView();
layoutView.render();
layoutView.menu.show(new MenuView());
layoutView.content.show(new MainContentView());
```


## Initialize A Region With An `el`

You can specify an `el` for the region to manage at the time
that the region is instantiated:

```js
var mgr = new Backbone.Marionette.Region({
  el: "#someElement"
});
```

The `el` option can also be a raw DOM node reference:

```js
var mgr = new Backbone.Marionette.Region({
  el: document.querySelector("body")
});
```

Or the `el` can also be a `jQuery` wrapped DOM node:

```js
var mgr = new Backbone.Marionette.Region({
  el: $("body")
});
```

## Basic Use

### Showing a View

Once a region is defined, you can call its `show`
and `empty` methods to display and shut-down a view:

```js
var myView = new MyView();

// render and display the view
MyApp.mainRegion.show(myView);

// empties the current view
MyApp.mainRegion.empty();
```

#### preventDestroy
If you replace the current view with a new view by calling `show`,
by default it will automatically destroy the previous view.
You can prevent this behavior by passing `{preventDestroy: true}` in the options
parameter. Several events will also be triggered on the views; see
[Region Events And Callbacks](#region-events-and-callbacks) for details.

```js
// Show the first view.
var myView = new MyView();
MyApp.mainRegion.show(myView);

// Replace the view with another. The
// `destroy` method is called for you
var anotherView = new AnotherView();
MyApp.mainRegion.show(anotherView);

// Replace the view with another.
// Prevent `destroy` from being called
var anotherView2 = new AnotherView();
MyApp.mainRegion.show(anotherView2, { preventDestroy: true });
```

NOTE: When using `preventDestroy: true` you must be careful to cleanup your old views
manually to prevent memory leaks.


#### forceShow
If you re-call `show` with the same view, by default nothing will happen
because the view is already in the region. You can force the view to be re-shown
by passing in `{forceShow: true}` in the options parameter.

```js
var myView = new MyView();
MyApp.mainRegion.show(myView);

// the second show call will re-show the view
MyApp.mainRegion.show(myView, {forceShow: true});
```

### `reset` A Region

A region can be `reset` at any time. This destroys any existing view
being displayed, and deletes the cached `el`. The next time the
region shows a view, the region's `el` is queried from
the DOM.

```js
myRegion.reset();
```

This is useful when regions are re-used across view
instances, and in unit testing.

### Set How View's `el` Is Attached

Override the region's `attachHtml` method to change how the view is attached
to the DOM. This method receives one parameter - the view to show.

The default implementation of `attachHtml` is:

```js
Marionette.Region.prototype.attachHtml = function(view){
  this.$el.empty().append(view.el);
}
```

This replaces the contents of the region with the view's
`el` / content. You can override `attachHtml` for transition effects and more.

```js
Marionette.Region.prototype.attachHtml = function(view){
  this.$el.hide();
  this.$el.html(view.el);
  this.$el.slideDown("fast");
}
```

This example will cause a view to slide down from the top
of the region, instead of just appearing in place.

### Attach Existing View

There are some scenarios where it's desirable to attach an existing
view to a region , without rendering or showing the view, and
without replacing the HTML content of the region. For example, SEO and
accessibiliy often need HTML to be generated by the server, and progressive
enhancement of the HTML.

There are two ways to accomplish this:

* set the `currentView` in the region's constructor
* call `attachView` on the region instance

#### Set `currentView` On Initialization

```js
var myView = new MyView({
  el: $("#existing-view-stuff")
});

var region = new Backbone.Marionette.Region({
  el: "#content",
  currentView: myView
});
```

#### Call `attachView` On Region

```js
MyApp.addRegions({
  someRegion: "#content"
});

var myView = new MyView({
  el: $("#existing-view-stuff")
});

MyApp.someRegion.attachView(myView);
```

## Region Events And Callbacks

### Events raised during `show`:
A region will raise a few events when showing
and destroying views:

* "before:show" / `onBeforeShow` - Called on the view instance after the view has been rendered, but before its been displayed.
* "before:show" / `onBeforeShow` - Called on the region instance after the view has been rendered, but before its been displayed.
* "show" / `onShow` - Called on the view instance when the view has been rendered and displayed.
* "show" / `onShow` - Called on the region instance when the view has been rendered and displayed.
* "before:swap" / `onBeforeSwap` - Called on the region instance before a new view is shown. NOTE: this will only be called when a view is being swapped, not when the region is empty.
* "swap" / `onSwap` - Called on the region instance when a new view is `show`n. NOTE: this will only be called when a view is being swapped, not when the region is empty.
* "before:empty" / `onBeforeEmpty` - Called on the region instance before the view has been emptied.
* "empty" / `onEmpty` - Called when the view has been emptied.

These events can be used to run code when your region
opens and destroys views.

```js
MyApp.mainRegion.on("before:show", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("show", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("before:swap", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("swap", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

MyApp.mainRegion.on("empty", function(view){
  // manipulate the `view` or do something extra
  // with the region via `this`
});

var MyRegion = Backbone.Marionette.Region.extend({
  // ...

  onBeforeShow: function(view) {
    // the `view` has not been shown yet
  },

  onShow: function(view){
    // the `view` has been shown
  }
});

var MyView = Marionette.ItemView.extend({
  onBeforeShow: function() {
    // called before the view has been shown
  },
  onShow: function(){
    // called when the view has been shown
  }
});

var MyRegion = Backbone.Marionette.Region.extend({
  // ...

  onBeforeSwap: function(view) {
    // the `view` has not been swapped yet
  },

  onSwap: function(view){
    // the `view` has been swapped
  }
});
```

## Custom Region Classes

You can define a custom region by extending from
`Region`. This allows you to create new functionality,
or provide a base set of functionality for your app.

### Attaching Custom Region Classes

Once you define a region class, you can attach the
new region class by specifying the region class as the
value. In this case, `addRegions` expects the constructor itself, not an instance.

```js
var FooterRegion = Backbone.Marionette.Region.extend({
  el: "#footer"
});

MyApp.addRegions({
  footerRegion: FooterRegion
});
```

You can also specify a selector for the region by using
an object literal for the configuration.

```js
var FooterRegion = Backbone.Marionette.Region.extend({
  el: "#footer"
});

MyApp.addRegions({
  footerRegion: {
    selector: "#footer",
    regionClass: FooterRegion
  }
});
```

Note that a region must have an element to attach itself to. If you
do not specify a selector when attaching the region instance to your
Application or LayoutView, the region must provide an `el` either in its
definition or constructor options.

### Instantiate Your Own Region

There may be times when you want to add a region to your
application after your app is up and running. To do this, you'll
need to extend from `Region` as shown above and then use
that constructor function on your own:

```js
var SomeRegion = Backbone.Marionette.Region.extend({
  el: "#some-div",

  initialize: function(options){
    // your init code, here
  }
});

MyApp.someRegion = new SomeRegion();

MyApp.someRegion.show(someView);
```

You can optionally add an `initialize` function to your Region
definition as shown in this example. It receives the `options`
that were passed to the constructor of the Region, similar to
a Backbone.View.
