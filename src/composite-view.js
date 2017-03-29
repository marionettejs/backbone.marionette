// Composite View
// --------------

import _ from 'underscore';
import deprecate from './utils/deprecate';
import MarionetteError from './error';
import CollectionView from './collection-view';
import View from './view';

const ClassOptions = [
  'childViewContainer',
  'template',
  'templateContext'
];

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView
// @deprecated
const CompositeView = CollectionView.extend({

  // Setting up the inheritance chain which allows changes to
  // Marionette.CollectionView.prototype.constructor which allows overriding
  // option to pass '{sort: false}' to prevent the CompositeView from
  // maintaining the sorted order of the collection.
  // This will fallback onto appending childView's to the end.
  constructor(options) {
    deprecate('CompositeView is deprecated. Convert to View at your earliest convenience');

    this.mergeOptions(options, ClassOptions);

    CollectionView.prototype.constructor.apply(this, arguments);
  },

  // Configured the initial events that the composite view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents() {

    // Bind only after composite view is rendered to avoid adding child views
    // to nonexistent childViewContainer

    if (this.collection) {
      this.listenTo(this.collection, 'add', this._onCollectionAdd);
      this.listenTo(this.collection, 'update', this._onCollectionUpdate);
      this.listenTo(this.collection, 'reset', this.renderChildren);

      if (this.sort) {
        this.listenTo(this.collection, 'sort', this._sortViews);
      }
    }
  },

  // Retrieve the `childView` to be used when rendering each of
  // the items in the collection. The default is to return
  // `this.childView` or Marionette.CompositeView if no `childView`
  // has been defined. As happens in CollectionView, `childView` can
  // be a function (which should return a view class).
  _getChildView(child) {
    let childView = this.childView;

    // for CompositeView, if `childView` is not specified, we'll get the same
    // composite view class rendered for each child in the collection
    // then check if the `childView` is a view class (the common case)
    // finally check if it's a function (which we assume that returns a view class)
    if (!childView) {
      return this.constructor;
    }

    childView = this._getView(childView, child);

    if (!childView) {
      throw new MarionetteError({
        name: 'InvalidChildViewError',
        message: '"childView" must be a view class or a function that returns a view class'
      });
    }

    return childView;
  },

  // Return the serialized model
  serializeData() {
    return this.serializeModel();
  },

  // Renders the model and the collection.
  render() {
    if (this._isDestroyed) { return this; }
    this._isRendering = true;
    this.resetChildViewContainer();

    this.triggerMethod('before:render', this);

    this._renderTemplate();
    this.bindUIElements();
    this.renderChildren();

    this._isRendering = false;
    this._isRendered = true;
    this.triggerMethod('render', this);
    return this;
  },

  renderChildren() {
    if (this._isRendered || this._isRendering) {
      CollectionView.prototype._renderChildren.call(this);
    }
  },

  // You might need to override this if you've overridden attachHtml
  attachBuffer(compositeView, buffer) {
    const $container = this.getChildViewContainer(compositeView);
    this.appendChildren($container, buffer);
  },

  // Internal method. Append a view to the end of the $el.
  // Overidden from CollectionView to ensure view is appended to
  // childViewContainer
  _insertAfter(childView) {
    const $container = this.getChildViewContainer(this, childView);
    this.appendChildren($container, childView.el);
  },

  // Internal method. Append reordered childView'.
  // Overidden from CollectionView to ensure reordered views
  // are appended to childViewContainer
  _appendReorderedChildren(children) {
    const $container = this.getChildViewContainer(this);
    this.appendChildren($container, children);
  },

  // Internal method to ensure an `$childViewContainer` exists, for the
  // `attachHtml` method to use.
  getChildViewContainer(containerView, childView) {
    if (!!containerView.$childViewContainer) {
      return containerView.$childViewContainer;
    }

    let container;
    const childViewContainer = containerView.childViewContainer;
    if (childViewContainer) {

      const selector = _.result(containerView, 'childViewContainer');

      if (selector.charAt(0) === '@' && containerView.ui) {
        container = containerView.ui[selector.substr(4)];
      } else {
        container = this.findEls(selector, containerView.$el);
      }

      if (container.length <= 0) {
        throw new MarionetteError({
          name: 'ChildViewContainerMissingError',
          message: `The specified "childViewContainer" was not found: ${containerView.childViewContainer}`
        });
      }

    } else {
      container = containerView.$el;
    }

    containerView.$childViewContainer = container;
    return container;
  },

  // Internal method to reset the `$childViewContainer` on render
  resetChildViewContainer() {
    if (this.$childViewContainer) {
      this.$childViewContainer = undefined;
    }
  }
});

// To prevent duplication but allow the best View organization
// Certain View methods are mixed directly into the deprecated CompositeView
const MixinFromView = _.pick(View.prototype, 'serializeModel', 'getTemplate', '_renderTemplate', '_renderHtml', 'mixinTemplateContext', 'attachElContent');
_.extend(CompositeView.prototype, MixinFromView);

export default CompositeView;
