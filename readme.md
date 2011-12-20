Make your Backbone.js apps dance with a composite application architecture!

## Backbone.Marionette

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

## Marionette's Pieces

There are only a few pieces to the marionette at this point:

* **Backbone.Marionette.Application**
* **Backbone.Marionette.RegionManager**: Manage visual regions of your application, including display and removal of content
* **app.vent**: Every instance of `Application` comes with a `.vent` property, an event aggregator

Both `Application` and `RegionManager` use the `extend` syntax and functionality
from Backbone, allowing you to define new versions of these objects with custom
functionality.

## Building A Marionette Application

In spite of the few pieces (or perhaps, because of?), you can build a number of
very interesting things out of Marionette, easily. Each of these pieces can be
used individually or combined in different ways, to produce a very powerful and
flexibile system.

### Marionette Applications

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

### Region Managers

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

## Backbone.Marionette Example Apps

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
myRegion = Backbone.Marionette.Region.extend({
  el: "#my-region"
});
MyApp.addRegion(myRegion: MyRegion);

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

## Requirements

Backbone.Marionette is built and tested with the following libraries:

* Underscore.js v1.2.3
* Backbone.js v0.5.3
* jQuery v1.7.1

You may not need to be up to date with these exact versions. However, there is
no guarantee that the code will work correctly if you are not.

### Test Suite Requirements

Backbone.Marionette is also tested with the Jasmine JavaScript test utility,
using the Jasmine Ruby gem. 

To get the test suite up and running, you need a Ruby installation with the 
latest RubyGems. Install the 'bundler' gem and then run 'bunle install' from 
the project's root folder. Then run `rake jasmine` to run the test suite, and
load up http://localhost:8888 to see the test suite in action.

### Annotated Source Code Generation

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code.

## Release Notes

### v0.1.0

* Initial release
* Created documentation
* Generated annotated source code

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
