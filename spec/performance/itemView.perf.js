var model = new Backbone.Model({
  foo: "bar",
  bar: "baz",
  stuff: "lots of stuff goes here.",
  moreStuff: "lots more stuff goes here, too"
});

var ItemView = Backbone.Marionette.ItemView.extend({
  template: "#item-template"
});

var View = Backbone.View.extend({
  initialize: function(options){
    this.template = options.template
  },

  render: function(){
    var data = {};
    if (this.model){
      data = this.model.toJSON();
    }
    var html = this.template(data);
    this.$el.html(html);
  }
});

var ItemViewWithModel = Backbone.Marionette.ItemView.extend({
  template: "#item-with-data-template"
});

$(function(){
  var template = _.template($("#item-template").html());
  var templateWithData = _.template($("#item-with-data-template").html());

  // -------------------------------------
  // Basic ItemView vs Backbone.View tests
  // -------------------------------------
  JSLitmus.test('ItemView :: Render New ItemView', function() {
    var view = new ItemView();
    view.render();
  });

  JSLitmus.test('ItemView :: Render New Backbone.View', function() {
    var view = new View({
      template: template
    });
    view.render();
  });

  // --------------------------------------------
  // ItemView vs Backbone.View, with model, tests
  // --------------------------------------------
  JSLitmus.test('ItemView :: Rendering An ItemView With A Model', function(){
    var view = new ItemViewWithModel({
      model: model
    });

    view.render();
  });

  (function(){
    JSLitmus.test('ItemView :: Rendering A Backbone.View With A Model', function(){
      var view = new View({
        template: templateWithData,
        model: model
      });
      view.render();
    });
  })();

  // -------------------------------------------------
  // ItemView vs Backbone.View, re-rendering same view
  // -------------------------------------------------
  (function(){
    var view = new ItemView();
    JSLitmus.test('ItemView :: Re-render Same ItemView', function() {
      view.render();
    });
  })();

  (function(){
    var view = new View({
      template: template
    });
    JSLitmus.test('ItemView :: Re-render Same Backbone.View', function() {
      view.render();
    });
  })();

});
