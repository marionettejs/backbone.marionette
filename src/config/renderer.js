// Static setter for the renderer
export function setRenderer(renderer, options) {
  this.prototype._renderHtml = renderer;
  if (options && options.destructive === false) {
    this.prototype._preventRegionReInit = true;
  }
  return this;
}
