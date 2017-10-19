import Backbone from 'backbone';
import {version} from '../package.json';

import proxy from './utils/proxy';
import extend from './utils/extend';

import {
  bindEvents as _bindEvents,
  unbindEvents as _unbindEvents
} from './common/bind-events';
import {
  bindRequests as _bindRequests,
  unbindRequests as _unbindRequests
} from './common/bind-requests';
import _getOption from './common/get-option';
import _mergeOptions from './common/merge-options';
import monitorViewEvents from './common/monitor-view-events';
import _normalizeMethods from './common/normalize-methods';
import _triggerMethod from './common/trigger-method';

import BackboneViewMixin from './mixins/backboneview';

import MnObject from './object';
import View from './view';
import CollectionView from './collection-view';
import Behavior from './behavior';
import Region from './region';
import Application from './application';

import DomApi from './config/dom';

import {
  isEnabled,
  setEnabled
} from './config/features';

const previousMarionette = Backbone.Marionette;

// This allows you to run multiple instances of Marionette on the same
// webapp. After loading the new version, call `noConflict()` to
// get a reference to it. At the same time the old version will be
// returned to Backbone.Marionette.
export const noConflict = function() {
  Backbone.Marionette = previousMarionette;
  return this;
};

// Utilities
export const bindEvents = proxy(_bindEvents);
export const unbindEvents = proxy(_unbindEvents);
export const bindRequests = proxy(_bindRequests);
export const unbindRequests = proxy(_unbindRequests);
export const mergeOptions = proxy(_mergeOptions);
export const getOption = proxy(_getOption);
export const normalizeMethods = proxy(_normalizeMethods);
export const triggerMethod = proxy(_triggerMethod);

// Configuration

export const setDomApi = function(mixin) {
  CollectionView.setDomApi(mixin);
  Region.setDomApi(mixin);
  View.setDomApi(mixin);
};
export const setRenderer = function(renderer) {
  CollectionView.setRenderer(renderer);
  View.setRenderer(renderer);
};

export {
  View,
  CollectionView,
  MnObject,
  Region,
  Behavior,
  Application,
  isEnabled,
  setEnabled,
  monitorViewEvents,
  BackboneViewMixin,
  extend,
  DomApi,
  version as VERSION
};
