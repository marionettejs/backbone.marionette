Make your Backbone.js apps dance with a composite application architecture!

# Backbone.Marionette

Backbone.Marionette is a composite application library for Backbone.js that
aims to simplify the construction of large scale JavaScript applications. It is
largely a collection of common design and implementation patterns found in 
the applications that I (Derick Bailey) have been building with Backbone, and
includes various pieces inspired by composite application architectures, 
such as Microsoft's "Prism" framework. 

Backbone.Marionette is designed 
to be a lightweight and flexible library of tools that you can use when you want 
to. Like Backbone.js itself, you're not required to use all of 
Backbone.Marionette just because you want to use some of it.

## Downloads And Source Code

You can download the raw source code above, fork the repository or
use these links:

Development: [backbone.marionette.js](https://raw.github.com/derickbailey/backbone.marionette/master/backbone.marionette.js) 13.88K file size (4.6K gzipped)

Production: [backbone.marionette.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/backbone.marionette.min.js) 4.97K file size (1.71K gzipped)

## Annotated Source Code

For a good time, call.. err... read through [the annotated source code](http://derickbailey.github.com/backbone.marionette/docs/backbone.marionette.html).

## Marionette's Pieces

These are the strings that you can pull to make your puppet dance:

* **Backbone.Marionette.Application**: An application object that starts your app via initializers, and more
* **Backbone.Marionette.AppRouter**: Reduce your routers to nothing more then configuration
* **Backbone.Marionette.ItemView**: A view that renders a single item
* **Backbone.Marionette.CollectionView**: A view that iterates over a collection, and renders individual `ItemView` instances for each model
* **Backbone.Marionette.RegionManager**: Manage visual regions of your application, including display and removal of content
* **Backbone.Marionette.BindTo**: An event binding manager, to facilitate binding and unbinding of events
* **Backbone.Marionette.TemplateManager**: Cache templates that are stored in `<script>` blocks, for faster subsequent access
* **Backbone.Marionette.Callbacks**: Manage a collection of callback methods, and execute them as needed
* **Application.vent**: Every instance of `Application` comes with a `.vent` property, an event aggregator

The `Application`, `RegionManager`, `ItemView` and `CollectionView` use the 
`extend` syntax and functionality from Backbone, allowing you to define new 
versions of these objects with custom behavior.

## Marionette.Application

The `Backbone.Marionette.Application` object is the hub of your composite 
application. It organizes, initializes and coordinate the various pieces of your
app. It also provides a starting point for you to call into, from your HTML 
script block or from your JavaScript files directly if you prefer to go that 
route.

The `Application` is meant to be instantiate directly, although you can extend
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

### Application Event;

The `Application` object raises a few events during its lifecycle. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start the
`Backbone.history`.

The events that are currently triggered are:

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

### Event Aggregator

An event aggregator is an application level pub/sub mechanism that allows various
pieces of an otherwise segmented and disconnected system to communicate with
each other. Backbone.Marionette provides an event aggregator with each 
application instance: `MyApp.vent`.

You can use this event aggregator to communicate between various modules of your
application, ensuring correct decoupling while also facilitating functionality
that needs more than one of your application's modules.

```js
(function(MyApp){

  MyApp.vent.bind("some:event", function(){
    alert("Some event was fired!!!!");
  });
  
})(MyApp);

MyApp.vent.trigger("some:event");
```

For a more detailed discussion and example of using an event aggregator with
Backbone applications see the blog post: [References, Routing, and The Event
Aggregator: Coordinating Views In Backbone.js](http://lostechies.com/derickbailey/2011/07/19/references-routing-and-the-event-aggregator-coordinating-views-in-backbone-js/)

## Marionette.AppRouter

Reduce the boilerplate code of handling route events and then calling a single method on another object.
Have your routers configured to call the method on your object, directly.

### Configure Routes

Configure an AppRouter with `appRoutes`. The route definition is passed on to Backbones standard routing
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

App routers can only take one `controller` object as a parameter to the constructor.

```js
myObj = {
  someMethod: function(){
    // do stuff
  }
};

new MyRouter({
  controller: myObj
});
```

The object that is used as the `controller` has no requirements, other than it will 
contain the methods that you specified in the `appRoutes`.

It is recommended that you divide your controller objects in to smaller pieces of related functionality
and have multiple routers / controllers, instead of just one giant router and controller.

## Marionette.RegionManager

Region managers provide a consistent way to manage your views and
show / close them in your application. They use a jQuery selector
to show your views in the correct place. They also call extra
methods on your views, to facilitate additional functionality.

### Defining A Region

Regions can be added to the application by calling the `addRegions` method on
your application instance. This method expects a single hash parameter, with
named regions and either jQuery selectors or `RegionManager` objects. You may
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

If you specify the same region name twice, last one in wins.

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

### Region Manager Events

A region manager will raise a few events during its showing and
closing of views:

* "view:show" - when the view has been rendered and displayed
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
```

### Defining A Custom Region Manager

You can define a custom region manager by extending from
`RegionManager`. This allows you to create new functionality,
or provide a base set of functionality for your app.

Once you define a region manager type, you can still call the
`addRegions` method. Specify the region manager type as the
value - not an instance of it, but the actual constructor
function.

```js
var FooterRegion = Backbone.Marionette.RegionManager.extend({
  el: "#footer"
});

MyApp.addRegions({footerRegion: FooterRegion});
```

Note that if you define your own `RegionManager` object, you must provide an
`el` for it. If you don't, you will receive a runtime exception saying that
an `el` is required.

### Instantiate Your Own Region Manager

There may be times when you want to add a region manager to your
application after your app is up and running. To do this, you'll
need to extend from `RegionManager` as shown above and then use
that constructor function on your own:

```js
var SomeRegion = Backbone.Marionette.RegionManager.extend({
  el: "#some-div"
});

MyApp.someRegion = new SomeRegion();

MyApp.someRegion.show(someView);
```

### jQuery Deferred And Asynchronous Template Loading

The region manager `show` method takes advantage of jQuery's
deferred capabilities, allowing for some very advanced techniques
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

## Marionette.ItemView

An `ItemView` is a view that represents a single item. That item may be a 
`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is, though, it
will be treated as a single item. 

### ItemView render

An item view has a `render` method built in to it. By default it uses
underscore.js templates.

The default implementation will use a template that you specify (see
below) and serialize the model or collection for you (see below).

You can provide a custom implementation of a method called
`renderTemplate` to change template engines. For example, if you want
to use jQuery templates, you can do this:

```js
Backbone.Marionette.ItemView.extend({
  renderTemplate: function(template, data){
    return template.tmpl(data);
  }
});
```

The `template` parameter is a jQuery object with the contents of the 
template that was specified in the view (see below).

The `data` parameter is the serialized data for either the model or
the collection of the view (see below).

After the view has been rendered, an `onRender` method will be called.
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

### ItemView template

Item views should be configured with a template. The `template` attribute should
be either a valid jQuery selector, or a function that returns a valid jQuery
selector:

```js
MyView = Backbone.Marionette.ItemView.extend({
  template: "#some-template"
});

AnotherView = Backbone.Marionette.ItemView.extend({
  template: function(){
    return $("#some-template")
  }
});

new SomeItemView({
  template: "#some-template"
});
```

If no template is specified, an error will be throwing saying so.

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

### ItemView events

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

After the view has been rendered, an `onRender` method will be called.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered:

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

If you do not specify an `itemView`, an exception will be thrown
stating that you must specify an `itemView`.

### CollectionView: Automatic Rendering

The collection view binds to the "add", "remove" and "reset" events of the
collection that is specified. 

When the collection for the view is "reset", the view will call `reRender` on
itself and re-render the entire collection.

When a model is added to the collection, the collection view will render that
one model in to the collection of item views.

When a model is removed from a collection (or destroyed / deleted), the collection
view will close and remove that model's item view.

### CollectionView: Re-render Collection

If you need to re-render the entire collection, you can call the
`view.reRender` method. This method takes care of closing all of
the child views that may have previously been opened.

### CollectionView's appendHtml

By default the collection view will call jQuery's `.append` to
move the HTML contents from the item view instance in to the collection
view's `el`. 

You can override this by specifying an `appendHtml` method in your 
view definition. This method takes two parameters and has no return
value.

Parameter `el`: the collection view's `el`, as a jQuery selector
object. 

Parameter `html`: the HTML contents that were generated by the
item view.

```js
Backbone.Marionette.CollectionView.extend({
  appendHtml: function(el, html){
    el.prepend(html);
  }
});
```

### Composite View

A `CollectionView` can be work as a composite view for scenarios
where it should represent both a branch and leaf in a tree structure.

For example, if you're rendering a treeview control, you may want
to render a collection view with a model and template so that it
will show a parent item with children in the tree.

You can specify a `modelView` to use for the model. If you don't
specify one, it will default to the `Marionette.ItemView`.

```js
LeafView = Backbone.Marionette.ItemView.extend({
  template: "leaf-template"
});

CompositeView = Backbone.Marionette.CollectionView.extend({
  template: "leaf-template"
  modelView: LeafView,
  itemView: LeafView
});

new CompositeView({
  model: someModel,
  collection: someCollection
});
```

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

## Marionette.BindTo

The `BindTo` object provides event binding management and facilitates simple
event binding and unbinding for any object that extends from `Backbone.Events`.

Bind an event:

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

You can call `unbindAll` to unbind all events that were bound with the
`bindTo` method:

```js
binder.unbindAll();
```

## Backbone.Marionette.TemplateManager

The `TemplateManager` provides a cache for retrieving templates
from script blocks in your HTML. This will improve
the speed of subsequent calls to get a template.

### Basic Usage

To use the `TemplateManager`, call it directly. It is not
instantiated like other Marionette objects.

### Get A Template

Templates are retrieved by jQuery selector, by default, and
handed back to you via a callback method:

```js
Backbone.Marionette.TemplateManager.get("#my-template", function(template){
 // use the template here
});
```

Making multiple calls to get the same template will retrieve the
template from the cache on subsequence calls:

```js
var a, b, c;
Backbone.Marionette.TemplateManager.get("#my-template", function(tmpl){a = tmpl});
Backbone.Marionette.TemplateManager.get("#my-template", function(tmpl){b = tmpl});
Backbone.Marionette.TemplateManager.get("#my-template", function(tmpl){c = tmpl});
a === b === c; // => true
```

### Override Template Retrieval

The default template retrieval is to select the template contents
from the DOM using jQuery. If you wish to change the way this
works, you can override the `loadTemplate` method on the
`TemplateManager` object.

For example, if you want to load templates asynchronously from the
server, instead of from the DOM, you could replace `loadTemplate`
with a function like this:

```js
Backbone.Marionette.TemplateManager.loadTemplate = function(templateId, callback){
  var that = this;
  $.get(templateId + ".html", function(template){
    callback.call(this, template);
  });
}
```

This will use jQuery to asynchronously retrieve the template from
the server, and then store the retrieved template in the template
manager's cache.

### Clear Items From cache

You can clear one or more, or all items from the cache using the
`clear` method. Clearing a template from the cache will force it
to re-load from the DOM (or from the overridden `loadTemplate`
function) the next time it is retrieved.

If you do not specify any parameters, all items will be cleared
from the cache:

```js
Backbone.Marionette.TemplateManager.get("#my-template");
Backbone.Marionette.TemplateManager.get("#this-template");
Backbone.Marionette.TemplateManager.get("#that-template");

// clear all templates from the cache
Backbone.Marionette.TemplateManager.clear()
```

If you specify one or more parameters, these parameters are assumed
to be the `templateId` used for loading / caching:

```js
Backbone.Marionette.TemplateManager.get("#my-template");
Backbone.Marionette.TemplateManager.get("#this-template");
Backbone.Marionette.TemplateManager.get("#that-template");

// clear 2 of 3 templates from the cache
Backbone.Marionette.TemplateManager.clear("#my-template", "#this-template")
```

### Built In To ItemView

If you're using `Marionette.ItemView`, you don't need to manually
call the `TemplateManager`. Just specify the `template` attribute
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

## Backbone.Marionette Example Apps

There are several sample apps available.

### BBCloneMail

I'm building a medium sized app to demonstrate Backbone.Marionette. It's a simple
clone of a Gmail like interface, with email and contact management. There is no
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

### Quick & Dirty Sample

Here's a quick and dirty example to show how to use some of the pieces of
Marionette:

```js
// define the application
// options we pass in are copied on to the instance
MyApp = new Backbone.Marionette.Application({
  someOption: "some value";
});

// add a region to the app
myRegion = Backbone.Marionette.RegionManager.extend({
  el: "#my-region"
});
MyApp.addRegions({ myRegion: MyRegion });

// define some functionality for the app
(function(MyApp, Backbone){

  // a view to render into the region
  var SomeView = Backbone.View.extend({
    render: function(){

      // get "someOption" from the app, since we
      // passed it into the app initializer, above
      this.$el.html(MyApp.someOption);
    },

    doSomething: function(){
      // the application has an event aggregator on instantiation
      // call out to the event aggregator to raise an event
      MyApp.vent.trigger("something:happened");
    }
  });

  // an initializer to run this functional area 
  // when the app starts up
  MyApp.addInitializer(function(){
    var someView = new SomeView();
    MyApp.myRegion.show(someView);
    someView.doSomething();
  });

})(MyApp, Backbone);

// calling start will run all of the initializers
// this can be done from your JS file directly, or
// from a script block in your HTML
$(function(){
  MyApp.start();
});
```

## Compatibility And Requirements

Theses libraries are require for the use, development, testing and
documentation of Backbone.Marionette.

### Runtime Requirements

Backbone.Marionette currently works with the following versions of these 
libraries:

* Backbone v0.9.1
* Underscore v1.3.1
* jQuery v1.7.1

While support for Zepto and Enderjs has been added, it is not officially
tested against these libraries at this time.

Marionette has not been tested against any other versions of these
libraries. You may or may not have success if you use a version other
than what it listed here.

### Test Suite

Backbone.Marionette is also tested with the Jasmine JavaScript test utility,
using the Jasmine Ruby gem. 

To get the test suite up and running, you need a Ruby installation with the 
latest RubyGems. Install the 'bundler' gem and then run 'bundle install' from 
the project's root folder. Then run `rake jasmine` to run the test suite, and
load up http://localhost:8888 to see the test suite in action.

### Annotated Source Code

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code.

## Release Notes

### v0.4.5

* CollectionView closes existing child views before re-rendering itself, when "reset" 
event of collection is triggered
* CollectionView now has "initialEvents" method which configures its initial events
* ItemView now has "initialEvents" method which configures its initial events

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
  * now supports returning a jQuery deferred object from a view’s `render` method
  * now has a `close` method that you can call to close the current view
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