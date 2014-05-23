describe('item view', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    this.Model = Backbone.Model.extend();

    this.Collection = Backbone.Collection.extend({
      model: this.Model
    });

    this.ItemView = Backbone.Marionette.ItemView.extend({});

    this.loadFixtures('itemTemplate.html', 'collectionItemTemplate.html', 'emptyTemplate.html');
  });

  describe('when rendering without a valid template', function() {
    beforeEach(function() {
      this.TemplatelessView = Backbone.Marionette.ItemView.extend({});
      this.view = new this.TemplatelessView({});
    });

    it('should throw an exception because there was no valid template', function() {
      expect(this.view.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when rendering', function() {
    beforeEach(function() {
      this.OnRenderView = Backbone.Marionette.ItemView.extend({
        template: '#emptyTemplate',
        onBeforeRender: function() {},
        onRender: function() {}
      });

      this.view = new this.OnRenderView({});

      this.sinon.spy(this.view, 'onBeforeRender');
      this.sinon.spy(this.view, 'onRender');
      this.sinon.spy(this.view, 'trigger');

      this.view.render();
    });

    it('should call a "onBeforeRender" method on the view', function() {
      expect(this.view.onBeforeRender).to.have.been.called;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.view.onRender).to.have.been.called;
    });

    it('should trigger a before:render event', function() {
      expect(this.view.trigger).to.have.been.calledWith('before:render', this.view);
    });

    it('should trigger a rendered event', function() {
      expect(this.view.trigger).to.have.been.calledWith('render', this.view);
    });
  });

  describe('when an item view has a model and is rendered', function() {
    beforeEach(function() {
      this.loadFixtures('itemTemplate.html');

      this.view = new this.ItemView({
        template: '#itemTemplate',
        model: new this.Model({
          foo: 'bar'
        })
      });

      this.sinon.spy(this.view, 'serializeData');

      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized model', function() {
      expect($(this.view.el)).to.contain.$text('bar');
    });
  });

  describe('when an item view has asynchronous data and is rendered', function() {
    beforeEach(function() {
      this.loadFixtures('itemTemplate.html');

      this.view = new this.ItemView({
        template: '#itemTemplate',
        serializeData: function() {
          var that = this;
          var deferred = $.Deferred();
          setTimeout(function() {
            deferred.resolve(that.model.toJSON());
          }, 100);
          return deferred.promise();
        },
        model: new this.Model({
          foo: 'bar'
        })
      });

      this.sinon.spy(this.view, 'serializeData');

      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized model', function() {
      expect($(this.view.el)).to.contain.$text('bar');
    });
  });

  describe('when an item view has an asynchronous onRender and is rendered', function() {
    beforeEach(function() {
      this.AsyncOnRenderView = Backbone.Marionette.ItemView.extend({
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
      this.view = new this.AsyncOnRenderView();
      this.promise = this.view.render();
    });

    it('should delay until onRender resolves', function(done) {
      var suite = this;
      setTimeout(function () {
        $.when(suite.promise).then(function() {
          expect(suite.view.asyncCallback).to.have.been.called;
          done();
        });
      }, 0);
    });
  });

  describe('when an item view has a collection and is rendered', function() {
    beforeEach(function() {
      this.view = new this.ItemView({
        template: '#collectionItemTemplate',
        collection: new this.Collection([{foo: 'bar'}, {foo: 'baz'}])
      });

      this.sinon.spy(this.view, 'serializeData');

      this.view.render();
    });

    it('should serialize the collection', function() {
      expect(this.view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized collection', function() {
      expect($(this.view.el)).to.contain.$text('bar');
      expect($(this.view.el)).to.contain.$text('baz');
    });
  });

  describe('when an item view has a model and collection, and is rendered', function() {
    beforeEach(function() {
      this.view = new this.ItemView({
        template: '#itemTemplate',
        model: new this.Model({foo: 'bar'}),
        collection: new this.Collection([{foo: 'bar'}, {foo: 'baz'}])
      });

      this.sinon.spy(this.view, 'serializeData');

      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.view.serializeData).to.have.been.called;
    });

    it('should render the template with the serialized model', function() {
      expect($(this.view.el)).to.contain.$text('bar');
      expect($(this.view.el)).not.to.contain.$text('baz');
    });
  });

  describe('when destroying an item view', function() {
    beforeEach(function() {
      this.EventedView = Backbone.Marionette.ItemView.extend({
        template: '#emptyTemplate',
        modelChange: function() {},
        collectionChange: function() {},
        onBeforeDestroy: function() {},
        onDestroy: function() {}
      });

      this.loadFixtures('itemTemplate.html');

      this.model = new this.Model({foo: 'bar'});
      this.collection = new this.Collection();
      this.view = new this.EventedView({
        template: '#itemTemplate',
        model: this.model,
        collection: this.collection
      });
      this.view.render();

      this.sinon.spy(this.view, 'remove');
      this.sinon.spy(this.view, 'stopListening');
      this.sinon.spy(this.view, 'modelChange');
      this.sinon.spy(this.view, 'collectionChange');
      this.sinon.spy(this.view, 'onBeforeDestroy');
      this.sinon.spy(this.view, 'onDestroy');
      this.sinon.spy(this.view, 'trigger');

      this.view.listenTo(this.model, 'change:foo', this.view.modelChange);
      this.view.listenTo(this.collection, 'foo', this.view.collectionChange);

      this.view.destroy();

      this.model.set({foo: 'bar'});
      this.collection.trigger('foo');
    });

    it('should unbind model events for the view', function() {
      expect(this.view.modelChange).not.to.have.been.called;
    });

    it('should unbind all collection events for the view', function() {
      expect(this.view.collectionChange).not.to.have.been.called;
    });

    it('should unbind any listener to custom view events', function() {
      expect(this.view.stopListening).to.have.been.called;
    });

    it('should remove the views EL from the DOM', function() {
      expect(this.view.remove).to.have.been.called;
    });

    it('should trigger "before:destroy"', function(){
      expect(this.view.trigger).to.have.been.calledWith('before:destroy');
    });

    it('should trigger "destroy"', function(){
      expect(this.view.trigger).to.have.been.calledWith('destroy');
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(this.view.onBeforeDestroy).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(this.view.onDestroy).to.have.been.called;
    });
  });

  describe('when a view with a checkbox is bound to re-render on the "change:done" event of the model', function() {
    describe('and rendering the view, then changing the checkbox from unchecked, to checked, and back to unchecked', function() {
      beforeEach(function() {
        this.View = Backbone.Marionette.ItemView.extend({
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

        this.loadFixtures('itemWithCheckbox.html');

        this.model = new Backbone.Model({
          done: false
        });

        this.view = new this.View({
          model: this.model
        });

        this.spy = this.sinon.spy(this.view, 'render');

        this.view.setupHandler();
        this.view.render();

        this.chk = this.view.$('#chk');
        this.chk.attr('checked', 'checked');
        this.chk.trigger('change');

        this.chk = this.view.$('#chk');
        this.chk.removeAttr('checked');
        this.chk.trigger('change');
      });

      it('should render the view 3 times total', function() {
        expect(this.spy.callCount).to.equal(3);
      });
    });
  });

  describe('when re-rendering an ItemView that is already shown', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: function() { return '<div>foo</div>'; }
      });

      this.renderUpdate = this.sinon.stub();

      this.view = new this.View();
      $('body').append(this.view.el);

      this.view.on('dom:refresh', this.renderUpdate);
      this.view.render();
      this.view.triggerMethod('show');

      this.view.render();
    });

    afterEach(function() {
      this.view.remove();
    });

    it('should trigger a dom:refresh event', function() {
      expect(this.renderUpdate).to.have.been.called;
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Marionette, 'View');
      this.itemView = new Marionette.ItemView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(this.constructor).to.have.been.called;
    });
  });
});
