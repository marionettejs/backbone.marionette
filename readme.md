<h1 align="center">Backbone.Marionette</h1>
<p align="center">
  <img title="backbone marionette" src='http://marionettejs.com/downloads/marionette-gh-banner.svg' />
</p>
<p align="center"> Make your Backbone.js apps dance!</p>
<p align="center">
  <a title='Build Status' href="https://travis-ci.org/marionettejs/backbone.marionette">
    <img src='https://secure.travis-ci.org/marionettejs/backbone.marionette.svg?branch=master' />
  </a>
</p>

## About Marionette

Backbone.Marionette is a composite application library for Backbone.js that
aims to simplify the construction of large scale JavaScript applications.
It is a collection of common design and implementation patterns found in
applications.

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
providing the framework for building a scalable application.

Like Backbone itself, you're not required to use all of Marionette just
because you want to use some of it. You can pick and choose which features
you want to use. This allows you to work with other Backbone
frameworks and plugins easily. It also means that you are not required
to engage in an all-or-nothing migration to begin using Marionette.

### Chat with us

Find us [on gitter](https://gitter.im/marionettejs/backbone.marionette) or on IRC in the FreeNode.net [#marionette channel](http://freenode.net).

We're happy to discuss design patterns and learn how you're using Marionette.


### Key Benefits

* Scalable: applications are built in modules, and with event-driven architecture
* Sensible defaults: Underscore templates are used for view rendering
* Easily modifiable: make it work with your application's specific needs
* Reduce boilerplate for views, with specialized view types
* Build on a modular architecture with an `Application` and modules that attach to it
* Compose your application's visuals at runtime, with the `Region` and `LayoutView` objects
* Nested views and layouts within visual regions
* Built-in memory management and zombie-killing in views, regions and layoutViews
* Event-driven architecture with `Backbone.Wreqr.EventAggregator`
* Flexible, "as-needed" architecture allowing you to pick and choose what you need
* And much, much more

## Source Code and Downloads

You can download the latest builds directly from the "lib" folder above.
For more information about the files in this folder, or to obtain an archive
containing all Marionette dependencies (including Underscore, Backbone, etc.),
please visit [the downloads section on the website](http://marionettejs.com#download).

#### [MarionetteJS.com](http://marionettejs.com#download)

### Available Packages

Marionette is available via bower, npm, and component.io. There are other channels that are maintained by the community.

##### [Available Packages](https://github.com/marionettejs/backbone.marionette/wiki/Available-packages)

## Release Notes And Upgrade Guide

**Changelog**: For change logs and release notes, see the
[changelog](changelog.md) file.

**Upgrade Guide**: Be sure to read [the upgrade guide](upgradeGuide.md)
for information on upgrading to the latest version of Marionette.

## Documentation

The primary documentation is split up into multiple files, due to the size
of the overall documentation. You can find these files in the
[/docs](docs) folder, or use the links below to get straight to the
documentation for each piece of Marionette.

### Annotated Source Code

In addition to this readme, the source code is documented
heavily and run through Docco as part of the build process.

You can read the annotations for all the details of how Marionette works, and advice on which methods to override.

##### [View the annotated source code](http://marionettejs.com/docs/backbone.marionette.html)

### Marionette's Pieces

**Views**

* [**Marionette.ItemView**](docs/marionette.itemview.md): A view that renders a single item
* [**Marionette.CollectionView**](docs/marionette.collectionview.md): A view that iterates over a collection, and renders individual `ItemView` instances for each model
* [**Marionette.CompositeView**](docs/marionette.compositeview.md): A collection view and item view, for rendering leaf-branch/composite model hierarchies
* [**Marionette.LayoutView**](docs/marionette.layoutview.md): A view that renders a layout and creates region managers to manage areas within it
* [**Marionette.View**](docs/marionette.view.md): The base View type that other Marionette views extend from (not intended to be used directly)

**Behaviors**

* [**Marionette.Behavior**](docs/marionette.behavior.md): an encapsulated `View` interaction layer that can be mixed into any `view`, helping to DRY up your view code.
* [**Marionette.Behaviors**](docs/marionette.behaviors.md): A helper class to glue your behaviors to your views.

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
* [**Marionette.Commands**](docs/marionette.application.md#commands): An extension of Backbone.Wreqr.Commands, a simple command execution framework
* [**Marionette.RequestResponse**](docs/marionette.application.md#request-response): An extension of Backbone.Wreqr.RequestResponse, a simple request/response framework
* [&rarr;] [**Backbone.Wreqr.EventAggregator**](https://github.com/marionettejs/backbone.wreqr): An event aggregator, to facilitate pub/sub and event architecture. Part of a suite of messaging based patterns
* [&rarr;] [**Backbone.Wreqr.Commands**](https://github.com/marionettejs/backbone.wreqr): A simple command execution system
* [&rarr;] [**Backbone.Wreqr.RequestResponse**](https://github.com/marionettejs/backbone.wreqr): A simple request/response system

**Other**

* [**Marionette.AppRouter**](docs/marionette.approuter.md): Reduce your routers to nothing more than configuration
* [**Marionette.Callbacks**](docs/marionette.callbacks.md): Manage a collection of callback methods, and execute them as needed
* [**Marionette.functions**](docs/marionette.functions.md): A suite of helper functions and utilities for implementing common Marionette behavior in your objects

## Compatibility and Requirements

MarionetteJS currently works with the following libraries:

* [jQuery](http://jquery.com) v1.8+
* [Underscore](http://underscorejs.org) v1.4.4 - 1.6.0
* [Backbone](http://backbonejs.org) v1.0.0 - 1.1.2 are preferred. v0.9.9 and v0.9.10 should work still
* [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr) Comes automatically with the bundled build.
* [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter) Comes automatically with the bundled build.

Marionette has not been tested against any other versions of these
libraries. You may or may not have success if you use a version other
than what it listed here.


## How to Contribute

If you would like to contribute to Marionette's source code, please read
the [guidelines for pull requests and contributions](CONTRIBUTING.md).
Following these guidelines will help make your contributions easier to
bring into the next release.

### [Github Issues](//github.com/marionettejs/backbone.marionette/issues)

Report issues with Marionette, submit pull requests to fix problems, or to
create summarized and documented feature requests (preferably with pull
requests that implement the feature).

## MIT License

Copyright (c) 2012-2014 Derick Bailey; Muted Solutions, LLC

Distributed under [MIT license](http://mutedsolutions.mit-license.org/).
