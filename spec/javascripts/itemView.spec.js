describe('item view', function() {
  'use strict';

  beforeEach(function() {
    this.modelData      = {foo: 'bar'};
    this.collectionData = [{foo: 'bar'}, {foo: 'baz'}];
    this.model      = new Backbone.Model(this.modelData);
    this.collection = new Backbone.Collection(this.collectionData);

    this.template = 'foobar';
    this.templateStub = this.sinon.stub().returns(this.template);
  });

  describe('when rendering without a valid template', function() {
    beforeEach(function() {
      this.view = new Marionette.ItemView();
    });

    it('should throw an exception because there was no valid template', function() {
      expect(this.view.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when rendering with a overridden attachElContent', function() {
    beforeEach(function() {
      this.attachElContentStub = this.sinon.stub();

      this.ItemView = Marionette.ItemView.extend({
        template        : this.templateStub,
        attachElContent : this.attachElContentStub
      });
      this.sinon.spy(Marionette.Renderer, 'render');

      this.itemView = new this.ItemView();
      this.itemView.render();
    });

    it('should render according to the custom attachElContent logic', function() {
      expect(this.attachElContentStub).to.have.been.calledOnce.and.calledWith(this.template);
    });

    it("should pass template stub, data and view instance to `Marionette.Renderer.Render`", function(){
      expect(Marionette.Renderer.render).to.have.been.calledWith(this.templateStub, {}, this.itemView);
    });
  });

  describe('when rendering', function() {
    beforeEach(function() {
      this.onBeforeRenderStub = this.sinon.stub();
      this.onRenderStub       = this.sinon.stub();

      this.View = Marionette.ItemView.extend({
        template       : this.templateStub,
        onBeforeRender : this.onBeforeRenderStub,
        onRender       : this.onRenderStub
      });

      this.view = new this.View();
      this.triggerSpy = this.sinon.spy(this.view, 'trigger');
      this.view.render();
    });

    it('should call a "onBeforeRender" method on the view', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });

    it('should trigger a before:render event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:render', this.view);
    });

    it('should trigger a rendered event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('render', this.view);
    });
  });

  describe('when an item view has a model and is rendered', function() {
    beforeEach(function() {
      this.view = new Marionette.ItemView({
        template : this.templateStub,
        model    : this.model
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
      this.view = new Marionette.ItemView({
        template   : this.templateStub,
        collection : this.collection
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
      this.view = new Marionette.ItemView({
        template   : this.templateStub,
        model      : this.model,
        collection : this.collection
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
      this.onBeforeDestroyStub = this.sinon.stub();
      this.onDestroyStub       = this.sinon.stub();

      this.View = Marionette.ItemView.extend({
        template        : this.templateStub,
        onBeforeDestroy : this.onBeforeDestroyStub,
        onDestroy       : this.onDestroyStub
      });

      this.view = new this.View();
      this.view.render();

      this.removeSpy        = this.sinon.spy(this.view, 'remove');
      this.stopListeningSpy = this.sinon.spy(this.view, 'stopListening');
      this.triggerSpy       = this.sinon.spy(this.view, 'trigger');

      this.sinon.spy(this.view, 'destroy');
      this.view.destroy();
    });

    it('should remove the views EL from the DOM', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should unbind any listener to custom view events', function() {
      expect(this.stopListeningSpy).to.have.been.calledOnce;
    });

    it('should trigger "before:destroy"', function(){
      expect(this.triggerSpy).to.have.been.calledWith('before:destroy');
    });

    it('should trigger "destroy"', function(){
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
  });

  describe('when re-rendering an ItemView that is already shown', function() {
    beforeEach(function() {
      this.onDomRefreshStub = this.sinon.stub();

      this.View = Marionette.ItemView.extend({
        template     : this.templateStub,
        onDomRefresh : this.onDomRefreshStub
      });

      this.view = new this.View();
      this.setFixtures(this.view.$el);

      this.view.render();
      this.view.triggerMethod('show');
      this.view.render();
    });

    it('should trigger a dom:refresh event', function() {
      expect(this.onDomRefreshStub).to.have.been.calledTwice;
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    beforeEach(function() {
      this.constructorSpy = this.sinon.spy(Marionette, 'View');
      this.itemView = new Marionette.ItemView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(this.constructorSpy).to.have.been.called;
    });
  });
});
