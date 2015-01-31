## [View the new docs](http://marionettejs.com/docs/marionette.module.html)

# Marionette.Module

Marionette Modules allow you to create modular encapsulated logic.
They can be used to split apart large applications into multiple files,
and to build individual components of your app.

## Documentation Index

* [Basic Usage](#basic-usage)
* [Module Definitions](#module-definitions)
  * [Callback Function Definition](#callback-function-definition)
  * [Object Literal Definition](#object-literal-definition)
* [Module Classes](#module-classes)
* [Defining Sub-Modules](#defining-sub-modules)
* [Starting and Stopping Modules](#starting-and-stopping-modules)
* [Starting Modules](#starting-modules)
  * [Start Events](#start-events)
  * [Preventing Auto-Start Of Modules](#preventing-auto-start-of-modules)
  * [Starting Sub-Modules With Parent](#starting-sub-modules-with-parent)
* [Stopping Modules](#stopping-modules)
  * [Stop Events](#stop-events)
* [Module Initializers (deprecated)](#module-initializers)
* [Module Finalizers (deprecated)](#module-finalizers)


## Basic Usage

A module is defined directly from an Application object. To create a module all
you need to do is give it a name.

```js
var MyApp = new Backbone.Marionette.Application();

// Creates a new module named "MyModule"
var myModule = MyApp.module("MyModule");

myModule === MyApp.MyModule; // => true
```

Modules cannot be overwritten once they are created. Subsequent
calls to `module` with the same name argument will not create
a new module, but instead return the already-created instance.

```js
var MyApp = new Backbone.Marionette.Application();

// Instantiates a new Marionette.Module
var myModule = MyApp.module("MyModule");

// Returns the module you just created
var theSameModule = MyApp.module("MyModule");
```

## Module Definitions

You can provide a definition for your module when you instantiate it.
Definitions can either be a callback function or an object literal.

### Callback Function Definition

The callback function definition will be invoked immediately on calling
the `module` method.

It will receive 6 parameters, in this order:

* The module itself
* The Application object
* Backbone
* Backbone.Marionette
* jQuery
* Underscore
* Any custom arguments

Within the callback you can attach both private and public
functions and data directly to your module.

```js
MyApp.module("MyModule", function(MyModule, MyApp, Backbone, Marionette, $, _){

  // The context of the function is also the module itself
  this === MyModule; // => true

  // Private Data And Functions
  // --------------------------

  var myData = "this is private data";

  var myFunction = function(){
    console.log(myData);
  }


  // Public Data And Functions
  // -------------------------

  MyModule.someData = "public data";

  MyModule.someFunction = function(){
    console.log(MyModule.someData);
  }
});

console.log(MyApp.MyModule.someData); //=> public data
MyApp.MyModule.someFunction(); //=> public data
```

#### Additional Arguments

You can provide additional arguments to the definition
function, allowing you to import 3rd party libraries
and other resources that you want to have locally scoped to
your module.

Pass the additional arguments after the
definition itself in the call to `module`.

```js
MyApp.module("MyModule", function(MyModule, MyApp, Backbone, Marionette, $, _, Lib1, Lib2, LibEtc){

  // Lib1 === LibraryNumber1;
  // Lib2 === LibraryNumber2;
  // LibEtc === LibraryNumberEtc;

}, LibraryNumber1, LibraryNumber2, LibraryNumberEtc);
```

#### Splitting A Module Definition Apart

Sometimes a module definition can become quite long. You can split
apart the definition by making subsequent calls to the `module`
function.

This can used to split the definition of your module
across multiple files.

```js
MyApp.module("MyModule", function(MyModule){
  MyModule.definition1 = true;
});

// The following could be in a separate file
MyApp.module("MyModule", function(MyModule){
  MyModule.definition2 = true;
});

MyApp.MyModule.definition1; //=> true
MyApp.MyModule.definition2; //=> true
```

### Object Literal Definition

The object literal definition of a module allows for more flexibility
than the callback method. It allows you to, for instance, specify
a custom class for your module.

Through the object literal definition you can still set a definition
function through the `define` property.

```js
MyApp.module("MyModule", {
  define: function(MyModule, MyApp, Backbone, Marionette, $, _) {
    // Define your module here
  }
});
```

#### Specifying a Custom Module Class

One of the more useful features of the object literal definition is specifying a custom
module class. You can make a new class using the extend function.

```
var CustomModule = Marionette.Module.extend({
  // Custom module properties
});

MyApp.module("Foo", {
  moduleClass: CustomModule,
  define: function() {} // You can still use the definition function on custom modules
});
```

When `moduleClass` is omitted Marionette will default to instantiating a new `Marionette.Module`.

#### Initialize Function

Modules have an `initialize` function which is immediately called when the Module is invoked. You can think of the `initialize` function as an extension of the constructor.

The initialize function is only available through the object literal definition of a Module.

```js
MyApp.module("Foo", {
  startWithParent: false,
  initialize: function( moduleName, app, options ) {
    this.someProperty = 'someValue';
  },
  // You can still set a define function
  define: function( Foo ) {
    console.log( this.someProperty ); // Logs 'someValue'
  }
});
```

The `initialize` function is passed the same arguments as the constructor.
  * The moduleName
  * The app
  * The object literal definition of the Module itself (which allows you to pass arbitrary values to your Module)

```js
MyApp.module("Foo", {
  initialize: function( moduleName, app, options ) {
    console.log( options.someVar ); // Logs 'someString'
  },
  someVar: 'someString'
});
```

The initialize function is distinct from the `define` function. The primary difference between the two is that `initialize` is on the prototype chain, whereas `define` is not. What this means is that `initialize` can be inherited.

```js
var CustomModule = Marionette.Module.extend({
  define: function() {},    // This is not inherited and will never be called
  initialize: function() {} // This, on the other hand, will be inherited
});
```

## Module Classes

Module classes can be used as an alternative to the define pattern.

The extend function of a Module is identical to the extend functions on other Backbone and Marionette classes. This allows module lifecycle events like `onStart` and `onStop` to be called directly.

```
var FooModule = Marionette.Module.extend({
  startWithParent: false,

  initialize: function(options, moduleName, app) {
  },

  onStart: function(options) {
  },

  onStop: function(options) {
  },
});

MyApp.module("Foo", FooModule);
```

If all of the module's functionality is defined inside its class, then the class can be passed in directly. `MyApp.module("Foo", FooModule)`

## Defining Sub-Modules

Sub-Modules (or 'child' Modules) can be defined in a single call by passing
a period-separated list of Modules to be created.

```js
MyApp.module("Parent.Child.GrandChild");

MyApp.Parent; // => a valid module object
MyApp.Parent.Child; // => a valid module object
MyApp.Parent.Child.GrandChild; // => a valid module object
```

When defining sub-modules using the dot-notation, the
parent modules do not need to exist; they'll be created for you. If a parent
has already been instantiated then that instance will be used.

## Accessing Modules

Although modules are attached directly to the Application instance we don't recommend accessing them this way. Instead,
use the `.module()` function to access your modules.

Let's look at two examples of accessing a module named `MyModule.Submodule`.

```js
// Not recommended
var myModule = App.MyModule.Submodule;

// Recommended
var MyModule = App.module('MyModule.Submodule');
```

## Starting And Stopping Modules

Modules can be started and stopped independently of the application and
of each other. This allows them to be loaded asynchronously, and also allows
them to be shut down when they are no longer needed.

This also facilitates unit testing of modules as you can start only the
module that you need in your tests.

## Starting Modules

Modules will, by default, start with the parent application. They also have a
`.start` function that can be used to start a stopped module, or a module that's
been configured to start independently from its parent.

In this example, the module will exhibit the default behavior and start automatically
with the parent application object's `start` call:

```js
MyApp = new Backbone.Marionette.Application();

MyApp.module("Foo", function(){
  // module code goes here
});

MyApp.start();
```

Note that modules loaded after the `MyApp.start()` call will be
immediately started.

### Start Events

When starting a module, a "before:start" event will be triggered prior
to any of the initializers being run. A "start" event will then be
triggered after they have been run.

```js
var mod = MyApp.module("MyMod");

mod.on("before:start", function(){
  // do stuff before the module is started
});

mod.on("start", function(){
  // do stuff after the module has been started
});
```

#### Passing Data to Start Events

`.start` takes a single `options` parameter that will be passed to start events and their equivalent methods (`onStart` and `onBeforeStart`.)

```js
var mod = MyApp.module("MyMod");

mod.on("before:start", function(options){
  // do stuff before the module is started
});

mod.on("start", function(options){
  // do stuff after the module has been started
});

var options = {
 // any data
};
mod.start(options);
```

### Preventing Auto-Start Of Modules

The default behavior of modules is that they start with the application.
If you wish to manually start a module instead, you can change this behavior
with the `startWithParent` property.

```js
var fooModule = MyApp.module("Foo", function(){

  // prevent starting with parent
  this.startWithParent = false;

  // ... module code goes here
});

// start the app without starting the module
MyApp.start();

// later, start the module
fooModule.start();
```

The same behavior can be accomplished with the object literal definition:

```js
var fooModule = MyApp.module("Foo", {
  startWithParent: false
});
```

When splitting a module across multiple files, it is recommended that you set
`startWithParent` to be false.

### Starting Sub-Modules With Parent

As you might expect, submodules default to starting with their parent module.
 The starting of sub-modules is done in a depth-first hierarchy traversal.
That is, a hierarchy of `Foo.Bar.Baz` will start `Baz` first, then `Bar`,
and finally `Foo`.

```js
MyApp.module("Foo", function(){...});
MyApp.module("Foo.Bar", function(){...});

MyApp.start();
```

In this example, the "Foo.Bar" module will be started with the call to
`MyApp.start()` because the parent module, "Foo" is (by default) set to start
with the app.

A sub-module can override this behavior by setting its `startWithParent`
to false. This prevents it from being started by the parent's `start` call.

```js
MyApp.module("Foo", function(){...});

MyApp.module("Foo.Bar", function(){
  this.startWithParent = false;
})

MyApp.start();
```

Now the module "Foo" will be started, but the sub-module "Foo.Bar" will
not be started.

A sub-module can still be started manually, with this configuration:

```js
MyApp.module("Foo.Bar").start();
```

## Stopping Modules

A module can be stopped, or shut down, to clear memory and resources when
the module is no longer needed. Like the starting of modules, stopping is done
in a depth-first hierarchy traversal. That is, a hierarchy of modules like
`Foo.Bar.Baz` will stop `Baz` first, then `Bar`, and finally `Foo`.

To stop a module and its children, call the `stop` method of a module.

```js
MyApp.module("Foo").stop();
```

Modules are not automatically stopped by the application. If you wish to
stop one you must call the `stop` method on it, or stop its parent module.
When you stop any parent module, all of its children will be stopped as well.

```js
MyApp.module("Foo.Bar.Baz");

MyApp.module("Foo").stop();
```

This call to `stop` causes the `Bar` and `Baz` modules to both be stopped
as they are sub-modules of `Foo`. For more information on defining
sub-modules, see the section "Defining Sub-Modules".

### Stop Events

When stopping a module, a "before:stop" event will be triggered prior
to any of the finalizers being run. A "stop" event will then be triggered
after they have been run.

```js
var mod = MyApp.module("MyMod");

mod.on("before:stop", function(){
  // do stuff before the module is stopped
});

mod.on("stop", function(){
  // do stuff after the module has been stopped
});
```

### Module Initializers

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in version 3 of Marionette. Instead
> of Initializers, you should use events to manage start-up logic. The `start` event is an ideal
> substitute for Initializers.
>
> If you were relying on the deferred nature of Initializers in your app, you should instead
> use Promises. This might look something like the following:
>
> ```js
> doAsyncThings().then(myModule.start);
> ```
>

Modules, like `Application` objects, can be configured to have initializers. And just like
an Application's initializers, module's initializers are run anytime that
the module is started. Further, there is no limit to the number of initializers it can have.

Initializers can be added in the module's definition function.

```js
MyApp.module("Foo", function(Foo){

  Foo.addInitializer(function(){
    // Do things once the module has started
  });

  Foo.addInitializer(function(){
    // You can have more than one initializer
  });

});
```

### Module Finalizers

> Warning: deprecated
>
> This feature is deprecated, and is scheduled to be removed in version 3 of Marionette. Instead
> of Finalizers, you should use events to manage start-up logic. The `stop` event is an ideal
> substitute for Finalizers.
>
> If you were relying on the deferred nature of Initializers in your app, you should instead
> use Promises. This might look something like the following:
>
> ```js
> doAsyncThings().then(myModule.stop);
> ```
>
Modules also have finalizers that work in an opposite manner to
initializers: they are called whenever a module is stopped via the `stop` method.
You can have as many finalizers as you'd like.

```js
MyApp.module("Foo", function(Foo){

  Foo.addFinalizer(function(){
    // Tear down, shut down and clean up the module in here
  });

  Foo.addFinalizer(function(){
    // Do more things
  });

});
```
