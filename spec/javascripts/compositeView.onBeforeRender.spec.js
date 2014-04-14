describe("composite view - on before render", function(){

  describe("when a composite view has a model and a collection", function(){
    var view;

    var Label = {
        Views: {}
    };

    Label.Model = Backbone.Model.extend({});
    Label.ListModel = Backbone.Model.extend({});

    Label.Collection = Backbone.Collection.extend({
        model: Label.Model
    });

    Label.Views.LabelItem = Backbone.Marionette.ItemView.extend({
        template: "#itemView",
        tagName: 'li',
        className: 'list-item'
    });

    Label.Views.LabelListModel = Backbone.Model.extend({});

    Label.Views.LabelList = Backbone.Marionette.CompositeView.extend({
      template: "#compView",
      childViewContainer: '#listTag',

      childView: Label.Views.LabelItem,

      onBeforeRender : function() {
        this.model.set("modelState", "Something Different");
      }
    });

    beforeEach(function(){
      setFixtures("<script id='itemView' type='text/template'>Title: <%= title %> </script><script id='compView' type='text/template'><div class='listing'> <h4><%= modelState %></h4> <br/> <ul id='listTag'> </ul> </div></script>");

      var collection = new Label.Collection([{ title: 'yoddle' }, { title: 'little' }]);
      var model = new Label.Model({ modelState: 'Yoddling Tomes' });

      view = new Label.Views.LabelList({
        collection: collection,
        model: model
      });

      view.render();
    });

    it("should call onBeforeRender before rendering the model", function(){
      expect(view.$el).toHaveText(/Something Different/);
    });

  });


});
