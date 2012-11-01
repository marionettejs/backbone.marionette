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
    el: "#test_element",
    itemView: ItemView
  });
 
  var modelList10 = [];
  for(var i = 0; i<10; i++){
    modelList10.push(new Model());
  }

  var modelList100 = [];
  for(var i = 0; i<100; i++){
    modelList100.push(new Model());
  }

  var modelList1000 = [];
  for(var i = 0; i<1000; i++){
    modelList1000.push(new Model());
  }

  // -------------------------------------
  // CollectionView Performance Test
  // -------------------------------------
  JSLitmus.test('CollectionView :: Reset 10 Items To Render', function() {
    var c = new Backbone.Collection();

    var cv = new CollectionView({
      collection: cv
    });
    cv.render();

    c.reset(modelList10);
  });

  JSLitmus.test('CollectionView :: Reset 100 Items To Render', function() {
    var c = new Backbone.Collection();

    var cv = new CollectionView({
      collection: cv
    });
    cv.render();

    c.reset(modelList100);
  });

  JSLitmus.test('CollectionView :: Reset 1000 Items To Render', function() {
    var c = new Backbone.Collection();

    var cv = new CollectionView({
      collection: cv
    });
    cv.render();

    c.reset(modelList1000);
  });

  // --------------------------------------------
});
