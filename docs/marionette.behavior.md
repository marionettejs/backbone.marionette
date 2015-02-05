## [View the new docs](http://marionettejs.com/docs/marionette.behavior.html)

# Marionette.Behavior


A `Behavior` is an  isolated set of DOM / user interactions that can be mixed into any `View` or another `Behavior`. `Behaviors` allow you to blackbox `View` specific interactions into portable logical chunks, keeping your `views` simple and your code DRY.

## Documentation Index

* [Motivation](#the-motivation)
* [Using Behaviors](#using)
* [API](#api)
  * [Event proxy](#the-event-proxy)
  * [Triggers](#triggers)
  * [Model Events](#model-events)
  * [Collection Events](#model-events)
  * [Grouped Behaviors](#grouped-behaviors)
  * [$](#$)
  * [$el and el](#$el-and-el)
  * [Defaults](#defaults)
  * [View](#view)

## The Motivation

As you build more and more complex views, you will find that your `view` becomes less about displaying model data, and more about interactions.

These interactions tend to be chunks of logic that you want to use in multiple views.

## Using

Here is an example of a simple `itemView`. Let's take a stab at simplifying it, and abstracting behaviors from it.

```js
var MyView = Marionette.ItemView.extend({
  ui: {
    "destroy": ".destroy-btn"
  },

  events: {
    "click @ui.destroy": "warnBeforeDestroy"
  },

  warnBeforeDestroy: function() {
    alert("you are destroying all your data is now gone!");
    this.destroy();
  },

  onShow: function() {
    this.ui.destroy.tooltip({
      text: "what a nice mouse you have"
    });
  }
});
```

Interaction points, such as tooltips and warning messages, are generic concepts. There is no need to recode them within your views. They are prime for abstraction into a higher level non-coupled concept, which is exactly what Behaviors provide you with.

Here is the syntax for declaring which behaviors get used within a view.
The keys in the hash are passed to `getBehaviorClass` to lookup the correct `Behavior` class.
The options for each behavior are also passed to said Behavior during initialization. The options are then stored within each behavior under `options`.

```js
var MyView = Marionette.ItemView.extend({
  ui: {
    "destroy": ".destroy-btn"
  },

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

Now let's create the `DestroyWarn` behavior.

```js
var DestroyWarn = Marionette.Behavior.extend({
  // you can set default options
  // just like you can in your Backbone Models
  // they will be overriden if you pass in an option with the same key
  defaults: {
    "message": "you are destroying!"
  },

  // behaviors have events that are bound to the views DOM
  events: {
    "click @ui.destroy": "warnBeforeDestroy"
  },

  warnBeforeDestroy: function() {
    alert(this.options.message);
    // every Behavior has a hook into the
    // view that it is attached to
    this.view.destroy();
  }
});
```

And onto the `Tooltip` behavior.

```js
var ToolTip = Marionette.Behavior.extend({
  ui: {
    tooltip: '.tooltip'
  },

  onShow: function() {
    this.ui.tooltip.tooltip({
      text: this.options.text
    });
  }
});
```

Finally, the user must define a location for where their `behaviors` are stored.
A simple example of this would look like this:

```js
  Marionette.Behaviors.behaviorsLookup = function() {
  	return window.Behaviors;
  }
```

In this example you would then store your behaviors like this:

```js
window.Behaviors.ToolTip = ToolTip;
window.Behaviors.DestroyWarn = DestroyWarn;
```

Note than in addition to extending a `View` with `Behavior`, a `Behavior` can itself use other behaviors. The syntax is identical to that used for a `View`:

```js
var Modal = Marionette.Behavior.extend({
  behaviors: {
    DestroyWarn: {
      message: "Whoa! You sure about this?"
    }
  }
});
```

Nested behaviors act as if they were direct behaviors of the parent behavior's view instance.

## API

### The Event Proxy
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

### Triggers
Any `triggers` you define on the `Behavior` will be triggered in response to the
appropriate event on the view.

```js
Marionette.Behavior.extend({
  triggers: {
    'click .label': 'click:label'
  }
});
```

### Model Events
`modelEvents` will respond to the view's model events.

```js
  Marionette.Behavior.extend({
    modelEvents: {
      "change:doge": "onDogeChange"
    },

    onDogeChange: function() {
      // buy more doge...
    }
  });
```

### Collection Events
`collectionEvents` will respond to the view's collection events.

```js
  Marionette.Behavior.extend({
    collectionEvents: {
      add: "onCollectionAdd"
    },

    onCollectionAdd: function() {
    }
  });
```

### Grouped Behaviors
Then `behaviors` key allows a behavior to group multiple behaviors together.

```js
  Marionette.Behavior.extend({
    behaviors: {
      SomeBehavior: {}
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

### $el and el
`el` is a direct proxy of the view's `el`.
Similarly, `$el` is a direct proxy of the view's `el` cached as a jQuery selector.

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
});
```

### view
The `view` is a reference to the view instance that the `behavior` is on.

```js
Marionette.Behavior.extend({
	handleDestroyClick: function() {
		this.view.destroy();
	}
});
```
