Make your Backbone.js apps dance with a composite application architecture!

# Backbone.Marionette

Backbone.Marionette is a composite application library for Backbone.js that
aims to simplify the construction of large scale JavaScript applications. It is
largely a collection of common design and implementation patterns found in 
the applications that I (Derick Bailey) have been building with Backbone, and
includes various pieces inspired by composite application architectures, 
such as Microsoft's "Prism" framework. 

Backbone.Marionette is designed to be a lightweight and flexible library of 
tools that you can use when you want to. Like Backbone.js itself, you're not 
required to use all of Backbone.Marionette just because you want to use some 
of it.

## Source Code And Downloads

You can download the raw source code from the "src" folder above, or grab one of the
many builds from the "lib" folder. 

To get the latest stable release, use these links which point to the 'master' branch's
builds:

### Standard Builds

Development: [backbone.marionette.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.js)

Production: [backbone.marionette.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.min.js)

### RequireJS (AMD) Builds

Development: [backbone.marionette.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/amd/backbone.marionette.js)

Production: [backbone.marionette.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/amd/backbone.marionette.min.js)

## Documentation

This readme represents the majority of documentation for Marionette.
However, this file has become quite large and can be difficult
to wade through. There's a better version of it available, though.

##### [View the formatted readme](http://derickbailey.github.com/backbone.marionette/)

### The Marionette Wiki

A wiki is an important aspect of a thriving community, as it provides
a place for the community to contribute ideas, examples, answer
frequently asked questions, and more. If you're looking for
community-driven information, examples that go beyond the
dry technical documentation, or want to contribute your own
ideas and examples to the community, please see the wiki page.

##### [View The Marionette Wiki](https://github.com/derickbailey/backbone.marionette/wiki)

### Annotated Source Code

In addition to this readme, I've commented the source code quite
heavily and run it through Docco as part of my build process.
This produces a nicely formatted, annotated source code as documenation
file.

You can read the annotated for all the detail of how Marionette works, and advice on which methods to override when.

##### [View the annotated source code](http://derickbailey.github.com/backbone.marionette/docs/backbone.marionette.html)

### DerickBailey.LosTechies.com

Lastly, I blog about Marionette on a regular basis, at my
LosTechies.com blog.

##### [View DerickBailey.LosTechies.com](http://derickbailey.lostechies.com)

## Support And Get Support For Marionette

There are many ways to support Marionette, ranging from
submitting bugs and patches, to helping answer questions in
the issue list and on StackOverflow, to providing financial
support for maintaining Marionette.

### Help With Code And Questions

If you're interested in helping with code and questions, please
see the issues list and stack overflow tag here:

* [Github Issues](//github.com/derickbailey/backbone.marionette/issues)
* [StackOverflow Tag](http://stackoverflow.com/questions/tagged/backbone.marionette)

If you have an idea to improve Marionette or want to report
a bug, please use the issues list.

### Financial Support

I understand that not everyone can offer assitance with code,
bug submissions, and answer questions. That's fine. Everyone has
their own strengths. 

If you're using Marionette and you're finding that it is
saving you as much time and effort as I believe it does, then
please consider financial support for the project. 

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7SJHYWJ487SF4)

(You would be surprised at how little financial support is given,
in spite of the financial savings that a framework like this
creates.)

## Marionette's Pieces

These are the strings that you can pull to make your puppet dance:

* [**Backbone.Marionette.Application**](#marionetteapplication): An application object that starts your app via initializers, and more
* [**Backbone.Marionette.Application.module**](#marionetteapplicationmodule): Create modules and sub-modules within the application
* [**Backbone.Marionette.AppRouter**](#marionetteapprouter): Reduce your routers to nothing more then configuration
* [**Backbone.Marionette.View**](#marionetteview): The base View type that other Marionette views extend from (not intended to be used directly)
* [**Backbone.Marionette.ItemView**](#marionetteitemview): A view that renders a single item
* [**Backbone.Marionette.CollectionView**](#marionettecollectionview): A view that iterates over a collection, and renders individual `ItemView` instances for each model
* [**Backbone.Marionette.CompositeView**](#marionettecompositeview): A collection view and item view, for rendering leaf-branch/composite model hierarchies
* [**Backbone.Marionette.Layout**](#marionettelayout): A view that renders a layout and creates region managers to manage areas within it
* [**Backbone.Marionette.Region**](#marionetteregion): Manage visual regions of your application, including display and removal of content
* [**Backbone.Marionette.EventAggregator**](#marionetteeventaggregator): An extension of Backbone.Events, to be used as an event-driven or pub-sub tool
* [**Backbone.Marionette.BindTo**](#marionettebindto): An event binding manager, to facilitate binding and unbinding of events
* [**Backbone.Marionette.Renderer**](#backbonemarionetterenderer): Render templates with or without data, in a consistent and common manner
* [**Backbone.Marionette.TemplateCache**](#backbonemarionettetemplatecache): Cache templates that are stored in `<script>` blocks, for faster subsequent access
* [**Backbone.Marionette.Callbacks**](#backbonemarionettecallbacks): Manage a collection of callback methods, and execute them as needed

The `Application`, `Region`, `ItemView` and `CollectionView` use the 
`extend` syntax and functionality from Backbone, allowing you to define new 
versions of these objects with custom behavior.

## Marionette.Application

The `Backbone.Marionette.Application` object is the hub of your composite 
application. It organizes, initializes and coordinate the various pieces of your
app. It also provides a starting point for you to call into, from your HTML 
script block or from your JavaScript files directly if you prefer to go that 
route.

The `Application` is meant to be instantiated directly, although you can extend
it to add your own functionality.

```js
MyApp = new Backbone.Marionette.Application();
```

### Adding Initializers

Your application needs to do useful things, like displaying content in your
regions, starting up your routers, and more. To accomplish these tasks and
ensure that your `Application` is fully configured, you can add initializer
callbacks to the application.

```js
MyApp.addInitializer(function(options){
  // do useful stuff here
  var myView = new MyView({
    model: options.someModel
  });
  MyApp.mainRegion.show(myView);
});

MyApp.addInitializer(function(options){
  new MyAppRouter();
  Backbone.history.start();
});
```

These callbacks will be executed when you start your application,
and are bound to the application object as the context for
the callback. In other words, `this` is the `MyApp` object, inside
of the initializer function.

The `options` parameters is passed from the `start` method (see below).

Initializer callbacks are guaranteed to run, no matter when you
add them to the app object. If you add them before the app is
started, they will run when the `start` method is called. If you
add them after the app is started, they will run immediately.

### Application Event

The `Application` object raises a few events during its lifecycle. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start the
`Backbone.history`.

The events that are currently triggered, are:

* **"initialize:before"**: fired just before the initializers kick off
* **"initialize:after"**: fires just after the initializers have finished
* **"start"**: fires after all initializers and after the initializer events

```js
MyApp.bind("initialize:before", function(options){
  options.moreData = "Yo dawg, I heard you like options so I put some options in your options!"
});

MyApp.bind("initialize:after", function(options){
  if (Backbone.history){
    Backbone.history.start();
  }
});
```

The `options` parameter is passed through the `start` method of the application
object (see below).

### Starting An Application

Once you have your application configured, you can kick everything off by 
calling: `MyApp.start(options)`.

This function takes a single optional parameter. This parameter will be passed
to each of your initializer functions, as well as the initialize events. This
allows you to provide extra configuration for various parts of your app, at
initialization/start of the app, instead of just at definition.

```js
var options = {
  something: "some value",
  another: "#some-selector"
};

MyApp.start(options);
```

### app.vent: Event Aggregator

Every application instance comes with an instance of `Marionette.EventAggregator` 
called `app.vent`.

```js
MyApp = new Backbone.Marionette.Application();

MyApp.vent.on("foo", function(){
  alert("bar");
});

MyApp.vent.trigger("foo"); // => alert box "bar"
```

See the `Marionette.EventAggregator` documentation below, for more details.

## Marionette.Application.module

Marionette allows you to define a module within your application,
including sub-modules hanging from that module.

This is useful for creating modular, encapsulated applications
that are be split apart in to multiple files.

By default, every module that you define and add to your 
application, including sub-modules, is a new `Application`
object instance. This allows you to have unlimited
sub-modules and nesting. It also means you have all of the
features and functionality of an `Application` object for
each module.

### Basic Usage

A module is defined directly from an Application object, 
and created another Application object as the specified
name:

```js
var MyApp = new Backbone.Marionette.Application();

var myModule = MyApp.module("MyModule");

MyApp.MyModule; // => a new Marionette.Application object

myModule === MyApp.MyModule; // => true
```

If you specify the same module name more than once, the
first instance of the module will be retained and a new
instance will not be created.

### Module Definitions

You can specify a callback function to provide a definition
for the module. Module definitions are invoked immediately
on calling `module` method. 

The module definition callback will receive 6 parameters:

* The module itself
* The Parent module or Application object
* Backbone
* Backbone.Marionette
* jQuery
* Underscore

You can add functions and data directly to your module to make
them publicly accessible. You can also add private functions
and data by using locally scoped variables.

```js
MyApp.module("MyModule", function(MyModule, MyApp, Backbone, Marionette, $, _){

  // Private Data And Functions
  // --------------------------

  var myData = "this is private data";
 
  var myFunction = function(){
    console.log(myData);
  }


  // Public Data And Functions
  // -------------------------

  MyModule.someData = "public data";

  MyModule.someFunction = function(){
    console.log(MyModule.someData);
  }
});

console.log(MyApp.MyModule.someData); //=> public data
MyApp.MyModule.someFunction(); //=> public data
```

### Defining Sub-Modules With . Notation

Sub-modules can be defined in a number of ways. 

You can define a module, and then later use that module 
to define sub-modules:

```js
MyModule = MyApp.module("MyModule");
MyModule.module("SubModule");

MyApp.MyModule.SubModule; // => a valid module object
```

Or you can define an entire hierarchy of modules and 
sub-modules all at once:

```js
MyApp.module("Parent.Child.GrandChild");

MyApp.Parent.Child.GrandChild; // => a valid module object
```

When defining sub-modules using the dot-notation, the 
parent modules do not need to exist. They will be created
for you if they don't exist. If they do exist, though, the
existing module will be used instead of creating a new one.

### Starting A Sub-Module

As each module is an `Application` object instance, 
initializer functions can be registerd on your modules. There
is no automatic starting of these modules, though. If you
wish to use the module's initializer functions, you must
manually call the module's start method.

```js
MyApp.module("MyModule", function(MyModule){

  MyModule.addInitializer(function(){
    console.log("I'm a module initializer!");
  });

});

MyApp.MyModule.start(); // => "I'm a module initializer!"
```

### Custom Module Objects

If you want to override the module object with your own
object, you can do that by returning an object from the
module definition:

```js
MyApp.module("MyModule", function(){
  var customModule = {};


  return customModule;
});

MyApp.MyModule; // => the 'customModule' object
```

**Note:** When you override a module with a custom object, 
you will not be able to add sub-modules to it using the 
`module` fuction, as this function will not exist on your
module (unless you add it yourself).

## Marionette.AppRouter

Reduce the boilerplate code of handling route events and then calling a single method on another object.
Have your routers configured to call the method on your object, directly.

### Configure Routes

Configure an AppRouter with `appRoutes`. The route definition is passed on to Backbone's standard routing
handlers. This means that you define routes like you normally would. Instead of providing a callback
method that exists on the router, though, you provide a callback method that exists on the `controller`
that you specify for the router instance (see below).

```js
MyRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    "some/route": "someMethod"
  }
});
```

You can also add standard routes to an AppRouter, with methods on the router.

### Specify A Controller

App routers can only use one `controller` object. You can either specify this
directly in the router definition:

```js
someController = {
  someMethod: function(){ /*...*/ }
};

Backbone.Marionette.AppRouter.extend({
  controller: someController
});
```

Or in a parameter to the contructor:

```js
myObj = {
  someMethod: function(){ /*...*/ }
};

new MyRouter({
  controller: myObj
});
```

Or

The object that is used as the `controller` has no requirements, other than it will 
contain the methods that you specified in the `appRoutes`.

It is recommended that you divide your controller objects into smaller pieces of related functionality
and have multiple routers / controllers, instead of just one giant router and controller.

## Marionette.Region

Region managers provide a consistent way to manage your views and
show / close them in your application. They use a jQuery selector
to show your views in the correct place. They also call extra
methods on your views to facilitate additional functionality.

### Defining An Application Region

Regions can be added to the application by calling the `addRegions` method on
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

As soon as you call `addRegions`, your region managers are available on your
app object. In the above, example `MyApp.mainRegion` and `MyApp.navigationRegion`
would be available for use immediately.

If you specify the same region name twice, the last one in wins.

### Initialize A Region With An `el`

You can specify an `el` for the region manager to manage at the time
that the region manager is instantiated:

```js
var mgr = new Backbone.Marionette.Region({
  el: "#someElement"
});
```

### Basic Usage

Once a region manager has been defined, you can call the `show`
and `close` methods on it to render and display a view, and then
to close that view:

```js
var myView = new MyView();

// render and display the view
MyApp.mainRegion.show(myView);

// closes the current view
MyApp.mainRegion.close();
```

If you replace the current view with a new view by calling `show`,
it will automatically close the previous view.

```js
// show the first view
var myView = new MyView();
MyApp.mainRegion.show(myView);

// replace view with another. the
// `close` method is called for you
var anotherView = new AnotherView();
MyApp.mainRegion.show(anotherView);
```

### Set How View's `el` Is Attached

You can specify a second parameter to the `show` method,
which will be used to determine how the HTML from the view's
`el` is attached to the DOM region that is being managed.

The options include any valid jQuery DOM object method, such
as `html`, `text`, `append`, etc.

```js
MyApp.mainRegion.show(myView, "append");
```

This example will use jQuery's `$.append` function to append
the new view to the current HTML.

**WARNING**: Be careful when using this feature, as the view
you are replacing may not be managed / closed correctly as a
result. This can cause unexpected behavior, memory leaks or
other problems. **Use At Your Own Risk**

### Attach Existing View

There are some scenarios where it's desirable to attach an existing
view to a region manager, without rendering or showing the view, and
without replacing the HTML content of the region. For example, SEO and
accessibiliy often need HTML to be generated by the server, and progressive
enhancement of the HTML.

There are two ways to accomplish this: 

* set the `currentView` in the region manager's constructor
* call `attachView` on the region manager instance

#### Set `currentView` On Initialization

```js
var myView = new MyView({
  el: $("#existing-view-stuff")
});

var manager = new Backbone.Marionette.Region({
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

### Region Events And Callbacks

A region manager will raise a few events during it's showing and
closing of views:

* "view:show" - when the view has been rendered and displayed
* "onShow" - called on the region when the view has been rendered
* "view:closed" - when the view has been closed

You can bind to these events and add code that needs to run with
your region manager, opening and closing views.

```js
MyApp.mainRegion.on("view:show", function(view){
  // manipulate the `view` or do something extra
  // with the region manager via `this`
});

MyApp.mainRegion.on("view:closed", function(view){
  // manipulate the `view` or do something extra
  // with the region manager via `this`
});

MyRegion = Backbone.Marionette.Region.extend({
  // ...

  onShow: function(view){
    // the `view` has been shown
  }
});
```

### View Callbacks And Events For Regions

The region manager will call an `onShow` method on the view
that was displayed. It will also trigger a "show" event
from the view:

```js
MyView = Backbone.View.extend({
  onShow: function(){
    // the view has been shown
  }
});

view = new MyView();

view.on("show", function(){
  // the view has been shown.
});

MyApp.mainRegion.show(view);
```

### Defining A Custom Region 

You can define a custom region manager by extending from
`Region`. This allows you to create new functionality,
or provide a base set of functionality for your app.

Once you define a region manager type, you can still call the
`addRegions` method. Specify the region manager type as the
value - not an instance of it, but the actual constructor
function.

```js
var FooterRegion = Backbone.Marionette.Region.extend({
  el: "#footer"
});

MyApp.addRegions({footerRegion: FooterRegion});
```

Note that if you define your own `Region` object, you must provide an
`el` for it. If you don't, you will receive an runtime exception saying that
an `el` is required.

### Instantiate Your Own Region 

There may be times when you want to add a region manager to your
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

### jQuery Deferred And Asynchronous Template Loading

The region manager `show` method takes advantage of jQuery's
deferred cababilities, allowing for some very advanced techniques
to be used for rendering views.

To use a deferred, a view that is shown via a region manager
must return a jQuery deferred object from the `render` method:

```js
DeferredView = Backbone.View.extend({
  render: function(){
    var that = this;
    var data = this.serializeData();
    var dfd = jQuery.Deferred();

    this.getTemplate(function(template){
      var html = that.renderTemplate(template, data);

      that.$el.html(html);

      if (that.onRender){
        that.onRender();
      }

      dfd.resolve();
    });

    return dfd.promise();
  }
});

var view = new DeferredView();
MyApp.mainRegion.show(view);
```

The region manager will wait until the deferred object is resolved
before it attached the view's `el` to the DOM and displays it.

## Marionette.View

Marionette has a base `Marionette.View` type that other views extend from.
This base view provides some common and core functionality for
other views to take advantage of.

**Note:** The `Marionette.View` type is not intended to be 
used directly. It exists as a base view for other view types
to be extended from, and to provide a common location for
behaviors that are shared across all views.

### View.triggers

Views can define a set of `triggers` as a hash, which will 
convert a DOM event in to a `view.trigger` event.

The left side of the hash is a standard Backbone.View DOM
event configuration, while the right side of the hash is the
view event that you want to trigger from the view.

```js
MyView = Backbone.Marionette.ItemView.extend({
  // ...

  triggers: {
    "click .do-something": "something:do:it"
  }
});

view = new MyView();
view.render();

view.on("something:do:it", function(){
  alert("I DID IT!");
});

// "click" the 'do-something' DOM element to 
// demonstrate the DOM event conversion
view.$(".do-something").trigger("click");
```

The result of this is an alert box that says, "I DID IT!"

You can also specify the `triggers` as a function that 
returns a hash of trigger configurations

```js
Backbone.Marionette.CompositeView.extend({
  triggers: function(){
    return {
      "click .that-thing": "that:i:sent:you"
    };
  }
});
```

Triggers work with all View types that extend from the base
Marionette.View.

### View.serializeData

The `serializeData` method will serialize a view's model or
collection - with precedence given to collections. That is,
if you have both a collection and a model in a view, calling
the `serializeData` method will return the serialized
collection.

### View.templateHelpers

There are times when a view's template needs to have some
logic in it, and the view engine itself will not provide an
easy way to accomplish this. For example, Underscore templates
do not provide a helper method mechanism while Handlebars
templates do.

A `templateHelpers` attribute can be applied to any View object
that uses the `serializeData` method - including ItemViews,
Layouts and CompositeViews. When this attribute is present,
it's contents will be mixed in to the data object that comes
back from the `serializeData` method for you. This will 
allow you to create helper methods that can be called from
within your templates.

#### Basic Example

```html
<script id="my-template" type="text/html">
  I think that <%= showMessage() %>
</script>
```

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: "#my-template",

  templateHelpers: {
    showMessage: function(){
      return this.name + " is the coolest!"
    }
  }

});

model = new Backbone.Model({name: "Backbone.Marionette"});
view = new MyView();
view.render(); //=> "I think that Backbone.Marionette is the coolest!";
```

#### Accessing Data Within The Helpers

In order to access data from within the helper methods, you
need to prefix the data you need with `this`. Doing that will
give you all of the methods and attributes of the serialized
data object, including the other helper methods.

```js
templateHelpers: {
  something: function(){
    return "Do stuff with " + this.name + " because it's awesome.";
  }
}
```

#### Object Or Function As `templateHelpers`

You can specify an object literal (as shown above), a reference
to an object literal, or a function as the `templateHelpers`. 

If you specify a function, the function will be invoked 
with the current view instance as the context of the 
function. The function must return an object that can be
mixed in to the data for the view.

```js
Backbone.Marionette.ItemView.extend({
  templateHelpers: function(){
    return {
      foo: function(){ /* ... */ }
    }
  }
});
```

## Marionette.Layout

Formerly known as `CompositeRegion`. 

A `Layout` is a specialized hybrid between an `ItemView` and
a collection of `Region` objects, used for rendering an application
layout with multiple sub-regions to be managed by specified region managers.

A layout manager can also be used as a composite-view to aggregate multiple
views and sub-application areas of the screen where multiple region managers need
to be attached to dynamically rendered HTML.

The `Layout` extends directly from `ItemView` and adds the ability
to specify `regions` which become `Region` instances that are attached
to the layout.

### Basic Usage

```html
<script id="layout-template" type="text/template">
  <section>
    <navigation id="menu">...</navigation>
    <article id="content">...</navigation>
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

### Nested Layouts And Views

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

### Closing A Layout 

When you are finished with a layout, you can call the
`close` method on it. This will ensure that all of the region managers
within the layout are closed correctly, which in turn
ensures all of the views shown within the regions are closed correctly.

If you are showing a layout within a parent region manager, replacing 
the layout with another view or another layout will close the current 
one, the same it will close a view.

All of this ensures that layouts and the views that they
contain are cleaned up correctly.

### Event Aggregator

It's common to use a `Layout` to represent a sub-application in a
larger overall application. Often the components of the sub-application need
to communicate with each other without allowing the other parts of the larger
application in on the communication. To facilitate this, the layout manager
includes an event aggregator, `vent`.

```js
var layout = new MyAppLayout();

layout.vent.trigger("stuff:was:done");
```

## Marionette.ItemView

An `ItemView` is a view that represents a single item. That item may be a 
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is, though, it
will be treated as a single item. 

### ItemView render

An item view has a `render` method built in to it, and uses the
`Renderer` object to do the actual rendering.

The `render` function of the item view will return a jQuery 
`promise` object.

You should provide a `template` attribute on the item view, which
will be either a jQuery selector:

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: "#some-template"
});

new MyView().render().done(function(){
  // the view is done rendering. do stuff here
});
```
or a function that returns a jQuery selector:

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: function(){
    if (this.model.get("foo")){
      return "#some-template";
    } else {
      return "#a-different-template";
    }
  }
});

new MyView().render().done(function(){
  // the view is done rendering. do stuff here
});
```

### Callback Methods

There are several callback methods that are called
for an ItemView. These methods are intended to be handled within
the view definition, directly.

#### beforeRender callback

Before an ItemView is rendered a `beforeRender` method will be called
on the view.

```js
Backbone.Marionette.ItemView.extend({
  beforeRender: function(){
    // set up final bits just before rendering the view's `el`
  }
});
```

#### onRender callback

After the view has been rendered, a `onRender` method will be called.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered:

```js
Backbone.Marionette.ItemView.extend({
  onRender: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

#### beforeClose callback

A `beforeClose` method will be called on the view, just prior
to closing it:

```js
Backbone.Marionette.ItemView.extend({
  beforeClose: function(){
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

#### onClose callback

An `onClose` method will be called on the view, after closing it.

```js
Backbone.Marionette.ItemView.extend({
  onClose: function(){
    // custom closing and cleanup goes here
  }
});
```

### View Events

There are several events that are triggers by an `ItemView`, which
allow code outside of a view to respond to what's happening with
the view.

### "item:before:render" event

An "item:before:render" event will be triggered just before the
view is rendered

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:before:render", function(){
  alert("the view is about to be rendered");
});
```

#### "render" / "item:rendered" event

An "item:rendered" event will be triggered just after the view 
has been rendered.

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:rendered", function(){
  alert("the view was rendered!");
});

myView.on("render", function(){
  alert("the view was rendered!");
});
```

#### "item:before:close" event

An "item:before:close" event will be triggered just prior to the
view closing itself. This event fires when the `close` method of
the view is called.

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:before:close", function(){
  alert("the view is about to be closed");
});

myView.close();
```

#### "item:closed" event

An "item:closed" event will be triggered just after the
view closes. This event fires when the `close` method of
the view is called.

```js
MyView = Backbone.Marionette.ItemView.extend({...});

var myView = new MyView();

myView.on("item:closed", function(){
  alert("the view is closed");
});

myView.close();
```

### ItemView serializeData

Item views will serialize a model or collection, by default, by
calling `.toJSON` on either the model or collection. If both a model
and collection are attached to an item view, the model will be used
as the data source. The results of the data serialization will be passed to the template
that is rendered. 

If the serialization is a model, the results are passed in directly:

```js
var myModel = new MyModel({foo: "bar"});

new MyItemView({
  template: "#myItemTemplate",
  model: myModel
});

MyItemView.render();
```

```html
<script id="myItemTemplate" type="template">
  Foo is: <%= foo %>
</script>
```

If the serialization is a collection, the results are passed in as an 
`items` array:

```js
var myCollection = new MyCollection([{foo: "bar"}, {foo: "baz"}]);

new MyItemView({
  template: "#myCollectionTemplate",
  collection: myCollection
});

MyItemView.render();
```

```html
<script id="myCollectionTemplate" type="template">
  <% _.each(items, function(item){ %>
    Foo is: <%= foo %>
  <% }); %>
</script>
```

If you need custom serialization for your data, you can provide a
`serializeData` method on your view. It must return a valid JSON
object, as if you had called `.toJSON` on a model or collection.

```js
Backbone.Marionette.ItemView.extend({
  serializeData: function(){
    return {
      "some attribute": "some value"
    }
  }
});
```

### Binding To ItemView Events

ItemView extends `Marionette.BindTo`. It is recommended that you use
the `bindTo` method to bind model and collection events. 

```js
MyView = Backbone.Marionette.ItemView.extend({
  initialize: function(){
    this.bindTo(this.model, "change:foo", this.modelChanged);
    this.bindTo(this.collection, "add", this.modelAdded);
  },

  modelChanged: function(model, value){
  },

  modelAdded: function(model){
  }
});
```

The context (`this`) will automatically be set to the view. You can
optionally set the context by passing in the context object as the
4th parameter of `bindTo`.

### ItemView close

ItemView implements a `close` method, which is called by the region
managers automatically. As part of the implementation, the following
are performed:

* unbind all `bindTo` events
* unbind all custom view events
* unbind all DOM events
* remove `this.el` from the DOM
* call an `onClose` event on the view, if one is provided

By providing an `onClose` event in your view definition, you can
run custom code for your view that is fired after your view has been
closed and cleaned up. This lets you handle any additional clean up
code without having to override the `close` method.

```js
Backbone.Marionette.ItemView.extend({
  onClose: function(){
    // custom cleanup or closing code, here
  }
});
```

## Marionette.CollectionView

The `CollectionView` will loop through all of the models in the
specified collection, render each of them using a specified `itemView`,
then append the results of the item view's `el` to the collection view's
`el`.

### Callback Methods

There are several callback methods that can be provided on a
`CollectionView`. If they are found, they will be called by the
view's base methods. These callback methods are intended to be
handled within the view definition directly.

#### beforeRender callback

A `beforeRender` callback will be called just prior to rendering
the collection view.

```js
Backbone.Marionette.CollectionView.extend({
  beforeRender: function(){
    // do stuff here
  }
});
```

#### onRender callback

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

#### beforeClose callback

This method is called just before closing the view.

```js
Backbone.Marionette.CollectionView.extend({
  beforeClose: function(){
    // do stuff here
  }
});
```

#### onClose callback

This method is called just after closing the view.

```js
Backbone.Marionette.CollectionView.extend({
  onClose: function(){
    // do stuff here
  }
});
```

### CollectionView Events

There are several events that will be triggered during the life
of a collection view. These are intended to be handled from code
external to the view.

#### "collection:before:render" event

Triggers just prior to the view being rendered

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("collection:before:render", function(){
  alert("the collection view is about to be rendered");
});

myView.render();
```

#### "render" / "collection:rendered" event

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

#### "collection:before:close" event

Triggered just before closing the view.

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("collection:before:close", function(){
  alert("the collection view is about to be closed");
});

myView.close();
```

#### "collection:closed" event

Triggered just after closing the view.

```js
MyView = Backbone.Marionette.CollectionView.extend({...});

var myView = new MyView();

myView.on("collection:closed", function(){
  alert("the collection view is now closed");
});

myView.close();
```

#### "itemview:\*" event bubbling from child views

When an item view within a collection view triggers an
event, that event will bubble up through the parent 
collection view, with "itemview:" prepended to the event
name. 

That is, if a child view triggers "do:something", the 
parent collection view will then trigger "itemview:do:something".

```js
// set up basic collection
var myModel = new MyModel();
var myColelction = new MyCollection();
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

### CollectionView render

The `render` method of the collection view is responsible for
rendering the entire collection. It loops through each of the
items in the collection and renders them individually as an
`itemView`.

The `render` method returns a jQuery deferred object, allowing
you to know when the rendering completes. This deferred object
is resolved after all of the child views have been rendered.

```js
MyCollectionView = Backbone.Marionette.CollectionView.extend({...});

new MyCollectionView().render().done(function(){
  // all of the children are now rendered. do stuff here.
});
```

### CollectionView's itemView

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

### CollectionView: Automatic Rendering

The collection view binds to the "add", "remove" and "reset" events of the
collection that is specified. 

When the collection for the view is "reset", the view will call `render` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of item views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will close and remove that model's item view.

### CollectionView: Re-render Collection

If you need to re-render the entire collection, you can call the
`view.render` method. This method takes care of closing all of
the child views that may have previously been opened.

### CollectionView's appendHtml

By default the collection view will call jQuery's `.append` to
move the HTML contents from the item view instance in to the collection
view's `el`. 

You can override this by specifying an `appendHtml` method in your 
view definition. This method takes two parameters and has no return
value.

```js
Backbone.Marionette.CollectionView.extend({
  appendHtml: function(collectionView, itemView){
    collectionView.$el.prepend(itemView.el);
  }
});
```

The first parameter is the instance of the collection view that 
will receive the HTML from the second parameter, the current item
view instance.

### CollectionView close

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

## Marionette.CompositeView

A `CompositeView` extends from CollectionView to be used as a 
composite view for scenarios where it should represent both a 
branch and leaf in a tree structure, or for scenarios where a
collection needs to be rendered within a wrapper template.

For example, if you're rendering a treeview control, you may 
want to render a collection view with a model and template so 
that it will show a parent item with children in the tree.

You can specify a `modelView` to use for the model. If you don't
specify one, it will default to the `Marionette.ItemView`.

```js
CompositeView = Backbone.Marionette.CompositeView.extend({
  template: "#leaf-branch-template"
});

new CompositeView({
  model: someModel,
  collection: someCollection
});
```

For more examples, see my blog post on 
[using the composite view](http://lostechies.com/derickbailey/2012/04/05/composite-views-tree-structures-tables-and-more/)

### Composite Render

A composite view returns a jQuery deferred object from the
`render` method. This allows you to know when the rendering for
the entire composite structure has been completed.

```js
MyComp = Backbone.Marionette.CompositeView.extend({...});

myComp = new MyComp().render().done(function(){
  // the entire composite is now rendered. do stuff here
});
```

### Composite Model Template

When a `CompositeView` is rendered, the `model` will be rendered
with the `template` that the view is configured with. You can
override the template by passing it in as a constructor option:

```js
new MyComp({
  template: "#some-template"
});
```

### Recursive By Default

The default rendering mode for a `CompositeView` assumes a
hierarchical, recursive structure. If you configure a composite
view without specifying an `itemView`, you'll get the same
composite view type rendered for each item in the collection. If
you need to override this, you can specify a `itemView` in the
composite view's definition:

```js
var ItemView = Backbone.Marionette.ItemView.extend({});

var CompView = Backbone.Marionette.CompositeView.extend({
  itemView: ItemView
});
```

### Model And Collection Rendering

The model and collection for the composite view will re-render
themselves under the following conditions:

* When the collection's "reset" event is fired, it will re-render the entire list
* When the collection has a model added to it (the "add" event is fired), it will render that one item to the rendered list
* When the collection has a model removed (the "remove" event is fired), it will remove that one item from the rendered list

You can also manually re-render either or both of them:

* If you want to re-render everything, call the `.render()` method
* If you want to re-render the model's view, you can call `.renderModel()`
* If you want to re-render the collection's views, you can call `.renderCollection()`

### Events And Callbacks

During the course of rendering a composite, several events will
be triggered:

* "composite:item:rendered" - after the `modelView` has been rendered
* "composite:collection:rendered" - after the collection of models has been rendered
* "render" / "composite:rendered" - after everything has been rendered

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

## Marionette.EventAggregator

An event aggregator is an application level pub/sub mechanism that allows various
pieces of an otherwise segmented and disconnected system to communicate with
each other. 

### Basic Usage

Backbone.Marionette provides an event aggregator with each application instance: 
`MyApp.vent`. You can also instantiate your own event aggregator:

```js
myVent = new Backbone.Marionette.EventAggregator();
```

Passing an object literal of options to the constructor function will extend the
event aggregator with those options:

```js
myVent = new Backbone.Marionette.EventAggregator({foo: "bar"});
myVent.foo // => "bar"
```

### BindTo

The `EventAggregator` extends from the `BindTo` object (see below) to easily track
and unbind all event callbacks, including inline callback functions. 

The `bindTo` method, though, has been proxied to only take 3 arguments. It assumes
that the object being bound to is the event aggregator directly, and does not allow
the bound object to be specified:

```js
vent = new Backbone.Marionette.EventAggregator();

vent.bindTo("foo", function(){
  alert("bar");
});

vent.unbindAll();

vent.trigger("foo"); // => nothing. all events have been unbound.
```

### Decoupling With An Event-Driven Architecture

You can use an event aggregator to communicate between various modules of your
application, ensuring correct decoupling while also facilitating functionality
that needs more than one of your application's modules.

```js
var vent = new Backbone.Marionette.EventAggregator();

vent.bind("some:event", function(){
  alert("Some event was fired!!!!");
});
  
vent.trigger("some:event");
```

For a more detailed discussion and example of using an event aggregator with
Backbone applications, see the blog post: [References, Routing, and The Event
Aggregator: Coordinating Views In Backbone.js](http://lostechies.com/derickbailey/2011/07/19/references-routing-and-the-event-aggregator-coordinating-views-in-backbone-js/)


## Marionette.BindTo

The `BindTo` object provides event binding management and facilitates simple
event binding and unbinding for any object that extends from `Backbone.Events`.

### Bind Events

```js
var binder = _.extend({}, Backbone.Marionette.BindTo);

var model = new MyModel();

var handler = {
  doIt: function(){}
}
binder.bindTo(model, "change:foo", handler.doIt);
```

You can optionally specify a 4th parameter as the context in which the callback
method for the event will be executed:

```js
binder.bindTo(model, "change:foo", someCallback, someContext);
```

### Unbind A Single Event

When you call `bindTo`, it returns a "binding" object that can be
used to unbind from a single event with the `unbindFrom` method:

```js
var binding = binder.bindTo(model, "change:foo", someCallback, someContext);

// later in the code
binder.unbindFrom(binding);
```

This will unbind the event that was configured with the binding
object, and remove it from the BindTo bindings.

### Unbind All Events

You can call `unbindAll` to unbind all events that were bound with the
`bindTo` method:

```js
binder.unbindAll();
```

This even works with in-line callback functions.

## Backbone.Marionette.Renderer

The `Renderer` object was extracted from the `ItemView` rendering
process, in order to create a consistent and re-usable method of
rendering a template with or without data.

### Basic Usage

The basic usage of the `Renderer` is to call the `render` method.
This method returns a jQuery `promise` object, which will provide
the HTML that was rendered when it resolves.

```js
var template = "#some-template";
var data = {foo: "bar"};
var render = Backbone.Marionette.Renderer.render(template, data);

render.done(function(html){
  // do something with the HTML here
});
```

### Custom Template Selection And Rendering

By default, the renderer will take a jQuery selector object as
the first parameter, and a JSON data object as the optional
second parameter. It then uses the `TemplateCache` to load the
template by the specified selector, and renders the template with
the data provided (if any) using Underscore.js templates.

If you wish to override the way the template is loaded, see
the `TemplateCache` object. 

If you wish to override the template engine used, change the 
`renderTemplate` method to work however you want:

```js
Backbone.Marionette.Renderer.renderTemplate = function(template, data){
  return $(template).tmpl(data);
});
```

This implementation will replace the default Underscore.js 
rendering with jQuery templates rendering.

### Pre-Loaded Templates With RequireJS

It's common for developers to use RequireJS to pre-load the entire
template that is needed. When the template is pre-loaded like this,
the use of a jQuery selector is not needed. 

If you wish to replace the entire rendering process, based on the 
assumption that you will always pre-load the entire template for 
your view, it can be done by replacing the `render` method on the 
`Renderer` object:

```js
Backbone.Marionette.Renderer.render = function(template, data){
  return _.template(template, data);
};
```

This will skip the `TemplateCache` usage entirely, and all of the
other code that is usually run, and return the compiled template
immediately.

### Caching Pre-Compiled Templates

There's a performance hit in replacing the entire `render`
function of the `Renderer` object as shown in the example
above. You should only have to compile a template once, and you should
be caching the pre-compiled template after that.

To accomplish this, avoid replacing the `render` function. Instead
use a combination of the `renderTemplate` function and the
`TemplateCache.loadTemplate` function.

```js
Backbone.Marionette.TemplateCache.loadTemplate = function(template, callback){
  // pre-compile the template and store that in the cache.
  var compiledTemplate = _.template(template);
  callback.call(this, compiledTemplate);
};

Backbone.Marionette.Renderer.renderTemplate = function(template, data){
  // because `template` is the pre-compiled template object,
  // we only need to execute the template with the data
  return template(data);
}
```

For more information about the `TemplateCache.loadTemplate` function,
see the next section of the documentation.

## Backbone.Marionette.TemplateCache

The `TemplateCache` provides a cache for retrieving templates
from script blocks in your HTML. This will improve
the speed of subsequent calls to get a template.

### Basic Usage

To use the `TemplateCache`, call it directly. It is not
instantiated like other Marionette objects.

### Get A Template

Templates are retrieved using a jQuery selector by default, and 
are handed back to you via a callback method. The template is returned
as a plain string.

```js
Backbone.Marionette.TemplateCache.get("#my-template", function(template){
 // use the template here
});
```

Making multiple calls to get the same template will retrieve the
template from the cache on subsequence calls:

```js
var a, b, c;
Backbone.Marionette.TemplateCache.get("#my-template", function(tmpl){a = tmpl});
Backbone.Marionette.TemplateCache.get("#my-template", function(tmpl){b = tmpl});
Backbone.Marionette.TemplateCache.get("#my-template", function(tmpl){c = tmpl});
a === b === c; // => true
```

### Override Template Retrieval

The default template retrieval is to select the template contents
from the DOM using jQuery. If you wish to change the way this
works, you can override the `loadTemplate` method on the
`TemplateCache` object.

```js
Backbone.Marionette.TemplateCache.loadTemplate = function(templateId, callback){
  // load your template here, returning it or a deferred
  // object that resolves with the template as the only param
}
```

For example, if you want to load templates asychronously from the
server, instead of from the DOM, you could replace 
`loadTemplate` function.

If a "template.html" file exists on the server, with this in it:

```html
<script id="my-template" type="text/template">
  <div>some template stuff</div>
</script>
```

Then the `loadTemplate` implementation may look like this:

```js
Backbone.Marionette.TemplateCache.loadTemplate = function(templateId, callback){
  var that = this;
  var url = templateId + ".html";

  $.get(url, function(templateHtml){
    var template = $(tmplateHtml).find(templateId);
    callback(template);
  });
}
```

This will use jQuery to asynchronously retrieve the template from
the server. When the `get` completes, the callback function will
select the template from the resulting HTML and then call the
`callback` function to send it in to the template cache and allow
it to be used for rendering.

### Clear Items From cache

You can clear one or more, or all items from the cache using the
`clear` method. Clearing a template from the cache will force it
to re-load from the DOM (or from the overriden `loadTemplate`
function) the next time it is retrieved.

If you do not specify any parameters, all items will be cleared
from the cache:

```js
Backbone.Marionette.TemplateCache.get("#my-template");
Backbone.Marionette.TemplateCache.get("#this-template");
Backbone.Marionette.TemplateCache.get("#that-template");

// clear all templates from the cache
Backbone.Marionette.TemplateCache.clear()
```

If you specify one or more parameters, these parameters are assumed
to be the `templateId` used for loading / caching:

```js
Backbone.Marionette.TemplateCache.get("#my-template");
Backbone.Marionette.TemplateCache.get("#this-template");
Backbone.Marionette.TemplateCache.get("#that-template");

// clear 2 of 3 templates from the cache
Backbone.Marionette.TemplateCache.clear("#my-template", "#this-template")
```

### Built In To ItemView

If you're using `Marionette.ItemView`, you don't need to manually
call the `TemplateCache`. Just specify the `template` attribute
of your view as a jQuery selector, and the `ItemView` will use 
the template manager by default.

## Backbone.Marionette.Callbacks

The `Callbacks` object assists in managing a collection of callback
methods, and executing them, in an async-safe manner.

### Basic Usage

There are only three methods: 

* `add`
* `run`
* `setOptions`

The `add` method adds a new callback to be executed later. 

The `run` method executes all current callbacks in, using the
specified context for each of the callbacks, and supplying the
provided options to the callbacks.

```js
var callbacks = new Backbone.Marionette.Callbacks();

callbacks.add(function(options){
  alert("I'm a callback with " + options.value + "!");
});

callbacks.run(someContext, {value: "options"});
```

This example will display an alert box that says "I'm a callback
with options!". The executing context for each of the callback
methods has been set to the `someContext` object, which can be
any valid JavaScript object.

### Advanced / Async Use

The `Callbacks` executes each callback in an async-friendly 
manner, and can be used to facilitate async callbacks. 
The `Marionette.Application` object uses `Callbacks`
to manage initializers (see above). 

It can also be used to guarantee callback execution in an event
driven scenario, much like the application initializers.

## Backbone.Marionette Sample Apps

There are several sample apps available.

### BBCloneMail

I'm building a medium sized app to demonstrate Backbone.Marionette. It's a simple
clone of a GMail like interface, with email and contact management. There is no
back end for data, currently. The sample app does run on top of Ruby and
Sinatra, but all the data is hard coded into the HTML/JavaScript right now.

You can find BBCloneMail online at:

http://bbclonemail.heroku.com

And you can find the source code at:

http://github.com/derickbailey/bbclonemail

### Steve Gentile' Contact Manager

Steve Gentile is building two versions of the same contact manager app. One of
them runs on NodeJS as a back-end, and the other runs on ASP.NET MVC as the
back-end.

The NodeJS version is here:

https://github.com/sgentile/BackboneNodeContacts

And the ASP.NET MVC version is here:

https://github.com/sgentile/BackboneContacts

## Compatibility And Requirements

Theses libraries are require for the use, development, testing and
documentation of Backbone.Marionette.

### Runtime Requirements

Backbone.Marionette currently works with the following versions of these 
libraries:

* Backbone v0.9.2
* Underscore v1.3.1
* jQuery v1.7.2

While support for Zepto and Enderjs has been added, it is not officially
tested against these libraries at this time.

Marionette has not been tested against any other versions of these
libraries. You may or may not have success if you use a version other
than what it listed here.

## Build Tools Used

I use a number of tools to build, test and maintain Marionette, including
but not limited to:

### Anvil.js

The [Anvil.js](https://github.com/arobson/anvil.js) project is used
to generate the builds for Backbone.Marionette. You can run the
`build.sh` file from a terminal, or the `build.cmd` file for Windows 
users, after installing anvil.

### Test Suite

Backbone.Marionette is also tested with the Jasmine JavaScript test utility,
using the Jasmine Ruby gem. 

To get the test suite up and running, you need a Ruby installation with the 
latest RubyGems. Install the 'bundler' gem and then run 'bundle install' from 
the project's root folder. Then run `rake jasmine` to run the test suite, and
load up http://localhost:8888 to see the test suite in action.

### Formatted Documentation

I'm using [DocumentUp.com](http://documentup.com) to
format the  readme / documentation at 
http://derickbailey.github.com/backbone.marionette

### Annotated Source Code

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code.

## Release Notes

### v0.8.2

* Views now have the ability to define `triggers` which will convert a DOM event in to a `view.trigger` event

### v0.8.1

* Module definition functions will only be applied to the last module in the . chain

### v0.8.0

* Added modules and sub-modules through the Application object

### v0.7.6

* An `itemView` instance as part of a Collection View or Composite View, will have it's events bubbled up through the parent view, prepended with "itemview:" as the event name

### v0.7.5

* The `onBefore` method of ItemView can now return a deferred object
* Code cleanup for rendering methods

### v0.7.4

* Fixed issue with `unbindAll` in BindTo, that was skipping some items

### v0.7.3

* The `bindTo` method on the `EventAggregator` now returns a binding configuration object
* Automatic mixing in of `templateMethods` as template / view helper methods, in views that use the `serializeData` function
* A friendlier error message will be thrown from an appRouter if a route is configured with a method that does not exist on the controller

### v0.7.2

* Extracted `compileTemplate` method in TemplateCache for clarity and easier modification
* ItemView will wait until `onRender` has completed before triggering other rendered events
* Region now supports an `onShow` method, when defining a custom region
* Moved the default `serializeData` method to the base Marionette.View
* CompositeView now calls the `serializeData` method to get the model's data for the view
* `BindTo` changes:
  * The `bindTo` method returns a "binding" object so that it can be unbound easily
  * Now has an `unbindFrom` method that will unbind a binding object

### v0.7.1

* ItemView now has a `renderHtml` method that can be overriden to render the item view's data
* Region now supports an `initialize` function when extending a region to your own object type
* CollectionView correctly defers until all children are rendered
* Underscore templates are cached as pre-compiled templates, instead of re-compiling them on every render
* Updating AMD support to also work with CommonJS / NodeJS
* Correctiong build to include header / license info for all output files
* Pass JSLint with no warnings (run w/ Anvil.js build process)
* Removed GZip release files, as they were broken anyways

### v0.7.0

* **BREAKING**: The `renderTemplate` method has moved from the `ItemView` prototype on to the `Renderer` object
* **BREAKING**: The `appendHtml` method of the `CollectionView` now takes `collectionView, itemView` as the arguments, instead of `el, html`
* Added `Marionette.View` object, to contain a few basic parts of every Marionette view
* Added `Marionette.Renderer` object, to handle template rendering
* Views correctly trigger the "close" events before unbinding event subscribers
* Additional `CollectionView` changes: 
  * Extracted `getItemView` method to retrieve the `itemView` type, either from `this.itemView` or `this.options.itemView`
  * Extracted `buildItemView` method to build each item's view
  * Renamed `removeChildView` to `removeItemView` to make the language consistent
  * Triggers "item:added" event after each item has been added
  * Triggers "item:removed" event after an item has been removed
* `CompositeView` changes:
  * No longer takes a `modelView`. Now directly renders the `template` specified
  * Defaults to a recurive structure, where `itemView` is the current composite view type
* A `Region` will trigger a `show` event from any view that it shows
* Added common "render" event to all the view types
* Updated to Backbone v0.9.2
* Updated to jQuery v1.7.2
* AMD / RequireJS compliant version is provided
* Now using [Anvil.js](https://github.com/arobson/anvil.js) for builds

#### v0.6.4

* CollectionView and CompositeView can render without a collection

#### v0.6.3

* `ItemView` changes
  * Calls a `beforeRender` and `beforeClose` method on the view, if it exists
  * Triggers a `item:before:render` event, just prior to rendering
  * Triggers a `item:before:close` and `item:closed` events, around the view's `close` method
* `CollectionView` changes
  * Calls a `beforeRender` and `beforeClose` method on the view, if it exists
  * Triggers a `collection:before:render` event before rendering
  * Triggers a `collection:before:close` and `collection:closed` event, surrounding closing of the view
* The `CollectionView` and `CompositeView` now close child views before closing itself

#### v0.6.2

* **BREAKING:** The `CollectionView` no longer has a `reRender` method. Call `render` instead
* **BREAKING:** The `TemplateCache.get` method now returns a plain string instead of a jQuery selector object
* Fixed a bug with closing and then re-using a Layout with defined regions
* Fixed a potential race condition for loading / caching templates where a template would be loaded multiple times instead of just once

#### v0.6.1

* Fixed the composite view so that it renders the collection correctly when the collection is "reset"
* Fixed the composite view so that it re-renders correctly
* Fixed various deferred usages to only return promises, instead of the full deferred object

#### v0.6.0

* **BREAKING:** Renamed `LayoutManager` to `Layout`
* **BREAKING:** Renamed `RegionManager` to `Region`
* **BREAKING:** Renamed `TemplateManager` to `TemplateCache`

* **Layout**
  * **BREAKING:** `Layout.render` no longer returns the view itself, now returns a jQuery deferred object
  * The `.vent` attribute is now available in the `initializer` method
  * Ensures that regions select the `$el` within the Layout's `$el` instead of globally on the page
  * Initialize the regions before the layout, allowing access to the regions in the `onRender` method of the layout
  * Close the Layout's regions before closing the layout itself

* **CompositeView**
  * **BREAKING:** `CompositeView.render` no longer returns the view itself, now returns a jQuery deffered object
  * Will only render the collection once. You can call `renderCollection` explicitly to re-render the entire collection
  * Will only render the model view once. You can call `renderModel` explicitly to re-render the model
  * Correctly close and dispose of the model view
  * Triggers various events during rendering of model view and collection view
  * Calls 'onRender' method of composite view, if it exists

* **ItemView**
  * **BREAKING:** `ItemView.render` no longer returns the view itself, now returns a jQuery deferred object
  * Optimization to only call `.toJSON` on either model or collection, not both
  * Trigger "item:rendered" method after rendering (in addition to calling onRender method of the view)

* **CollectionView**
  * **BREAKING:** `CollectionView.render` no longer returns the view itself, now returns a jQuery deferred object
  * Trigger "collection:rendered" method after rendering (in addition to calling onRender method)

* Large updates to the readme/documentation
* Heavy use of `jQuery.Deferred()` and `jQuery.when/then` to better support asynchronous templates and rendering

#### v0.5.2

* **BREAKING:** Renamed `CompositeRegion` to `LayoutManager`
* Aliased CompsiteRegion to LayoutManager for backwards compatibility
* Bug fix for correctly initializing LayoutManager with specified options in constructor

#### v0.5.1

* Controller methods fired from an `AppRouter` are now called with `this` set to the controller, instead of the router
* Fixed a bug in the CompositeView where the list wouldn't render when passing in a populated collection

#### v0.5.0

* **BREAKING:** Extraced `CompositeView` out of the collection view
* Added `CompositeView` for managing leaf-branch/composite model structures
* Added `CompositeRegion` for managing nested views and nested region managers
* Added `attachView` method to `RegionManager` to attach existing view without rendering / replacing
* Specify how to attach HTML to DOM in region manager's `show` method

#### v0.4.8

* Don't re-render an ItemView when the view's model "change" event is triggered

#### v0.4.7

* Allow `RegionManager` to be instantiated with an `el` specified in the options
* Change how RegionManagers are added to an Application instance, to reduce memory usage from extraneous types

#### v0.4.6

* AppRouter can have it's `controller` specified directly in the router definition or in the construction function call
* Extracted `Marionette.EventAggregator` out in to it's own explicit object

#### v0.4.5

* CollectionView closes existing child views before re-rendering itself, when "reset" 
event of collection is triggered
* CollectionView now has "initialEvents" method which configures it's initial events
* ItemView now has "initialEvents" method which configures it's initial events

#### v0.4.4

* CollectionView renders itself when the view's collection "reset" event is fired
* ItemView renders itself when the view's model "change" event is fired
* ItemView renders itself when the view's collection "reset" event is fired

#### v0.4.3

* Fixed bug with RegionManagers trying to select element before DOM is ready, to lazy-select the element on first use of `show`

#### v0.4.2

* **BREAKING:** Removed the `setOptions` method from the `Callbacks` object
* Refactored `Callbacks` object to use a jQuery Deferred instead of my own code
* Fixed template manager's `clear` so it properly clears a single template, when only one is specified
* Refactored the `RegionManager` code to support several new features
  * now support returning a jQuery deferred object from a view's `render` method
  * now have a `close` method that you can call to close the current view
  * now trigger a "view:show" and "view:close" event
  * correctly remove reference to previous views, allowing garbage collection of the view
  * now support the `bindTo` and `unbindAll` methods, for binding/unbinding region manager events

#### v0.4.1

* Minor fix to context of template manager callback, to fix issue w/ async template loading

#### v0.4.0

* **BREAKING:** Rewrote the template manager to be async-template loading friendly
* **BREAKING:** Dropping support for Backbone v0.5.3 and below
* Added `Marionette.Callbacks` to manage a collection of callbacks in an async-friendly way
* Guarantee the execution of app initializer functions, even if they are added after the app 
has been started.
* App triggers "start" event after initializers and initializer events
* Updated to Backbone v0.9.1

#### v0.3.1

* Make region managers initialize immediately when calling `app.addRegions`

#### v0.3.0

* **BREAKING:** `view.el` for `ItemView` and `CollectionView` is no longer a jQuery selector object. Use `view.$el` instead
* **BREAKING:** `regionManger.el` is no longer a jQuery selector object. Use `regionManager.$el` instead
* Updated to use Backbone v0.9.0
* Updated to use Underscore v1.3.1
* Removed default `itemView` from the `CollectionView` definition
* `CollectionView` now explicitly checks for an `itemView` defined on it, and throws an error if it's not found

#### v0.2.6

* Bind the context (`this`) of application initializer functions to the application object

#### v0.2.5

* Added `AppRouter`, to reduce boilerplate routers down to simple configuration
* `CollectionView` can be treated as a composite view, rendering an `model` and a `collection` of models
* Now works with either jQuery, Zepto, or enter.js
* `ItemView` will throw an error is no template is specified

#### v0.2.4

* Return `this` (the view itself) from `ItemView` and `CollectionView` `render` method
* Call `onRender` after the `CollectionView` has rendered itself

#### v0.2.3

* Fixed global variable leaks
* Removed declared, but unused variables

#### v0.2.2

* Fixed binding events in the collection view to use `bindTo` (#6)
* Updated specs for collection view
* Documentation fixes (#7)

#### v0.2.1

* Added `TemplateManager` to cache templates
* CollectionView binds to add/remove and updates rendering appropriately
* ItemView uses `TemplateManager` for template retrieval
* ItemView and CollectionView set `this.el = $(this.el)` in constructor

#### v0.2.0

* Added `ItemView`
* Added `CollectionView`
* Added `BindTo`
* Simplified the way `extend` is pulled from Backbone

#### v0.1.0

* Initial release
* Created documentation
* Generated annotated source code

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
