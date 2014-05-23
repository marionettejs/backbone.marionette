describe('item view', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  var Model = Backbone.Model.extend();

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var ItemView = Backbone.Marionette.ItemView.extend({});

  beforeEach(function() {
    this.loadFixtures('itemTemplate.html', 'collectionItemTemplate.html', 'emptyTemplate.html');
  });

  describe('when rendering without a valid template', function() {
    var TemplatelessView = Backbone.Marionette.ItemView.extend({});
    var view;

    beforeEach(function() {
      view = new TemplatelessView({});
    });

    it('should throw an exception because there was no valid template', function() {
      expect(view.render).to.throw('Cannot render the template since its false, null or undefined.');
    });

  });

  describe('when rendering', function() {
    var OnRenderView = Backbone.Marionette.ItemView.extend({
      template: '#emptyTemplate',
      onBeforeRender: function() {},
      onRender: function() {}
    });

    var view;

    beforeEach(function() {
      view = new OnRenderView({});

      this.sinon.spy(view, 'onBeforeRender');
      this.sinon.spy(view, 'onRender');
      this.sinon.spy(view, 'trigger');

      view.render();
    });

    afterEach(function() {
      view.onBeforeRender.restore();
      view.onRender.restore();
      view.trigger.restore();
    });

    it('should call a "onBeforeRender" method on the view', function() {
      expect(view.onBeforeRender).to.have.been.called;
    });

    it('should call an "onRender" method on the view', function() {
      expect(view.onRender).to.have.been.called;
    });

    it('should trigger a before:render event', function() {
      expect(view.trigger).to.have.been.calledWith('before:render', view);
    });

    it('should trigger a rendered event', function() {
      expect(view.trigger).to.have.been.calledWith('render', view);
    });
  });

  describe('when an item view has a model and is rendered', function() {
    var view;

    beforeEach(function() {
      this.loadFixtures('itemTemplate.html');

      view = new ItemView({
        template: '#itemTemplate',
        model: new Model({
          foo: 'bar'
        })
      });

      this.sinon.spy(view, 'serializeData');

      view.render();
    });

    afterEach(function() {
      view.serializeData.restore();
    });

    it('should serialize the model', function() {
      expect(view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized model', function() {
      expect($(view.el)).to.contain.$text('bar');
    });
  });

  describe('when an item view has asynchronous data and is rendered', function() {
    var view;

    beforeEach(function() {
      this.loadFixtures('itemTemplate.html');

      view = new ItemView({
        template: '#itemTemplate',
        serializeData: function() {
          var that = this;
          var deferred = $.Deferred();
          setTimeout(function() {
            deferred.resolve(that.model.toJSON());
          }, 100);
          return deferred.promise();
        },
        model: new Model({
          foo: 'bar'
        })
      });

      this.sinon.spy(view, 'serializeData');

      view.render();
    });

    it('should serialize the model', function() {
      expect(view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized model', function() {
      expect($(view.el)).to.contain.$text('bar');
    });
  });

  describe('when an item view has an asynchronous onRender and is rendered', function() {
    var AsyncOnRenderView;

    var view, promise;

    beforeEach(function() {
      AsyncOnRenderView = Backbone.Marionette.ItemView.extend({
        template: '#emptyTemplate',
        asyncCallback: this.sinon.stub(),
        onRender: function() {
          var that = this;
          var deferred = $.Deferred();
          setTimeout(function() {
            deferred.resolve(that.asyncCallback());
          }, 0);
          return deferred.promise();
        }
      });

      this.loadFixtures('emptyTemplate.html');
      view = new AsyncOnRenderView();
      promise = view.render();
    });

    it('should delay until onRender resolves', function(done) {
      setTimeout(function () {
        $.when(promise).then(function() {
          expect(view.asyncCallback).to.have.been.called;
          done();
        });
      }, 0);
    });
  });

  describe('when an item view has a collection and is rendered', function() {
    var view;

    beforeEach(function() {
      view = new ItemView({
        template: '#collectionItemTemplate',
        collection: new Collection([{foo: 'bar'}, {foo: 'baz'}])
      });

      this.sinon.spy(view, 'serializeData');

      view.render();
    });

    it('should serialize the collection', function() {
      expect(view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized collection', function() {
      expect($(view.el)).to.contain.$text('bar');
      expect($(view.el)).to.contain.$text('baz');
    });
  });

  describe('when an item view has a model and collection, and is rendered', function() {
    var view;

    beforeEach(function() {
      view = new ItemView({
        template: '#itemTemplate',
        model: new Model({foo: 'bar'}),
        collection: new Collection([{foo: 'bar'}, {foo: 'baz'}])
      });

      this.sinon.spy(view, 'serializeData');

      view.render();
    });

    afterEach(function() {
      view.serializeData.restore();
    });

    it('should serialize the model', function() {
      expect(view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized model', function() {
      expect($(view.el)).to.contain.$text('bar');
      expect($(view.el)).not.to.contain.$text('baz');
    });
  });

  describe('when destroying an item view', function() {
    var EventedView = Backbone.Marionette.ItemView.extend({
      template: '#emptyTemplate',

      modelChange: function() {},
      collectionChange: function() {},
      onBeforeDestroy: function() {},
      onDestroy: function() {}
    });

    var view;
    var model;
    var collection;

    beforeEach(function() {
      this.loadFixtures('itemTemplate.html');

      model = new Model({foo: 'bar'});
      collection = new Collection();
      view = new EventedView({
        template: '#itemTemplate',
        model: model,
        collection: collection
      });
      view.render();

      this.sinon.spy(view, 'remove');
      this.sinon.spy(view, 'stopListening');
      this.sinon.spy(view, 'modelChange');
      this.sinon.spy(view, 'collectionChange');
      this.sinon.spy(view, 'onBeforeDestroy');
      this.sinon.spy(view, 'onDestroy');
      this.sinon.spy(view, 'trigger');

      view.listenTo(model, 'change:foo', view.modelChange);
      view.listenTo(collection, 'foo', view.collectionChange);

      view.destroy();

      model.set({foo: 'bar'});
      collection.trigger('foo');
    });

    it('should unbind model events for the view', function() {
      expect(view.modelChange).not.to.have.been.called;
    });

    it('should unbind all collection events for the view', function() {
      expect(view.collectionChange).not.to.have.been.called;
    });

    it('should unbind any listener to custom view events', function() {
      expect(view.stopListening).to.have.been.called;
    });

    it('should remove the views EL from the DOM', function() {
      expect(view.remove).to.have.been.called;
    });

    it('should trigger "before:destroy"', function(){
      expect(view.trigger).to.have.been.calledWith('before:destroy');
    });

    it('should trigger "destroy"', function(){
      expect(view.trigger).to.have.been.calledWith('destroy');
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(view.onBeforeDestroy).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(view.onDestroy).to.have.been.called;
    });
  });

  describe('when a view with a checkbox is bound to re-render on the "change:done" event of the model', function() {
    describe('and rendering the view, then changing the checkbox from unchecked, to checked, and back to unchecked', function() {

      var View = Backbone.Marionette.ItemView.extend({
        template: '#item-with-checkbox',

        setupHandler: function() {
          this.listenTo(this.model, 'change:done', this.render, this);
        },

        events: {
          'change #chk': 'changeClicked'
        },

        changeClicked: function(e) {
          var chk = $(e.currentTarget);
          var checkedAttr = chk.attr('checked');
          var checked = !!checkedAttr;
          this.model.set({done: checked});
        }
      });

      var view, spy, model, chk;

      beforeEach(function() {
        this.loadFixtures('itemWithCheckbox.html');

        model = new Backbone.Model({
          done: false
        });

        view = new View({
          model: model
        });

        spy = this.sinon.spy(view, 'render');

        view.setupHandler();
        view.render();

        chk = view.$('#chk');
        chk.attr('checked', 'checked');
        chk.trigger('change');

        chk = view.$('#chk');
        chk.removeAttr('checked');
        chk.trigger('change');
      });

      it('should render the view 3 times total', function() {
        expect(spy.callCount).to.equal(3);
      });
    });

  });

  describe('when re-rendering an ItemView that is already shown', function() {
    var View = Marionette.ItemView.extend({
      template: function() { return '<div>foo</div>'; }
    });

    var renderUpdate, view;

    beforeEach(function() {
      renderUpdate = this.sinon.stub();

      view = new View();
      $('body').append(view.el);

      view.on('dom:refresh', renderUpdate);
      view.render();
      view.triggerMethod('show');

      view.render();
    });

    afterEach(function() {
      view.remove();
    });

    it('should trigger a dom:refresh event', function() {
      expect(renderUpdate).to.have.been.called;
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {

    var constructor, itemView;

    beforeEach(function() {
      constructor = this.sinon.spy(Marionette, 'View');
      itemView = new Marionette.ItemView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(constructor).to.have.been.called;
    });
  });

});
