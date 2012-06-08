// Basic ItemView rendering performance
(function(){
  var ItemView = Backbone.Marionette.ItemView.extend({
    template: "#item-template"
  });

  (function(){
    var view = new ItemView();
    JSLitmus.test('Re-render Same ItemView', function() {
      view.render();
    });
  })();

  JSLitmus.test('Render New ItemView', function() {
    var view = new ItemView();
    view.render();
  });
})();

// ItemView vs Backbone.View rendering data performance
$(function(){
  var View = Backbone.View.extend({
    initialize: function(options){
      this.template = options.template
    },

    render: function(){
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
    }
  });

  var ItemView = Backbone.Marionette.ItemView.extend({
    template: "#item-with-data-template"
  });

  var model = new Backbone.Model({
    foo: "bar",
    bar: "baz",
    stuff: "lots of stuff goes here.",
    moreStuff: "lots more stuff goes here, too"
  });

  JSLitmus.test('Rendering An ItemView With A Model', function(){
    var view = new ItemView({
      model: model
    });

    view.render();
  });

  var template = _.template($("#item-with-data-template").html());
  JSLitmus.test('Rendering A Backbone.View With A Model', function(){
    var view = new View({
      template: template,
      model: model
    });
    view.render();
  });
});
