Make your Backbone.js apps dance with a composite application architecture!

# Backbone.Marionette

Backbone.Marionette is a composite application libarary for Backbone.js that
aims to simplify the construction of large scale JavaScript application through
common design and implementation patterns found in composite application
architectures, such as Microsoft's "Prism" framework. 

Unlike other composite application frameworks, Backbone.Marionette is designed 
to be a lightweigt and flexible library of tools that you can use when you want 
to. Like Backbone.js itself, you're not required to use all of 
Backbone.Marionette just because you want to use some of it.

## Download And Annotated Source Code

You can download the raw source code above. For the development version, grab
"backbone.marionette.js". For the production version, grab
"backbone.marionette.min.js".

For a good time, call.. err... read through [the annotated source code](http://derickbailey.github.com/backbone.marionette/docs/backbone.marionette.html).

# Marionette's Pieces

These are the strings that you can pull to make your puppet dance:

* **Backbone.Marionette.Application**: An application object that starts your app via initializers, and more
* **Backbone.Marionette.AppRouter**: Reduce your routers to nothing more then configuration
* **Backbone.Marionette.ItemView**: A view that renders a single item
* **Backbone.Marionette.CollectionView**: A view that iterates over a collection, and renders individual `ItemView` instances for each model
* **Backbone.Marionette.RegionManager**: Manage visual regions of your application, including display and removal of content
* **Backbone.Marionette.BindTo**: An event binding manager, to facilitate binding and unbinding of events
* **Backbone.Marionette.TemplateManager**: Cache templates that are stored in `<script>` blocks, for faster subsequent access
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

These callbacks will be executed when you start your application. The `options`
parameters is passed through the `start` method (see below).

### Application Events

The `Application` object raises a few events during its lifecycle. These events
can be used to do additional processing of your application. For example, you
may want to pre-process some data just before initialization happens. Or you may
want to wait until your entire application is initialized to start the
`Backbone.history`.

The two events that are currently triggered, are:

* **"initialize:before"**: fired just before the initializers kick off
* **"initialize:after"**: fires just after the initializers have finished

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
Backbone applications, see the blog post: [References, Routing, and The Event
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

App routers can only take one `controller` object as a parameter to the contructor.

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

It is reocmmended that you divide your controller objects in to smaller peices of related functionality
and have multiple routers / controllers, instead of just one giant router and controller.

## Marionette.RegionManager

Regions can be added to the application by calling the `addRegions` method on
your application instance. This method expects a single hash parameter, with
named regions and either jQuery selectors or `RegionManager` objects. You may
call this method as many times as you like, and it will continue adding regions
to the app. If you specify the same name twice, last one in wins.

```js
MyApp.addRegions({
  mainRegion: "#main-content",
  navigationRegion: "#navigation"
});

var FooterRegion = Backbone.Marionette.RegionManager.extend({
  el: "#footer"
});

MyApp.addRegions({footerRegion: FooterRegion});
```

Note that if you define your own `RegionManager` object, you must provide an
`el` for it. If you don't, you will receive an runtime exception saying that
an `el` is required.

Additionally, when you pass a `RegionManager` directly into to the `addRegions`
method, you must specify the constructor function for your region manager, not
an instance of it.

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
* remove `this.el` from teh DOM
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

After the view has been rendered, a `onRender` method will be called.
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

### CollectionView: Add / Remove Items

The collection view binds to the "add" and "remove" events of the
collection that is specified. It will render any model that is
added to the collection and add to the DOM automatically. It will
also close any view for a model that is removed from the collection.

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
* remove `this.el` from teh DOM
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

# Backbone.Marionette.TemplateManager

The `TemplateManager` provides a cache for retrieving templates
from script blocks in your HTML. This will improve
the speed of subsequent calls to get a template.

## Basic Usage

To use the `TemplateManager`, call it directly. It is not
instantiated like other Marionette objects.

## Get A Template

Templates are retrieved by jQuery selector, by default:

```js
Backbone.Marionette.TemplateManager.get("#my-template");
```

Making multiple calls to get the same template will retrieve the
template from the cache on subsequence calls:

```js
Backbone.Marionette.TemplateManager.get("#my-template");
Backbone.Marionette.TemplateManager.get("#my-template");
Backbone.Marionette.TemplateManager.get("#my-template");
```

## Override Template Retrieval

The default template retrieval is to select the template contents
from the DOM using jQuery. If you wish to change the way this
works, you can override the `loadTemplate` method on the
`TemplateManager` object.

For example, if you want to load templates asychronously from the
server, instead of from the DOM, you could replace `loadTemplate`
with a function like this:

```js
Backbone.Marionette.TemplateManager.loadTemplate = function(templateId){
  var that = this;
  $.get(templateId + ".html", function(template){
    // store the template in the cache.
    that.templates[templateId] = template;
  });
}
```

This will use jQuery to asynchronously retrieve the template from
the server, and then store the retrieved template in the template
manager's cache (be sure to use the `templateId` parameter as the 
key for the cache).

## Clear Items From cache

You can clear one or more, or all items from the cache using the
`clear` method. Clearing a template from the cache will force it
to re-load from the DOM (or from the overriden `loadTemplate`
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

## Built In To ItemView

If you're using `Marionette.ItemView`, you don't need to manually
call the `TemplateManager`. Just specify the `template` attribute
of your view as a jQuery selector, and the `ItemView` will use 
the template manager by default.

# Backbone.Marionette Example Apps

There are several sample apps available.

## BBCloneMail

I'm building a medium sized app to demonstrate Backbone.Marionette. It's a simple
clone of a GMail like interface, with email and contact management. There is no
back end for data, currently. The sample app does run on top of Ruby and
Sinatra, but all the data is hard coded into the HTML/JavaScript right now.

You can find BBCloneMail online at:

http://bbclonemail.heroku.com

And you can find the source code at:

http://github.com/derickbailey/bbclonemail

## Steve Gentile' Contact Manager

Steve Gentile is building two versions of the same contact manager app. One of
them runs on NodeJS as a back-end, and the other runs on ASP.NET MVC as the
back-end.

The NodeJS version is here:

https://github.com/sgentile/BackboneNodeContacts

And the ASP.NET MVC version is here:

https://github.com/sgentile/BackboneContacts

## Quick & Dirty Sample

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
      $(this.el).html(MyApp.someOption);
    },

    doSomething: function(){
      // the applicaiton has an event aggregator on instantiation
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

# Requirements

Backbone.Marionette is built and tested with the following libraries:

* Underscore.js v1.2.3
* Backbone.js v0.5.3
* jQuery v1.7.1

You may not need to be up to date with these exact versions. However, there is
no guarantee that the code will work correctly if you are not.

## Test Suite Requirements

Backbone.Marionette is also tested with the Jasmine JavaScript test utility,
using the Jasmine Ruby gem. 

To get the test suite up and running, you need a Ruby installation with the 
latest RubyGems. Install the 'bundler' gem and then run 'bunle install' from 
the project's root folder. Then run `rake jasmine` to run the test suite, and
load up http://localhost:8888 to see the test suite in action.

## Annotated Source Code Generation

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code.

# Release Notes

## v0.2.5

* Added `AppRouter`, to reduce boilerplate routers down to simple configuration
* `CollectionView` can be treated as a composite view, rendering an `model` and a `collection` of models
* Now works with either jQuery, Zepto, or enter.js

## v0.2.4

* Return `this` (the view itself) from `ItemView` and `CollectionView` `render` method
* Call `onRender` after the `CollectionView` has rendered itself

## v0.2.3

* Fixed global variable leaks
* Removed declared, but unused variables

## v0.2.2

* Fixed binding events in the collection view to use `bindTo` (#6)
* Updated specs for collection view
* Documentation fixes (#7)

## v0.2.1

* Added `TemplateManager` to cache templates
* CollectionView binds to add/remove and updates rendering appropriately
* ItemView uses `TemplateManager` for template retrieval
* ItemView and CollectionView set `this.el = $(this.el)` in constructor

## v0.2.0

* Added `ItemView`
* Added `CollectionView`
* Added `BindTo`
* Simplified the way `extend` is pulled from Backbone

## v0.1.0

* Initial release
* Created documentation
* Generated annotated source code

# Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
