describe('view ui elements', function() {
  'use strict';

  beforeEach(function() {
    this.templateFn = _.template('<div id="<%= name %>"></div>');
    this.uiHash = {foo: '#foo', bar: '#bar'};
    this.model = this.model = new Backbone.Model({name: 'foo'});
    this.View = Marionette.ItemView.extend({
      template: this.templateFn,
      ui: this.uiHash
    });
  });

  describe('when accessing a ui element from the hash', function() {
    beforeEach(function() {
      this.view = new this.View({model: this.model});
      this.view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(this.view.ui.bar).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
    });

    it('should return its jQuery selector through getUI', function() {
      expect(this.view.getUI('foo')).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
      expect(this.view.getUI('bar')).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
    });
  });

  describe('when re-rendering a view with a UI element configuration', function() {
    beforeEach(function() {
      this.view = new this.View({model: this.model});
      this.view.render();
      this.view.model.set('name', 'bar');
      this.view.render();
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
      expect(this.view.ui.bar).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });

    it('should return an up-to-date selector through getUI', function() {
      expect(this.view.getUI('foo')).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
      expect(this.view.getUI('bar')).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });
  });

  describe('when the ui element is a function that returns a hash', function() {
    beforeEach(function() {
      this.View = this.View.extend({
        ui: this.sinon.stub().returns(this.uiHash)
      });

      this.view = new this.View({model: this.model});
      this.view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(this.view.ui.bar).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
      expect(this.view.ui.bar).to.be.instanceOf(jQuery).to.have.lengthOf(0);

      this.view.model.set('name', 'bar');
      this.view.render();

      expect(this.view.ui.foo).to.have.lengthOf(0);
      expect(this.view.ui.bar).to.have.lengthOf(1);
    });

    it('should return its jQuery selector through getUI', function() {
      expect(this.view.getUI('foo')).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });
  });

  describe('when destroying a view that has not been rendered', function() {
    beforeEach(function() {
      this.viewOne = new this.View({model: this.model});
      this.viewTwo = new this.View({model: this.model});
    });

    it('should not affect future ui bindings', function() {
      expect(this.viewTwo.ui).to.deep.equal(this.uiHash);
    });
  });

  describe('when destroying a view', function() {
    beforeEach(function() {
      this.view = new this.View({model: this.model});
      this.view.render();
      this.view.destroy();
    });

    it('should unbind UI elements and reset them to the selector', function() {
      expect(this.view.ui).to.deep.equal(this.uiHash);
    });

    it('should throw ViewDestroyedError when accessing ui bindings through getUI', function() {
      expect(_.bind(function() {
        return this.view.getUI('foo');
      }, this)).to.throw(Marionette.Error, new Marionette.Error({
        name: 'ViewDestroyedError',
        message: 'View (cid: "' + this.view.id + '") has already been destroyed and cannot be used.'
      }));
    });
  });

  describe('when calling delegateEvents', function() {
    beforeEach(function() {
      this.uiHash = {'foo': '#foo'};
      this.eventsHash = {
        'click @ui.foo': 'bar',
        'mouseout @ui#foo': 'baz'
      };

      this.View = Marionette.ItemView.extend({
        ui     : this.uiHash,
        events : {}
      });

      this.view = new this.View();
      this.view.delegateEvents();

      _.extend(this.view.events, this.eventsHash);
      this.view.delegateEvents();
    });

    it('the events should be re-normalised valid ui references', function() {
      expect(this.view.events).to.deep.equal({
        'click #foo': 'bar',
        'mouseout @ui#foo': 'baz'
      });
    });
  });
});
