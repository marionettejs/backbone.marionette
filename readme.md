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

### Available Packages

Marionette is unofficially available from various package
management systems, such as RubyGems, Node Package Manager,
Nuget, etc. These packages are maintained by the community
and are not part of the core Backbone.Marionette code.

[Available Packages](https://github.com/derickbailey/backbone.marionette/wiki/Available-packages)

## Donations

Marionette needs your support, but not everyone can offer assitance 
with code, bug submissions, and answering questions. If you're using 
Marionette and you're finding that it is saving you as much time and 
effort as I believe it does, then please consider financial support 
for the project. 

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7SJHYWJ487SF4)

## Documentation And Support

The primary documentation has been moved in to a separate file [apidoc.md](https://github.com/derickbailey/backbone.marionette/blob/master/apidoc.md), in order to reduce the
file size and prevent rendering and formatting errors.

##### [View the documentation](https://github.com/derickbailey/backbone.marionette/blob/master/apidoc.md)

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

### Help With Code And Questions

If you're interested in helping with code and questions, please
see the issues list and stack overflow tag here:

* [Github Issues](//github.com/derickbailey/backbone.marionette/issues)
* [StackOverflow Tag](http://stackoverflow.com/questions/tagged/backbone.marionette)

If you have an idea to improve Marionette or want to report
a bug, please use the issues list.

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

### v0.8.5

* ** BREAKING CHANGES ** Region
  * Removed the ability to send a second parameter to a regions' "show" method
  * Changed the implementation of `Region` to allow easier overriding of how the new view is added to the DOM

* ** BREAKING CHANGES ** Layout
  * Regions specified within a layout are now available immediately after creating a layout instance

* BindTo:
  * The unbinding of an event now considers the `context` parameter when unbinding, allowing multiple handers to be bound to the same event from the same object, and unbinding only one of them

### v0.8.4

* Fixed: A call to `.module` will correctly pass the `Application` instance from which `.module` was called, as the second parameter of the module definition function

### v0.8.3

* Module definitions can be split across multiple files and/or multiple calls to define the module

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

#### Additional Changelogs

For older change logs and release notes, see the
[changelog](https://github.com/derickbailey/backbone.marionette/blob/master/changelog.md) file.

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
