import _ from 'underscore';

import {
  bindEntityEvents,
  unbindEntityEvents
} from '../bind-entity-events';

// MixinOptions
// - collectionEvents
// - modelEvents

export default {
  // Handle `modelEvents`, and `collectionEvents` configuration
  _delegateEntityEvents(model, collection) {
    this._undelegateEntityEvents(model, collection);

    const modelEvents = _.result(this, 'modelEvents');
    bindEntityEvents.call(this, model, modelEvents);

    const collectionEvents = _.result(this, 'collectionEvents');
    bindEntityEvents.call(this, collection, collectionEvents);
  },

  _undelegateEntityEvents(model, collection) {
    const modelEvents = _.result(this, 'modelEvents');
    unbindEntityEvents.call(this, model, modelEvents);

    const collectionEvents = _.result(this, 'collectionEvents');
    unbindEntityEvents.call(this, collection, collectionEvents);
  }
};
