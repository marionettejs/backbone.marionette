<h1 align="center">Backbone.Marionette</h1>
<p align="center">
  <img title="backbone marionette" src='https://cdn.mediacru.sh/6sNqngKFuqft.svg' />
</p>
<p align="center">The Backbone framework</p>
<p align="center">
  <a title='Build Status' href="https://travis-ci.org/marionettejs/backbone.marionette">
    <img src='https://secure.travis-ci.org/marionettejs/backbone.marionette.svg?branch=master' />
  </a>
  <a href='https://coveralls.io/r/marionettejs/backbone.marionette'>
    <img src='https://img.shields.io/coveralls/marionettejs/backbone.marionette.svg' alt='Coverage Status' />
  </a>
</p>

## About Marionette

Backbone.Marionette is a composite application library for Backbone.js that
aims to simplify the construction of large scale JavaScript applications.
It is a collection of common design and implementation patterns found in
applications.

## Documentation

All of the documentation for Marionette can be found at

##### [marionettejs.com/docs/current](http://marionettejs.com/docs/current)

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


## Marionette Inspector

<a href="https://github.com/marionettejs/marionette.inspector"><img src="http://i.imgur.com/B1q9QXH.jpg" align="center" /></a>

+ **Visualize** the view hierarchy with the UI tree
+ **Visualize** application activity with a full history of actions
+ **Inspect** view ui, events, listeners, properties
+ **Inspect** model attributes, listeners, properties
+ **Explore** Radio channel events, requests, commands
+ **Explore** application with an inspector magnifying glass
+ **Jump** between the inspector elements and source panel with intelligent links

Download at [Chrome Web Store](https://chrome.google.com/webstore/detail/marionette-inspector/fbgfjlockdhidoaempmjcddibjklhpka)  
Explore code at  [Github](https://github.com/marionettejs/marionette.inspector)

## Source Code and Downloads

You can download the latest builds directly from the "lib" folder above.
For more information about the files in this folder, or to obtain an archive
containing all Marionette dependencies (including Underscore, Backbone, etc.),
please visit [the downloads section on the website](http://marionettejs.com#download).

#### [MarionetteJS.com](http://marionettejs.com#download)

### Available Packages

Marionette is available via bower, npm, and component.io. There are other channels that are maintained by the community.


## Release Notes And Upgrade Guide

**Changelog**: For change logs and release notes, see the
[changelog](changelog.md) file.

**Upgrade Guide**: Be sure to read [the upgrade guide](upgradeGuide.md)
for information on upgrading to the latest version of Marionette.


### Annotated Source Code

The source code for Marionette is heavily documented.
You can read the annotations for all the details of how Marionette works, and advice on which methods to override.

##### [View the annotated source code](http://marionettejs.com/annotated-src/backbone.marionette)

## Compatibility and Requirements

MarionetteJS currently works with the following libraries:

* [jQuery](http://jquery.com) v1.8+
* [Underscore](http://underscorejs.org) v1.4.4 - 1.6.0
* [Backbone](http://backbonejs.org) v1.0.0 - 1.1.2 are preferred.
* [Backbone.Wreqr](https://github.com/marionettejs/backbone.wreqr) Comes automatically with the bundled build.
* [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter) Comes automatically with the bundled build.

Marionette has not been tested against any other versions of these
libraries. You may or may not have success if you use a version other
than what is listed here.


## How to Contribute

If you would like to contribute to Marionette's source code, please read
the [guidelines for pull requests and contributions](CONTRIBUTING.md).
Following these guidelines will help make your contributions easier to
bring into the next release.

### [Github Issues](//github.com/marionettejs/backbone.marionette/issues)

Report issues with Marionette, submit pull requests to fix problems, or to
create summarized and documented feature requests (preferably with pull
requests that implement the feature).
