import {
  bindEntityEvents,
  unbindEntityEvents
} from '../bind-entity-events';

export default {
  // Handle `modelEvents`, and `collectionEvents` configuration
  _delegateEntityEvents: function(model, collection) {
    this._undelegateEntityEvents(model, collection);

    var modelEvents = this.getValue(this.getOption('modelEvents'));
    bindEntityEvents.call(this, model, modelEvents);

    var collectionEvents = this.getValue(this.getOption('collectionEvents'));
    bindEntityEvents.call(this, collection, collectionEvents);
  },

  _undelegateEntityEvents: function(model, collection) {
    var modelEvents = this.getValue(this.getOption('modelEvents'));
    unbindEntityEvents.call(this, model, modelEvents);

    var collectionEvents = this.getValue(this.getOption('collectionEvents'));
    unbindEntityEvents.call(this, collection, collectionEvents);
  }
};
