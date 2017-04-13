# Marionette.Behavior

A `Behavior` provides a clean separation of concerns to your view logic,
allowing you to share common user-facing operations between your views.

Behaviors are particularly good at factoring out the common user, model and
collection interactions to be utilized across your application.

## Documentation Index

* [Using Behaviors](#using-behaviors)
  * [Defining and Attaching Behaviors](#defining-and-attaching-behaviors)
  * [Behavior Options](#behavior-options)
  * [Behavior Defaults](#behavior-defaults)
* [Nesting Behaviors](#nesting-behaviors)
* [View Proxy](#view-proxy)
  * [Listening to View Events](#listening-to-view-events)
  * [Proxy Handlers](#proxy-handlers)
  * [Events / Initialize Order](#events--initialize-order)
  * [Using `ui`](#using-ui)
  * [View and el](#view-and-el)


## Using Behaviors

The easiest way to see how to use the `Behavior` class is to take an example
view and factor out common behavior to be shared across other views.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  ui: {
    destroy: '.destroy-btn'
  },

  events: {
    'click @ui.destroy': 'warnBeforeDestroy'
  },

  warnBeforeDestroy: function() {
    alert('You are about to destroy all your data!');
    this.destroy();
  },

  onRender: function() {
    this.ui.destroy.tooltip({
      text: 'What a nice mouse you have.'
    });
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/pa8ryv03/)

Interaction points, such as tooltips and warning messages, are generic concepts.
There is no need to recode them within your Views so they are prime candidates
to be extracted into `Behavior` classes.

### Defining and Attaching Behaviors

```javascript
var Mn = require('backbone.marionette');

var DestroyWarn = Mn.Behavior.extend({
  // You can set default options
  // just like you can in your Backbone Models.
  // They will be overridden if you pass in an option with the same key.
  defaults: {
    message: 'You are destroying!'
  },
  ui: {
    destroy: '.destroy-btn'
  },

  // Behaviors have events that are bound to the views DOM.
  events: {
    'click @ui.destroy': 'warnBeforeDestroy'
  },

  warnBeforeDestroy: function() {
    var message = this.getOption('message');
    window.alert(message);
    // Every Behavior has a hook into the
    // view that it is attached to.
    this.view.destroy();
  }
});

var ToolTip = Mn.Behavior.extend({
  defaults: {
    text: ''
  },
  ui: {
    tooltip: '.tooltip'
  },

  onRender: function() {
    this.ui.tooltip.tooltip({
      text: this.getOption('text')
    });
  }
});
```

We've passed in a `defaults` attribute that sets default options.
[This will be covered in default soon](#behavior-defaults). With the warning and tooltip
behaviors extracted, we just need to attach them to our view:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  behaviors: [DestroyWarn, ToolTip]
});
```

[Live example](https://jsfiddle.net/marionettejs/b1awta6u/)

Each behavior will now be able to respond to user interactions as though the
event handlers were attached to the view directly. In addition to using array
notation, Behaviors can be attached using an object:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  behaviors: {
    destroy: DestroyWarn,
    tooltip: ToolTip
  }
});
```

#### Behavior Options

When we attach behaviors to views, we can also pass in options to add to the
behavior. This tends to be static information relating to what the behavior
should do. In our above example, we want to override the message to our
`DestroyWarn` and `Tooltip` behaviors to match the original message on the View:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  behaviors: [
    {
      behaviorClass: DestroyWarn,
      message: 'You are about to destroy all your data!'
    },
    {
      behaviorClass: ToolTip,
      text: 'What a nice mouse you have.'
    }
  ]
});
```

[Live example](https://jsfiddle.net/marionettejs/vq9k3c69/)

Using an object, we must define the `behaviorClass` attribute to refer to our
behaviors and then add any extra options with keys matching the option we want
to override. Any passed options will override the `defaults` passed.

Here is the syntax for declaring which behaviors get used within a View.
* You can pass behaviors either as a set of key-value pairs where the keys are used to lookup the behavior class, or as an array.
* The options for each `Behavior` are also passed through to the `Behavior` during initialization.
* The options are then stored within each `Behavior` under `options`.

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  ui: {
    destroy: '.destroy-btn'
  },

  behaviors: {
    DestroyWarn: {
      message: 'you are destroying all your data is now gone!'
    },
    ToolTip: {
      text: 'what a nice mouse you have'
    }
  }
});
```

Now let's create the `DestroyWarn` `Behavior`.

```javascript
var Mn = require('backbone.marionette');

var DestroyWarn = Mn.Behavior.extend({
  // You can set default options
  // just like you can in your Backbone Models.
  // They will be overridden if you pass in an option with the same key.
  defaults: {
    message: 'You are destroying!'
  },

  // Behaviors have events that are bound to the views DOM.
  events: {
    'click @ui.destroy': 'warnBeforeDestroy'
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

```javascript
var Mn = require('backbone.marionette');

var ToolTip = Mn.Behavior.extend({
  ui: {
    tooltip: '.tooltip'
  },

  onRender: function() {
    this.ui.tooltip.tooltip({
      text: this.options.text
    });
  }
});
```

#### Behavior Defaults

**Deprecated:** Defaults can be effectively set with an `options` hash defined on the Behavior.

```javascript
Marionette.Behavior.extend({
  options: function() {
    return {
      deepSpace: 9
    }
  }
});
```

```javascript
Marionette.Behavior.extend({
  options: {
    dominion: 'invasion',
    doge: 'amaze'
  }
});
```

`defaults` can be a [`hash` or `function`](./basics.md#functions-returning-values) to define the default options for your `Behavior`. The default options will be overridden depending on what you set as the options per `Behavior`. (This works just like a `Backbone.Model`.)

```javascript
Marionette.Behavior.extend({
  defaults: function() {
    return {
      'deepSpace': 9
    }
  }
});
```

```javascript
Marionette.Behavior.extend({
  defaults: {
    'dominion': 'invasion',
    'doge': 'amaze'
  }
});
```

### view
The `view` is a reference to the `View` instance that the `Behavior` is attached to.

```javascript
Marionette.Behavior.extend({
  handleDestroyClick: function() {
    this.view.destroy();
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/p8vymo4j/)

## Nesting Behaviors

In addition to extending a `View` with `Behavior`, a `Behavior` can itself use
other Behaviors. The syntax is identical to that used for a `View`:

```javascript
var Mn = require('backbone.marionette');

var Modal = Mn.Behavior.extend({
  behaviors: {
    DestroyWarn: {
      message: 'Whoa! You sure about this?'
    }
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/7ffnqff3/)

Nested Behaviors act as if they were direct Behaviors of the parent `Behavior`'s
view instance.

## View Proxy

The `Behavior` class provides proxies for a selection of `View` functionality.
This includes listening to events on the view, being able to handle events on
models and collections, and being able to directly interact with the attached
template.

### Listening to View Events

Behaviors are powered by an event proxy. This means that any events that are
triggered on a `View` are passed to all attached `behaviors`. This includes:

* Events fired by `triggerMethod`
* Events fired from `triggers`
* Events fired by `childViewTriggers`
* Events fired from `childView`

These handlers work exactly as they do on `View` -
[see the `View` documentation](./marionette.view.md#events)

> Events triggered in the behavior instance are not executed in the view. To notify
> the view, the behavior must trigger an event in its view property, e.g, `this.view.trigger('my:event')`

### Proxy Handlers

Behaviors provide proxies to a number of the view event handling attributes
including:

* [`events`](./marionette.view.md#view-events)
* [`triggers`](./marionette.view.md#view-triggers)
* [`modelEvents`](./marionette.view.md#model-events)
* [`collectionEvents`](./marionette.view.md#collection-events)

### Events / Initialize Order

If both view and behavior are listening for the same event, this will be executed
first in the view then in the behavior as below.

The View + Behavior initialize process is as follows:

1. View is constructed
2. Behavior is constructed
3. Behavior is initialized with view property set
4. View is initialized
5. View triggers an `initialize` event on the behavior.

This means that the behavior can access the view during its own `initialize` method.
The view `initialize` is called later with the information eventually injected by the behavior.
The `initialize` event is triggered on the behavior indicating that the view is fully initialized.

[Live example](https://jsfiddle.net/marionettejs/qb9go1y3/)

#### Using `ui`

As in views, `events` and `triggers` can use the `ui` references in their
listeners. For more details, see the [`ui` documentation for views](./marionette.view.md#organizing-your-view).
These can be defined on either the Behavior or the View:

```javascript
var Mn = require('backbone.marionette');

var MyBehavior = Mn.Behavior.extend({
  ui: {
    saveForm: '.btn-save'
  },

  events: {
    'click @ui.saveForm': 'saveForm'
  },

  modelEvents: {
    invalid: 'showError'
  },

  saveForm: function() {
    this.view.model.save();
  },

  showError: function() {
    alert('You have errors');
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/6b8o3pmz/)

If your `ui` keys clash with keys on the attached view, references within the
behavior will always use the definition on the behavior itself. As views are
only peripherally aware of their behaviors, their `ui` keys will not be changed
when accessed within the `View`. For example:

```javascript
var Mn = require('backbone.marionette');

var MyBehavior = Mn.Behavior.extend({
  ui: {
    saveForm: '.btn-save'
  },

  events: {
    'click @ui.saveForm': 'saveForm'  // .btn-save
  },

  saveForm: function() {
    this.view.model.save();
  }
});

var FirstView = Mn.View.extend({
  behaviors: [MyBehavior],

  ui: {
    saveForm: '.btn-primary'
  },

  events: {
    'click @ui.saveForm': 'checkForm'  // .btn-primary
  },

  checkForm: function() {
    // ...
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/xoy56gpv/)

### View and el

The `Behavior` has a number of proxies attributes that directly refer to the
related attribute on a view:

* `$`
* `el`
* `$el`

In addition, each behavior is able to reference the view they are attached to
through the `view` attribute:

```javascript
var Mn = require('backbone.marionette');

var ViewBehavior = Mn.Behavior.extend({
  onRender: function() {
    if (this.view.model.get('selected')) {
      this.$el.addClass('highlight');
    }
    else {
      this.$el.removeClass('highlight');
    }
  }
});
```

[Live example](https://jsfiddle.net/marionettejs/8dmk30Lq/)
