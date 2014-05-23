describe('base view', function() {
  'use strict';
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('when initializing a view', function() {
    beforeEach(function() {
      var suite = this;

      this.fooHandler = this.sinon.stub();

      this.View = Backbone.Marionette.View.extend({
        initialize: function() {
          this.listenTo(this.model, 'foo', suite.fooHandler);
        }
      });

      this.model = new Backbone.Model();
      this.view = new this.View({
        model: this.model
      });

      this.model.trigger('foo');
    });

    it('should allow event to be bound via event binder', function() {
      expect(this.fooHandler).to.have.been.called;
    });
  });

  describe('when using listenTo for the "destroy" event on itself, and destroying the view', function() {
    beforeEach(function() {
      this.destroy = this.sinon.stub();
      this.view = new Marionette.View();
      this.view.listenTo(this.view, 'destroy', this.destroy);
      this.view.destroy();
    });

    it('should trigger the "destroy" event', function() {
      expect(this.destroy).to.have.been.called;
    });
  });

  describe('when destroying a view', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        onDestroy: this.sinon.stub()
      });

      this.view = new this.View();

      this.sinon.spy(this.view, 'remove');
      this.destroy = this.sinon.stub();
      this.view.on('destroy', this.destroy);

      this.view.destroy(123, 'second param');
    });

    it('should trigger the destroy event', function() {
      expect(this.destroy).to.have.been.called;
    });

    it('should call an onDestroy method with any arguments passed to destroy', function() {
      expect(this.view.onDestroy).to.have.been.calledWith(123, 'second param');
    });

    it('should remove the view', function() {
      expect(this.view.remove).to.have.been.called;
    });

    it('should set the view isDestroyed to true', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('when destroying a view and returning false from the onBeforeDestroy method', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.sinon.spy(this.view, 'remove');
      this.destroy = this.sinon.stub();
      this.view.on('destroy', this.destroy);

      this.view.onBeforeDestroy = function() {
        return false;
      };

      this.view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(this.destroy).to.have.been.called;
    });

    it('should not remove the view', function() {
      expect(this.view.remove).to.have.been.called;
    });

    it('should not set the view isDestroyed to true', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('when destroying a view and returning undefined from the onBeforeDestroy method', function() {
    beforeEach(function() {
      this.view = new Marionette.View();

      this.sinon.spy(this.view, 'remove');
      this.destroy = this.sinon.stub();
      this.view.on('destroy', this.destroy);

      this.view.onBeforeDestroy = function() {
        return undefined;
      };

      this.view.destroy(123, 'second param');
    });

    it('should trigger the destroy event', function() {
      expect(this.destroy).to.have.been.calledWith(123, 'second param');
    });

    it('should remove the view', function() {
      expect(this.view.remove).to.have.been.called;
    });

    it('should set the view isDestroyed to true', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });

  describe('constructing a view with default options', function() {
    beforeEach(function() {
      this.View = Marionette.ItemView.extend();
      this.PresetOptions = Marionette.View.extend({
        options: {
          'lila': 'zoidberg'
        }
      });
      this.PresetOptionsFn = Marionette.View.extend({
        options: function() {
          return {fry: 'bender'};
        }
      });
    });

    it('should take and store view options', function() {
      var viewInstance = new this.View({'Guybrush': 'Island'});
      expect(viewInstance.options.Guybrush).to.equal('Island');
    });

    it('should take and store view options as a function', function() {
      var viewInstance = new this.View(function() {
        return {Guybrush: 'Island'};
      });
      expect(viewInstance.options.Guybrush).to.equal('Island');
    });

    it('should have an empty hash of options by default', function() {
      var viewInstance = new this.View();
      expect(typeof(viewInstance.options.Guybrush)).to.equal('undefined');
    });

    it('should retain options set on view class', function() {
      var viewInstance = new this.PresetOptions();
      expect(viewInstance.options.lila).to.equal('zoidberg');
    });

    it('should retain options set on view class as a function', function() {
      var viewInstance = new this.PresetOptionsFn();
      expect(viewInstance.options.fry).to.equal('bender');
    });
  });

  describe('should expose its options in the constructor', function() {
    beforeEach(function() {
      this.View = Marionette.View.extend({
        initialize: function() {
          this.info = this.options;
        }
      });
    });

    it('should be able to access instance options', function() {
      var myView = new this.View({name: 'LeChuck'});
      expect(myView.info.name).to.equal('LeChuck');
    });
  });

  describe('when destroying a view that is already destroyed', function() {
    beforeEach(function() {
      this.view = new Marionette.View();
      this.view.destroy();

      this.sinon.spy(this.view, 'remove');
      this.destroy = this.sinon.stub();
      this.view.on('destroy', this.destroy);

      this.view.destroy();
    });

    it('should not trigger the destroy event', function() {
      expect(this.destroy).not.to.have.been.called;
    });

    it('should not remove the view', function() {
      expect(this.view.remove).not.to.have.been.called;
    });

    it('should leave isDestroyed as true', function() {
      expect(this.view.isDestroyed).to.be.true;
    });
  });
});
