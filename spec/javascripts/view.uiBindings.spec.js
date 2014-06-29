describe('view ui elements', function() {
  'use strict';

  beforeEach(function() {
    this.templateFn = _.template('<div id="<%= name %>"></div>');
    this.uiHash = {foo: '#foo', bar: '#bar'};
    this.model = this.model = new Backbone.Model({name: 'foo'});
  });

  describe('when accessing a ui element from the hash', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: _.template('<div id="foo"></div>'),
        ui: this.uiHash
      });

      this.view = new this.View();
      this.view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery);
      expect(this.view.ui.foo).to.have.lengthOf(1);
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(this.view.ui.bar).to.be.instanceOf(jQuery);
      expect(this.view.ui.bar).to.have.lengthOf(0);
    });
  });

  describe('when re-rendering a view with a UI element configuration', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: _.template('<div id="<%= name %>"></div>'),
        ui: this.uiHash
      });

      this.view = new this.View({model: this.model});

      this.view.render();
      this.view.model.set('name', 'bar');
      this.view.render();
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery);
      expect(this.view.ui.bar).to.be.instanceOf(jQuery);
      expect(this.view.ui.foo).to.have.lengthOf(0);
      expect(this.view.ui.bar).to.have.lengthOf(1);
    });
  });

  describe('when the ui element is a function that returns a hash', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: this.templateFn,
        ui: this.sinon.stub().returns(this.uiHash)
      });

      this.view = new this.View({model: this.model});
      this.view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery);
      expect(this.view.ui.foo).to.have.lengthOf(1);
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(this.view.ui.bar).to.be.instanceOf(jQuery);
      expect(this.view.ui.bar).to.have.lengthOf(0);
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(this.view.ui.foo).to.be.instanceOf(jQuery);
      expect(this.view.ui.bar).to.be.instanceOf(jQuery);
      expect(this.view.ui.foo).to.have.lengthOf(1);
      expect(this.view.ui.bar).to.have.lengthOf(0);

      this.view.model.set('name', 'bar');
      this.view.render();

      expect(this.view.ui.foo).to.have.lengthOf(0);
      expect(this.view.ui.bar).to.have.lengthOf(1);
    });

  });

  describe('when destroying a view that has not been rendered', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: this.templateFn,
        ui: this.uiHash
      });
      this.viewOne = new this.View({model: this.model});
      this.viewTwo = new this.View({model: this.model});
    });

    it('should not affect future ui bindings', function() {
      expect(this.viewTwo.ui).to.deep.equal(this.uiHash);
    });
  });

  describe('when destroying a view', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend({
        template: this.templateFn,
        ui: this.uiHash
      });
      this.view = new this.View({model: this.model});
      this.view.render();
      this.view.destroy();
    });

    it('should unbind UI elements and reset them to the selector', function() {
      expect(this.view.ui).to.deep.equal(this.uiHash);
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
