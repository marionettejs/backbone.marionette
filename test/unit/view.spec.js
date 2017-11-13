import _ from 'underscore';
import Backbone from 'backbone';
import Region from '../../src/region';
import View from '../../src/view';

describe('item view', function() {
  'use strict';

  let modelData;
  let collectionData;
  let model;
  let collection;
  let template;
  let templateStub;

  beforeEach(function() {
    modelData = {foo: 'bar'};
    collectionData = [{foo: 'bar'}, {foo: 'baz'}];
    model = new Backbone.Model(modelData);
    collection = new Backbone.Collection(collectionData);

    template = 'foobar';
    templateStub = this.sinon.stub().returns(template);
  });

  describe('when instantiating a view with a DOM element', function() {
    let view;

    beforeEach(function() {
      this.setFixtures('<div id="foo"><span class="element">bar</span></div>');
      view = new View({
        el: '#foo',
        ui: {
          element: '.element'
        }
      });
    });

    it('should be rendered', function() {
      expect(view.isRendered()).to.be.true;
    });

    it('should be attached', function() {
      expect(view.isAttached()).to.be.true;
    });

    it('should contain the DOM content', function() {
      expect(view.el.innerHTML).to.contain('<span class="element">bar</span>');
    });

    it('should bind ui elements', function() {
      expect(view.ui.element.text()).to.contain('bar');
    });
  });

  describe('when instantiating a view with a non existing DOM element', function() {
    let view;

    beforeEach(function() {
      this.setFixtures('<div id="foo"><span class="element">bar</span></div>');
      view = new View({
        el: '#nonexistent'
      });
    });

    it('should not be rendered', function() {
      expect(view.isRendered()).to.be.false;
    });

    it('should not be attached', function() {
      expect(view.isAttached()).to.be.false;
    });
  });

  describe('when rendering without a valid template', function() {
    let view;

    beforeEach(function() {
      view = new View();
    });

    it('should throw an exception because there was no valid template', function() {
      expect(function() {view.render()}).to.throw();
    });
  });

  describe('when rendering with a false template', function() {
    let onBeforeRenderStub;
    let onRenderStub;
    let TestView;
    let marionetteRendererSpy;
    let serializeDataSpy;
    let mixinTemplateContextSpy;
    let attachElContentSpy;
    let bindUIElementsSpy;
    let view;

    beforeEach(function() {
      onBeforeRenderStub = this.sinon.stub();
      onRenderStub = this.sinon.stub();

      TestView = View.extend({
        template: false,
        onBeforeRender: onBeforeRenderStub,
        onRender: onRenderStub,

        ui: {
          testElement: '.test-element'
        }
      });

      view = new TestView();

      marionetteRendererSpy = this.sinon.spy(view, '_renderHtml');
      serializeDataSpy = this.sinon.spy(view, 'serializeData');
      mixinTemplateContextSpy = this.sinon.spy(view, 'mixinTemplateContext');
      attachElContentSpy = this.sinon.spy(view, 'attachElContent');
      bindUIElementsSpy = this.sinon.spy(view, 'bindUIElements');

      view.render();
    });

    it('should not throw an exception for a false template', function() {
      expect(view.render.bind(view)).to.not.throw();
    });

    it('should not call an "onBeforeRender" method on the view', function() {
      expect(onBeforeRenderStub).to.not.have.been.called;
    });

    it('should not call an "onRender" method on the view', function() {
      expect(onRenderStub).to.not.have.been.called;
    });

    it('should not call bindUIElements', function() {
      expect(bindUIElementsSpy).to.not.have.been.called;
    });

    it('should not add in data or template context', function() {
      expect(serializeDataSpy).to.not.have.been.called;
      expect(mixinTemplateContextSpy).to.not.have.been.called;
    });

    it('should not render a template', function() {
      expect(marionetteRendererSpy).to.not.have.been.called;
    });

    it('should not attach any html content', function() {
      expect(attachElContentSpy).to.not.have.been.called;
    });

    it('should not claim isRendered', function() {
      expect(view.isRendered()).to.be.false;
    });

    describe('and there is prerendered content', function() {
      let elView;

      beforeEach(function() {
        this.setFixtures('<div id="foo">bar</div>');
        elView = new TestView({ el: '#foo' });
      });

      it('should stay rendered', function() {
        expect(elView.isRendered()).to.be.true;
      });
    });
  });

  describe('when rendering with a overridden attachElContent', function() {
    let attachElContentStub;
    let TestView;
    let itemView;

    beforeEach(function() {
      attachElContentStub = this.sinon.stub();

      TestView = View.extend({
        template: templateStub,
        attachElContent: attachElContentStub
      });
      this.sinon.spy(TestView.prototype, '_renderHtml');

      itemView = new TestView();
      itemView.render();
    });

    it('should render according to the custom attachElContent logic', function() {
      expect(attachElContentStub).to.have.been.calledOnce.and.calledWith(template);
    });

    it('should pass template stub, data and view renderer`', function() {
      expect(itemView._renderHtml).to.have.been.calledWith(templateStub, {});
    });
  });

  describe('when rendering', function() {
    let onBeforeRenderStub;
    let onRenderStub;
    let TestView;
    let view;
    let triggerSpy;
    let attachElContentSpy;

    beforeEach(function() {
      onBeforeRenderStub = this.sinon.spy(function() {
        return this.isRendered();
      });
      onRenderStub = this.sinon.spy(function() {
        return this.isRendered();
      });

      TestView = View.extend({
        template: templateStub,
        onBeforeRender: onBeforeRenderStub,
        onRender: onRenderStub
      });

      view = new TestView();
      triggerSpy = this.sinon.spy(view, 'trigger');
      attachElContentSpy = this.sinon.spy(view, 'attachElContent');
      view.render();
    });

    it('should have an isAttached method which returns if the view is attached or not', function() {
      expect(view.isAttached()).to.be.equal(false);
    });

    it('should call a "onBeforeRender" method on the view', function() {
      expect(onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(onRenderStub).to.have.been.calledOnce;
    });

    it('should call "onBeforeRender" before "onRender"', function() {
      expect(onBeforeRenderStub).to.have.been.calledBefore(onRenderStub);
    });

    it('should not be rendered when "onBeforeRender" is called', function() {
      expect(onBeforeRenderStub.lastCall.returnValue).not.to.be.ok;
    });

    it('should be rendered when "onRender" is called', function() {
      expect(onRenderStub.lastCall.returnValue).to.be.true;
    });

    it('should trigger a before:render event', function() {
      expect(triggerSpy).to.have.been.calledWith('before:render', view);
    });

    it('should trigger a rendered event', function() {
      expect(triggerSpy).to.have.been.calledWith('render', view);
    });

    it('should mark as rendered', function() {
      expect(view).to.have.property('_isRendered', true);
    });

    it('should call attachElContent', function() {
      expect(attachElContentSpy).to.have.been.calledOnce.and.calledWith(template);
    });
  });

  describe('when rendering with a template that returns an empty string', function() {
    let view;
    let attachElContentSpy;

    beforeEach(function() {
      view = new View({
        template: function() { return '' }
      });
      attachElContentSpy = this.sinon.spy(view, 'attachElContent');
      view.render();
    });

    it('should call attachElContent', function() {
      expect(attachElContentSpy).to.have.been.calledOnce.and.calledWith('');
    });
  });

  describe('when rendering with a template that returns undefined', function() {
    let view;
    let attachElContentSpy;

    beforeEach(function() {
      view = new View({
        template: _.noop
      });
      attachElContentSpy = this.sinon.spy(view, 'attachElContent');
      view.render();
    });

    it('should not call attachElContent', function() {
      expect(attachElContentSpy).to.not.have.been.called;
    });
  });

  describe('when an item view has a model and is rendered', function() {
    let view;
    let serializeDataSpy;

    beforeEach(function() {
      view = new View({
        template: templateStub,
        model: model
      });

      serializeDataSpy = this.sinon.spy(view, 'serializeData');
      view.render();
    });

    it('should serialize the model', function() {
      expect(serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized model', function() {
      expect(templateStub).to.have.been.calledWith(modelData);
    });
  });

  describe('when an item view has a collection and is rendered', function() {
    let view;
    let serializeDataSpy;

    beforeEach(function() {
      view = new View({
        template: templateStub,
        collection: collection
      });

      serializeDataSpy = this.sinon.spy(view, 'serializeData');
      view.render();
    });

    it('should serialize the collection', function() {
      expect(serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized collection', function() {
      expect(templateStub).to.have.been.calledWith({items: collectionData});
    });
  });

  describe('when an item view has a model and collection, and is rendered', function() {
    let view;
    let serializeDataSpy;

    beforeEach(function() {
      view = new View({
        template: templateStub,
        model: model,
        collection: collection
      });

      serializeDataSpy = this.sinon.spy(view, 'serializeData');
      view.render();
    });

    it('should serialize the model', function() {
      expect(serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized model', function() {
      expect(templateStub).to.have.been.calledWith(modelData);
    });
  });

  describe('when destroying an item view', function() {
    let onBeforeDestroyStub;
    let onDestroyStub;
    let TestView;
    let view;
    let removeSpy;
    let stopListeningSpy;
    let triggerSpy;

    beforeEach(function() {
      onBeforeDestroyStub = this.sinon.spy(function() {
        return {
          isRendered: this.isRendered(),
          isDestroyed: this.isDestroyed()
        };
      });
      onDestroyStub = this.sinon.spy(function() {
        return {
          isRendered: this.isRendered(),
          isDestroyed: this.isDestroyed()
        };
      });

      TestView = View.extend({
        template: templateStub,
        onBeforeDestroy: onBeforeDestroyStub,
        onDestroy: onDestroyStub
      });

      view = new TestView();
      view.render();

      removeSpy = this.sinon.spy(view, '_removeElement');
      stopListeningSpy = this.sinon.spy(view, 'stopListening');
      triggerSpy = this.sinon.spy(view, 'trigger');

      this.sinon.spy(view, 'destroy');
      view.destroy();
    });

    it('should remove the views EL from the DOM', function() {
      expect(removeSpy).to.have.been.calledOnce;
    });

    it('should unbind any listener to custom view events', function() {
      expect(stopListeningSpy).to.have.been.calledOnce;
    });

    it('should trigger "before:destroy"', function() {
      expect(triggerSpy).to.have.been.calledWith('before:destroy');
    });

    it('should trigger "destroy"', function() {
      expect(triggerSpy).to.have.been.calledWith('destroy');
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(onBeforeDestroyStub).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(onDestroyStub).to.have.been.called;
    });

    it('should return the view', function() {
      expect(view.destroy).to.have.returned(view);
    });

    it('should not be destroyed when "onBeforeDestroy" is called', function() {
      expect(onBeforeDestroyStub.lastCall.returnValue.isDestroyed).not.to.be.ok;
    });

    it('should be rendered when "onBeforeDestroy" is called', function() {
      expect(onBeforeDestroyStub.lastCall.returnValue.isRendered).to.be.true;
    });

    it('should be destroyed when "onDestroy" is called', function() {
      expect(onDestroyStub.lastCall.returnValue.isDestroyed).to.be.true;
    });

    it('should not be rendered when "onDestroy" is called', function() {
      expect(onDestroyStub.lastCall.returnValue.isRendered).to.be.false;
    });

    it('should be marked destroyed', function() {
      expect(view).to.have.property('_isDestroyed', true);
    });

    it('should be marked not rendered', function() {
      expect(view).to.have.property('_isRendered', false);
    });
  });

  describe('when re-rendering an View that is already shown', function() {
    let onDomRefreshStub;
    let TestView;
    let view;
    let region;
    let TestRegion;

    beforeEach(function() {
      onDomRefreshStub = this.sinon.stub();

      TestView = View.extend({
        template: templateStub,
        onDomRefresh: onDomRefreshStub
      });

      this.setFixtures('<div id="region"></div>');
      TestRegion = Region.extend({
        el: '#region'
      });

      view = new TestView();
      region = new TestRegion();
      region.show(view);
      view.render();
    });

    it('should trigger a dom:refresh event', function() {
      expect(onDomRefreshStub).to.have.been.calledTwice;
    });
  });

  describe('has a valid inheritance chain back to Backbone.View', function() {
    let constructor;

    beforeEach(function() {
      constructor = this.sinon.spy(Backbone.View.prototype, 'constructor');
    });

    it('calls the parent Backbone.Views constructor function on instantiation with the proper parameters', function() {
      const options = {foo: 'bar'};
      const customParam = {foo: 'baz'};

      new View(options, customParam);
      expect(constructor).to.have.been.calledWith(options, customParam);
    });
  });

  describe('when instantiating a View', function() {
    it('should trigger `initialize` on the behaviors', function() {
      this.sinon.stub(View.prototype, '_triggerEventOnBehaviors');

      const myView = new View();

      // _triggerEventOnBehaviors comes from Behaviors mixin
      expect(myView._triggerEventOnBehaviors)
        .to.be.calledOnce.and.calledWith('initialize', myView);
    });
  });

  describe('when serializing view data', function() {
    let itemView;

    beforeEach(function() {
      modelData = {foo: 'bar'};
      collectionData = [{foo: 'bar'}, {foo: 'baz'}];

      itemView = new View();
      this.sinon.spy(itemView, 'serializeModel');
      this.sinon.spy(itemView, 'serializeCollection');
    });

    it('should return an empty object without data', function() {
      expect(itemView.serializeData()).to.be.undefined;
    });

    describe('and the view has a model', function() {
      beforeEach(function() {
        itemView.model = new Backbone.Model(modelData);
        itemView.serializeData();
      });

      it('should call serializeModel', function() {
        expect(itemView.serializeModel).to.have.been.calledOnce;
      });

      it('should not call serializeCollection', function() {
        expect(itemView.serializeCollection).to.not.have.been.called;
      });
    });

    describe('and the view only has a collection', function() {
      beforeEach(function() {
        itemView.collection = new Backbone.Collection(collectionData);
        itemView.serializeData();
      });

      it('should call serializeCollection', function() {
        expect(itemView.serializeCollection).to.have.been.calledOnce;
      });

      it('should not call serializeModel', function() {
        expect(itemView.serializeModel).to.not.have.been.called;
      });
    });

    describe('and the view has a collection and a model', function() {
      beforeEach(function() {
        itemView.model = new Backbone.Model(modelData);
        itemView.collection = new Backbone.Collection(collectionData);
        itemView.serializeData();
      });

      it('should call serializeModel', function() {
        expect(itemView.serializeModel).to.have.been.calledOnce;
      });

      it('should not call serializeCollection', function() {
        expect(itemView.serializeCollection).to.not.have.been.called;
      });
    });
  });

  describe('when serializing a collection', function() {
    let itemView;

    beforeEach(function() {
      collectionData = [{foo: 'bar'}, {foo: 'baz'}];
      itemView = new View({
        collection: new Backbone.Collection(collectionData)
      });
    });

    it('should serialize to an items attribute', function() {
      expect(itemView.serializeData().items).to.be.defined;
    });

    it('should serialize all models', function() {
      expect(itemView.serializeData().items).to.deep.equal(collectionData);
    });
  });
});
