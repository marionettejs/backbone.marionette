**_These docs are for Marionette 3 which is still in pre-release. Some parts may
not be accurate or up-to-date_**

# Marionette.Behaviors

'Marionette.Behaviors' is a utility class that takes care of gluing your `Behavior` instances to their given `View`.
The most important thing to understand when using this class is that you **MUST** override the class level `behaviorsLookup` method or set the option `behaviorClass` for things to work properly.

## Documentation Index
* [API](#api)
  * [Behaviors Lookup](#behaviorslookup)
  * [getBehaviorClass](#getbehaviorclass)
  * [behaviorClass](#behaviorclass)

## API

There are two class level methods that you can override on the `Behaviors` class. The rest of the class is tied to under the hood implementation details of Views.

### behaviorsLookup

This method defines where your Behavior classes are stored. A simple implementation might look something like this.

```js
Marionette.Behaviors.behaviorsLookup = function() {
    return window.Behaviors;
}
```

There are 2 different syntaxes for attaching Behaviors to a View.  The first is an object syntax where the Behaviors are looked up by their key value in a given View's behavior hash. The second is an array syntax where you can pass the Behavior class directly.

In this sample, which uses the object syntax, your code will expect the following Behaviors to be present in `window.Behaviors.DestroyWarn` and `window.Behaviors.ToolTip`

```js
var MyView = Marionette.View.extend({
	behaviors: {
        ToolTip: {},
		DestroyWarn: {
			message: "you are destroying all your data is now gone!"
		}
	}
});
```

If you use a module loader like [requirejs](http://requirejs.org/) or [browserify](http://browserify.org/) you can use the array based syntax, where you pass in a Behavior Class directly or include it as a behaviorClass property on your options object.

```js
var Tooltip = require('behaviors/tooltip');
var DestroyWarn = require('behaviors/destroy-warn');

var MyView = Marionette.View.extend({
    behaviors: [Tooltip, {
        behaviorClass: DestroyWarn,
        message: "you are destroying all your data is now gone!"
    }]
});
```

### getBehaviorClass

This method has a default implementation that is simple to override. It is responsible for the lookup of single Behavior when given an options object and a key, and is used for both the array and object based notations.

```js
getBehaviorClass: function(options, key) {
    if (options.behaviorClass) {
        return options.behaviorClass;
        //treat functions as a Behavior constructor
    } else if(_.isFunction(options)) {
        return options;
    }
    // behaviorsLookup can be either a flat object or a method
    return Marionette._getValue(Behaviors.behaviorsLookup, this, [options, key])[key];
}
```
