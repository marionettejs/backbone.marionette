# Marionette.Behavior


A `Behavior` is an  isolated set of DOM / user interactions that can be mixed into any `View`. `Behaviors` allow you to blackbox `View` specific interactions into portable logical chunks, keeping your `views` simple and your code DRY.

## Documentation Index

* [Motivation](#the-motivation)
* [Using Behaviors](#using)
* [API](#api)
  * [Event proxy](#the-event-proxy)
  * [$](#$)
  * [$el](#$el)
  * [Defaults](#defaults)
  * [View](#view)

## The Motivation

As you build more and more complex views you will find that your `view` becomes less about displaying model data, and more about interactions.

These interactions tend to be chunks of logic that you want to use in multiple views.

## Using

Here is an example of a simple `itemView`. Let's take a stab at simplifying it, and abstracting behaviors from it.

```js
var MyView = Marionette.ItemView.extend({
	ui: {
        "close": ".close-btn"
	},

	events: {
	    "click @ui.close": "warnBeforeClose"
	},

	warnBeforeClose: function() {
	    alert("you are closing all your data is now gone!");
	    this.close();
	},

	onShow: function() {
	   this.$('.tooltip').tooltip({
	     text: "what a nice mouse you have"
	   });
	}
});
```

Interaction points such as tooltips and warning messages are generic concepts. There is no need to recode them within your views. They are prime for abstraction into a higher level non-coupled concept, which is exactly what Behaviors provide you with.

Here is the syntax for declaring which behaviors get used within a view.
The keys in the hash are passed to `getBehaviorClass` to lookup the correct `Behavior` class.
The options for each behavior are also passed to said Behavior during initialization. The options are then stored within each behavior under `options`.

```js
var MyView = Marionette.ItemView.extend({
	behaviors: {
		CloseWarn: {
			message: "you are closing all your data is now gone!"
		},
		ToolTip: {
			text: "what a nice mouse you have"
		}
	}
});
```

Now let's create the `CloseWarn` behavior.

```js
var CloseWarn = Marionette.Behavior.extend({
	// you can set default options
	// just like you can in your Backbone Models
	// they will be overriden if you pass in an option with the same key
	defaults: {
		"message": "you are closing!"
	},

	// Behaviors have events that are bound to the behavior instance
	events: {
		"click .close": "warnBeforeClose"
	},

	warnBeforeClose: function() {
		alert(this.options.message);
	  	// every Behavior has a hook into the
	  	// view that it is attached to
	  	this.view.close();
	}
});
```

And onto the `Tooltip` behavior.

```js
var ToolTip = Marionette.Behavior.extend({
	onShow: function() {
		// this.$ is another example of something
		// that is exposed to each behavior instance
  		// of the view
  		this.$('.tooltip').tooltip({
	     	text: this.options.text
  		});
	}
});
```

There is one final piece to finalizing this. The user must define a location for where their `behaviors` are stored.
A simple example of this would look like this:

```js
  Marionette.Behaviors.behaviorsLookup = function() {
  	return window.Behaviors;
  }
```

In this example you would then store your behaviors like this:

```js
window.Behaviors.ToolTip = ToolTip;
window.Behaviors.CloseWarn = CloseWarn;
```

## API

### the event proxy
Behaviors are powered by an event proxy. What this means is that any events that are triggered by the view's `triggerMethod` function are passed to each Behavior on the view as well.

As a real world example, whenever in your `view` you would have `onShow`, your behavior can also have this `onShow` method defined. The same follows for `modelEvents` and `collectionEvents`. Think of your behavior as a receiver for all of the events on your view instance.

This concept also allows for a nice decoupled method to communicate to behaviors from your view instance.
You can just call from within your view `this.triggerMethod("SomeEvent", {some: "data"})`. then your `behavior` class would look like this:

```js
Marionette.Behavior.extend({
	onSomeEvent: function(data) {
		console.log("wow such data", data);
	}
});
```


### $
`$` is a direct proxy of the views `$` lookup method.
```js
	Marionette.Behavior.extend({
		onShow: function() {
			this.$('.zerg')
		}
	});
```

### $el
`$el` is a direct proxy of the views `el` cached as a jquery selector.
```js
Marionette.Behavior.extend({
	onShow: function() {
		this.$el.fadeOut('slow')
	}
});
```

### defaults
`defaults` can be a `hash` or `function` to define the default options for your behavior.
The default options will be overridden depending on what you set as the options per behavior (this works just like a `backbone.model`).

```js
Marionette.Behavior.extend({
	defaults: function() {
		return {
			'deepSpace': 9
		}
	}
});
```

```js
Marionette.Behavior.extend({
	defaults: {
			'dominion': 'invasion',
			'doge': 'amaze'
		}
	}
});
```

### view
The `view` is a reference to the view instance that the `behavior` is on.

```js
Marionette.Behavior.extend({
	onShow: function() {
		this.view.close();
	}
});
```
