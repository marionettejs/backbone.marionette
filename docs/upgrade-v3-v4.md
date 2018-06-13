# Upgrade Guide from v3 to v4

Marionette 4 introduces a number of breaking changes. This upgrade guide will go
through the major changes and describe how to change your application to
accommodate them.

## Changes between v3 and v4

#### The package export format has changed
 * **Old behavior:** The package was exported as an UMD module with all classes / functions as a property of the default export
 * **New behavior:** Package is exported as a ECMAScript module using named exports. There's no default export
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

#### Support for vanilla Backbone.View has changed
 * **Old behavior:** `Backbone.View` instances were supported as is  
 * **New behavior:** To support `Backbone.View` is necessary to apply `Marionette.Events` mixin
 * **Reason:** Improve performance
 * **Remedy:** Apply the `Marionette.Events` mixin` to the prototype of the view class intended
   to be used with `Marionette`. Example:
   ```javascript
   // once, in the application start
   import _ from 'underscore';
   import {Events} from 'backbone.marionette';
   _.extend(Backbone.View.prototype, Events);
   ```
