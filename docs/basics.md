# Common Marionette Concepts

This document covers the basic usage patterns and concepts across Marionette.
This includes things like calling conventions, setting attributes, common option
patterns etc.

## Documentation Index

* [Class-based Inheritance](#class-based-inheritance)
  * [Value Attributes](#value-attributes)
  * [Functions Returning Values](#functions-returning-values)
  * [Binding Attributes on Instantiation](#binding-attributes-on-instantiation)
* [Setting Options](#setting-options)
  * [The `getOption` Method](#the-getoption-method)
  * [The `mergeOptions` Method](#the-mergeoptions-method)

## Class-based Inheritance

Backbone and Marionette utilize the `_.extend` function to simulate class-based
inheritance. All built-in classes, such as `Marionette.View`,
`Marionette.Object` and everything that extend these provide an `extend` method
for just this purpose.

In the example below, we create a new pseudo-class called `MyView`:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({});
```

You can now create instances of `MyView` with JavaScript's `new` keyword:

```javascript
var view = new MyView();
```

### Value Attributes

When we extend classes, we can provide class attributes with specific values by
defining them in the object we pass as the `extend` parameter:

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

[Live example](https://jsfiddle.net/marionettejs/k93pejyb/)

When we instantiate `MyView`, each instance will be given a `.bg-success` class
with a `myRegion` region created on the `.my-region` element.

### Functions Returning Values

In almost every instance where we can set a value, we can also assign a function
to figure out the value at runtime. In this case, Marionette will run the
function on instantiation and use the returned value:

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
    console.log('model changed');
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/nn1754fc/)

As we can see, almost all of the attributes here can be worked out dynamically.
In most cases, Marionette will call the function once at instantiation, or first
render, and preserve the value throughout the lifetime of the View. There are
some exceptions to this rule - these will be referred to with their respective
documentation.

### Function Context

When using functions to set attributes, Marionette will assign the instance of
your new class as `this`. You can use this feature to ensure you're able to
access your object in cases where `this` isn't what you might expect it to be.
For example, the value or result of
[`templateContext`](./template.md#template-context) is
[bound to its data object](./template.md#binding-of-this) so using a
function is the only way to access the view's context directly.

### Binding Attributes on Instantiation

In Marionette, most attributes can be bound on class instantiation in addition
to being set when the [class is defined](#class-based-inheritance). You can use
this to bind events, triggers, models, and collections at runtime:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: '#template-identifier'
});

var myView = new MyView({
  triggers: {
    'click a': 'show:link'
  }
});
```

This will set a trigger called `show:link` that will be fired whenever the user
clicks an `<a>` inside the view.

Options set here will override options set on class definition. So, for example:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: '#template-identifier',

  triggers: {
    'click @ui.save': 'save:form'
  }
});

var myView = new MyView({
  triggers: {
    'click a': 'show:link'
  }
});
```

In this example, the trigger for `save:form` will no longer be fired, as the
trigger for `show:link` completely overrides it.

## Setting Options

Marionette can set options when you instantiate a class. This lets you override
many class-based attributes when you need to. You can also pass new information
specific to the object in question that it can access through special helper
methods.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  checkOption: function() {
    console.log(this.getOption('foo'));
  }
});

var view = new MyView({
  foo: 'some text'
});

view.checkOption();  // prints 'some text'
```

[Live example](https://jsfiddle.net/marionettejs/6n02ex1m/)

### The `getOption` Method

To access an option, we use the `getOption` method. `getOption` will fall back
to the value defined on the instance of the same name if not defined in the options.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  className: function() {
    var defaultClass = this.getOption('defaultClass');
    var extraClasses = this.getOption('extraClasses');
    return [defaultClass, extraClasses].join(' ');
  },
  defaultClass: 'table'
});

var myView = new MyView({
  model: new MyModel(),
  extraClasses: 'table-striped'
});
```

[Live example](https://jsfiddle.net/marionettejs/ekvb8wwa/)

### The `mergeOptions` Method

The `mergeOptions` method takes two arguments: an `options` object and `keys` to
pull from the options object. Any matching `keys` will be merged onto the
class instance. For example:

```javascript
var Bb = require('backbone');
var Mn = require('backbone.marionette');

var MyObject = Mn.Object.extend({
  initialize: function(options) {
    this.mergeOptions(options, ['model', 'something']);
    // this.model and this.something will now be available
  }
});

var myObject = new MyObject({
  model: new Backbone.Model(),
  something: 'test',
  another: 'value'
});

console.log(myObject.model);
console.log(myObject.something);
console.log(myObject.getOption('another'));
```

[Live example](https://jsfiddle.net/marionettejs/ub510cbx/)

In this example, `model` and `something` are directly available on the
`MyObject` instance, while `another` must be accessed via `getOption`. This is
handy when you want to add extra keys that will be used heavily throughout the
defined class.
