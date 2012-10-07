### v1.0.0-beta1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.10.2...dev)

* Backbone.EventBinder
  * **BREAKING:** Marionette's EventBinder has been extracted to the Backbone.EventBinder repository and plugin. You must include this file in your app, available at https://github.com/marionettejs/backbone.eventbinder

* Backbone.Wreqr
  * **BREAKING:** Marionette's EventAggregator has been extracted to the Backbone.Wreqr repository and plugin. You must include this file in your app, available at https://github.com/marionettejs/backbone.wreqr

* All Views
  * **BREAKING:** `beforeRender` method is now `onBeforeRender`
  * **BREAKING:** `beforeClose` method is now `onBeforeClose`
  * **BREAKING:** The `render` method for all Marionette views is bound to the view instance
  * All view events are now triggered with `triggerMethod`, calling their corresponding method on the view if it exists
  * All views now have an `isClosed` attribute on them, which is set to `true` when calling the `close()` method and reset to `false` when calling the `render()` method
  * EventBinder is now attached to the views with the `Marionette.addEventBinder` method call

* CompositeView
  * **BREAKING:** CompositeView will only render a model in to it's template, instead of a model or collection. It will still render the collection as itemView instances.

* Modules
  * **BREAKING:** Split module definitions can now receive custom args per module definition, instead of sharing / replacing them across all definitions

* CollectionView / CompositeView
  * Cleaned up the `getItemViewContainer` code, and improved the error that is thrown when the specified container element is not found
  * Can attach existing view instance w/ existing DOM element as child of collection view / composite view, in parent's `initialize` function
  * Fixed a bug where an undefined `this.options` would prevent child views from being rendered, trying to find the index of the view

* Layout
  * Allow a Layout to be defined without `regions`, using Underscore v1.4.x

* View / ItemView / CompositeView
  * Removed the `serializeData` method and added directly to `ItemView` and `CompositeView` as needed

* Application
  * Application regions can now be specified as a jQuery selector string, a region type, or an object literal with a selector and type: `{selector: "#foo", regionType: MyCustomRegion}`
  * added `.commands` as instance of Backbone.Wreqr.Commands, to facilitate command execution
  * added `.execute` method for direct command execution
  * added `.reqres` as instance of Backbone.Wreqr.RequestResponse, to facilitate request/response execution
  * added `.request` method for direct requesting of a response

* Marionette.triggerMethod
  * Added `Marionette.triggerMethod` method to trigger an event and call the corresponding method. For example, `view.triggetMethod("before:render")` will trigger the "before:render" event and call the `onBeforeRender` method.

* Marionette.addEventBinder
  * Added `Marionette.addEventBinder` method to add all of the Backbone.Wreqr.EventBinder methods to a specified target object

* Misc
  * Added `Marionette.extend` as alias to Backbone's `extend` method for more consistent use
  * jQuery ($) support now works from global `$` or `window.jQuery`
  * Updated to Underscore.js v1.4.1
  * Updated to jQuery v1.8.2

### v0.10.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.10.1...v0.10.2)

* Callbacks
  * Fixed a bug that caused callbacks to fire multiple times after calling `reset`

* Layout
  * Fixed a bug that prevented the regions from being re-initialized correctly, when using `render` as a callback method for an event

### v0.10.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.10.0...v0.10.1)

* Modules
  * Fixed a bug when defining modules in reverse order, that prevented `startWithParent` from working correctly

### v0.10.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.13...v0.10.0)

* Modules
  * **BREAKING:** Module definition functions are executed immediately and only once, not every time you call `start`
  * **BREAKING:** Renamed `startWithApp` to `startWithParent` in module definitions
  * **BREAKING:** Sub-modules rely on the parent module to start them, by default, but can be started manually
  * **BREAKING:** Sub-modules default to starting with their parent module start
  * **BREAKING:** Specifying `startWithParent: false` for a sub-module will prevent the module from being started when the parent starts
  * **BREAKING:** Specifying `startWithParent: false` for a top-level module will prevent the module from being started when the parent `Application` starts
  * **BREAKING:** When starting a module, sub-modules will be started / initialized before parent modules (depth-first hierarchy traversal)
  * **BREAKING:** When stopping a module, sub-modules will be stopped / finalized before parent modules (depth-first hierarchy traversal)
  * Fixed: retrieving a module by name (`var foo = MyApp.module("Foo");`) will not change the module's definition or `startWithParent` setting

* CollectionView
  * Allow `itemViewOptions` to be a function, which recieves the `item` as an argument

* Callbacks
  * Added `reset` method to reset the list of callbacks and allow them to be run again, when needed

### v0.9.13 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.12...v0.9.13)

* CollectionView
  * Fixed bug that prevented "collection:closed" event from being triggered
  * Allow different item view to be rendered for each item in collection by overriding `getItemView` method

* CompositeView
  * Allow different item view to be rendered for each item in collection by overriding `getItemView` method

* Layout
  * Regions are initialized before prototype constructor, or `initialize` function are called

* All Views
  * Adds declarative event binding for models and collections. See [Marionette.View documentation](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.view.md) for more information.

* Build and test
  * Removed all dependencies on Ruby, in favor of NodeJS and Grunt

### v0.9.12 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.11...v0.9.12)

* Moved [Marionette.Async](https://github.com/marionettejs/backbone.marionette.async) to it's own repository
* De-linted source code
* Corrected throwing an "Exception" to throwing an "Error"

### v0.9.11 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.10...v0.9.11)

* JamJS Support
  * Updated the `package.json` file with more detail and support for [JamJS](http://jamjs.org/).

* Layout
  * Fixed a global variable leak

### v0.9.10 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.9...v0.9.10)

* ItemView and Layout
  * **BREAKING:** Removed the default implementation of `initialEvents`, so that a collection "reset" event won't cause the ItemView or Layout to re-render
* Build Process
  * Changed from Anvil.js to Grunt.js for the build process

### v0.9.9 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.8...v0.9.9)

* Regions
  * Added a `reset` method to regions, which closes the open view and deletes the region's cached `el`

### v0.9.8 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.7...v0.9.8)

* Modules
  * Fixed a bug that ensures modules will start and stop the correct number of times, instead of always stopping immediately after they have been stopped once

### v0.9.7 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.6...v0.9.7)

* Modules
  * Fixed a bug to ensure modules are only started once, no matter how many definitions the module is split in to

* View Templates
  * Better support for pre-compiled templates - can specify a function as the `template` setting for a view, and the function will be run as the template, directly.

### v0.9.6 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.5...v0.9.6)

* All Marionette Views
  * Fixed bug that prevented `bindTo` function and other `EventBinder` functions from being available in `initialize` method of views

### v0.9.5 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.4...v0.9.5)

* Layout
  * Fixed a typo / bug in default Region type used for layouts

### v0.9.4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.3...v0.9.5)

* BindTo -> EventBindings
  * **BREAKING:** Renamed `Marionette.BindTo` to `Marionette.EventBindings` and made it a constructor function instead of an object literal

* Modules
  * **BREAKING:** Changed the API of `Module.create` to be more clear and explicit about `app` parameter
  * **BREAKING:** Defer module definition until module is started
  * Modules now have `addInitializer` method to add initializers
  * Modules can be started (run the initializers) with `start` method
  * Modules are automatically started when Marionette.Application `start` method is called
  * App.start sends options to module initializers
  * Modules that are defined (or loaded from external source) afer app is started will auto-start by default
  * Can specify a module is not started with the app, to prevent the module from being started when app.start is called
  * Calling `start` on a module will start all of the sub-modules for that module

* CollectionView/CompositeView
  * Correctly handles non-existent collection and removing child item views that were added manually
  * Corrected showing empty view and closing empty view when resetting collection and adding items
  * Fixed bug to prevent showing the empty view more than once when rendering the collection view

* Application
  * Added a `removeRegion` method to close / remove regions, as a counter-function to the `addRegions` method

* Marionette.View (all views / base view)
  * Can specify a set of `ui` elements that are cached jQuery selectors

* Layout
  * An already closed layout can be re-rendered, and the regions will regenerate
  * Allow a custom region type to be specified for all regions, as well as per-region instance

### v0.9.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.2...v0.9.3)

* CompositeView
  * Cleaned up the method to get / cache the `itemViewContainer`
  * Allow `itemViewContainer` to be a function that return a jQuery selector string

* View `render` methods all return `this` in the standard Marionette views (the async views still return a deferred object).

### v0.9.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.1...v0.9.2)

* CompositeView
  * Added `itemViewContainer` to specify which element children / itemView instances should be appended to

* CollectionView
  * Now triggers "before:render" and "render" events

* Region
  * Returns a deferred/promise from the `show` method, with Marionette.Async

* Fixed bug in template cache for Marionette.Async

* Marionette can now be installed with [Volo](https://github.com/volojs/volo)

### v0.9.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.9.0...v0.9.1)

* CollectionView and CompositeView properly close their `emptyView` instance when an item is added to the view's collection
* CollectionView and CompositeView will show their `emptyView` after the last item has been removed from the collection

### v0.9.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.8.4...v0.9.0)

* **BREAKING** Async Support Removed From Core Marionette
  * Marionette no longer supports asynchronous / deferred rendering in any view, by default
  * Async / deferred rendering are now provided via `backbone.marionette.async.js` add-on

* Split the single src/backbone.marionette.js file into multiple files for easier maintenance

* Marionette.Async:
  * Added `Marionette.Async` add-on which provides support for rendering and retrieving templates asynchronously

* Marionette.View:
  * **BREAKING** Renamed the `getTemplateSelector` method to `getTemplate`
  * Call `unbindAll` to unbind all bound events, later in the close process, so the `close` event can be listened to

* ItemView:
  * **BREAKING** The `template` attribute no longer allows you to specify a function that returns a jQuery selector. Override `getTemplate` to do this.
  * **BREAKING** The `renderHtml` method has been removed from the ItemView
  * **BREAKING** Async support removed

* CollectionView:
  * **BREAKING** Async support removed
  * Now supports optional `emptyView` attribute, to specify what view to render when no items exist in the collection
  * Fixed a memory leak for closed item views
  * ItemView is now guaranteed to have it's "onRender" and "onShow" methods called, when rendering the collection and when adding a new item to the collection / rendering the new item view
  * Calls an `onItemAdded` method when adding an item/item view, just prior to rendering the item view
  * Can now specify an `itemViewOptions` object literal on your collection view definition, and the data will be passed to each itemView instance as part of the itemView's options
  * The `appendHtml` method receives a third argument of the itemView's "index" for sorted collections

* CompositeView:
  * **BREAKING** When a CompositeView's collection is reset, only the collection will be re-rendered. It will no longe re-render the composite's template/model, just the collection.
  * **BREAKING** Async support removed
  * (see change list for `CollectionView`)

* Layout:
  * **BREAKING** Regions specified within a layout are now available immediately after creating a layout instance
  * **BREAKING** Re-rendering a layout will close all regions and reset them to the new DOM elements that were rendered
  * **BREAKING** Layouts no longer have a `.vent` event aggregator hanging off them
  * **BREAKING** Async support removed

* Region:
  * **BREAKING** Removed the ability to send a second parameter to a regions' "show" method
  * **BREAKING** Changed the implementation of `Region` to allow easier overriding of how the new view is added to the DOM
  * **BREAKING** Async support removed

* TemplateCache:
  * **BREAKING** Moved TemplateCache to object instances instead of single object literal
  * **BREAKING** Moved the `loadTemplate` and `compileTemplate` to `TemplateCache.prototype`
  * **BREAKING** `TemplateCache.get` no longer accepts a callback method. It always returns jQuery promise

* Renderer:
  * **BREAKING** Removed the `renderHtml` method
  * Rendering a pre-compiled template function is now much easier - just override the `Renderer.render` method.

* Modules:
  * **BREAKING** Modules must be defined on an instance of a Marionette.Application, and cannot be defined from another module directly
  * **BREAKING** Modules no longer allow you to return a custom module object from the module definition function
  * **BREAKING** Modules no longer allow you to add initializers to them
  * **BREAKING** Modules no longer have a `.vent` event aggregator hanging off them
  * Extracted `Marionette.Module` in to it's own constructor function to be used as modules, instead of Marionette.Application
  * Modules allow you to pass in any arbirary arguments, after the module definition function, and they will be supplied to the module definition function
  * The `this` argument in a module definition function is now the module itself

* Callbacks:
  * **BREAKING** Switched the order of parameters for the `run` method to `args, context`

* BindTo:
  * The unbinding of an event now considers the `context` parameter when unbinding, allowing multiple handers to be bound to the same event from the same object, and unbinding only one of them

### v0.8.4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.8.3...v0.8.4)

* Fixed: A call to `.module` will correctly pass the `Application` instance from which `.module` was called, as the second parameter of the module definition function

### v0.8.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.8.2...v0.8.3)

* Module definitions can be split across multiple files and/or multiple calls to define the module

### v0.8.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.8.1...v0.8.2)

* Views now have the ability to define `triggers` which will convert a DOM event in to a `view.trigger` event

### v0.8.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.8.0...v0.8.1)

* Module definition functions will only be applied to the last module in the . chain

### v0.8.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.7.6...v0.8.0)

* Added modules and sub-modules through the Application object

### v0.7.6

* An `itemView` instance as part of a Collection View or Composite View, will have it's events bubbled up through the parent view, prepended with "itemview:" as the event name

### v0.7.5

* The `onBefore` method of ItemView can now return a deferred object
* Code cleanup for rendering methods

### v0.7.4

* Fixed issue with `unbindAll` in BindTo, that was skipping some items

### v0.7.3

* The `bindTo` method on the `EventAggregator` now returns a binding configuration object
* Automatic mixing in of `templateMethods` as template / view helper methods, in views that use the `serializeData` function
* A friendlier error message will be thrown from an appRouter if a route is configured with a method that does not exist on the controller

### v0.7.2

* Extracted `compileTemplate` method in TemplateCache for clarity and easier modification
* ItemView will wait until `onRender` has completed before triggering other rendered events
* Region now supports an `onShow` method, when defining a custom region
* Moved the default `serializeData` method to the base Marionette.View
* CompositeView now calls the `serializeData` method to get the model's data for the view
* `BindTo` changes:
  * The `bindTo` method returns a "binding" object so that it can be unbound easily
  * Now has an `unbindFrom` method that will unbind a binding object

### v0.7.1

* ItemView now has a `renderHtml` method that can be overriden to render the item view's data
* Region now supports an `initialize` function when extending a region to your own object type
* CollectionView correctly defers until all children are rendered
* Underscore templates are cached as pre-compiled templates, instead of re-compiling them on every render
* Updating AMD support to also work with CommonJS / NodeJS
* Correctiong build to include header / license info for all output files
* Pass JSLint with no warnings (run w/ Anvil.js build process)
* Removed GZip release files, as they were broken anyways

### v0.7.0

* **BREAKING**: The `renderTemplate` method has moved from the `ItemView` prototype on to the `Renderer` object
* **BREAKING**: The `appendHtml` method of the `CollectionView` now takes `collectionView, itemView` as the arguments, instead of `el, html`
* Added `Marionette.View` object, to contain a few basic parts of every Marionette view
* Added `Marionette.Renderer` object, to handle template rendering
* Views correctly trigger the "close" events before unbinding event subscribers
* Additional `CollectionView` changes: 
  * Extracted `getItemView` method to retrieve the `itemView` type, either from `this.itemView` or `this.options.itemView`
  * Extracted `buildItemView` method to build each item's view
  * Renamed `removeChildView` to `removeItemView` to make the language consistent
  * Triggers "item:added" event after each item has been added
  * Triggers "item:removed" event after an item has been removed
* `CompositeView` changes:
  * No longer takes a `modelView`. Now directly renders the `template` specified
  * Defaults to a recurive structure, where `itemView` is the current composite view type
* A `Region` will trigger a `show` event from any view that it shows
* Added common "render" event to all the view types
* Updated to Backbone v0.9.2
* Updated to jQuery v1.7.2
* AMD / RequireJS compliant version is provided
* Now using [Anvil.js](https://github.com/arobson/anvil.js) for builds

#### v0.6.4

* CollectionView and CompositeView can render without a collection

#### v0.6.3

* `ItemView` changes
  * Calls a `beforeRender` and `beforeClose` method on the view, if it exists
  * Triggers a `item:before:render` event, just prior to rendering
  * Triggers a `item:before:close` and `item:closed` events, around the view's `close` method
* `CollectionView` changes
  * Calls a `beforeRender` and `beforeClose` method on the view, if it exists
  * Triggers a `collection:before:render` event before rendering
  * Triggers a `collection:before:close` and `collection:closed` event, surrounding closing of the view
* The `CollectionView` and `CompositeView` now close child views before closing itself

#### v0.6.2

* **BREAKING:** The `CollectionView` no longer has a `reRender` method. Call `render` instead
* **BREAKING:** The `TemplateCache.get` method now returns a plain string instead of a jQuery selector object
* Fixed a bug with closing and then re-using a Layout with defined regions
* Fixed a potential race condition for loading / caching templates where a template would be loaded multiple times instead of just once

#### v0.6.1

* Fixed the composite view so that it renders the collection correctly when the collection is "reset"
* Fixed the composite view so that it re-renders correctly
* Fixed various deferred usages to only return promises, instead of the full deferred object

#### v0.6.0

* **BREAKING:** Renamed `LayoutManager` to `Layout`
* **BREAKING:** Renamed `RegionManager` to `Region`
* **BREAKING:** Renamed `TemplateManager` to `TemplateCache`

* **Layout**
  * **BREAKING:** `Layout.render` no longer returns the view itself, now returns a jQuery deferred object
  * The `.vent` attribute is now available in the `initializer` method
  * Ensures that regions select the `$el` within the Layout's `$el` instead of globally on the page
  * Initialize the regions before the layout, allowing access to the regions in the `onRender` method of the layout
  * Close the Layout's regions before closing the layout itself

* **CompositeView**
  * **BREAKING:** `CompositeView.render` no longer returns the view itself, now returns a jQuery deffered object
  * Will only render the collection once. You can call `renderCollection` explicitly to re-render the entire collection
  * Will only render the model view once. You can call `renderModel` explicitly to re-render the model
  * Correctly close and dispose of the model view
  * Triggers various events during rendering of model view and collection view
  * Calls 'onRender' method of composite view, if it exists

* **ItemView**
  * **BREAKING:** `ItemView.render` no longer returns the view itself, now returns a jQuery deferred object
  * Optimization to only call `.toJSON` on either model or collection, not both
  * Trigger "item:rendered" method after rendering (in addition to calling onRender method of the view)

* **CollectionView**
  * **BREAKING:** `CollectionView.render` no longer returns the view itself, now returns a jQuery deferred object
  * Trigger "collection:rendered" method after rendering (in addition to calling onRender method)

* Large updates to the readme/documentation
* Heavy use of `jQuery.Deferred()` and `jQuery.when/then` to better support asynchronous templates and rendering

#### v0.5.2

* **BREAKING:** Renamed `CompositeRegion` to `LayoutManager`
* Aliased CompsiteRegion to LayoutManager for backwards compatibility
* Bug fix for correctly initializing LayoutManager with specified options in constructor

#### v0.5.1

* Controller methods fired from an `AppRouter` are now called with `this` set to the controller, instead of the router
* Fixed a bug in the CompositeView where the list wouldn't render when passing in a populated collection

#### v0.5.0

* **BREAKING:** Extraced `CompositeView` out of the collection view
* Added `CompositeView` for managing leaf-branch/composite model structures
* Added `CompositeRegion` for managing nested views and nested region managers
* Added `attachView` method to `RegionManager` to attach existing view without rendering / replacing
* Specify how to attach HTML to DOM in region manager's `show` method

#### v0.4.8

* Don't re-render an ItemView when the view's model "change" event is triggered

#### v0.4.7

* Allow `RegionManager` to be instantiated with an `el` specified in the options
* Change how RegionManagers are added to an Application instance, to reduce memory usage from extraneous types

#### v0.4.6

* AppRouter can have it's `controller` specified directly in the router definition or in the construction function call
* Extracted `Marionette.EventAggregator` out in to it's own explicit object

#### v0.4.5

* CollectionView closes existing child views before re-rendering itself, when "reset" 
event of collection is triggered
* CollectionView now has "initialEvents" method which configures it's initial events
* ItemView now has "initialEvents" method which configures it's initial events

#### v0.4.4

* CollectionView renders itself when the view's collection "reset" event is fired
* ItemView renders itself when the view's model "change" event is fired
* ItemView renders itself when the view's collection "reset" event is fired

#### v0.4.3

* Fixed bug with RegionManagers trying to select element before DOM is ready, to lazy-select the element on first use of `show`

#### v0.4.2

* **BREAKING:** Removed the `setOptions` method from the `Callbacks` object
* Refactored `Callbacks` object to use a jQuery Deferred instead of my own code
* Fixed template manager's `clear` so it properly clears a single template, when only one is specified
* Refactored the `RegionManager` code to support several new features
  * now support returning a jQuery deferred object from a view's `render` method
  * now have a `close` method that you can call to close the current view
  * now trigger a "view:show" and "view:close" event
  * correctly remove reference to previous views, allowing garbage collection of the view
  * now support the `bindTo` and `unbindAll` methods, for binding/unbinding region manager events

#### v0.4.1

* Minor fix to context of template manager callback, to fix issue w/ async template loading

#### v0.4.0

* **BREAKING:** Rewrote the template manager to be async-template loading friendly
* **BREAKING:** Dropping support for Backbone v0.5.3 and below
* Added `Marionette.Callbacks` to manage a collection of callbacks in an async-friendly way
* Guarantee the execution of app initializer functions, even if they are added after the app 
has been started.
* App triggers "start" event after initializers and initializer events
* Updated to Backbone v0.9.1

#### v0.3.1

* Make region managers initialize immediately when calling `app.addRegions`

#### v0.3.0

* **BREAKING:** `view.el` for `ItemView` and `CollectionView` is no longer a jQuery selector object. Use `view.$el` instead
* **BREAKING:** `regionManger.el` is no longer a jQuery selector object. Use `regionManager.$el` instead
* Updated to use Backbone v0.9.0
* Updated to use Underscore v1.3.1
* Removed default `itemView` from the `CollectionView` definition
* `CollectionView` now explicitly checks for an `itemView` defined on it, and throws an error if it's not found

#### v0.2.6

* Bind the context (`this`) of application initializer functions to the application object

#### v0.2.5

* Added `AppRouter`, to reduce boilerplate routers down to simple configuration
* `CollectionView` can be treated as a composite view, rendering an `model` and a `collection` of models
* Now works with either jQuery, Zepto, or enter.js
* `ItemView` will throw an error is no template is specified

#### v0.2.4

* Return `this` (the view itself) from `ItemView` and `CollectionView` `render` method
* Call `onRender` after the `CollectionView` has rendered itself

#### v0.2.3

* Fixed global variable leaks
* Removed declared, but unused variables

#### v0.2.2

* Fixed binding events in the collection view to use `bindTo` (#6)
* Updated specs for collection view
* Documentation fixes (#7)

#### v0.2.1

* Added `TemplateManager` to cache templates
* CollectionView binds to add/remove and updates rendering appropriately
* ItemView uses `TemplateManager` for template retrieval
* ItemView and CollectionView set `this.el = $(this.el)` in constructor

#### v0.2.0

* Added `ItemView`
* Added `CollectionView`
* Added `BindTo`
* Simplified the way `extend` is pulled from Backbone

#### v0.1.0

* Initial release
* Created documentation
* Generated annotated source code
