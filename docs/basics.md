**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Common Marionette Concepts

This document covers the basic usage patterns and concepts across Marionette.
This includes things like calling conventions, setting attributes, common option
patterns etc.

## Documentation Index

* [Class-based Inheritance](#class-based-inheritance)
  * [Value Attributes](#value-attributes)
  * [Functions Returning Values](#functions-returning-values)
* [Setting Options](#setting-options)
  * [The `getOption` Method](#the-getoption-method)

## Class-based Inheritance

Backbone and Marionette utilize the `_.extend` function to simulate class-based
inheritance. All built-in classes, such as `Marionette.View`,
`Marionette.Object` and everything that extend these provide an `extend` method
for just this purpose.

In the below example, we create a new pseudo-class called `MyView`:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({});
```

You can now create instances of `MyView` with JavaScript's `new` keyword:

```javascript
var view = new MyView();
```

### Value Attributes

When we extend classes, we can set a form of class attributes by setting new
values to be a specific value by setting it when we extend our class:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  className: 'bg-success',

  template: '#template-identifier',

  regions: {
    myRegion: '.my-region'
  },

  modelEvents: {
    change: 'removeBackground'
  },

  removeBackground: function() {
    this.$el.removeClass('bg-success');
  }
});
```

When we instantiate `MyView`, each instance will be given a `.bg-success` class
with a `myRegion` region created on the `.my-region` element.

### Functions Returning Values

In almost every instance where we can set a value, we can also assign a function
to figure out the value at runtime. In this case, Marionette will run the
function on instantiating and use the returned value:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  className: function() {
    return this.model.successful() ? 'bg-success' : 'bg-error';
  },

  template: '#template-identifier',

  regions: function() {
    return {
      myRegion: '.my-region'
    };
  },

  modelEvents: function() {
    var wasSuccessful = this.model.successful();
    return {
      change: wasSuccessful ? 'removeBackground' : 'alert'
    };
  },

  removeBackground: function() {
    this.$el.removeClass('bg-success');
  },

  alert: function() {
    window.alert('model changed');
  }
});
```

As we can see, almost all of the attributes here can be worked out dynamically.
In most cases, Marionette will call the function once at instantiation, or first
render, and preserve the value throughout the lifetime of the View. There are
some exceptions to this rule - these will be referred to with their respective
documentation.

There are some exceptions to this general rule that will be documented in the
relevant places.

## Setting Options

Marionette can set options when you instantiate a class. This lets you override
many class-based attributes when you need to. You can also pass new information
specific to the object in question that it can access through special helper
methods.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend();

var view = new MyView({
  foo: 'some text'
});

view.checkOption();
```

### The `getOption` Method

To access an option, we use the `getOption` method.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  className: function() {
    var defaultClass = 'table';
    var extraClasses = this.getOption('extraClasses') || '';
    return defaultClass + ' ' + extraClasses;
  }
});

var myView = new MyView({
  model: new MyModel(),
  extraClasses: 'table-striped'
});
```

This only works for custom options - arguments that belong to the standard
Backbone/Marionette attributes, such as `model` and `collection`, are not
accessible via `getOption` and should be accessed as just `view.model` or
`view.collection`.
