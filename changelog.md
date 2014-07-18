### v2.0.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v2.0.2...v2.0.3)

  * Bug Fixes

    * Fixed an issue where `before:show` was not triggered on a view's behavior when shown within a region.

    * Destroying a view outside of its region will now cause the region to remove its reference to that view.

### v2.0.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v2.0.1...v2.0.2)

  * Bug Fixes
    * Fixed issue where `render:collection` called before the entire collection and children had been rendered.

  * General
    * Remove bundled main entry point for bower.

### v2.0.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v2.0.0...v2.0.1)
  * Fix missing Wreqr and Babysitter in Core AMD definition.

### v2.0.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.8...v2.0.0)
  * This is a breaking release and contains many API updates and changes, thus changelog is quite large for this release, please refer to the [google doc](https://docs.google.com/document/d/1fuXb9N5LwmdPn-teMwAo3c8JTx6ifUowbqFY1NNSdp8/edit#) for the full details of what is new and what has changed.

### v2.0.0-pre.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v2.0.0-pre.1...v2.0.0-pre.2)
  * The changelog is quite large for this release, please refer to the [google doc](https://docs.google.com/document/d/1fuXb9N5LwmdPn-teMwAo3c8JTx6ifUowbqFY1NNSdp8/edit#)

### v2.0.0-pre.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.5...v2.0.0-pre.1)
  * The changelog is quite large for this release, please refer to the [google doc](https://docs.google.com/document/d/1fuXb9N5LwmdPn-teMwAo3c8JTx6ifUowbqFY1NNSdp8/edit#)

### v1.8.8 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.7...v1.8.8)

  * Fixes
    * Fixed the case where `onShow` was not called on child view behaviors when inside a `Collection` or `Composite` view.

### v1.8.7 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.6...v1.8.7)

  * Fixes
    * Fixed nasty ui interpolation bug with behaviors.

  * General
    * Minor Doc cleanup

### v1.8.6 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.5...v1.8.6)

  * Regions
    * `Region.show` now returns the region instance to allow for region operation chaining.
    * `Region.show` triggers the view's native `triggerMethod` if it exists. This is to handle the case that triggerMethod is wrapped by a `Marionette.Behavior`.

  * General
    * Update jquery 2.x upper bound dependency restrictions.
    * The grunt test command will now complain if you do not have bower components installed.
    * Readme cleanups.

### v1.8.5 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.4...v1.8.5)

  * Fixes
    * Update the UMD build to be inline with the 2.x branch UMD implementation.

### v1.8.4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.3...v1.8.4)

  * General
    * Update bundled build to use the latest version of babysitter and wreqr.

### v1.8.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.2...v1.8.3)

  * Fixes
    * Behaviors now have access to the views options and events during their initialize.

### v1.8.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.8.0...v1.8.2)

  * Fixes
    * Behaviors now calls `stopListening` on close.
    * Behaviors now undelegate `modelEvents` and `collectionEvents` when the parent view calls `undelegateEvents`.

### v1.8.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.7.4...v1.8.0)

  * General
    * Update Gruntfile.
    * The default task (`grunt`) now runs tests.
    * `$ grunt dev` watch for watching.
    * `$ grunt build` runs the tests and compiles.
    * Add better inline documentation for module implementation.
    * Add better inline behavior documentation.

  * Fixes
    * Behaviors now correctly lookup methods for `modelEvents` and `collectionEvents`.
    * The `CollectionView` now triggers close on its children in the correct order.

  * Features
    * Add `onRoute` to the `appRouter`.
    ```js
      Backbone.Marionette.AppRouter.extend({
        onRoute: function(route, params) {
        }
      })
    ```
    * `Region.show` now takes an option to prevent closing the previous view in the region. By default a region will automatically close the previous view, however you can prevent this behavior by passing `{preventDestroy: true}` in the options parameter.
    ```js
    myRegion.show(view2, { preventDestroy: true })
    ```
    * Add  a `getRegion`  method to `Layout`. This is in line with the eventual goal of not attaching regions to the root layout object.
    * Behavior instances now extend from Backbone.Events, allowing you to use `.listenTo` and `.on`.

    * Allow Behaviors to have a functional hash lookup.
    ```js
      Marionette.ItemView.extend({
        behaviors: function() {
          // “this” will refer to the view instance
          return : {
            BehaviorA: {}
          }
        }
      })
    ```
    * RegionManagers now calls `stopListening` on a regions on removal.

  * Refactors
    * Abstract underscore collection method mixin into a generic helper.
    * Use built in marionette extend for behaviors.

  * Tests
    * Add a whitespace linter to the text coverage. Trailing whitespace now causes travis.ci to fail.
    * Add test coverage for `bindEntitiyEvents` and `unbindEntityEvents`.
    * Test public API for the `regionManager`.
    * Improve view trigger tests for better control when testing.

### v1.7.4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.7.3...v1.7.4)

* General
  * Update bower dependencies to take advantage of the fact that marionette repos follow semver.

* Fixes
  * Behaviors events no longer collide with each other.
  * Revert `stopListening` call on `stop` for modules. While this was a "fix", the docs were quite vague leading to breaking changes for many people.
  * `startWithParent` is now respected when using a `moduleClass` property.

### v1.7.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.7.2...v1.7.3)

* Behaviors
  * Adds the ability to use `@ui` interpolation within the events hash on a behavior.

* Fixes
  * Corrects broken view $el proxy in behaviors.

### v1.7.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.7.1...v1.7.2)

* Fixes
  * Binds behavior events to the behavior instance, as compared to the view.

### v1.7.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.7...v1.7.1)

* Fixes
  * Enables the use of string based behavior event methods.

### v1.7.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.6.4...v1.7)

Version 1.7 represents a significant step in formalizing the ways to improve your `view` code though reusable `behaviors`. Say goodbye to custom mixin strategies and welcome `behaviors` into town.

* Behaviors

    A `Behavior` is an  isolated set of DOM / user interactions  that can be mixed into any `View`. `Behaviors` allow you to blackbox `View` specific interactions into portable logical chunks, keeping your `views` simple and your code DRY. **[Read the docs here.](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.behavior.md)**

* Modules
    * Call stop listening on module stop.

* Events
    * add a before:show event for views and regions

* Docs
    * Entire refactor of application docs.

* Tests
    * Rework the module tests to improve readability and consistency.

* General
    * switch from `~` to `^` for *trusted* dependencies.

### v1.6.4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.6.3...v1.6.4)
  * Fixes
    * Patches a bug that would cause modules to be initialized twice when a custom module class is passed

### v1.6.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.6.2...v1.6.3)
  * Improvements
    * Enable more direct module instantiation on `Marionette.App`.
      ```js
        var ItemModule = Marionette.Module.extend({
          startWithParent: false,
          initialize: function(options) {},
          onStart: function() {}
        });

        // ...

        this.app.module('Items', ItemModule);
      ```
    * `ui` hash interpolation now supports a functional `ui` hash.

      ```js
        ui: function() {
          return {
            "foo": ".foo"
          }
        }
      ```
  * Fixes
    * Fix `@ui` interpolation for handling complex selectors.

      ```js
        {
          "click div:not(@ui.bar)": "tapper"
        }
      ```
    * Bump `backbone.babysitter` and `backbone.wreqr` versions.
  * General
    * Improve readme docs for `CollectionView`, `AppRouter` and `ItemView`.
    * Handle THE [npm self sign cert problem](http://blog.npmjs.org/post/78085451721/npms-self-signed-certificate-is-no-more)
    * Replace unneeded argument slicing.
    * Normalize error throwing to use internal `throwError` helper method.
    * Use `_` type checks for non performant code to improve readability and consistency.

### v1.6.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.6.1...v1.6.2)
  * CollectionView/CompositeView
    * allow `itemEvents` to use string based method names [PR 875](https://github.com/marionettejs/backbone.marionette/pull/875)
  * Modules
	* update module initialize to include moduleName and app [PR 898](https://github.com/marionettejs/backbone.marionette/pull/898)
  * General
  	* significantly improve module documentation [PR 897](https://github.com/marionettejs/backbone.marionette/pull/897)

### v1.6.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.6.0...v1.6.1)
  * Modules
    * Fix a bug where a module would not start by default when defined as an object literal

### v1.6.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.5.1...v1.6.0)
  * CompositeView
    * add a `composite:collection:before:render` event

  * CollectionView
    * `checkEmpty` can now be overridden

  * Modules
    * `Modules` can now be created using the extend method, and then attached to an [Application](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.module.md#extending-modules).

  * General
    * add a component.json file
    * update bower.json
    * add AMD build in bower.json

  * Tests
    * general clean up
    * add sinon.js for test spys

### v1.5.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.5.0...v1.5.1)
  * CollectionView/CompositeView
    * Fix bug where `show` and `onDomRefresh` was not called on `itemViews` in certain [conditions](https://github.com/marionettejs/backbone.marionette/pull/866)

### v1.5.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.4.1...v1.5.0)
  * Views
    * View `options` can now be a [function](https://github.com/marionettejs/backbone.marionette/pull/819)
    * `onDomRefresh` is now only called when said `view` is in the [DOM](https://github.com/marionettejs/backbone.marionette/pull/855)

  * CollectionView/CompositeView
    * `itemViewContainer` is now called with the correct [context](https://github.com/marionettejs/backbone.marionette/pull/841)
    * Fix bug where reseting a `collection` within a `collectionView` would cause `onShow` and `onDomRefresh` to be called [incorrectly](https://github.com/marionettejs/backbone.marionette/pull/849) on the itemViews.
    * `addItemView` now returns the `view` that was [added](https://github.com/marionettejs/backbone.marionette/pull/851)
    * You can now specify an `itemEvents` hash or method which allows you to capture all bubbling itemEvents without having to [manually set bindings](https://github.com/marionettejs/backbone.marionette/pull/861).

    ```js
    itemEvents: {
      "render": function() {
        console.log("an itemView has been rendered");
      }
    }
    ```

  * Regions
    * Region `close` event now passes the `view` being closed with the [event](https://github.com/marionettejs/backbone.marionette/pull/834).

  * General
    * Updated bower ignore folder
    * Added an editor config file

### v1.4.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.4.0...v1.4.1)
* Views
  * fix for inital view class options. Now retains set options at class instantiation

### v1.4.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.3.0...v1.4.0)
* Views
  * adds the ability to use the new ```@ui.``` syntax within the events and triggers hash to prevent selector duplication

### v1.3.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.2.3...v1.3.0)
* CompositeView / CollectionView
  * Massive perf boost in rendering collection and composite views by using document fragments [jsPerf](http://jsperf.com/marionette-documentfragment-collectionview/5)

### v1.2.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.2.2...v1.2.3)
* CompositeView
  * Fixed bug where ```child views``` were being added before the initial render, thus raising errors.

### v1.2.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.2.1...v1.2.2)
* Views
	* Move the instantiation of ```view``` options above the ```constructor``` This allows for view options to be accessed from within the ```initialize``` method for a given ```view```
This is needed since backbone views no longer set the view options in the constructor

### v1.2.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.2.0...v1.2.1)
* Views
  * fixed a bug so now view options are {} by default and not undefined.
  * fixed a bug where the triggers preventDefault and stopPropagation were executing in the wrong context – triggers now prevent default and stop propagation by default once more.

### v1.2.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.1.0...v1.2.0)
* Update Backbone to [1.1.0](https://github.com/jashkenas/backbone/compare/1.0.0...1.1.0)

* Views
  * added the ability to customize the behavior of `triggers` preventDefault and stopPropagation

* Collection View / CompositeView
  * added the ability to specifiy `getEmptyView` for dynamic `emptyView` lookups

### v1.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.4...v1.1.0)

* Marionette.View / All Views
  * Fix for `ui` bindings to not be removed from view prototype, if unrendered view is closed
  * Template helpers can now be provided as a constructor function option

* Layout
  * Will properly attach regions if the layout's `close` method was called prior to `render`
  * Calling `.addRegions` will correctly modify the layout instance' region list instead of the prototype's
  * Fixed bug that prevented default `regionType` from being used

* CompositeView
  * The `itemViewContainer` can be supplied in the constructor function options

* Application
  * Added `closeRegions` method to close all regions on the app instance
  * Added `getRegion` method to retrieve a region by name

* AppRouter
  * Added `appRoute` method to create app router handlers at runtime
  * Added ability to set `appRoutes` in constructor function options

* Marionette.triggerMethod
  * Calls to the `Marionette.triggerMethod` can be made on objects that do not have a `trigger` method

### v1.0.4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.3...v1.0.4)

* ItemView
  * Added needed `constructor` function back - it added lots of things and needed to be there

* CompositeView
  * Added explicit call to CollectionView constructor to allow for inheritance overriding

* Layout
  * Small clarification for consistency on call to ItemView constructor

### v1.0.3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.2...v1.0.3)

* ItemView
  * Deleted unneeded `constructor` function - it added nothing and didn't need to be there

* CompositeView
  * Added `index` parameter to method signature, to show that it is available
  * Deleted unneeded `constructor` function and removed call to `getItemView` as it was causing problems and was not needed in the constructor.

* All Views
  * Fixed a bug in the entity and collection event bindings, where `stopListening` would not unbind the event handlers

* Renderer / All Views
  * The `Renderer.render` method will throw a more meaningful error if the supplied template is falsey

* Region
  * Re-showing a closed view now works by re-rendering and re-inserting the view in to the DOM
  * Region will trigger a `show` event when showing a view (updated the code to work like the docs already said)
  * Set the `currentView` before triggering the `show` events from the region / view

* RegionManager
  * Fixed a bug to decrement the `.length` when a region is removed

### v1.0.2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.1...v1.0.2)

* UI Elements
  * Fix bug to unbind them after the "close" event / `onClose` method, so the `ui` elements are available during these

* AppRouter
  * Fix bug that was reversing the order of routes, causing the wrong route to be fired in many cases

### v1.0.1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0...v1.0.1)

* AMD build: Removed `require('jQuery')` as Marionette now pulled `Backbone.$` as
    `Marionette.$`.

* Fixed RegionManager to allow region types to be specified again, not just
  region instances.

* NPM: Removed hard dependency on jQuery from the dependency list. This will
  be pulled in by other libs, or should be pulled in manually, to get the
  right version.

### v1.0.0 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc6...v1.0.0)

* RegionManager
  * Created new `Marionette.RegionManager` object to manage a set of regions

* Region
  * Region will call the `close` method on a view, or the `remove` method if `close` is not found, when closing a view
  * When calling the `show` method with the same view instance multiple times, subsequent calls will only re-render the view and not close / re-open it

* Application
  * Now uses `Marionette.RegionManager` to manage regions

* Layout
  * Now uses `Marionette.RegionManager` to manage regions
  * Now supports dynamic add / remove of regions
  * Can specify `regions` as a function that takes an `options` argument (the view's constructor options)

* CollectionView / CompositeView
  * When specifying `itemViewOptions` as a function, an item `index` argument will be passed as the second parameter
  * Will call the `close` or `remove` method when closing a view, with `close` method taking precedence

* CompositeView
  * Fixed a bug that caused an error when the collection was `reset` (loaded) before the view was rendered

* All Views
  * Closing a view will properly unbind `ui` elements
  * Closing and then re-rendering a view will re-bind the `ui` elements

* Functions
  * Removed the `Marionette.createObject` function - it was never used by Marionette, directly

* jQuery
  * Replaced direct calls to `$` with new `Marionette.$`, which is assigned to
    `Backbone.$` for consistency w/ Backbone.

* Backbone.Wreqr
  * Updated to v0.2.0
  * Renamed `addHandler` method to `setHandler`
  * For more information, see the [Wreqr changelog](https://github.com/marionettejs/backbone.wreqr/blob/master/CHANGELOG.md)

* Code Cleanup
  * Replaced `that = this` with the `context` param of several calls to `_.each` to clean up the code
  * Removed an unused method from the CompositeView implementation

* Build process
  * Updated to Grunt v0.4.x
  * Added code coverage and other analysis reports

### v1.0.0-rc6 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc5...v1.0.0-rc6)

* CompositeView
  * Corrected the timing of the "before:render" event / `onBeforeRender` callback, so that it will be called before serializing the data for the model / template

### v1.0.0-rc5 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc4...v1.0.0-rc5)

* CollectionView / ItemView
  * Corrected the timing on the "show" event / `onShow` callback for itemView instances that are added after the CollectionView is in the DOM

### v1.0.0-rc4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc3...v1.0.0-rc4)

* EventBinder
  * **BREAKING:** Removed `Marionette.addEventBinder` function.

* EventAggregator
  * **BREAKING:** Removed `Marionette.EventAggregator` object. Use `Backbone.Wreqr.EventAggregator` instead

* CollectionView / CompositeView
  * Fixed several issues related to resetting the collection, and producing zombie "empty" views
  * Fixed a bug that caused multiple emptyView instances when resetting the collection
  * Forwarded events from child views are now called with `triggerMethod`, meaning they trigger the event and call the corresponding "onEventName" method

* Modules
  * Finalizers now run with the module as the `this` context

* Marionette.getOption
  * Fixed support for "falsey" values in an object's `options`

* Build process
  * Fixed build process to work on case-sensitive file systems (Linux, for example)

### v1.0.0-rc3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc2...v1.0.0-rc3)

* Updated Backbone v0.9.10

* Updated jQuery to v1.9.0
  * Fixed a few minor unit test issues w/ jQuery update

* Read [the upgrade guide](https://github.com/marionettejs/backbone.marionette/blob/master/upgradeGuide.md) for upgrading from v1.0.0-rc2 to v1.0.0-rc3

### v1.0.0-rc3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc2...v1.0.0-rc3)

* **IMPORTANT:** Be sure to read [the upgrade guide](https://github.com/marionettejs/backbone.marionette/blob/master/upgradeGuide.md) for upgrading from v1.0.0-rc2 to v1.0.0-rc3

* Backbone v0.9.9
  * **BREAKING:** Backbone v0.9.2 is no longer supported
  * Backbone v0.9.9 is now supported

* Marionette.Async
  * **BREAKING:** Marionette.Async is no longer supported

* Backbone.EventBinder / Marionette.EventBinder
  * **BREAKING:** Marionette.EventBinder / Backbone.EventBinder have been removed entirely.
  * Backbone.Events supercedes the older objects
  * Backbone.Wreqr.EventAggregator also supercedes Marionette.EventBinder

* EventBinder -> EventAggregator
  * **BREAKING:** Backbone.Werqr.EventAggregator largely replaces Backbone.EventBinder
  * **BREAKING:** `bindTo` has been replaced with `listenTo`
  * **BREAKING:** `unbindAll` has been replaced with `stopListening`
  * **BREAKING:** `unbindFrom` has been removed and will not be replaced

* Marionette.addEventBinder
  * **BREAKING:** This function will mix in Backbone.Events to the target object if it does not exist
  * **BREAKING:** This function will alter the `listenTo` method of the target to accept a `context` parameter as the 4th parameter of the method

* All Views, Controller, etc
  * **BREAKING:** Backbone.EventBinder is no longer mixed in
  * **BREAKING:** See 'EventBinder -> EventAggregator' changes regarding method names to use for binding / unbinding events

* CollectionView
  * Added `removeChildView` to remove a specific view instance
  * Fixed event handler leak for child views that have been removed
  * Changed the implementation for triggering the "show" event / "onShow" method call, to avoid memory leaks
  * Fixed the `index` parameter for adding a model to the collection, and getting the view in to the right place

* All Views
  * **BREAKING:** The `initialEvents` method has been removed. Use the `initialize` method, the `collectionEvents` or `modelEvents` configuration instead.
  * Allow `modelEvents` and `collectionEvents` to be a function that returns a hash
  * Allow `ui` configuration to be a function that returns a hash
  * `modelEvents` and `collectionEvents` are now delegated / undelegated with Backbone.View's `.delegateEvents` and `.undelegateEvents` method calls
  * View `triggers` now include an `args` object with `args.view`, `args.model` and `args.collection`

* Modules
  * Added alternate syntax for specifying `startWithParent` option
  * Fixed a bug where a module would not be started without an explicit definition for that module (#388 & #400)

### v1.0.0-rc2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-rc1...v1.0.0-rc2)

* CollectionView / CompositeView
  * **BREAKING: ** Changed the `item:added` event to `before:item:added` and `after:item:added`
  * Fixed the `onShow` callbacks, so they can be used in the `initialize` method

* AMD build
  * Fixed the AMD build by adding Backbone.BabySitter to the AMD dependency list

* All Views
  * All views (include Marionette.View) now have a "dom:refresh" and `onDomRefresh` event / method triggered

### v1.0.0-rc1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-beta6...v1.0.0-rc1)

* Fixed IE < 9 support w/ calls to `.apply` when `arguments` was null or undefined

* Module
  * **BREAKING:** Renamed "initialize:before" event to "before:start", for consistency
  * **BREAKING:** Renamed "initialize:after" event to "start", for consistency
  * Triggers a "before:stop" event/method before the module is stopped
  * Triggers a "stop" event/method after the module has been stopped

* Marionette.View
  * **BREAKING**: The `bindBackboneEntityTo` method has been removed from Marionette.View and replaced with `Marionette.bindEntityEvents` function.

* Marionette.bindEntityEvents
  * This function has been extracted from Marionette.View, and will bind an events hash to the events from an entity (model or collection), using the supplied EventBinder object (or any object with a bindTo method)

* Marionette.EventBinder
  * The context of the callback method defaults to the object w/ the `bindTo` method

* CollectionView / CompositeView
  * The "item:added"/`onItemAdded` callback method are now fired after an item view has been rendered and added to it's parent collection view
  * The "itemview:" events - events that are forwarded from item views - can now have a custom prefix with the `itemViewEventPrefix` setting

* ItemView
  * Added a "dom:refresh" event/callback method that fires after a view has been rendered, placed in the DOM with a Marionette.Region, and is re-rendered

* All Views
  * The `modelEvents` and `collectionEvents` can now have a function configured as the value in the `{ "event:name": "value" }` configuration hash
  * A view that uses `bindTo` for its own "close" event will have it's close handler called correctly
  * Returning `false` from the `onBeforeClose` method will prevent the view from being closed

### v1.0.0-beta6 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-beta5...v1.0.0-beta6)

* CollectionView / CompositeView
  * **BREAKING:** The `.children` attribute, used to store child views, is no longer an object literal. It is now an instance of `Backbone.ChildViewContainer` from Backbone.BabySitter
  * Updated to use [Backbone.BabySitter](https://github.com/marionettejs/backbone.babysitter) to store and manage child views

* Controller
  * Added a default `close` method to unbind all events on the controller instance and controller event binder
  * Trigger a "close"/onClose event/method when closing
  * Fixed initialize method so `options` parameter is always a valid object

* Modules
  * Fixed an issue with grand-child modules being defined with a non-existent direct parent, and starting the top level parent directly

### v1.0.0-beta5 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-beta4...v1.0.0-beta5)

* Modules
  * Fixed the `startWithParent` option so that you only have to specify `startWithParent: false` once, no matter how many files the module definition is split in to

### v1.0.0-beta4 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-beta3...v1.0.0-beta4)

* CollectionView / CompositeView
  * **BREAKING:** Changed when the `itemViewOptions` gets called, in order to simplify the `buildItemView` method and make it easier to override
  * **BREAKING:** The `storeChild` method now requires an instance of the item being rendered, as well as the view that was rendered for it

* CompositeView / templateHelpers
  * **BREAKING:** Fixed the `CompositeView` so that `serializeData` is no longer responsible for mixing in the `templateHelpers`

* Controller
  * Added a very basic `Marionette.Controller` object, and basic documentation for it

* Marionette.getOption
  * Added a convience method to get an object's options either from the object directly, or from it's `this.options`, with `this.options` taking precedence
  * Converted use of `this.options` to use `Marionette.getOption` through most of the code

* Marionette.createObject
  * Added a convience method to create an object that inherits from another, as a wrapper / shim around `Object.create`

### v1.0.0-beta3 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-beta2...v1.0.0-beta3)

* Region
  * Fixed "show" method so that it includes the view instance being shown, again

### v1.0.0-beta2 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v1.0.0-beta1...v1.0.0-beta2)

* templateHelpers
  * **BREAKING:** Changed when the templateHelpers is mixed in to the data for a view, so that it is no longer dependent on the `serializeData` implementation

* Region
  * **BREAKING:** Changed "view:show" event to "show"
  * **BREAKING:** Changed "view:closed" event to "close"
  * All region events and events that the triggers from a view are now triggered via Marionette.triggerMethod.

* Marionette.EventAggregator
  * **BREAKING:** The `bindTo` method no longer assumes you are binding to the EventAggregator instance. You must specify the object that is triggering the event: `ea.bindto(ea, "event", callback, context)`
  * Marionette.EventAggregator combines Backbone.Wreqr.EventAggregator with Backbone.EventBinder, allowing the event aggregator to act as it's own event binder

* CollectionView
  * Fixed bug where adding an item to a collection would not allow the CollectionView to propagate the itemView's events
  * Allow `itemViewOptions` to be specified in CollectionView constructor options

* Application
  * The events triggered from the Application object instance are now triggered with corresponding "on{EventName}" method calls

* Backbone.EventBinder
  * Updated to v0.1.0 of Backbone.EventBinder, allowing for jQuery/DOM events to be handled within the EventBinder instances / `bindTo` methods

* AMD Wrapper
  * The "core" AMD wrapper specifies Backbone.Wreqr and Backbone.EventBinder
  * The "standard" AMD wrapper does not specify Backbone.Wreqr / EventBinder, as these are built in

* Build / downloads
  * The standard and AMD versions of `backbone.marionette.js` and `backbone.marionette.min.js` include all dependencies (EventBinder, Wreqr)
  * The "core" versions of `backbone.marionette.js` and `backbone.marionette.min.js` do not include any dependencies (EventBinder, Wreqr)

### v1.0.0-beta1 [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/v0.10.2...v1.0.0-beta1)

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
