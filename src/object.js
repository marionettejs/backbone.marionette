// Object
// ------

import _ from 'underscore';
import extend from './utils/extend';
import CommonMixin from './mixins/common';
import DestroyMixin from './mixins/destroy';
import RadioMixin from './mixins/radio';

const ClassOptions = [
  'channelName',
  'radioEvents',
  'radioRequests'
];

// Object borrows many conventions and utilities from Backbone.
const MarionetteObject = function(options) {
  this._setOptions(options, ClassOptions);
  this.cid = _.uniqueId(this.cidPrefix);
  this._initRadio();
  this.initialize.apply(this, arguments);
};

MarionetteObject.extend = extend;

// Object Methods
// --------------

_.extend(MarionetteObject.prototype, CommonMixin, DestroyMixin, RadioMixin, {
  cidPrefix: 'mno',

  // This is a noop method intended to be overridden
  initialize() {}
});

export default MarionetteObject;
