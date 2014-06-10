describe('layoutView - dynamic regions', function() {
  'use strict';

  beforeEach(function() {
    this.template = function() {
      return '<div id="foo"></div><div id="bar"></div>';
    };
  });

  describe('when adding a region to a layoutView, after it has been rendered', function() {
    beforeEach(function() {
      this.MyLayoutView = Marionette.LayoutView.extend({
        onAddRegion: function() {},
        onBeforeAddRegion: function() {}
      });

      this.layoutView = new this.MyLayoutView({
        template: this.template
      });

      this.beforeAddHandler = this.sinon.spy();
      this.addHandler = this.sinon.spy();
      this.onBeforeAddSpy = this.sinon.spy(this.layoutView, 'onBeforeAddRegion');
      this.onAddSpy = this.sinon.spy(this.layoutView, 'onAddRegion');
      this.layoutView.on('before:add:region', this.beforeAddHandler);
      this.layoutView.on('add:region', this.addHandler);

      this.layoutView.render();

      this.region = this.layoutView.addRegion('foo', '#foo');

      this.view = new Backbone.View();
      this.layoutView.foo.show(this.view);
    });

    it('should add the region to the layoutView', function() {
      expect(this.layoutView.foo).to.equal(this.region);
    });

    it('should set the parent of the region to the layoutView', function() {
      expect(this.region.$el.parent()[0]).to.equal(this.layoutView.el);
    });

    it('should be able to show a view in the region', function() {
      expect(this.layoutView.foo.$el.children().length).to.equal(1);
    });

    it('should trigger a before:add:region event', function() {
      expect(this.beforeAddHandler).to.have.been.calledWith('foo');
      expect(this.onBeforeAddSpy).to.have.been.calledWith('foo');
    });

    it('should trigger a add:region event', function() {
      expect(this.addHandler).to.have.been.calledWith('foo', this.region);
      expect(this.onAddSpy).to.have.been.calledWith('foo', this.region);
    });
  });

  describe('when adding a region to a layoutView, before it has been rendered', function() {
    beforeEach(function() {
      this.layoutView = new Marionette.LayoutView({
        template: this.template
      });

      this.region = this.layoutView.addRegion('foo', '#foo');

      this.layoutView.render();

      this.view = new Backbone.View();
      this.layoutView.foo.show(this.view);
    });

    it('should add the region to the layoutView after it is rendered', function() {
      expect(this.layoutView.foo).to.equal(this.region);
    });

    it('should set the parent of the region to the layoutView', function() {
      expect(this.region.$el.parent()[0]).to.equal(this.layoutView.el);
    });

    it('should be able to show a view in the region', function() {
      expect(this.layoutView.foo.$el.children().length).to.equal(1);
    });
  });

  describe('when adding a region to a layoutView that does not have any regions defined, and re-rendering the layoutView', function() {
    beforeEach(function() {
      this.layoutView = new Marionette.LayoutView({
        template: this.template
      });

      this.barRegion = this.layoutView.bar;

      this.region = this.layoutView.addRegion('foo', '#foo');

      this.layoutView.render();
      this.layoutView.render();

      this.view = new Backbone.View();
      this.layoutView.foo.show(this.view);
    });

    it('should keep the original regions', function() {
      expect(this.layoutView.bar).to.equal(this.barRegion);
    });

    it('should re-add the region to the layoutView after it is re-rendered', function() {
      expect(this.layoutView.foo).to.equal(this.region);
    });

    it('should set the parent of the region to the layoutView', function() {
      expect(this.region.$el.parent()[0]).to.equal(this.layoutView.el);
    });

    it('should be able to show a view in the region', function() {
      expect(this.layoutView.foo.$el.children().length).to.equal(1);
    });
  });

  describe('when adding a region to a layoutView that already has regions defined, and re-rendering the layoutView', function() {
    beforeEach(function() {
      this.layoutView = new Marionette.LayoutView({
        regions: {
          bar: '#bar'
        },
        template: this.template
      });

      this.region = this.layoutView.addRegion('foo', '#foo');

      this.layoutView.render();
      this.layoutView.render();

      this.view = new Backbone.View();
      this.layoutView.foo.show(this.view);
    });

    it('should re-add the region to the layoutView after it is re-rendered', function() {
      expect(this.layoutView.foo).to.equal(this.region);
    });

    it('should set the parent of the region to the layoutView', function() {
      this.region.show(new Backbone.View());
      expect(this.region.$el.parent()[0]).to.equal(this.layoutView.el);
    });

    it('should be able to show a view in the region', function() {
      expect(this.layoutView.foo.$el.children().length).to.equal(1);
    });
  });

  describe('when removing a region from a layoutView', function() {
    beforeEach(function() {
      this.LayoutView = Marionette.LayoutView.extend({
        template: this.template,
        regions: {
          foo: '#foo'
        },
        onBeforeRemoveRegion: function() {},
        onRemoveRegion: function() {}
      });

      this.emptyHandler = this.sinon.spy();
      this.beforeRemoveHandler = this.sinon.spy();
      this.removeHandler = this.sinon.spy();

      this.layoutView = new this.LayoutView();

      this.onBeforeRemoveSpy = this.sinon.spy(this.layoutView, 'onBeforeRemoveRegion');
      this.onRemoveSpy = this.sinon.spy(this.layoutView, 'onRemoveRegion');

      this.layoutView.render();
      this.layoutView.foo.show(new Backbone.View());
      this.region = this.layoutView.foo;

      this.region.on('empty', this.emptyHandler);
      this.layoutView.on('before:remove:region', this.beforeRemoveHandler);
      this.layoutView.on('remove:region', this.removeHandler);

      this.layoutView.removeRegion('foo');
    });

    it('should empty the region', function() {
      expect(this.emptyHandler).to.have.been.called;
    });

    it('should trigger a before:remove:region event', function() {
      expect(this.onBeforeRemoveSpy).to.have.been.calledWith('foo');
      expect(this.beforeRemoveHandler).to.have.been.calledWith('foo');
    });

    it('should trigger a remove:region event', function() {
      expect(this.onRemoveSpy).to.have.been.calledWith('foo', this.region);
      expect(this.removeHandler).to.have.been.calledWith('foo', this.region);
    });

    it('should remove the region', function() {
      expect(this.layoutView.foo).to.be.undefined;
      expect(this.layoutView.regions.foo).to.be.undefined;
      expect(this.layoutView.regionManager.get('foo')).to.be.undefined;
    });
  });

  describe('when removing a region and then re-rendering the layoutView', function() {
    beforeEach(function() {
      this.LayoutView = Marionette.LayoutView.extend({
        template: this.template,
        regions: {
          foo: '#foo'
        }
      });

      this.layoutView = new this.LayoutView();

      this.layoutView.render();
      this.layoutView.foo.show(new Backbone.View());

      this.layoutView.removeRegion('foo');
      this.layoutView.render();

      this.region = this.layoutView.foo;
    });

    it('should not re-attach the region to the layoutView', function() {
      expect(this.region).to.be.undefined;
      expect(this.layoutView.regionManager.get('foo')).to.be.undefined;
    });
  });

  describe('when adding a region to a layoutView then destroying the layoutView', function() {
    beforeEach(function() {
      this.emptyHandler = this.sinon.stub();
      this.layoutView = new Marionette.LayoutView({
        template: this.template
      });

      this.layoutView.render();

      this.region = this.layoutView.addRegion('foo', '#foo');
      this.region.on('empty', this.emptyHandler);

      this.view = new Backbone.View();
      this.layoutView.foo.show(this.view);

      this.layoutView.destroy();
    });

    it('should empty the region', function() {
      expect(this.emptyHandler).to.have.been.called;
    });
  });
});
