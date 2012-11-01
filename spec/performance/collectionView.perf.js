$(function(){

  var Model = Backbone.Model.extend({
    defaults: {
      foo: "bar",
      bar: "baz",
      stuff: "lots of stuff goes here.",
      moreStuff: "lots more stuff goes here, too"
    }
  });

  var ItemView = Backbone.Marionette.ItemView.extend({
    template: "#item-with-data-template"
  });

  var CollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ItemView
  });
 
  var modelList = [];
  for(var i = 0; i<100; i++){
    modelList.push(new Model());
  }

  // -------------------------------------
  // CollectionView Performance Test
  // -------------------------------------
  JSLitmus.test('CollectionView :: Reset 100 Items To Render', function() {
    var c = new Backbone.Collection();

    var cv = new CollectionView({
      collection: cv
    });
    cv.render();

    c.reset(modelList);
  });

  // --------------------------------------------
});
