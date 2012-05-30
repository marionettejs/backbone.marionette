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

For change logs and release notes, see the
[changelog](https://github.com/derickbailey/backbone.marionette/blob/master/changelog.md) file.

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
