export default {
  _isDestroyed: false,

  isDestroyed() {
    return this._isDestroyed;
  },

  destroy(...args) {
    if (this._isDestroyed) { return this; }

    this.triggerMethod('before:destroy', this, ...args);
    this._isDestroyed = true;
    this.triggerMethod('destroy', this, ...args);
    this.stopListening();

    return this;
  }
};
