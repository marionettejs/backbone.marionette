// Async CollectionView
// --------------------

// provides async rendering for collection views
Async.CollectionView = {
  render: function(){
    var that = this;
    var deferredRender = $.Deferred();
    var promises = [];
    var ItemView = this.getItemView();
    var EmptyView = this.options.emptyView || this.emptyView;

    if (this.beforeRender) { this.beforeRender(); }
    this.trigger("collection:before:render", this);

    this.closeChildren();

    if (this.collection) {
      if (this.collection.length === 0 && EmptyView) {
        var promise = this.addItemView(new Backbone.Model(), EmptyView);
        promises.push(promise);
      } else {
        this.collection.each(function(item){
          var promise = that.addItemView(item, ItemView);
          promises.push(promise);
        });
      }
    }

    deferredRender.done(function(){
      if (this.onRender) { this.onRender(); }
      this.trigger("collection:rendered", this);
    });

    $.when.apply(this, promises).then(function(){
      deferredRender.resolveWith(that);
    });

    return deferredRender.promise();
  },
  
  renderItemView: function(view) {
    var that = this;
	var viewRendered = view.render();
    $.when(viewRendered).then(function(){
      that.appendHtml(that, view);
    });
    return viewRendered;
  }
}
