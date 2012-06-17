// Async CollectionView
// --------------------

// provides async rendering for collection views
Async.CollectionView = {
  render: function(){
    var that = this;
    var deferredRender = $.Deferred();
    var promises;

    this.triggerBeforeRender();

    this.closeChildren();

    if (this.collection && this.collection.length > 0) {
      promises = this.showCollection();
    } else {
      var promise = this.showEmptyView();
      promises = [promise];
    }

    deferredRender.done(function(){
      that.triggerRendered();
    });

    $.when.apply(this, promises).then(function(){
      deferredRender.resolveWith(that);
    });

    return deferredRender.promise();
  },
  
  // Internal method to loop through each item in the
  // collection view and show it
  showCollection: function(){
    var that = this;
    var promises = [];
    var ItemView = this.getItemView();

    this.collection.each(function(item, index){
      var promise = that.addItemView(item, ItemView, index);
      promises.push(promise);
    });

    return promises;
  },

  // Internal method to show an empty view in place of
  // a collection of item views, when the collection is
  // empty
  showEmptyView: function(promises){
    var promise;
    var EmptyView = this.options.emptyView || this.emptyView;
    if (EmptyView){
      this.showingEmptyView = true;
      var model = new Backbone.Model();
      promise = this.addItemView(model, EmptyView, 0);
    }
    return promise;
  },
  
  renderItemView: function(view, index) {
    var that = this;
    var viewRendered = view.render();
    $.when(viewRendered).then(function(){
      that.appendHtml(that, view, index);
    });
    return viewRendered;
  }
}
