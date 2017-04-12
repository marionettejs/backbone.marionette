describe('item view', function() {
  'use strict';

  beforeEach(function() {
    this.modelData = {foo: 'bar'};
    this.collectionData = [{foo: 'bar'}, {foo: 'baz'}];
    this.model = new Backbone.Model(this.modelData);
    this.collection = new Backbone.Collection(this.collectionData);

    this.template = 'foobar';
    this.templateStub = this.sinon.stub().returns(this.template);
  });

  describe('when instantiating a view with a DOM element', function() {
    beforeEach(function() {
      this.setFixtures('<div id="foo"><span class="element">bar</span></div>');
      this.view = new Marionette.View({
        el: '#foo',
        ui: {
          element: '.element'
        }
      });
    });

    it('should be rendered', function() {
      expect(this.view.isRendered()).to.be.true;
    });

    it('should be attached', function() {
      expect(this.view.isAttached()).to.be.true;
    });

    it('should contain the DOM content', function() {
      expect(this.view.el.innerHTML).to.contain('<span class="element">bar</span>');
    });

    it('should bind ui elements', function() {
      expect(this.view.ui.element.text()).to.contain('bar');
    });
  });

  describe('when rendering without a valid template', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
    });

    it('should throw an exception because there was no valid template', function() {
      expect(this.view.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when rendering with a false template', function() {
    beforeEach(function() {
      this.onBeforeRenderStub = this.sinon.stub();
      this.onRenderStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: false,
        onBeforeRender: this.onBeforeRenderStub,
        onRender: this.onRenderStub,

        ui: {
          testElement: '.test-element'
        }
      });

      this.view = new this.View();

      this.marionetteRendererSpy = this.sinon.spy(Marionette.Renderer, 'render');
      this.triggerSpy = this.sinon.spy(this.view, 'trigger');
      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.mixinTemplateContextSpy = this.sinon.spy(this.view, 'mixinTemplateContext');
      this.attachElContentSpy = this.sinon.spy(this.view, 'attachElContent');
      this.bindUIElementsSpy = this.sinon.spy(this.view, 'bindUIElements');

      this.view.render();
    });

    describe('when DEV_MODE is true', function() {
      beforeEach(function() {
        Marionette.DEV_MODE = true;
        this.sinon.spy(Marionette.deprecate, '_warn');
        this.sinon.stub(Marionette.deprecate, '_console', {
          warn: this.sinon.stub()
        });
        Marionette.deprecate._cache = {};
      });

      it('should call Marionette.deprecate', function() {
        this.view.render();
        expect(Marionette.deprecate._warn).to.be.calledWith('Deprecation warning: template:false is deprecated.  Use _.noop.');
      });

      afterEach(function() {
        Marionette.DEV_MODE = false;
      });
    });

    it('should not throw an exception for a false template', function() {
      expect(this.view.render).to.not.throw('Cannot render the template since it is null or undefined.');
    });

    it('should call an "onBeforeRender" method on the view', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });

    it('should call bindUIElements', function() {
      expect(this.bindUIElementsSpy).to.have.been.calledOnce;
    });

    it('should trigger a before:render event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:render', this.view);
    });

    it('should trigger a rendered event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('render', this.view);
    });

    it('should not add in data or template context', function() {
      expect(this.serializeDataSpy).to.not.have.been.called;
      expect(this.mixinTemplateContextSpy).to.not.have.been.called;
    });

    it('should not render a template', function() {
      expect(this.marionetteRendererSpy).to.not.have.been.called;
    });

    it('should not attach any html content', function() {
      expect(this.attachElContentSpy).to.not.have.been.called;
    });

    it('should claim isRendered', function() {
      expect(this.view.isRendered()).to.be.true;
    });
  });

  describe('when rendering with a overridden attachElContent', function() {
    beforeEach(function() {
      this.attachElContentStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: this.templateStub,
        attachElContent: this.attachElContentStub
      });
      this.sinon.spy(Marionette.Renderer, 'render');

      this.itemView = new this.View();
      this.itemView.render();
    });

    it('should render according to the custom attachElContent logic', function() {
      expect(this.attachElContentStub).to.have.been.calledOnce.and.calledWith(this.template);
    });

    it('should pass template stub, data and view instance to `Marionette.Renderer.Render`', function() {
      expect(Marionette.Renderer.render).to.have.been.calledWith(this.templateStub, {}, this.itemView);
    });
  });

  describe('when rendering', function() {
    beforeEach(function() {
      this.onBeforeRenderStub = this.sinon.spy(function() {
        return this.isRendered();
      });
      this.onRenderStub = this.sinon.spy(function() {
        return this.isRendered();
      });

      this.View = Marionette.View.extend({
        template: this.templateStub,
        onBeforeRender: this.onBeforeRenderStub,
        onRender: this.onRenderStub
      });

      this.view = new this.View();
      this.triggerSpy = this.sinon.spy(this.view, 'trigger');
      this.view.render();
    });

    it('should have an isAttached method which returns if the view is attached or not', function() {
      expect(this.view.isAttached()).to.be.equal(false);
    });

    it('should call a "onBeforeRender" method on the view', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });

    it('should call "onBeforeRender" before "onRender"', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledBefore(this.onRenderStub);
    });

    it('should not be rendered when "onBeforeRender" is called', function() {
      expect(this.onBeforeRenderStub.lastCall.returnValue).not.to.be.ok;
    });

    it('should be rendered when "onRender" is called', function() {
      expect(this.onRenderStub.lastCall.returnValue).to.be.true;
    });

    it('should trigger a before:render event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:render', this.view);
    });

    it('should trigger a rendered event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('render', this.view);
    });

    it('should mark as rendered', function() {
      expect(this.view).to.have.property('_isRendered', true);
    });
  });

  describe('when an item view has a model and is rendered', function() {
    beforeEach(function() {
      this.view = new Marionette.View({
        template: this.templateStub,
        model: this.model
      });

      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized model', function() {
      expect(this.templateStub).to.have.been.calledWith(this.modelData);
    });
  });

  describe('when an item view has a collection and is rendered', function() {
    beforeEach(function() {
      this.view = new Marionette.View({
        template: this.templateStub,
        collection: this.collection
      });

      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.view.render();
    });

    it('should serialize the collection', function() {
      expect(this.serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized collection', function() {
      expect(this.templateStub).to.have.been.calledWith({items: this.collectionData});
    });
  });

  describe('when an item view has a model and collection, and is rendered', function() {
    beforeEach(function() {
      this.view = new Marionette.View({
        template: this.templateStub,
        model: this.model,
        collection: this.collection
      });

      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized model', function() {
      expect(this.templateStub).to.have.been.calledWith(this.modelData);
    });
  });

  describe('when destroying an item view', function() {
    beforeEach(function() {
      this.onBeforeDestroyStub = this.sinon.spy(function() {
        return {
          isRendered: this.isRendered(),
          isDestroyed: this.isDestroyed()
        };
      });
      this.onDestroyStub = this.sinon.spy(function() {
        return {
          isRendered: this.isRendered(),
          isDestroyed: this.isDestroyed()
        };
      });

      this.View = Marionette.View.extend({
        template: this.templateStub,
        onBeforeDestroy: this.onBeforeDestroyStub,
        onDestroy: this.onDestroyStub
      });

      this.view = new this.View();
      this.view.render();

      this.removeSpy = this.sinon.spy(this.view, 'removeEl');
      this.stopListeningSpy = this.sinon.spy(this.view, 'stopListening');
      this.triggerSpy = this.sinon.spy(this.view, 'trigger');

      this.sinon.spy(this.view, 'destroy');
      this.view.destroy();
    });

    it('should remove the views EL from the DOM', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should unbind any listener to custom view events', function() {
      expect(this.stopListeningSpy).to.have.been.calledOnce;
    });

    it('should trigger "before:destroy"', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:destroy');
    });

    it('should trigger "destroy"', function() {
      expect(this.triggerSpy).to.have.been.calledWith('destroy');
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(this.onBeforeDestroyStub).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(this.onDestroyStub).to.have.been.called;
    });

    it('should return the view', function() {
      expect(this.view.destroy).to.have.returned(this.view);
    });

    it('should not be destroyed when "onBeforeDestroy" is called', function() {
      expect(this.onBeforeDestroyStub.lastCall.returnValue.isDestroyed).not.to.be.ok;
    });

    it('should be rendered when "onBeforeDestroy" is called', function() {
      expect(this.onBeforeDestroyStub.lastCall.returnValue.isRendered).to.be.true;
    });

    it('should be destroyed when "onDestroy" is called', function() {
      expect(this.onDestroyStub.lastCall.returnValue.isDestroyed).to.be.true;
    });

    it('should not be rendered when "onDestroy" is called', function() {
      expect(this.onDestroyStub.lastCall.returnValue.isRendered).to.be.false;
    });

    it('should be marked destroyed', function() {
      expect(this.view).to.have.property('_isDestroyed', true);
    });

    it('should be marked not rendered', function() {
      expect(this.view).to.have.property('_isRendered', false);
    });
  });

  describe('when re-rendering an View that is already shown', function() {
    beforeEach(function() {
      this.onDomRefreshStub = this.sinon.stub();

      this.View = Marionette.View.extend({
        template: this.templateStub,
        onDomRefresh: this.onDomRefreshStub
      });

      this.setFixtures('<div id="region"></div>');
      this.Region = Marionette.Region.extend({
        el: '#region'
      });

      this.view = new this.View();
      this.region = new this.Region();
      this.region.show(this.view);
      this.view.render();
    });

    it('should trigger a dom:refresh event', function() {
      expect(this.onDomRefreshStub).to.have.been.calledTwice;
    });
  });

  describe('has a valid inheritance chain back to Backbone.View', function() {
    beforeEach(function() {
      this.constructor = this.sinon.spy(Backbone.View.prototype, 'constructor');
    });

    it('calls the parent Backbone.Views constructor function on instantiation with the proper parameters', function() {
      const options = {foo: 'bar'};
      const customParam = {foo: 'baz'};

      this.layoutView = new Marionette.View(options, customParam);
      expect(this.constructor).to.have.been.calledWith(options, customParam);
    });
  });

  describe('when instantiating a View', function() {
    it('should trigger `initialize` on the behaviors', function() {
      this.sinon.stub(Marionette.View.prototype, '_triggerEventOnBehaviors');

      const myView = new Marionette.View();

      // _triggerEventOnBehaviors comes from Behaviors mixin
      expect(myView._triggerEventOnBehaviors)
        .to.be.calledOnce.and.calledWith('initialize', myView);
    });
  });

  describe('when serializing view data', function() {
    beforeEach(function() {
      this.modelData = {foo: 'bar'};
      this.collectionData = [{foo: 'bar'}, {foo: 'baz'}];

      this.itemView = new Marionette.View();
      this.sinon.spy(this.itemView, 'serializeModel');
      this.sinon.spy(this.itemView, 'serializeCollection');
    });

    it('should return an empty object without data', function() {
      expect(this.itemView.serializeData()).to.deep.equal({});
      expect(this.itemView.serializeCollection()).to.deep.equal({});
    });

    describe('and the view has a model', function() {
      beforeEach(function() {
        this.itemView.model = new Backbone.Model(this.modelData);
        this.itemView.serializeData();
      });

      it('should call serializeModel', function() {
        expect(this.itemView.serializeModel).to.have.been.calledOnce;
      });

      it('should not call serializeCollection', function() {
        expect(this.itemView.serializeCollection).to.not.have.been.called;
      });
    });

    describe('and the view only has a collection', function() {
      beforeEach(function() {
        this.itemView.collection = new Backbone.Collection(this.collectionData);
        this.itemView.serializeData();
      });

      it('should call serializeCollection', function() {
        expect(this.itemView.serializeCollection).to.have.been.calledOnce;
      });

      it('should not call serializeModel', function() {
        expect(this.itemView.serializeModel).to.not.have.been.called;
      });
    });

    describe('and the view has a collection and a model', function() {
      beforeEach(function() {
        this.itemView.model = new Backbone.Model(this.modelData);
        this.itemView.collection = new Backbone.Collection(this.collectionData);
        this.itemView.serializeData();
      });

      it('should call serializeModel', function() {
        expect(this.itemView.serializeModel).to.have.been.calledOnce;
      });

      it('should not call serializeCollection', function() {
        expect(this.itemView.serializeCollection).to.not.have.been.called;
      });
    });
  });

  describe('when serializing a collection', function() {
    beforeEach(function() {
      this.collectionData = [{foo: 'bar'}, {foo: 'baz'}];
      this.itemView = new Marionette.View({
        collection: new Backbone.Collection(this.collectionData)
      });
    });

    it('should serialize to an items attribute', function() {
      expect(this.itemView.serializeData().items).to.be.defined;
    });

    it('should serialize all models', function() {
      expect(this.itemView.serializeData().items).to.deep.equal(this.collectionData);
    });
  });
});
