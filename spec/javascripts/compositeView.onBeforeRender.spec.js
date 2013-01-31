describe("composite view - on before render", function(){

  describe("when a composite view has a model and a collection", function(){
    var order;

    beforeEach(function(){
      var Label = {
          Views: {}
      };

      Label.Model = Backbone.Model.extend({});
      Label.ListModel = Backbone.Model.extend({});

      Label.Collection = Backbone.Collection.extend({
          model: Label.Model
      });

      Label.Views.LabelItem = Backbone.Marionette.ItemView.extend({
          template: function(){
            return 'Title: <%= title %> - Bar : <%= bar %>'
          },
          tagName: 'li',
          className: 'list-item',
          onBeforeRender : function() {
            console.log("item view: before render");
          },

          onRender: function(){
            console.log("item view: after render");
          }
          
      });

      Label.Views.LabelListModel = Backbone.Model.extend({});

      Label.Views.LabelList = Backbone.Marionette.CompositeView.extend({
        template: function(){
          return '<div class="listing"> <h4><%=modelState%></h4> <br/> <ul id="listTag"> </ul> </div>';
        },
        itemViewContainer: '#listTag',
        itemView: Label.Views.LabelItem,

        serializeData: function(){
          console.log("composite view: serialize data");
          return Marionette.CompositeView.prototype.serializeData.call(this);
        },
        onBeforeRender : function() {
          console.log("composite view: before render");
        },
 
        onRender: function(){
          console.log("composite view: after render");
        }
      });

      var collection = new Label.Collection([{
          title: 'yoddle'
      }, {
          title: 'little'
      }]);
      var model = new Label.Model({
          modelState: 'Yoddling Tomes'
      });
      var view = new Label.Views.LabelList({
          collection: collection,
          model: model
      });

      var region = new Marionette.Region({el: "<div></div>"});
      region.show(view);
    });

    it("should call onBeforeRender before rendering the model", function(){
      throw new "need to write a real test here";
    });

  });


});
