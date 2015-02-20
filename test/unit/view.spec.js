describe('base view', function() {
  'use strict';

  describe('when creating a view', function() {
    beforeEach(function() {
      this.initializeStub = this.sinon.stub();
      this.viewConstructorSpy = this.sinon.spy(Backbone, 'View');

      this.View = Marionette.View.extend({
        initialize: this.initializeStub
      });

      this.view = new this.View();
    });

    it('should call the Backone.View constructor', function() {
      expect(this.viewConstructorSpy).to.have.been.calledOnce;
    });

    it('should call initialize', function() {
      expect(this.initializeStub).to.have.been.calledOnce;
    });

    it('should set _behaviors', function() {
      expect(this.view._behaviors).to.be.eql({});
    });
  });

  describe('when using listenTo for the "destroy" event on itself, and destroying the view', function() {
    beforeEach(function() {
      this.destroyStub = this.sinon.stub();
      this.view = new Marionette.View();
      this.view.listenTo(this.view, 'destroy', this.destroyStub);
      this.view.destroy();
    });

    it('should trigger the "destroy" event', function() {
      expect(this.destroyStub).to.have.been.called;
    });
  });

  describe('when destroying a view', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.view = new Marionette.View();

      this.sinon.spy(this.view, 'remove');
      this.sinon.spy(this.view, 'destroy');

      this.onDestroyStub = this.sinon.stub();
      this.view.onDestroy = this.onDestroyStub;

      this.destroyStub = this.sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.view.destroy(this.argumentOne, this.argumentTwo);
    });

    it('should trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce;
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(this.onDestroyStub).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should remove the view', function() {
      expect(this.view.remove).to.have.been.calledOnce;
    });

    it('should set the view isDestroyed to true', function() {
      expect(this.view).to.be.have.property('isDestroyed', true);
    });

    it('should return the View', function() {
      expect(this.view.destroy).to.have.returned(this.view);
    });

    describe('and it has already been destroyed', function() {
      beforeEach(function() {
        this.view.destroy();
      });

      it('should return the View', function() {
        expect(this.view.destroy).to.have.returned(this.view);
      });
    });

    describe('isDestroyed property', function() {
      beforeEach(function() {
        this.view = new Marionette.View();
      });

      it('should be set to false before destroy', function() {
        expect(this.view).to.be.have.property('isDestroyed', false);
      });

      it('should be set to true after destroying', function() {
        this.view.destroy();
        expect(this.view).to.be.have.property('isDestroyed', true);
      });
    });
  });

  describe('when destroying a view and returning false from the onBeforeDestroy method', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.removeSpy = this.sinon.spy(this.view, 'remove');

      this.destroyStub = this.sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.onBeforeDestroyStub = this.sinon.stub().returns(false);
      this.view.onBeforeDestroy = this.onDestroyStub;

      this.view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce;
    });

    it('should not remove the view', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should not set the view isDestroyed to true', function() {
      expect(this.view).to.be.have.property('isDestroyed', true);
    });
  });

  describe('when destroying a view and returning undefined from the onBeforeDestroy method', function() {
    beforeEach(function() {
      this.argumentOne = 'foo';
      this.argumentTwo = 'bar';

      this.view = new Marionette.View();

      this.removeSpy = this.sinon.spy(this.view, 'remove');

      this.destroyStub = this.sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.onBeforeDestroyStub = this.sinon.stub().returns(false);
      this.view.onBeforeDestroy = this.onBeforeDestroyStub;
      this.sinon.spy(this.view, 'destroy');

      this.view.destroy(this.argumentOne, this.argumentTwo);
    });

    it('should trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce.and.calledWith(this.argumentOne, this.argumentTwo);
    });

    it('should remove the view', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should set the view isDestroyed to true', function() {
      expect(this.view).to.have.property('isDestroyed', true);
    });

    it('should return the view', function() {
      expect(this.view.destroy).to.have.returned(this.view);
    });
  });

  describe('constructing a view with default options', function() {
    beforeEach(function() {
      this.presets = {foo: 'foo'};
      this.options = {foo: 'bar'};

      this.presetsStub = this.sinon.stub().returns(this.presets);
      this.optionsStub = this.sinon.stub().returns(this.options);

      this.View = Marionette.View.extend();
      this.ViewPresets   = Marionette.View.extend({ options: this.presets });
      this.ViewPresetsFn = Marionette.View.extend({ options: this.presetsStub });
    });

    it('should take and store view options', function() {
      this.view = new this.View(this.options);
      expect(this.view.options).to.deep.equal(this.options);
    });

    it('should take and store view options as a function', function() {
      this.view = new this.View(this.optionsStub);
      expect(this.view.options).to.deep.equal(this.options);
    });

    it('should have an empty hash of options by default', function() {
      this.view = new this.View();
      expect(this.view.options).to.deep.equal({});
    });

    it('should retain options set on view class', function() {
      this.view = new this.ViewPresets();
      expect(this.view.options).to.deep.equal(this.presets);
    });

    it('should retain options set on view class as a function', function() {
      this.view = new this.ViewPresetsFn();
      expect(this.view.options).to.deep.equal(this.presets);
    });
  });

  // http://backbonejs.org/#View-constructor
  describe('when constructing a view with Backbone viewOptions', function () {
    it('should attach the viewOptions to the view if options are on the view', function () {
      this.MyView = Marionette.View.extend({
        options: {
          className: '.some-class'
        } 
      });
      this.myView = new this.MyView();
      expect(this.myView.className).to.equal('.some-class');
    });

    it('should attach the viewOptions to the view if options are passed as a function', function () {
      var options = function(){
        return {
          className: '.some-class'
        };
      };  
      this.myView = new Marionette.View(options);
      expect(this.myView.className).to.equal('.some-class');
    });
  });

  describe('should expose its options in the constructor', function() {
    beforeEach(function() {
      this.options = {foo: 'bar'};
      this.view = new Marionette.View(this.options);
    });

    it('should be able to access instance options', function() {
      expect(this.view.options).to.deep.equal(this.options);
    });
  });

  describe('when destroying a view that is already destroyed', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.removeSpy = this.sinon.spy(this.view, 'remove');
      this.destroyStub = this.sinon.stub();
      this.view.on('destroy', this.destroyStub);

      this.view.destroy();
      this.view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(this.destroyStub).to.have.been.calledOnce;
    });

    it('should not remove the view', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should leave isDestroyed as true', function() {
      expect(this.view).to.be.have.property('isDestroyed', true);
    });
  });

  describe("when serializing a model", function(){
    var modelData = { foo: "bar" };
    var model;
    var view;

    beforeEach(function(){
      model = new Backbone.Model(modelData);
      view = new Marionette.View();
    });

    it("should return all attributes", function(){
      expect(view.serializeModel(model)).to.be.eql(modelData);
    });
  });
});
