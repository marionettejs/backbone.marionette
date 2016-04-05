## [View the new docs](http://marionettejs.com/docs/marionette.view.html)

# Marionette.View

An `View` is a view that, most of the time, represents a single item. That item may be a`Backbone.Model` or may be a `Backbone.Collection`. Whichever it is though, itwill be treated as a single item. It’s also possible to create Views that do not represent items, but just contain regions (which can be filled with View elements as well).View extends directly from `Backbone.View`, which means you’re free to use Backbone’s methods in your Marionette Views.

Note: Since Marionette v3.x, `Marionette.View` will replace `Marionette.LayoutView` and `Marionette.ItemView`.

## Documentation Index

* [View render](#itemview-render)
* [Rendering A Collection In An View](#rendering-a-collection-in-an-itemview)
* [Template-less View](#template-less-itemview)
* [Events and Callback Methods](#events-and-callback-methods)
  * ["before:render" / onBeforeRender event](#beforerender--onbeforerender-event)
  * ["render" / onRender event](#render--onrender-event)
  * ["before:destroy" / onBeforeDestroy event](#beforedestroy--onbeforedestroy-event)
  * ["destroy" / onDestroy event](#destroy--ondestroy-event)
* [View serializeData](#itemview-serializedata)
* [Organizing ui elements](#organizing-ui-elements)
* [modelEvents and collectionEvents](#modelevents-and-collectionevents)

## Rendering

Unlike Backbone Views, all Marionette views come with a powerful render method.
In fact, the primary differences between the views are the differences in their
render methods. It goes without saying that it is unwise to override the `render`
method of any Marionette view. Instead, you should use the [`onBeforeRender` and `onRender` callbacks](#events-and-callback-methods)
to layer in additional functionality to the rendering of your view.

The `View` defers to the `Marionette.Renderer` object to do the actual
rendering of the template.

The view instance is passed as the third argument to the
`Renderer` object's `render` method, which is useful in custom
`Renderer` implementations.

### Templates
A Marionette view usually consists of a template. You can set a `template` attribute in the definition or pass a `template: "#tpl-product-layout"` parameter to the constructor options.

The passed template will be used whenever your view will be rendered. Most of the times your views will have templates, which will help you display the data you want.

#### Passing a template

Your template can be passed to your view in two ways:

1) A jQuery selector (e.g.: `#tpl-template`) referring to the DOM element passed as a string:

```js
let MyView = new Marionette.View({
	template: "#tpl-product-layout"
});

new MyView().render();
```

2) A function taking a single argument: the object returned by [View.serializeData](#itemview-serializedata). 

Using a template function allows passing custom arguments into the `_.template` function and allows for more control over how the `_.template` function is called.

```js
let my_template_html = '<div><%= args.name %></div>';
let MyView = Marionette.View.extend({
  template: function(serialized_model) {
    let name = serialized_model.name;
    return _.template(my_template_html)({
        name : name,
        some_custom_attribute : some_custom_key
    });
  }
});

new MyView().render();
```

For more information on the _.template function see the [Underscore docs](http://underscorejs.org/#template).

#### Templateless views

An `View` can be attached to existing elements as well. The primary benefit of this is to attach behavior and events to static content that has been rendered by your server (typically for SEO purposes). To set up a template-less `View`, your `template` attribute must be `false`.

```html
<div id="my-element">
  <p>Hello World</p>
  <button class="my-button">Click Me</button>
</div>
```

```js
let MyView = Marionette.View.extend({
  el: '#my-element',

  template: false,

  ui: {
    paragraph: 'p',
    button: '.my-button'
  },

  events: {
    'click @ui.button': 'clickedButton'
  },

  clickedButton: function() {
    console.log('I clicked the button!');
  }
});

let view = new MyView();
view.render();

view.ui.paragraph.text();        // returns 'Hello World'
view.ui.button.trigger('click'); // logs 'I clicked the button!'
```

Another use case is when you want to attach a `Marionette.View` to a SVG graphic or canvas element, to provide a uniform view layer interface to non-standard DOM nodes. By not having a template this allows you to also use a view on pre-rendered DOM nodes, such as complex graphic elements.

## Rendering A Collection In An View

The most common way to render a Backbone.Collection is to use
a `CollectionView`. If you just need to render a
simple list that does not need a lot of interaction, it does not
always make sense to use these. A `Backbone.Collection` can be
rendered with a simple `View`, using the templates to iterate
over an `items` array.

```js
<script id="some-template" type="text/html">
  <ul>
    <% _.each(items, function(item){ %>
    <li> <%= item.someAttribute %> </li>
    <% }); %>
  </ul>
</script>
```

The important thing to note here, is the use of `items` as the
variable to iterate in the `_.each` call. This will always be the
name of the variable that contains your collection's items.

Then, from JavaScript, you can define and use an View with this
template, like this:

```js
let MyItemsView = Marionette.View.extend({
  template: "#some-template"
});

let view = new MyItemsView({
  collection: someCollection
});

// show the view via a region or calling the .render method directly
```

Rendering this view will convert the `someCollection` collection in to
the `items` array for your template to use.

For more information on when you would want to do this, and what options
you have for retrieving an individual item that was clicked or
otherwise interacted with, see the blog post on
[Getting The Model For A Clicked Element](http://lostechies.com/derickbailey/2011/10/11/backbone-js-getting-the-model-for-a-clicked-element/).

## Events and Callback Methods

There are several events and callback methods that are called
for an View. These events and methods are triggered with the
[Marionette.triggerMethod](./marionette.functions.md#marionettetriggermethod) function, which
triggers the event and a corresponding "on{EventName}" method.

### "before:render" / onBeforeRender event

Triggered before an View is rendered.

```js
Marionette.View.extend({
  onBeforeRender: function() {
    // set up final bits just before rendering the view's `el`
  }
});
```

### "render" / onRender event

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

### "before:destroy" / onBeforeDestroy event

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

### "destroy" / onDestroy event

Triggered just after the view has been destroyed.

```js
Marionette.View.extend({
  onDestroy: function() {
    // custom destroying and cleanup goes here
  }
});
```

### "before:add:region" / onBeforeAddRegion event
The `View` will trigger a "before:add:region"
event before a region is added to the manager. This
allows you to perform some actions on the region before it is added.

### "add:region" / onAddRegion event
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

### "before:remove:region" / onBeforeRemoveRegion event
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

### "remove:region" / onRemoveRegion event
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

### "detach" / onDetach event
The `View` will trigger the "detach" event when the view was rendered and has just been destroyed.

### "before:detach" / onBeforeDetach event
The `View` will trigger the "before:detach" event when the view is rendered and is about to be destroyed.
If the view has not been rendered before, this event will not be fired.

### "dom:refresh" / onDomRefresh
Triggered just after the view has been attached **and** the view has been rendered.

## Regions
A `View` can be used to hold a collection of regions. Each `Region` could display another `View` or `CollectionView`.

Regions provide consistent methods to manage, show and destroy views in your applications and layouts. They
are ideal for rendering application layouts with multiple sub-regions
managed by specified region managers.

Each Region added to a View will become a `Region` instance. 

Additionally, interactions with `Marionette.Region`
will provide features such as `onRender` callbacks, etc. Please see
the Region documentation for more information.

### Basic usage
Regions can be added to a `View` in two ways:

1) Passing a regions hash to to the View's constructor:

```javascript
let view = new Marionette.View({
	template: "#tpl-view-with-regions",
	
	regions: {
		firstRegion: "#first-region",
		secondRegion: "#second-region"
	}
});
```

2) Using the `Region` API:

 
```
let view = new Marionette.View();

view.addRegion("foo", "#foo");
view.getRegion('foo').show(new someView(), options);
```

There are also helpful shortcuts for more concise syntax.

```
view.showChildView('menu', new MenuView(), options);
```

```
view.showChildView('content', new MainContentView(), options);
```

### Specifying regions as functions
Regions can be specified on a View using a function that returns an object with the region definitions. The returned object follow the same rules for defining a region, as outlined above.

```
Marionette.View.extend({
  regions: function(options){
    return {
      fooRegion: "#foo-element"
    };
  }
});
```

Note that the function receives the view's options arguments that were passed in to the view's constructor. this.options is not yet available when the regions are first initialized, so the options must be accessed through this parameter.

### Region options
A `View` can take a `regions` hash that allows you to specify regions per `View` instance.

```
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

```
let ParentView = Marionette.View.extend({
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

## Listening to childEvents
A childEvents hash or method permits handling of child view events without manually setting bindings. The values of the hash can either be a function or a string method name on the collection view.

```
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

```
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

## Organizing UI Elements

As documented in [Marionette.AbstractView](./marionette.abstractview.md), you can specify a `ui` hash in your `view` that
maps UI elements by their jQuery selectors. This is especially useful if you access the
same UI element more than once in your view's code. Instead of
duplicating the selector, you can simply reference it by
`this.getUI('elementName')`:

You can also use the ui hash values from within events and trigger keys using the ```"@ui.elementName"```: syntax

```js
Marionette.View.extend({
  tagName: "tr",

  ui: {
    checkbox: "input[type=checkbox]"
  },

  onRender: function() {
    if (this.model.get('selected')) {
      this.getUI('checkbox').addClass('checked');
    }
  }
});
```

## modelEvents and collectionEvents

Views can bind directly to model events and collection events
in a declarative manner:

```js
Marionette.View.extend({
  modelEvents: {
    "change": "modelChanged"
  },

  collectionEvents: {
    "add": "modelAdded"
  }
});
```

For more information, see the [Marionette.AbstractView](./marionette.abstractview.md) documentation.
