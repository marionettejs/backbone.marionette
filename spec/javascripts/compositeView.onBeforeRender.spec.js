describe('composite view - on before render', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when a composite view has a model and a collection', function() {
    beforeEach(function() {
      this.Label = {
        Views: {}
      };

      this.Label.Model = Backbone.Model.extend({});
      this.Label.ListModel = Backbone.Model.extend({});

      this.Label.Collection = Backbone.Collection.extend({
        model: this.Label.Model
      });

      this.Label.Views.LabelItem = Backbone.Marionette.ItemView.extend({
        template: '#itemView',
        tagName: 'li',
        className: 'list-item'
      });

      this.Label.Views.LabelListModel = Backbone.Model.extend({});

      this.Label.Views.LabelList = Backbone.Marionette.CompositeView.extend({
        template: '#compView',
        childViewContainer: '#listTag',

        childView: this.Label.Views.LabelItem,

        onBeforeRender: function() {
          this.model.set('modelState', 'Something Different');
        }
      });

      this.setFixtures('<script id="itemView" type="text/template">Title: <%= title %> </script><script id="compView" type="text/template"><div class="listing"> <h4><%= modelState %></h4> <br/> <ul id="listTag"> </ul> </div></script>');

      this.collection = new this.Label.Collection([{title: 'yoddle'}, {title: 'little'}]);
      this.model = new this.Label.Model({modelState: 'Yoddling Tomes'});

      this.view = new this.Label.Views.LabelList({
        collection: this.collection,
        model: this.model
      });

      this.view.render();
    });

    it('should call onBeforeRender before rendering the model', function() {
      expect(this.view.$el).to.contain.$text('Something Different');
    });
  });
});
