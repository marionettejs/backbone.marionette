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

Note that if you return a custom module from your module 
definitions, the last module definition to return, wins.

```js
MyApp.module("MyModule", function(MyModule){
  a = {};

  a.foo = "bar";

  return a;
});

MyApp.module("MyModule", function(MyModule){
  b = {};

  b.foo = "I'm overriding you!";

  return b;
});

MyApp.MyModule.foo; //=> "I'm overriding you!"
```

