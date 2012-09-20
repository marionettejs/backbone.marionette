# Marionette.Application.module

Marionette allows you to define a module within your application,
including sub-modules hanging from that module. This is useful for creating 
modular, encapsulated applications that are be split apart in to multiple 
files.

Marionette's module allow you to have unlimited sub-modules hanging off
your application, and serve as an event aggregator in themselves.

## Basic Usage

A module is defined directly from an Application object as the specified
name:

```js
var MyApp = new Backbone.Marionette.Application();

var myModule = MyApp.module("MyModule");

MyApp.MyModule; // => a new Marionette.Application object

myModule === MyApp.MyModule; // => true
```

If you specify the same module name more than once, the
first instance of the module will be retained and a new
instance will not be created.

## Starting And Stopping Modules

Modules can be started and stopped independently of the application and
of each other. This allows them to be loaded asynchronously, and also allows
them to be shut down when they are no longer needed. This also facilitates
easier unit testing of modules in isolation as you can start only the
module that you need in your tests.

### Starting Modules

Starting a module is done in one of two ways:

1. Automatically with the parent application's `.start()` method
2. Manually call the `.start()` method on the module

In this example, the module will be started automatically with the parent
application object's `start` call:

```js
MyApp = new Backbone.Marionette.Application();

MyApp.module("Foo", function(){

  // module code goes here

});

MyApp.start();
```

Note that modules loaded and defined after the `app.start()` call will still
be started automatically.

### Preventing Auto-Start Of Modules

If you wish to manually start a module instead of having the application
start it, you can tell the module definition not to start with the app:

```js
var fooModule = MyApp.module("Foo", {
  startWithApp: false,

  define: function(){
    // module code goes here
  }
});

// later, start the module
fooModule.start();
```

Note the use of an object literal instead of just a function to define
the module, and the presence of the `startWithApp` attribute, to tell it
not to start with the application.

Then to start the module, the module's `start` method is manually called.
You can also grab a reference to the module at a later point in time, to
start it:

```js
MyApp.module("Foo", {
  startWithApp: false,
  define: function(){ /*...*/ }
});

// start the module by getting a reference to it first
MyApp.module("Foo").start();
```

### Auto-start Of Sub-Modules

Submodules default to the `startWithApp` setting that a parent module
has defined.

```js
MyApp.module("Foo", {
  startWithApp: false,
  define: function(){ /*...*/ }
});

MyApp.module("Foo.Bar", function(){...});

MyApp.start();
```

In this example, the "Foo.Bar" module will not be started with the call to
`MyApp.start()` because the parent module, "Foo", has specified not to start
with the app.

A sub-module can override this behavior, though.

```js
MyApp.module("Foo", {
  startWithApp: false,
  define: function(){ /*...*/ }
});

MyApp.module("Foo.Bar", {
  startWithApp: true,
  define: function(){...}
})

MyApp.start();
```

Now the sub-module "Foo.Bar" will be started with the call to `MyApp.start()`.

The inverse is also true. If a parent module starts with the app, then a
child module can specify not to.

```js
MyApp.module("Foo", function(){ /*...*/ });

MyApp.module("Foo.Bar", {
  startWithApp: false,
  define: function(){...}
})

MyApp.start();
```

In this example, the sub-module "Foo.Bar" will not be started when the
parent module is started. "Foo.Bar" must be started manually.

### Stopping Modules

A module can be stopped, or shut down, to clear memory and resources when
the module is no longer needed. This is done with the `stop` method
on modules.

```js
MyApp.module("Foo").stop();
```

Modules are not automatically stopped by the application. If you wish to 
stop one, you must call the `stop` method on it. The exception to this is
that stopping a parent module will stop all of it's sub-modules.

```js
MyApp.module("Foo.Bar.Baz");

MyApp.module("Foo").stop();
```

This call to `stop` causes the `Bar` and `Baz` modules to both be stopped
as they are sub-modules of `Foo`. For more information on defining
sub-modules, see the next section: "Defining Sub-Modules With . Notation".

## Defining Sub-Modules With . Notation

Sub-modules or child modules can be defined as a hierarchy of modules and 
sub-modules all at once:

```js
MyApp.module("Parent.Child.GrandChild");

MyApp.Parent; // => a valid module object
MyApp.Parent.Child; // => a valid module object
MyApp.Parent.Child.GrandChild; // => a valid module object
```

When defining sub-modules using the dot-notation, the 
parent modules do not need to exist. They will be created
for you if they don't exist. If they do exist, though, the
existing module will be used instead of creating a new one.

## Module Definitions

You can specify a callback function to provide a definition
for the module. Module definitions are invoked immediately
on calling `module` method. 

The module definition callback will receive 6 parameters:

* The module itself
* The Parent module, or Application object that `.module` was called from
* Backbone
* Backbone.Marionette
* jQuery
* Underscore
* Any custom arguments

You can add functions and data directly to your module to make
them publicly accessible. You can also add private functions
and data by using locally scoped variables.

```js
MyApp.module("MyModule", function(MyModule, MyApp, Backbone, Marionette, $, _){

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

### Module Initializers

Modules have initializers, similarly to `Application` objects. A module's
initializers are run when the module is started.

```js
MyApp.module("Foo", function(Foo){

  Foo.addInitializer(function(){
    // initialize and start the module's running code, here.
  });

});
```

Any way of starting this module will cause it's initializers to run. You
can have as many initializers for a module as you wish.

### Module Finalizers

Modules also have finalizers that are run when a module is stopped.

```js
MyApp.module("Foo", function(Foo){

  Foo.addFinalizer(function(){
    // tear down, shut down and clean up the module, here
  });

});
```

Calling the `stop` method on the module will run all that module's 
finalizers. A module can have as many finalizers as you wish.

## The Module's `this` Argument

The module's `this` argument is set to the module itself.

```js
MyApp.module("Foo", function(Foo){
  this === Foo; //=> true
});
```

## Custom Arguments

You can provide any number of custom arguments to your module, after the
module definition function. This will allow you to import 3rd party
libraries, and other resources that you want to have locally scoped to
your module.

```js
MyApp.module("MyModule", function(MyModule, MyApp, Backbone, Marionette, $, _, Lib1, Lib2, LibEtc){

  // Lib1 === LibraryNumber1;
  // Lib2 === LibraryNumber2;
  // LibEtc === LibraryNumberEtc;

}, LibraryNumber1, LibraryNumber2, LibraryNumberEtc);
```

## Splitting A Module Definition Apart

Sometimes a module gets to be too long for a single file. In
this case, you can split a module definition across multiple
files:

```js
MyApp.module("MyModule", function(MyModule){
  MyModule.definition1 = true;
});

MyApp.module("MyModule", function(MyModule){
  MyModule.definition2 = true;
});

MyApp.MyModule.definition1; //=> true
MyApp.MyModule.definition2; //=> true
```
