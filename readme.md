Make your Backbone.js apps dance, with a composite application architecture!

## Backbone.Marionette

Backbone.Marionette is a composite application libarary for Backbone.js that
aims to simplify the construction of large scale JavaScript application through
common design and implementation patterns found in composite application
architectures, such as Microsoft's "Prism" framework. 

Unlike other composite application frameworks, Backbone.Marionette is designed 
to be a lightweigt and flexible library of tools that you can use when you want 
to. Like Backbone.js itself, you're not required to use all of 
Backbone.Marionette just because you want to use some of it.

## Runtime Requirements

Backbone.Marionette is built and tested with the following libraries:

* Underscore.js v1.2.3
* Backbone.js v0.5.3
* jQuery v1.7.1

You may not need to be up to date with these exact versions. However, there is
no guarantee that the code will work correctly if you are not.

## An Example

A quick and dirty example to show how to build an app using Marionette.

````
// define the application
MyApp = new Backbone.Marionette.Application();

// add a region to the app
MyApp.MyRegion = Backbone.Marionette.Region.extend({
  el: "#my-region"
});

// define some functionality for the app
(function(MyApp, Backbone){

  // a view to render into the region
  var SomeView = Backbone.View.extend({
    render: function(){
      $(this.el).html("some content");
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
    this.MyRegion.show(someView);
    someView.doSomething();
  });

})(MyApp, Backbone);

// calling start will run all of the initializers
// this can be done from your JS file directly, or
// from a script block in your HTML
MyApp.start();
````

## Test Suite Requirements

Backbone.Marionette is also tested with the Jasmine JavaScript test utility,
using the Jasmine Ruby gem. 

To get the test suite up and running, you need a Ruby installation with the 
latest RubyGems. Install the 'bundler' gem and then run 'bunle install' from 
the project's root folder. Then run `rake jasmine` to run the test suite, and
load up http://localhost:8888 to see the test suite in action.

## Pre-Alpha Project

This project is still under initial development. The documentation is terrible
and the API will change drastically as it's being fleshed out for it's first 
few production apps. Use at your own risk.

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
