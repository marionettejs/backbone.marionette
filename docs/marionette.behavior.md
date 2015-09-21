## [View the new docs](http://marionettejs.com/docs/marionette.behavior.html)

# Marionette.Behavior


A `Behavior` is an  isolated set of DOM / user interactions that can be mixed into any `View` or another `Behavior`. Behaviors allow you to blackbox `View`-specific interactions into portable logical chunks, keeping your Views simple and your code DRY.

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

As you build more and more complex Views, you will find that your `View` becomes less about displaying model data, and more about interactions.

These interactions tend to be chunks of logic that you want to use in multiple views.

## Usage

Here is an example of a simple `ItemView`. Let's take a stab at simplifying it, and abstracting Behaviors from it.

```js
var MyView = Marionette.ItemView.extend({
  ui: {
    "destroy": ".destroy-btn"
  },

  events: {
    "click @ui.destroy": "warnBeforeDestroy"
  },

  warnBeforeDestroy: function() {
    alert("You are about to destroy all your data!");
    this.destroy();
  },

  onShow: function() {
    this.ui.destroy.tooltip({
      text: "What a nice mouse you have."
    });
  }
});
```

Interaction points, such as tooltips and warning messages, are generic concepts. There is no need to recode them within your Views. They are prime candidates for abstraction into a higher level, non-coupled concept, which is exactly what Behaviors provide you with.

Here is the syntax for declaring which behaviors get used within a View:
* The keys in the hash are passed to `getBehaviorClass`, which looks up the correct `Behavior` class.
* The options for each `Behavior` are also passed through to the `Behavior` during initialization.
* The options are then stored within each `Behavior` under `options`.

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

Now let's create the `DestroyWarn` `Behavior`.

```js
var DestroyWarn = Marionette.Behavior.extend({
  // You can set default options
  // just like you can in your Backbone Models.
  // They will be overridden if you pass in an option with the same key.
  defaults: {
    "message": "You are destroying!"
  },

  // Behaviors have events that are bound to the views DOM.
  events: {
    "click @ui.destroy": "warnBeforeDestroy"
  },

  warnBeforeDestroy: function() {
    alert(this.options.message);
    // Every Behavior has a hook into the
    // view that it is attached to.
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

Finally, the user must define a location where their Behaviors are stored. Here is a simple example:

```js
  Marionette.Behaviors.behaviorsLookup = function() {
  	return window.Behaviors;
  }
```

In this example, you would then store your Behaviors like this:

```js
window.Behaviors.ToolTip = ToolTip;
window.Behaviors.DestroyWarn = DestroyWarn;
```

Note that in addition to extending a `View` with `Behavior`, a `Behavior` can itself use other Behaviors. The syntax is identical to that used for a `View`:

```js
var Modal = Marionette.Behavior.extend({
  behaviors: {
    DestroyWarn: {
      message: "Whoa! You sure about this?"
    }
  }
});
```

Nested Behaviors act as if they were direct Behaviors of the parent `Behavior`'s view instance.

## API

### The Event Proxy
Behaviors are powered by an event proxy. This means that any events that are triggered by the view's `triggerMethod` function are passed to each `Behavior` on the `View` as well.

As a real world example, whenever you would define a click event in your `View`'s `events` hash, you can define the same event listeners and callbacks in the `Behavior`'s `events` hash. The same follows for `modelEvents` and `collectionEvents`. Think of your `Behavior` as a receiver for all of the events on your `View` instance.

This concept also allows for a nice decoupled method to communicate to Behaviors from your `View` instance. You can just call the following from within your `View`: `this.triggerMethod("SomeEvent", {some: "data"})`. Then your `Behavior` class would look like this:

```js
Marionette.Behavior.extend({
  onSomeEvent: function(data) {
		console.log("wow such data", data);
	}
});
```


### Model Events
`modelEvents` will respond to the `View`'s model events.

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
`collectionEvents` will respond to the `View`'s collection events.

```js
  Marionette.Behavior.extend({
    collectionEvents: {
      add: "onCollectionAdd"
    },

    onCollectionAdd: function() {
    }
  });
```

### Life Cycle Methods

In addition to providing the same event hashes as Views, Behaviors allow you to use the same life cycle functions that you find on Views. That means methods like `initialize`, `onRender`, `onBeforeShow`, and `onBeforeDestroy` are all valid as long as the `View` that implements the `Behavior` fires the relevant events.

```js
  Marionette.Behavior.extend({

    onRender: function() {
        //Apply a jQuery plugin to every .foo item within the view
        this.$('.foo').bar();
    }
  });
```

### Triggers
Any `triggers` you define on the `Behavior` will be triggered in response to the appropriate event on the `View`.

```js
Marionette.Behavior.extend({
  triggers: {
    'click .label': 'click:label'
  }
});
```

### Grouped Behaviors
The `behaviors` key allows a `Behavior` to group multiple behaviors together.

```js
  Marionette.Behavior.extend({
    behaviors: {
      SomeBehavior: {}
    }
  });
```

### $
`$` is a direct proxy of the `View`'s `$` lookup method.

```js
	Marionette.Behavior.extend({
		onShow: function() {
			this.$('.zerg')
		}
	});
```

### $el and el
`el` is a direct proxy of the `View`'s `el`. Similarly, `$el` is a direct proxy of the `View`'s `el` cached as a jQuery selector.

```js
Marionette.Behavior.extend({
	onShow: function() {
		this.$el.fadeOut('slow')
	}
});
```

### defaults
`defaults` can be a `hash` or `function` to define the default options for your `Behavior`. The default options will be overridden depending on what you set as the options per `Behavior`. (This works just like a `Backbone.Model`.)

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
The `view` is a reference to the `View` instance that the `Behavior` is attached to.

```js
Marionette.Behavior.extend({
	handleDestroyClick: function() {
		this.view.destroy();
	}
});
```

### ui

Behaviors can have their own `ui` hash, which will be mixed into the `ui` hash of its associated `View` instance.
`ui` elements defined on either the `Behavior` or the `View` will be made available within events and triggers. They
also are attached directly to the `Behavior` and can be accessed within `Behavior` methods as `this.ui`.

```js
Marionette.Behavior.extend({
    ui: {
        'foo' : 'li.foo'
    },

    doStuff: function() {
        this.ui.foo.trigger('something');
    }
})
```
