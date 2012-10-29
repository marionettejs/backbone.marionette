# ViewSwapper

Quickly swap between two or more view instances, based on events that the
views trigger. This view type enables common scenarios such as edit-in-place, "loading"
screens, and more.

A ViewSwapper extends from `Marionette.View`, which means it can be used 
in place of any standard Backbone.View or Marionette view instance. 

## Documentation Index

* [Basic Use](#basic-use)
* [Events And Callback Methodsl](#events-and-callback-methods)
* [Configuring View Swapping With `swapOn`](#configuring-view-swapping-with-swapon)
* [Swapping With Events From The ViewSwapper Instance](#swapping-with-events-from-the-viewswapper-instance)
* [Configuring View Instances with `views`](#configuring-view-instances-with-views)
* [Configuring The Initial View](#configuring-the-initial-view)
* [Custom Show And Hide Animations When Swapping](#cusom-show-and-hide-animations-when-swapping)
* [ViewSwapper vs Layout And Region](#viewswapper-vs-layout-and-region)

## Basic Use

The idea is that a ViewSwapper view can be configured to allow swapping out 
different child-views, based on the events that the current view triggers. 
For example, swapping out add/edit views would look like this:

```js
var AddEditView = new ViewSwapper({
  initialView: "displayView",

  swapOn: {
    editView: {
      "swap:display": "displayView"
    },
    displayView: {
      "swap:edit": "editView"
    }
  }
});
```

Then when you create the instance to display the real views, you would 
specify the views to use in place of the names provides:

```js
var dv = new SomeView();
var ev = new SomeEditView();

new AddEditView({
    views: {
        displayView: dv,
        editView: ev
    }
});
```

When displayView triggers the "swap:edit" event, the editView will be 
displayed in place. Similarly, when editView triggers the "swap:display" 
event, the displayView will be displayed.

## Events And Callback Methods

The ViewSwapper will trigger the following events and callback methods:

* swap:in/onSwapIn : triggered when a view is swapped in, includes the view view instance as a parameter
* swap:out/onSwapOut : triggered when a view is swapped out, includes the view view instance as a parameter

**Note:** The view that is passed as the only parameter to the "swap:in"
and "swap:out" events / callbacks is a wrapper object around the originally
specified view instance. This wrapper object contains two attributes that
can be used to verify that the view is the expected one: `originalView` and
`viewName`. 

The ViewSwapper will also trigger these events on the sub-views that it swaps in / out:

* render/onRender: triggered on a sub-view that is being rendered for display. only triggers one per view
* show/onShow: triggered on a sub-view that has been swapped in and shown in the DOM
* hide/onHide: triggered on a sub-view that has been swapped out and removed from the DOM


## Configuring View Swapping With `swapOn`

The `swapOn` configuration is used to determine which view to swap to,
when the named view triggers a specific event. The format for the the
`swapOn` setting is:

```js
swapOn: {
  viewName: {
    "event name": "target view name"
  }
}
```

This setting can be supplied to either the ViewSwapper definition, or
constructor options when instantiating it.

The "viewName" corresponds to the named view instances that are configured
with the `views` setting for the ViewSwapper. The object for this setting
tells the ViewSwapper what events to listen for when the "viewName" view
is the currently displayed view.

The "event Name" is the name of an event to listen for when "viewName" is
the current view. 

The "target view name" is the named view to swap to when the "event name"
is triggered from the "viewName" - but only if "viewName" is the currently
displayed view.

From the above example for add/edit:

```js
displayView: {
  "swap:edit": "editView"
}
```

When the `displayView` view is shown, the view swapper will listen for an
event named "swap:edit". When this event is triggered, the view swapper
will swap out the `displayView` instance for the `editView` instance.

## Swapping With Events From The ViewSwapper Instance

The ViewSwapper instance can also be configured to trigger events and
cause view swaps to happen. To do this, use the special view name "swapper"
in the `swapOn` configuration:

```js
swapOn: {
  swapper: {
    "some:event": "anotherView",
    "event:two": "thatView"
  }
}
```

The view name "swapper" is reserved for the ViewSwapper instance itself
and cannot be used for another view instance. It also cannot be used as
the `initialView` or as a target view to swap to. If the "swapper" name
is used in either of these cases, an exception will be thrown.

## Configuring View Instances with `views`

The views that the ViewSwapper uses must be configured with names that
the ViewSwapper knows, corresponding to view instances. This is done
by providing a `views` configuration with the following format:

```js
views: {
  "view name": viewInstance,
  "another name": anotherInstance
}
```

This setting can be supplied to either the ViewSwapper definition, or
constructor options when instantiating it.

```js
views: {
  displayView: dv,
  editView: ev
}
```

All view names that are configured in the `swapOn` and `initialView`
settings are string names that correspond to the names configured here.

In other words, when the ViewSwapper needs to swap over to the 
"displayView" because the correct event was triggered, it will look up 
"displayView" in this configuration and find the `dv` view instance to use.

## Configuring The Initial View

An `initialView` must be configured for the ViewSwapper. This is the name
of the view that should be shown the first time the ViewSwapper is
rendered.

```js
initialView: "view name"
```

This setting can be supplied to either the ViewSwapper definition, or
constructor options when instantiating it.

From the above example for add/edit:

```js
initialView: "displayView"
```

This tells the ViewSwapper to use the view that is configured with the
"displayView" name as the view to show, when the ViewSwapper is
rendered for the first time.

## Custom Show And Hide Animations When Swapping

The default method for showing a view, after swapping to it, is to call
`view.$el.show()`. The default method for hiding a view when swapping it
out is to call `view.$el.hide()`. These can be easily configured by
overriding the `showView` and `hideView` methods on your view definition.

```js
var FadingViewSwapper = Marionette.ViewSwapper.extend({

  // ...

  // provide custom function to show the view being swapped in
  showView: function(view, done){
    view.$el.fadeIn("fast", function(){
      done();
    });
  },

  // provide custom function to hide the view being swapped out
  hideView: function(view, done){
    view.$el.fadeOut("fast", function(){
      done();
    });
  }

});
```

Note the `done` parameter of both of these methods, and the execution of
this parameter as a callback function. The `done` callback must be executed
or the ViewSwapper will not properly transition to the desired state.

## ViewSwapper vs Layout and Region

There certainly is a lot of overlap between this idea and a Layout w/ a 
single Region. The reduction in boilerplate code and the more specialized 
use case give it value that is separate form a Layout, though. Often the 
significant different between one object and another is semantics. This 
is evident in the "commands" vs "request/response" methods from Wreqr. 
It's also evident in a "proxy" vs "decorator" design pattern 
implementation. But semantics are important. And semantics also tend to 
lead down diverging paths and more meaningful differences. 

One of the differences between a Layout and a ViewSwapper is the region 
and parent template - there isn't one for the view swapper. The 
ViewSwapper itself is just an empty tag that manages the display of other 
views inside of it - no need for a region to get involved because there's 
no need to select an element in which the sub-views get displayed.

Another difference is in the behavior of a Region vs the ViewSwapper. 
Regions will force-ably close your view when displaying the next one. The 
ViewSwapper on the other-hand, only hides the previously shown view. This 
allows the views to be very quickly swapped back and forth, without 
having to re-render and re-attach the view's DOM events. 

What this really comes down to, is semantics again. The semantics for a 
region are that you have a DOM element which will display an unknown 
number of views, at an unknown number of times, for an unknown set of 
reasons. It exists to make it easy to move between pages of your 
Single-Page-Application, to move between applications and sub-applications, 
etc. The semantics for a ViewSwapper are different in that it is intended 
to be used when you have a known set of conditions that need to display a 
known set of views, in a very limited capacity. 

The same effect can be accomplished with a Layout and Region. But the 
amount of code that you have to write increases and becomes significantly 
more complex when using a Layout and Region. The ViewSwapper provides a 
configuration-oriented mechanism that facilitate different scenarios, 
such as building a Tab widget, an Add/Edit view, enabling Add/Edit within 
a CollectionView or CompositeView, quickly and easily building a 
"Loading..." screen, and more.
