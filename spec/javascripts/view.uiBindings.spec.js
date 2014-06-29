describe('view ui elements', function() {
  'use strict';

  describe('when accessing a ui element from the hash', function() {
    beforeEach(function() {
      this.itemWithCheckboxTemplateFn = _.template('<input type="checkbox" id="chk" <% if (done) { %>checked<% } %>></input>');

      this.View = Backbone.Marionette.ItemView.extend({
        template: this.itemWithCheckboxTemplateFn,

        ui: {
          checkbox: '#chk',
          unfoundElement: '#not_found'
        }
      });

      this.model = new Backbone.Model({
        done: false
      });

      this.view = new this.View({
        model: this.model
      });

      this.view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(this.view.ui.checkbox.attr('type')).to.equal('checkbox');
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(this.view.ui.unfoundElement.length).to.equal(0);
    });
  });

  describe('when re-rendering an ItemView with a UI element configuration', function() {
    beforeEach(function() {
      this.itemWithCheckboxTemplateFn = _.template('<input type="checkbox" id="chk" <% if (done) { %>checked<% } %>></input>');

      this.View = Backbone.Marionette.ItemView.extend({
        template: this.itemWithCheckboxTemplateFn,

        ui: {
          checkbox: '#chk',
          unfoundElement: '#not_found'
        }
      });

      this.model = new Backbone.Model({
        done: false
      });

      this.view = new this.View({
        model: this.model
      });

      this.view.render();

      // setting the model 'done' attribute to true will cause the 'checked' attribute
      // to be added to the checkbox element in the subsequent render.
      this.view.model.set('done', true);
      this.view.render();
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.checkbox.attr('checked')).to.exist;
    });

  });

  describe('when re-rendering a CollectionView with a UI element configuration', function() {
    beforeEach(function() {
      this.itemWithCheckboxTemplateFn = _.template('<input type="checkbox" class="chk"></input>');

      this.ItemView = Backbone.Marionette.ItemView.extend({
        template: this.itemWithCheckboxTemplateFn,
      });

      this.CollectionView = Backbone.Marionette.CollectionView.extend({

        childView: this.ItemView,

        ui: {
          checkbox: '.chk',
        }
      });

      this.collection = new Backbone.Collection([{}, {}]);

      this.view = new this.CollectionView({
        collection: this.collection
      });

      this.view.render();
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.checkbox.length).to.equal(2);
    });

  });

  describe('when re-rendering a CompositeView with a UI element configuration', function() {
    beforeEach(function() {
      this.itemWithCheckboxTemplateFn = _.template('<input type="checkbox" class="chk"></input>');

      this.ItemView = Backbone.Marionette.ItemView.extend({
        template: this.itemWithCheckboxTemplateFn,
      });

      this.CompositeView = Backbone.Marionette.CompositeView.extend({

        template: _.template(''),

        childView: this.ItemView,

        ui: {
          checkbox: '.chk',
        }
      });

      this.collection = new Backbone.Collection([{}, {}]);

      this.view = new this.CompositeView({
        collection: this.collection
      });

      this.view.render();
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.checkbox.length).to.equal(2);
    });

  });

  describe('when the ui element is a function that returns a hash', function() {
    beforeEach(function() {
      this.itemWithCheckboxTemplateFn = _.template('<input type="checkbox" id="chk" <% if (done) { %>checked<% } %>></input>');

      this.View = Backbone.Marionette.ItemView.extend({
        template: this.itemWithCheckboxTemplateFn,

        ui: function() {
          return {
            checkbox: '#chk',
            unfoundElement: '#not_found'
          };
        }
      });

      this.model = new Backbone.Model({
        done: false
      });

      this.view = new this.View({
        model: this.model
      });

      this.view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(this.view.ui.checkbox.attr('type')).to.equal('checkbox');
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(this.view.ui.unfoundElement.length).to.equal(0);
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      // asserting state before subsequent render
      expect(this.view.ui.checkbox.attr('checked')).to.be.undefined;

      // setting the model 'done' attribute to true will cause the 'checked' attribute
      // to be added to the checkbox element in the subsequent render.
      this.view.model.set('done', true);
      this.view.render();

      // since the ui elements selectors are refreshed after each render then the associated selector
      // should point to the newly rendered checkbox element that has the 'checked' attribute.
      expect(this.view.ui.checkbox.attr('checked')).to.exist;
    });

  });

  describe('when destroying a view that has not been rendered', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: function() {
          return '<div id="foo"></div>';
        },

        ui: {
          foo: '#foo'
        }
      });
      this.view1 = new this.View();
      this.view1.destroy();
      this.view2 = new this.View();
    });

    it('should not affect future ui bindings', function() {
      expect(this.view2.ui.foo).to.equal('#foo');
    });
  });

  describe('when destroying a view', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: function() {
          return '<div id="foo"></div>';
        },

        ui: {
          foo: '#foo'
        }
      });
      this.view = new this.View();
      this.view.render();
      this.view.destroy();
    });

    it('should unbind UI elements and reset them to the selector', function() {
      expect(this.view.ui.foo).to.equal('#foo');
    });
  });

  describe("when calling delegateEvents", function () {
    beforeEach(function () {
      this.ui     = {'foo': '#foo'};
      this.events = {'click @ui.foo': 'bar'};

      this.View = Marionette.ItemView.extend({
        ui     : this.ui,
        events : {}
      });

      this.view = new this.View();
      this.view.delegateEvents();

      _.extend(this.view.events, this.events);
      this.view.delegateEvents();
    });

    it("the events should be re-normalised", function() {
      expect(this.view.events).to.deep.equal({'click #foo': 'bar'});
    });
  });
});
