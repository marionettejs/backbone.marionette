# Backbone.Marionette

Make your Backbone.js apps dance!

[![Build Status](https://secure.travis-ci.org/marionettejs/backbone.marionette.png?branch=master)](http://travis-ci.org/marionettejs/backbone.marionette)


## About Marionette

Backbone.Marionette is a composite application library for Backbone.js that
aims to simplify the construction of large scale JavaScript applications. 
It is a collection of common design and implementation patterns found in 
the applications that I (Derick Bailey) have been building with Backbone, 
and includes various pieces inspired by composite application architectures, 
such as Microsoft's "Prism" framework. 

### App Architecture On Backbone's Building Blocks

Backbone provides a great set of building blocks for our JavaScript
applications. It gives us the core constructs that are needed to build
small apps, organize jQuery DOM events, or create single page apps that
support mobile devices and large scale enterprise needs. But Backbone is
not a complete framework. It's a set of building blocks. It leaves
much of the application design, architecture and scalability to the 
developer, including memory management, view management, and more.

Marionette brings an application architecture to Backbone, along with
built in view management and memory management. It's designed to be a 
lightweight and flexible library of tools that sits on top of Backbone, 
providing a framework for building scalable application.

Like Backbone itself, you're not required to use all of Marionette just 
because you want to use some of it. You can pick and choose which features 
you want to use, when. This allows you to work with other Backbone 
frameworks and plugins very easily. It also means that you are not required
to engage in an all-or-nothing migration to begin using Marionette.

### Key Benefits

* Scale applications out with modular, event driven architecture
* Sensible defaults, such as using Underscore templates for view rendering
* Easy to modify to make it work with your application's specific needs
* Reduce boilerplate for views, with specialized view types
* Build on a modular architecture with an `Application` and modules that attach to it
* Compose your application's visuals at runtime, with `Region` and `Layout`
* Nested views and layouts within visual regions
* Built-in memory management and zombie killing in views, regions and layouts
* Event-driven architecture with `Backbone.Wreqr.EventAggregator`
* Flexible, "as-needed" architecture allowing you to pick and choose what you need
* And much, much more

## Source Code And Downloads

You can download the latest builds directly from the "lib" folder above.  
For more information about the files in this folder, or to obtain an archive
containing all Marionette dependencies (including Underscore, Backbone, etc),
please see [the downloads section on the website](http://marionettejs.com#download).

#### [MarionetteJS.com](http://marionettejs.com#download)

### Available Packages

Marionette is unofficially available from various package
management systems, such as RubyGems, Node Package Manager,
Nuget, etc. These packages are maintained by the community
and are not part of the core Backbone.Marionette code.

##### [Available Packages](https://github.com/marionettejs/backbone.marionette/wiki/Available-packages)

## Release Notes And Upgrade Guide

**Changelog**: For change logs and release notes, see the
[changelog](changelog.md) file.

**Upgrade Guide**: Be sure to read [the upgrade guide](upgradeGuide.md)
for information on upgrading to the latest version of Marionette.

## Documentation

The primary documentation is split up in to multiple files, due to the size
of the over-all documentation. You can find these files in the 
[/docs](docs) folder, or use the links below to get straight to the
documentation for each piece of Marionette.

### Annotated Source Code

In addition to this readme, I've commented the source code quite
heavily and run it through Docco as part of my build process.
This produces a nicely formatted, annotated source code as documentation
file.

You can read the annotated for all the detail of how Marionette works, and advice on which methods to override when.

##### [View the annotated source code](http://marionettejs.com/docs/backbone.marionette.html)

### Marionette Configuration

Marionette provides a few globally configurable settings, such as which
DOM library to use (jQuery by default). You can find out more about which
settings will change Marionette in the [configuration
documentation](docs/marionette.configuration.md).

### Marionette's Pieces

These are the strings that you can pull to make your puppet dance.
If you're looking for an introduction and/or 
examples on how to get started, please see [the Wiki](https://github.com/marionettejs/backbone.marionette/wiki).

**Views**

* [**Marionette.ItemView**](docs/marionette.itemview.md): A view that renders a single item
* [**Marionette.CollectionView**](docs/marionette.collectionview.md): A view that iterates over a collection, and renders individual `ItemView` instances for each model
* [**Marionette.CompositeView**](docs/marionette.compositeview.md): A collection view and item view, for rendering leaf-branch/composite model hierarchies
* [**Marionette.Layout**](docs/marionette.layout.md): A view that renders a layout and creates region managers to manage areas within it
* [**Marionette.View**](docs/marionette.view.md): The base View type that other Marionette views extend from (not intended to be used directly)

**View Management**

* [**Marionette.Region**](docs/marionette.region.md): Manage visual regions of your application, including display and removal of content
* [**Marionette.RegionManager**](docs/marionette.regionmanager.md): Manage a group of related Regions
* [**Marionette.Renderer**](docs/marionette.renderer.md): Render templates with or without data, in a consistent and common manner
* [**Marionette.TemplateCache**](docs/marionette.templatecache.md): Cache templates that are stored in `<script>` blocks, for faster subsequent access
* [&rarr;] [**Backbone.BabySitter**](https://github.com/marionettejs/backbone.babysitter): Manage child views for your Backbone.View (and other parents)

**Application Infrastructure**

* [**Marionette.Application**](docs/marionette.application.md): An application object that starts your app via initializers, and more
* [**Marionette.Module**](docs/marionette.application.module.md): Create modules and sub-modules within the application
* [**Marionette.Controller**](docs/marionette.controller.md): A general purpose object for controlling modules, routers, view, and implementing a mediator pattern

**Object-Messaging Infrastructure**

* [**Marionette.Commands**](docs/marionette.commands.md): An extension of Backbone.Wreqr.Commands, a simple command execution framework
* [**Marionette.RequestResponse**](docs/marionette.requestresponse.md): An extension of Backbone.Wreqr.RequestResponse, a simple request/response framework
* [&rarr;] [**Backbone.Wreqr.EventAggregator**](https://github.com/marionettejs/backbone.wreqr): An event aggregator, to facilitate pub/sub and event architecture. Part of a suite of messaging based patterns
* [&rarr;] [**Backbone.Wreqr.Commands**](https://github.com/marionettejs/backbone.wreqr): A simple command execution system
* [&rarr;] [**Backbone.Wreqr.RequestResponse**](https://github.com/marionettejs/backbone.wreqr): A simple request/response system

**Other**

* [**Marionette.AppRouter**](docs/marionette.approuter.md): Reduce your routers to nothing more than configuration
* [**Marionette.Callbacks**](docs/marionette.callbacks.md): Manage a collection of callback methods, and execute them as needed
* [**Marionette.functions**](docs/marionette.functions.md): A suite of helper functions and utilities for implementing common Marionette behavior in your objects

**Deprecated Items**

* [&rarr;] [**Backbone.EventBinder**](https://github.com/marionettejs/backbone.eventbinder): Deprecated w/ Backbone v0.9.9 and higher. An event binding manager for Backbone v0.9.2, to facilitate binding and unbinding of events

### The Wiki: Sample Apps, Tutorials, And Much More

A wiki is an important aspect of a thriving community, as it provides
a place for the community to contribute ideas, examples, answer
frequently asked questions, and more. If you're looking for
community-driven information, examples that go beyond the
dry technical documentation, or want to contribute your own
ideas and examples to the community, please see the wiki page.

##### [View The Marionette Wiki](https://github.com/marionettejs/backbone.marionette/wiki)

## Compatibility And Requirements

MarionetteJS currently works with the following libraries:

* [jQuery](http://jquery.com) v1.8.x or v1.9.x
* [Underscore](http://underscorejs.org) v1.4.4
* [Backbone](http://backbonejs.org) v1.0 is preferred. v0.9.9 and v0.9.10 should work still
* [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr) 
* [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter)

Marionette has been tested against any other versions of these
libraries in the past, but is only tested against the latest versions
at this time. You may or may not have success if you use a version other
than what it listed here.

While support for Zepto and Enderjs has been added, it is not officially
tested against these libraries at this time.

### Deferred/Promise Objects

Marionette makes use of jQuery's [Deferred](http://api.jquery.com/category/deferred-object/)
objects and, as such, will need supported methods in replacement libraries.
Zepto users can use @Mumakil's [Standalone-Deferred](https://github.com/Mumakil/Standalone-Deferred)
or @sudhirj's [simply-deferred](https://github.com/sudhirj/simply-deferred).
Enderjs users, please let us know of how you solve any compatibility issues.

Marionette no longer relies on [Backbone.EventBinder](https://github.com/marionettejs/backbone.eventbinder).
Backbone.Events, as of v0.9.9, supersedes this library with its
`listenTo` and `stopListening` methods. See [the upgrade guide](upgradeGuide.md)
for more information.

## Donations

Marionette needs your support, but not everyone can offer assistance 
with code, bug submissions, and answering questions. If you're using 
Marionette and you're finding that it is saving you as much time and 
effort as I believe it does, then please consider financial support 
for the project. 

**Please see the footer of [MarionetteJS.com](http://marionettejs.com) 
for links to donate.**

## How To Contribute

If you would like to contribute to Marionette's source code, please read
the [guidelines for pull requests and contributions](CONTRIBUTING.md).
Following these guidelines will help make your contributions easier to
bring in to the next release.

## Help Is Just A Click Away

### #Marionette on FreeNode.net IRC

Join the `#marionette` channel on [FreeNode.net](http://freenode.net) to ask questions and get help.

### [Google Group Mailing List](https://groups.google.com/forum/#!forum/backbone-marionette)

Get announcements for new releases, share your projects and ideas that are
using Marionette, and join in open-ended discussion that does not fit in
to the Github issues list or StackOverflow Q&A.

**For help with syntax, specific questions on how to implement a feature
using Marionette, and other Q&A items, use StackOverflow.**

### [StackOverflow](http://stackoverflow.com/questions/tagged/backbone.marionette)

Ask questions about using Marionette in specific scenarios, with
specific features. For example, help with syntax, understanding how a feature works and
how to override that feature to do what you need or how to organize the
different view types to work best with your applications needs.

Questions on StackOverflow often turn in to blog posts and wiki entries.

### [Github Issues](//github.com/marionettejs/backbone.marionette/issues)

Report issues with Marionette, submit pull requests to fix problems, or to
create summarized and documented feature requests (preferably with pull
requests that implement the feature).

**Please don't ask questions or seek help in the issues list.** There are
other, better channels for seeking assistance, like StackOverflow and the
Google Groups mailing list.

### [DerickBailey.LosTechies.com](http://derickbailey.lostechies.com)

Lastly, I blog about Marionette on a regular basis, at my
LosTechies.com blog.

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Derick Bailey; Muted Solutions, LLC

Distributed under [MIT license](http://mutedsolutions.mit-license.org/).
