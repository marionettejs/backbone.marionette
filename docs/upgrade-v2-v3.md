# Upgrade Guide from v2 to v3

Marionette 3 introduces a number of breaking changes. This upgrade guide will go
through the major changes and describe how to change your application to
accommodate them.

## Changes between v3 and v4

#### LayoutView has been removed

 * **Old behavior:** `LayoutView` implemented the features to manage subregions  
 * **New behavior:** The `LayoutView` functionality was merged into `View` class 
 * **Reason:** API simplification
 * **Remedy:** Rename `LayoutView` to `View`
  
#### ItemView has been renamed to View

 * **Old behavior:** `ItemView` was the recommended class to render a single view   
 * **New behavior:** The `View` is recommended class to render a single view or a view
   with subregions 
 * **Reason:** API simplification
 * **Remedy:** Rename `ItemView` to `View`