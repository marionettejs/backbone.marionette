## [View the new docs](http://marionettejs.com/docs/marionette.view.html)

# Marionette.View

A `View` is a view that represents an item to be displayed with a template.This is typically a `Backbone.Model`, `Backbone.Collection`, or nothing at all.Views are also used to build up your application hierarchy - you can easily nestmultiple views through the `regions` attribute.**_Note: From Marionette v3.x, `Marionette.View` replaces
`Marionette.LayoutView` and `Marionette.ItemView`._**

## Documentation Index

* [Rendering a Template](#rendering-a-template)
  * [Using a Model](#using-a-model)
  * [Using a Collection](#using-a-collection)
  * [Template context](#template-context)
  * [Advanced Rendering Techniques](#advanced-rendering-techniques)
* [Managing an Existing Page](#managing-an-existing-page)
* [Laying out Views - Regions](#laying-out-views-regions)
* [Organising your View](#organising-your-view)
* [Events and Callback Methods](#events-and-callback-methods)
  * [modelEvents and collectionEvents](#modelevents-and-collectionevents)
  * [Lifecycle Events](#lifecycle-events)
    * ["before:render" / onBeforeRender event](#beforerender--onbeforerender-event)
    * ["render" / onRender event](#render--onrender-event)
    * ["before:destroy" / onBeforeDestroy event](#beforedestroy--onbeforedestroy-event)
    * ["destroy" / onDestroy event](#destroy--ondestroy-event)
* [View serializeData](#itemview-serializedata)
* [Organizing ui elements](#organizing-ui-elements)

## Rendering a Template

The Marionette View implements a powerful render method which, given a template,
will build your HTML from that template, mixing in model information and any
extra template context.

**Overriding `render`** If you want to add extra behavior to your view's render,
you would be best off doing your logic in the
[`onBeforeRender` or `onRender` handlers](#lifecycle-events).

### Passing a Template

The `Marionette.View` looks for the attached template on the `template`
attribute. Like most attributes in Backbone and Marionette, this takes a string
(selector) or function.

#### Template Selector

If your index page contains a pre-formatted template, you can simply pass in the
jQuery selector for it to `template` and Marionette will look it up:

```javascript
var Mn = require('backbone.marionette');

export.MyView = Mn.View.extend({
  template: '#template-layout'
});
```

```html
<script id="template-layout" type="x-template/underscore">
<h1>Hello, world</h1>
</script>
```

Marionette will look up the template above and render it for you when `MyView`
gets rendered.

#### Template Function

A more common way of setting a template is to assign a function to `template`
that renders its argument. This will commonly be the `_.template` function:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

export.MyView = Mn.View.extend({
  template: _.template('<h1>Hello, world</h1>')
});
```

This doesn't have to be an underscore template, you can pass your own rendering
function:

```javascript
var Mn = require('backbone.marionette');

export.MyView = Mn.View.extend({
  template: function(data) {
    if (data.name) {
      return _.template('<h1>Hello, <%- name %></h1>')(data);
    }
    return '<h1>Hello, world</h1>';
  }
});
```

Using a custom function can give you a lot of control over the output of your
view, let you switch templates, or just add extra data to the context passed
into your template.

### Using a Model

Marionette will happily render a template without a model. This won't give us a
particularly interesting result. As with Backbone, we can attach a model to our
views and render the data they represent:

```javascript
var Backbone = require('backbone');
var Mn = require('backbone.marionette');

var MyModel = Backbone.Model.extend({
  defaults: {
    name: 'world'
  }
});

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- name %></h1>')
});

var myView = new MyView({model: new MyModel()});
```

Now our template has full access to the attributes on the model passed into the
view.

### Using a Collection

The `Marionette.View` also provides a simple tool for rendering collections into
a template. Simply pass in the collection as `collection` and Marionette will
provide an `items` attribute to render:

```javascript
var Backbone = require('backbone');
var Mn = require('backbone.marionette');

var MyCollection = Backbone.Collection.extend({
});

var MyView = Mn.View.extend({
  template: '#hello-template'
});

var collection = new MyCollection([
  {name: 'Steve'}, {name: 'Helen'}
]);

var myView = new MyView({collection: collection});
```

For clarity, we've moved the template into this script tag:

```html
<script id="hello-template" type="x-template/underscore">
<ul>
  <% _.each(items, function(item) { %>
  <li><%- item.name %></li>
  <% }) %>
</ul>
</script>
```

As you can see, `items` is provided to the template representing each record in
the collection.

### User interaction with Collection records

While possible, reacting to user interaction with individual items in your
collection is tricky with just a `View`. If you want to act on individual items,
it's recommended that you use [`CollectionView`](./marionette.collectionview.md)
and handle the behavior at the individual item level.

### Rendering a Model or Collection

Marionette uses a simple method to determine whether to make a model or
collection available to the template:

1. If `view.model` is set, the attributes from `model`
2. If `view.model` is not set, but `view.collection` is, set `items` to the
  individual items in the collection
3. If neither are set, an empty object is used

The result of this is mixed into the
[`templateContext` object](#template-context) and made available to your
template. Using this means you can setup a wrapper `View` that can act on
`collectionEvents` but will render its `model` attribute - if your `model` has
and `items` attribute then that will always be used.

### Template Context

The `Marionette.View` provides a `templateContext` attribute that is used to add
extra information to your templates. This can be either an object, or a function
returning an object. The keys on the returned object will be mixed into the
model or collection keys and made available to the template.

#### Context Object

Using the context object, simply attach an object to `templateContext` as so:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey %></h1>'),

  templateContext: {
    contextKey: 'world'
  }
});

var myView = new MyView();
```

The `myView` instance will be rendered without errors even though we have no
model or collection - `contextKey` is provided by `templateContext`.

#### Context Function

The `templateContext` object can also be a function returning an object. This is
useful when you want to access
[information from the surrounding view](#binding-of-this) (e.g. model methods).

To use a `templateContext`, simply assign a function:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey %></h1>'),

  templateContext: function() {
    return {
      contextKey: this.getOption('contextKey')
    }
  }
});

var myView = new MyView({contextKey: 'world'});
```

Here, we've passed an option that can be accessed from the `templateContext`
function using `getOption()`. More information on `getOption` can be found in
the [documentation for `Marionette.Object`](./marionette.object.md#getoption).

#### Binding of `this`

When using functions in the `templateContext` it's important to know that `this`
is _bound to the `data` object and **not the view**_. An illustrative example:

```javascript
var _ = require('underscore');
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: _.template('<h1>Hello, <%- contextKey() %></h1>'),

  templateContext: {
    contextKey: function() {
      return this.getOption('contextKey');  // ERROR
    }
  }
});

var myView = new MyView({contextKey: 'world'});
```

The above code will fail because the context (`data`) object in the template
_cannot see_ the view's `getOption`.

## Managing an Existing Page

Marionette is able to manage pre-generated pages - either static or
server-generated - and treat them as though they were generated from Marionette.

To use the existing page, set the `template` attribute to `false`:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View({
  el: '#base-element',
  template: false
});
```

Marionette will then attach all the usual
[`event`](#events-and-callback-methods) and [`ui`](#organising-your-view)
handlers to the view using the existing HTML. Though the View has no template,
you can still listen to the `before:render` and `render` events that will fire
as usual when `render` is called - or when you execute `region.show(view)`.

### Setting a falsy `template` value

When using an existing page, Marionette explicitly looks for `false` - any other
falsy value will cause Marionette to raise an error when attempting to render
the template.

## Laying out Views - Regions

The `Marionette.View` class lets us manage a hierarchy of views using `regions`.
Regions are a hook point that lets us show views inside views, manage the
show/hide lifecycles, and act on events inside the children.

**This Section only covers the basics. For more information on regions, see the
[Regions Documentation.](./marionette.region.md)**


Regions are ideal for rendering application layouts by isolating concerns inside
another view. This is especially useful for independently re-rendering chunks
of your application without having to completely re-draw the entire screen every
time some data is updated.

Regions can be added to a View at class definition, with `regions`, or at
runtime using  `addRegion`.

### Class Definition

When you extend `View`, we use the `regions` attribute to point to the  selector
where the new view will be displayed:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
	template: '#tpl-view-with-regions',

	regions: {
		firstRegion: '#first-region',
		secondRegion: '#second-region'
	}
});
```

If we have the following template:

```html
<script type="x-template/underscore" id="tpl-view-with-regions">
  <div id="first-region"></div>
  <div id="second-region"></div>
  <div id="third-region"></div>
</script>
```

When we show views in the region, the contents of `#first-region` and
`#second-region` will be replaced with the contents of the view we show. The
value in the `regions` hash is just a jQuery selector, and any valid jQuery
syntax will suffice.

#### Specifying regions as functions

Regions can be specified on a View using a function that returns an object with
the region definitions. The returned object follow the same rules for defining a
region:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  regions: function(options){
    return {
      firstRegion: '#first-region'
    };
  }
});
```

The `options` argument contains the options passed to the view on instantiation.
As the view has not been constructed yet, `this.getOption()` is not able to
return any options from the view - use `options` instead.

### Adding Regions

To add regions to a view after it has been instantiated, simply use the
`addRegion` method:

```javascript
var MyView = require('./myview');

myView = new MyView();
myView.addRegion('thirdRegion', '#third-region');
```

Now we can access `thirdRegion` as we would the others.

### Managing Sub-views

`View` provides a simple interface for managing sub-views with `showChildView`
and `getChildView`:


#### Showing a view

To show a view inside a region, simply call `showChildView(region, view)`. This
will handle rendering the view's HTML and attaching it to the DOM for you:

```javascript
var Mn = require('backbone.marionette');
var SubView = require('./subview');

var MyView = Mn.View.extend({
  template: '#tpl-view-with-regions',

  regions: {
    firstRegion: '#first-region'
  },

  onRender: function() {
    this.showChildView('firstRegion', new SubView());
  }
});
```

#### Accessing a child view

To access the child view of a `View` - use the `getChildView(region)` method.
This will return the view instance that is current being displayed at that
region, or `null`:

```javascript
var Mn = require('backbone.marionette');
var SubView = require('./subview');

var MyView = Mn.View.extend({
  template: '#tpl-view-with-regions',

  regions: {
    firstRegion: '#first-region'
  },

  onRender: function() {
    this.showChildView('firstRegion', new SubView());
  },

  onSomeEvent: function() {
    var first = this.getChildView('firstRegion');
    first.doSomething();
  }
});
```

If no view is available, `getChildView` returns `null`.

### Region options
A `View` can take a `regions` hash that allows you to specify regions per `View` instance.

```javascript
new Marionette.View({
 regions: {
   "cat": ".doge",
   "wow": {
     selector: ".such",
     regionClass: Coin
   }
 }
});
```

### Region availability
Any defined regions within a `View` will be available to the `View` or any calling code immediately after instantiating the `View`. This allows a View to be attached to an existing DOM element in an HTML page, without the need to call a render method or anything else, to create the regions.

However, a region will only be able to populate itself if the `View` has access to the elements specified within the region definitions. That is, if your view has not yet rendered, your regions may not be able to find the element that you've specified for them to manage. In that scenario, using the region will result in no changes to the DOM.

### Efficient nested view structures
When your views get some more regions, you may want to think of the most efficient way to render your views. Since manipulating the DOM is performany heavy, it's best practice to render most of your views at once.

Marionette provides a simple mechanism to infinitely nest views in a single paint: just render all
of the children in the onBeforeShow callback.

```javascript
var ParentView = Marionette.View.extend({
  onBeforeShow: function() {
    this.showChildView('header', new HeaderView());
    this.showChildView('footer', new FooterView());
  }
});

myRegion.show(new ParentView(), options);
```
In this example, the doubly-nested view structure will be rendered in a single paint.

This system is recursive, so it works for any deeply nested structure. The child views
you show can render their own child views within their onBeforeShow callbacks!

## Organising your View

The `View` provides a mechanism to name parts of your template to be used
throughout the view with the `ui` attribute. This provides a number of benefits:

1. Provide a reference to commonly used UI elements
2. Cache the jQuery selector
3. Change the selector later in only one place in your view

### Defining `ui`

To define your `ui` hash, just set an object of key to jQuery selectors to the
`ui` attribute of your View:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: '#my-template',
  ui: {
    save: '#save-button',
    close: '.close-button'
  }
});
```

Inside your view, the `save` and `close` references will point to the jQuery
selectors `#save-button` and `.close-button` respectively.

### Accessing UI elements

To get the handles to your UI elements, use the `getUI(ui)` method:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: '#my-template',
  ui: {
    save: '#save-button',
    close: '.close-button'
  },

  onDoSomething: function() {
    var saveButton = this.getUI('save');
    saveButton.addClass('disabled');
    saveButton.attr('disabled', 'disabled');
  }
});
```

As `saveButton` here is a jQuery selector, you can call any jQuery methods on
it, according to the jQuery documentation.

#### Referencing UI in events

The UI attribute is especially useful when setting handlers in the
[`events`](#events-and-callback-methods) object, simply use the `@ui.*` prefix:

```javascript
var Mn = require('backbone.marionette');

var MyView = Mn.View.extend({
  template: '#my-template',
  ui: {
    save: '#save-button',
    close: '.close-button'
  },

  events: {
    'click @ui.save': 'handleSave'
  },

  triggers: {
    'click @ui.close': 'close:view'
  },

  handleSave: function() {
    this.model.save();
  }
});
```

By prefixing with `@ui`, we can change the underlying template without having to
hunt through our view for every place where that selector is referenced - just
update the `ui` object.

## Listening to childEvents
A childEvents hash or method permits handling of child view events without manually setting bindings. The values of the hash can either be a function or a string method name on the collection view.

```javascript
// childEvents can be specified as a hash...
let MyView = Marionette.View.extend({

  childEvents: {
    // This callback will be called whenever a child is rendered or emits a `render` event
    render: function() {
      console.log('A child view has been rendered.');
    }
  }
});

// ...or as a function that returns a hash.
let MyView = Marionette.View.extend({

  childEvents: function() {
    return {
      render: this.onChildRendered
    }
  },

  onChildRendered: function () {
    console.log('A child view has been rendered.');
  }
});
```

childEvents also catches custom events fired by a child view. Take note that the first argument to a childEvents handler is the child view itself.

```javascript
// The child view fires a custom event, `show:message`
var ChildView = Marionette.View.extend({

  // Events hash defines local event handlers that in turn may call `triggerMethod`.
  events: {
    'click .button': 'onClickButton'
  },

  // Triggers hash converts DOM events directly to view events catchable on the parent.
  triggers: {
    'submit form': 'submit:form'
  },

  onClickButton: function () {
    this.triggerMethod('show:message', 'foo');
  }
});

// The parent uses childEvents to catch that custom event on the child view
var ParentView = Marionette.View.extend({

  childEvents: {
    'show:message': 'onChildShowMessage',
    'submit:form': 'onChildSubmitForm'
  },

  onChildShowMessage: function (childView, message) {
    console.log('A child view fired show:message with ' + message);
  },
  // Methods called from the triggers hash do not have access to DOM events
  // Any logic requiring the original DOM event should be handled in it's respective view
  onChildSubmitForm: function (childView) {
    console.log('A child view fired submit:form');
  }
});
```

## Events and Callback Methods

There are several events and callback methods that are called
for an View. These events and methods are triggered with the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod)
function which triggers the event and a corresponding `on{EventName}` method.

### `before:render` / `onBeforeRender` event

Triggered before an View is rendered.

```js
Marionette.View.extend({
  onBeforeRender: function() {
    // set up final bits just before rendering the view's `el`
  }
});
```

### `render` / `onRender` event

Triggered after the view has been rendered.
You can implement this in your view to provide custom code for dealing
with the view's `el` after it has been rendered.

```js
Marionette.View.extend({
  onRender: function() {
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### `before:destroy` / `onBeforeDestroy` event

Triggered just prior to destroying the view, when the view's `destroy()` method has been called.

```js
Marionette.View.extend({
  onBeforeDestroy: function() {
    // manipulate the `el` here. it's already
    // been rendered, and is full of the view's
    // HTML, ready to go.
  }
});
```

### `destroy` / `onDestroy` event

Triggered just after the view has been destroyed.

```js
Marionette.View.extend({
  onDestroy: function() {
    // custom destroying and cleanup goes here
  }
});
```

### `before:add:region` / `onBeforeAddRegion` event
The `View` will trigger a "before:add:region"
event before a region is added to the manager. This
allows you to perform some actions on the region before it is added.

### `add:region` / `onAddRegion` event
The `RegionsMixin` will trigger an "add:region"
event when a region is added to the view. This
allows you to use the region instance immediately,
or attach the region to an object that needs a
reference to it:

```javascript
let view = new Marionette.View(),
	 myObject = {};

view.on("add:region", function(name, region) {
  // add the region instance to an object
  myObject[name] = region;
});

view.addRegion("foo", "#bar");
```

### `before:remove:region` / `onBeforeRemoveRegion` event
The `View` will trigger a "before:remove:region"
event before a region is removed from the view.
This allows you to perform any cleanup operations before the region is removed.

```javascript
let view = new Marionette.View();

view.on("before:remove:region", function(name, region) {
  // do something with the region instance here
});

view.addRegion("foo", "#bar");

view.removeRegion("foo");
```

### `remove:region` / `onRemoveRegion` event
The `View` will trigger a "remove:region"
event when a region is removed from the view.
This allows you to use the region instance one last
time, or remove the region from an object that has a
reference to it:

```javascript
let view = new Marionette.View();

view.on("remove:region", function(name, region) {
  // add the region instance to an object
  delete myObject[name];
});

view.addRegion("foo", "#bar");

view.removeRegion("foo");
```

### `detach` / `onDetach` event
The `View` will trigger the "detach" event when the view was rendered and has just been destroyed.

### `before:detach` / `onBeforeDetach` event
The `View` will trigger the "before:detach" event when the view is rendered and is about to be destroyed.
If the view has not been rendered before, this event will not be fired.

### `dom:refresh` / `onDomRefresh`
Triggered just after the view has been attached **and** the view has been rendered.

### modelEvents and collectionEvents

The Marionette View can bind to events that occur on attached models and
collections - this includes both [standard][backbone-events] and custom events.

### Model Events

For example, to listen to a model's events:

```javascript
var MyView = Marionette.View.extend({
  modelEvents: {
    'change:attribute': 'actOnChange'
  },

  actOnChange: function(value, model) {
    console.log('New value: ' + value);
  }
});
```

The `modelEvents` attribute passes through all the arguments that are passed
to `model.trigger('event', arguments)`.

#### Function callback

You can also bind a function callback directly in the `modelEvents` attribute:

```javascript
var MyView = Marionette.View.extend({
  modelEvents: {
    'change:attribute': function() {
      console.log('attribute was changed');
    }
  }
})
```

#### Attaching a function

As with most things in Backbone and Marionette, you can attach a function that
returns the object to to attach to `modelEvents`. This is particularly handy for
binding to events based on options passed into the view:

```javascript
var MyView = Marionette.View.extend({
  modelEvents: function() {
    var events = {};
    var fieldToListenTo = this.getOption('customField');
    events['change:' + fieldToListenTo] = 'customHandler';
    return events;
  },

  customHandler: function() {
    console.log('I will be called based on the value passed into customField');
  }
});
```

### Collection Events

```javascript
var MyView = Marionette.View.extend({
  collectionEvents: {
    sync: 'actOnSync'
  },

  actOnSync: function(collection) {
    console.log('Collection was synchronised with the server');
  }
});
```

#### Function callback

You can also bind a function callback directly in the `modelEvents` attribute:

```javascript
var MyView = Marionette.View.extend({
  collectionEvents: {
    'update': function() {
      console.log('the collection was updated');
    }
  }
})
```

#### Attaching a function

As with most things in Backbone and Marionette, you can attach a function that
returns the object to to attach to `modelEvents`. This is particularly handy for
binding to events based on options passed into the view:

```javascript
var MyView = Marionette.View.extend({
  collectionEvents: function() {
    var events = {};
    var eventToListenTo = this.getOption('customListener');
    events[eventToListenTo] = 'customHandler';
    return events;
  },

  customHandler: function() {
    console.log('I will be called based on the value passed into customListener');
  }
})
```

### Listening to both

If your view has a `model` and `collection` attached, it will listen for events
on both:

```javascript
var MyView = Marionette.View.extend({
  modelEvents: {
    'change:someattribute': 'changeMyAttribute'
  },

  collectionEvents: {
    update: 'modelsChanged'
  },

  changeMyAttribute: function() {
    console.log('someattribute was changed');
  },

  modelsChanged: function() {
    console.log('models were added or removed in the collection');
  }
})
```

In this case, Marionette will bind event handlers to both.

## View serializeData

This method is used to convert a View's `model` or `collection`
into a usable form for a template.

Item Views are called such because they process only a single item
at a time. Consequently, only the `model` **or** the `collection` will
be serialized. If both exist, only the `model` will be serialized.

By default, models are serialized by cloning the attributes of the model.

Collections are serialized into an object of this form:

```js
{
  items: [modelOne, modelTwo]
}
```

where each model in the collection will have its attributes cloned.

The result of `serializeData` is included in the data passed to
the view's template.

Let's take a look at some examples of how serializing data works.

```js
let myModel = new MyModel({foo: "bar"});

new MyView({
  template: "#myItemTemplate",
  model: myModel
});

MyView.render();
```

```html
<script id="myItemTemplate" type="template">
  Foo is: <%= foo %>
</script>
```

If the serialization is a collection, the results are passed in as an
`items` array:

```js
let myCollection = new MyCollection([{foo: "bar"}, {foo: "baz"}]);

new MyView({
  template: "#myCollectionTemplate",
  collection: myCollection
});

MyView.render();
```

```html
<script id="myCollectionTemplate" type="template">
  <% _.each(items, function(item){ %>
    Foo is: <%= foo %>
  <% }); %>
</script>
```

If you need to serialize the View's `model` or `collection` in a custom way,
then you should override either `serializeModel` or `serializeCollection`.

On the other hand, you should not use this method to add arbitrary extra data
to your template. Instead, use [View.templateContext](./marionette.abstractview.md#viewtemplatecontext).
