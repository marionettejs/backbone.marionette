# Backbone.Marionette

Make your Backbone.js apps dance with a composite application architecture!

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

* Sensible defaults, such as using Underscore templates for view rendering
* Easy to modify to make it work with your applicaton's specific needs
* Reduce boilerplate for views, with specialized view types
* Composite your application's visuals at runtime, with `Region` and `Layout`
* Nested views and layouts within visual regions
* Memory management and zombie killing built in to views, regions and layouts
* Built-in event clean up with the `EventBinder`
* Event-driven architecture with the `EventAggregator`
* Flexible, "as-needed" architecture allowing you to pick and choose what you need
* And much, much more

## Source Code And Downloads

You can download the raw source code from the "src" folder above, or grab one of the
many builds from the "lib" folder. 

To get the latest stable release, use these links which point to the 'master' branch's
builds:

### Standard Builds

* Development: [backbone.marionette.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.js)

* Production: [backbone.marionette.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.min.js)

### RequireJS (AMD) Builds

* Development: [backbone.marionette.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/amd/backbone.marionette.js)

* Production: [backbone.marionette.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/amd/backbone.marionette.min.js)

### Marionette.Async Add-on

* Development: [backbone.marionette.async.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.async.js)

* Production: [backbone.marionette.async.min.js](https://raw.github.com/derickbailey/backbone.marionette/master/lib/backbone.marionette.async.min.js)

See the [async.md](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.async.md)
documentation for more information.

### Available Packages

Marionette is unofficially available from various package
management systems, such as RubyGems, Node Package Manager,
Nuget, etc. These packages are maintained by the community
and are not part of the core Backbone.Marionette code.

##### [Available Packages](https://github.com/derickbailey/backbone.marionette/wiki/Available-packages)

## Donations

Marionette needs your support, but not everyone can offer assitance 
with code, bug submissions, and answering questions. If you're using 
Marionette and you're finding that it is saving you as much time and 
effort as I believe it does, then please consider financial support 
for the project. 

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7SJHYWJ487SF4)

## Documentation

The primary documentation is split up in to multiple files, due to the size
of the over-all documentation. You can find these files in the 
[/docs](https://github.com/derickbailey/backbone.marionette/tree/master/docs) folder, or use the links below to get straight to the
documentation for each peice of Marionette.

### Marionette's Pieces

These are the strings that you can pull to make your puppet dance:

* [**Backbone.Marionette.Application**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.application.md): An application object that starts your app via initializers, and more
* [**Backbone.Marionette.Application.module**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.application.module.md): Create modules and sub-modules within the application
* [**Backbone.Marionette.AppRouter**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.approuter.md): Reduce your routers to nothing more then configuration
* [**Backbone.Marionette.View**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.view.md): The base View type that other Marionette views extend from (not intended to be used directly)
* [**Backbone.Marionette.ItemView**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.itemview.md): A view that renders a single item
* [**Backbone.Marionette.CollectionView**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.collectionview.md): A view that iterates over a collection, and renders individual `ItemView` instances for each model
* [**Backbone.Marionette.CompositeView**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.compositeview.md): A collection view and item view, for rendering leaf-branch/composite model hierarchies
* [**Backbone.Marionette.Region**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.region.md): Manage visual regions of your application, including display and removal of content
* [**Backbone.Marionette.Layout**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.layout.md): A view that renders a layout and creates region managers to manage areas within it
* [**Backbone.Marionette.EventAggregator**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.eventaggregator.md): An extension of Backbone.Events, to be used as an event-driven or pub-sub tool
* [**Backbone.Marionette.EventBinder**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.eventbinder.md): An event binding manager, to facilitate binding and unbinding of events
* [**Backbone.Marionette.Renderer**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.renderer.md): Render templates with or without data, in a consistent and common manner
* [**Backbone.Marionette.TemplateCache**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.templatecache.md): Cache templates that are stored in `<script>` blocks, for faster subsequent access
* [**Backbone.Marionette.Callbacks**](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.callbacks.md): Manage a collection of callback methods, and execute them as needed

Please note that this is document is rather dry - it's meant to be a reference for
those that just need a reference. If you're looking for an introduction and/or 
examples on how to get started, please see [the Wiki](https://github.com/derickbailey/backbone.marionette/wiki).

### Async / Deferred Rendering Support

Support for asynchronously rendering views, loading templates, etc has been
removed from Marionette directly due to performance problems and overhead
incurred. To get async support in Marionette, then, you need to download and
include the the `backbone.marionette.async.js` or `async.min` file in 
your project. See the above download links and the the 
[async.md](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.async.md)
documentation for more information.

##### [View The Async Documentation](https://github.com/derickbailey/backbone.marionette/blob/master/docs/marionette.async.md)

### The Wiki: Sample Apps, Tutorials, And Much More

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

## Help Is Just A Click Away

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

### [Github Issues](//github.com/derickbailey/backbone.marionette/issues)

Report issues with Marionette, submit pull requests to fix problems, or to
create summarized and documented feature requests (preferably with pull
requests that implement the feature).

**Please don't ask questions or seek help in the issues list.** There are
other, better channels for seeking assistance, like StackOverflow and the
Google Groups mailing list.

### [DerickBailey.LosTechies.com](http://derickbailey.lostechies.com)

Lastly, I blog about Marionette on a regular basis, at my
LosTechies.com blog.

## Compatibility And Requirements

Theses libraries are required for the use, development, testing and
documentation of Backbone.Marionette.

### Runtime Requirements

Backbone.Marionette currently works with the following versions of these 
libraries:

* Backbone v0.9.2
* Underscore v1.3.3
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

### Annotated Source Code

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code.

## Release Notes

For change logs and release notes, see the
[changelog](https://github.com/derickbailey/backbone.marionette/blob/master/changelog.md) file.

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
