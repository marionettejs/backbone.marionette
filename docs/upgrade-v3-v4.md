# Upgrade Guide from v3 to v4

Marionette 4 introduces a number of breaking changes. This upgrade guide will go
through the major changes and describe how to change your application to
accommodate them.

## Required changes
These are breaking changes that need to be handled when migrating from Marionette v3 to v4

#### CompositeView was removed
 * **Old behavior:** `CompositeView` class was provided
 * **New behavior:** `CompositeView` does not exists
 * **Reason:** API simplification
 * **Remedy:** Use `CollectionView` instead. Most features of `CompositeView` were added to `CollectionView` and in common cases a class rename is enough. 
 
One of the required changes is to explicitely define the `childView` when implementing a recursive (tree) view

   ```javascript
   // with compositeview
   const TreeView = CompositeView.extend({
     template: 'node-template'
   })

   // with colecctionview
   const TreeView = CollectionView.extend({
     template: 'node-template',
     childView () {
       return TreeView
     }
   })   
   ```

#### NextCollectionView was renamed to CollectionView
 * **Old behavior:** Both `NextCollectionView` and `CollectionView` were provided
 * **New behavior:** Only `CollectionView`, based on `NextCollectionView` is provided. The old `CollectionView` implementation was removed
 * **Reason:** API simplification
 * **Remedy:** Use `CollectionView` instead

#### Marionette global instance is not attached to Backbone global instance
 * **Old behavior:** Marionette could be acessed using `Backbone.Marionette`
 * **New behavior:** Marionette is not attached to `Backbone` global instance
 * **Reason:** Support named exports
 * **Remedy:** Import Marionette classes directly or use global Marionette instance (when using as a standalone script)

#### Renderer class was removed
 * **Old behavior:** The default renderer could be changed by setting `Renderer.render`
 * **New behavior:** `Renderer` does not exists
 * **Reason:** API simplification
 * **Remedy:** Use `Marionette.setRenderer` which accepts a function with same signature as expected by `Renderer.render`

#### Function isNodeAttached was removed
 * **Old behavior:** Utility function `isNodeAttached` was provided
 * **New behavior:** `isNodeAttached` does not exists
 * **Reason:** API simplification
 * **Remedy:** Use native code: `document.documentElement.contains(el)`

#### Support for vanilla Backbone.View has changed
 * **Old behavior:** `Backbone.View` instances were supported as is  
 * **New behavior:** To support `Backbone.View` is necessary to apply `Marionette.Events` mixin
 * **Reason:** Improve performance
 * **Remedy:** If vanilla `Backbone.View` is not used there's no required change, otherwise, apply the `Marionette.Events` mixin` to the prototype of the view class intended
   to be used with `Marionette`. Example:
   ```javascript
   // once, in the application start
   import _ from 'underscore';
   import {Events} from 'backbone.marionette';
   _.extend(Backbone.View.prototype, Events);
   ```

## Recommended changes (deprecations)
These changes are optional, although recommended to make future upgrades easy

#### The default export has been deprecated
 * **Old behavior:** The package was exported as an UMD module with all classes / functions as a property of the default export
 * **New behavior:** Package is exported as a ECMAScript module using named exports. The default export with all classes still
 * **Reason:** Align with current JS standard practice, allow tree shaking
 * **Remedy:** Import each Marionette classses / functions separatedly or with * keyword
   Examples:
   ```javascript
   // using ES module syntax
   // old behavior
   import Mn from 'backbone.marionette';
   const MyView = Mn.View.extend({});

   // new behaviors
   // import only needed class/function
   import {View} from 'backbone.marionette';
   const MyView = View.extend({});

   // or import all (kills any chance of tree shaking)
   import * as Mn from 'backbone.marionette';
   const MyView = Mn.View.extend({});

   // or create a module that default exports all functions/classes
   // mymarionette.js -> can be configured as an alias for marionette or any other module name with webpack
   import * as Mn from 'backbone.marionette';
   export default Mn;

   // myview.js
   import Mn from './mymarionette';
   const MyView = Mn.View.extend({});


   // using CommonJS syntax

   // old behavior
   const Mn = require('backbone.marionette');
   const MyView = Mn.View.extend({});

   // new behavior
   const {View} = require('backbone.marionette');
   const MyView = View.extend({});
   ```

#### `Marionette.Object` was renamed to `Marionette.MnObject`

 * **Old behavior:** The Marionette Object class was exported as `Marionette.Object`
 * **New behavior:** The Marionette Object class is exported as `MnObject`
 * **Reason:** Avoid collision with native `Object` class when using with ES imports
 * **Remedy:** Rename `Marionette.Object` to `MnObject`. To easy transition the Object will still be available on default Marionette export

```javascript
   // using ES module syntax
   // old behavior
   import Mn from 'backbone.marionette';
   const MyObj = Mn.Object.extend({});

   // new behaviors
   // import only needed class/function
   import {MnObject} from 'backbone.marionette';
   const MyView = MnObject.extend({});
   ```