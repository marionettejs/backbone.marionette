// Async Composite View
// --------------------

Async.CompositeView = {
  // Renders the model once, and the collection once. Calling
  // this again will tell the model's view to re-render itself
  // but the collection will not re-render.
  render: function(){
    var that = this;
    var compositeRendered = $.Deferred();

    this.resetItemViewContainer();

    var modelIsRendered = this.renderModel();
    $.when(modelIsRendered).then(function(html){
      that.$el.html(html);
      that.trigger("composite:model:rendered");
      that.trigger("render");

      var collectionIsRendered = that.renderCollection();
      $.when(collectionIsRendered).then(function(){
        compositeRendered.resolve();
      });
    });

    compositeRendered.done(function(){
      that.trigger("composite:rendered");
    });

    return compositeRendered.promise();
  },

  // Render the collection for the composite view
  renderCollection: function(){
    var collectionDeferred = Marionette.CollectionView.prototype.render.apply(this, arguments);
    collectionDeferred.done(function(){
      this.trigger("composite:collection:rendered");
    });
    return collectionDeferred.promise();
  }
}
