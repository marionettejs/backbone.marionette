# Upgrade Guide from v2 to v3

Marionette 3 introduces a number of breaking changes. This upgrade guide will go
through the major changes and describe how to change your application to
accommodate them.

## Required changes
These are breaking changes that need to be handled when migrating from Marionette v2 to v3

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

#### CollectionView.getEmptyView has been removed

 * **Old behavior:** `CollectionView.getEmptyView` was provided
 * **New behavior:** There's no `CollectionView.getEmptyView`
 * **Reason:** API simplification
 * **Remedy:** Rename `getEmptyView` to `emptyView`

#### CollectionView.getChildView has been removed

 * **Old behavior:** `CollectionView.getChildView` was provided
 * **New behavior:** There's no `CollectionView.getChildView`
 * **Reason:** API simplification
 * **Remedy:** Rename `getChildView` to `childView`
 * 

## Recommended changes (deprecations)
These changes are optional, although recommended to make future upgrades easy

#### CompositeView is deprecated

 * **Old behavior:** `CompositeView` was fully supported
 * **New behavior:** The `CompositeView` is deprecated
 * **Reason:** API simplification
 * **Remedy:** Use `CollectionView` or `NextCollectionView` instead