# Marionette.Behaviors

'Marionette.Behaviors' is a utility class that takes care of glueing your `behavior` instances to their given `View`.
The most important part of this class is that you **MUST** override the class level `behaviorsLookup` method for things to work properly.

## Documentation Index
* [API](#api)
  * [Behaviors Lookup](#behaviorslookup)
  * [getBehaviorClass](#getbehaviorclass)
  * [behaviorClass](#behaviorclass)

## API

There are two class level methods that you can override on the `Behaviors` class. The rest of the class is tied to under the hood implementation details of views.

### behaviorsLookup

This method defines where your behavior classes are stored. A simple implementation might look something like this.

```js
Marionette.Behaviors.behaviorsLookup = function() {
    return window.Behaviors;
}
```

By default the behaviors are looked up by their key value in a given views behavior hash.

In this sample (using the default `getBehaviorClass` implementation) your code will expect the following behaviors to be present in `window.Behaviors.DestroyWarn` and `window.Behaviors.ToolTip`

```js
var MyView = Marionette.ItemView.extend({
	behaviors: {
		DestroyWarn: {
			message: "you are destroying all your data is now gone!"
		},
		ToolTip: {
			text: "what a nice mouse you have"
		}
	}
});
```

### getBehaviorClass

This method has a default implementation that is simple to override. It is responsible for the lookup of single behavior from within the `Behaviors.behaviorsLookup` or elsewhere.

```js
getBehaviorClass: function(options, key) {
    if (options.behaviorClass) {
        return options.behaviorClass;
    }

    return Behaviors.behaviorsLookup[key];
}
```

### behaviorClass

This property lets you pass a `class` in for the `behavior` to use (bypassing the normal key based lookup). This is nice to have when the behavior is a dependency of the view in [requirejs](http://requirejs.org/). Properties passed in this way will be used in `getBehaviorClass`.

```js
define(['marionette', 'lib/tooltip'], function(Marionette, Tooltip) {
  var View = Marionette.ItemView.extend({
     behaviors: {
        Tooltip: {
          behaviorClass: Tooltip,
          message: "hello world"
        }
     }
  });
});
```
