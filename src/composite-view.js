// Composite View
// --------------

import _ from 'underscore';
import MarionetteError from './error';
import CollectionView from './next-collection-view';
import View from './view';

const ClassOptions = [
  'childViewContainer',
  'template',
  'templateContext'
];

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView
const CompositeView = CollectionView.extend({
  constructor(options) {
    this.mergeOptions(options, ClassOptions);

    this.on('before:render', this._onBeforeRender);

    CollectionView.prototype.constructor.apply(this, arguments);
  },

  childView() {
    return this.constructor;
  },

  // Return the serialized model
  serializeData() {
    return this.serializeModel();
  },

  attachHtml(els) {
    this.Dom.appendContents(this.$container[0], els, {_$el: this.$container});
  },

  _onBeforeRender() {
    this._renderTemplate();
    this.bindUIElements();
    this._getChildViewContainer();
  },

  _getChildViewContainer() {
    const childViewContainer = _.result(this, 'childViewContainer');
    this.$container = childViewContainer ? this.$(childViewContainer) : this.$el;

    if (this.$container.length <= 0) {
      throw new MarionetteError({
        name: 'ChildViewContainerMissingError',
        message: `The specified "childViewContainer" was not found: ${childViewContainer}`
      });
    }
  }
});

// TODO: Extract to a TemplateRenderMixin
const MixinFromView = _.pick(View.prototype, 'serializeModel', 'getTemplate', '_renderTemplate', '_renderHtml', 'mixinTemplateContext', 'attachElContent');
_.extend(CompositeView.prototype, MixinFromView);

export default CompositeView;
