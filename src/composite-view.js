// Composite View
// --------------

import _ from 'underscore';
import MarionetteError from './error';
import CollectionView from './next-collection-view';
import TemplateRenderMixin from './mixins/template-render';

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

    CollectionView.prototype.constructor.apply(this, arguments);
  },

  childView() {
    return this.constructor;
  },

  attachHtml(els) {
    this.Dom.appendContents(this.$container[0], els, {_$el: this.$container});
  },

  _render() {
    this._renderTemplate();
    this.bindUIElements();
    this._getChildViewContainer();
    this._showChildren();
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
}, {
  setRenderer(renderer) {
    this.prototype._renderHtml = renderer;
    return this;
  }
});

_.extend(CompositeView.prototype, TemplateRenderMixin);

export default CompositeView;
