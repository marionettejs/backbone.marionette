describe('isNodeAttached', function() {
  'use strict';

  describe('document.documentElement', function() {
    it('should exist', function() {
      expect(document.documentElement).to.not.be.undefined;
    });
  });
});

describe('normalizeUIKeys', function() {
  'use strict';

  describe('When creating a generic View class without a ui hash, and creating two generic view sublcasses with a ui hash', function() {
    beforeEach(function() {
      this.GenericView = Marionette.View.extend({
        events: {'change @ui.someUi' : 'onSomeUiChange'},
        onSomeUiChange: sinon.stub()
      });
      this.GenericViewSubclass1 = this.GenericView.extend({
        template: _.template('<div class="subclass-1-el"><div class="subclass-1-ui"></div></div>'),
        ui: {someUi: '.subclass-1-ui'}
      });
      this.GenericViewSubclass2 = this.GenericView.extend({
        template: _.template('<div class="subclass-2-el"><div class="subclass-2-ui"></div></div>'),
        ui: {someUi: '.subclass-2-ui'}
      });
      this.genericViewSubclass1Instance = new this.GenericViewSubclass1();
      this.genericViewSubclass2Instance = new this.GenericViewSubclass2();
      this.genericViewSubclass1Instance.render();
      this.genericViewSubclass2Instance.render();
    });

    describe('the 1st generic view subclass instance', function() {
      it('should have its events hash parsed correctly', function() {
        expect(this.genericViewSubclass1Instance.events).to.eql({'change .subclass-1-ui' : 'onSomeUiChange'});
      });

      it('should have its registered event handler called when the ui DOM event is triggered', function() {
        this.genericViewSubclass1Instance.ui.someUi.trigger('change');
        expect(this.genericViewSubclass1Instance.onSomeUiChange).to.be.calledOnce;
      });
    });

    describe('the 2nd generic view subclass instance', function() {
      it('should have its events hash parsed correctly', function() {
        expect(this.genericViewSubclass2Instance.events).to.eql({'change .subclass-2-ui' : 'onSomeUiChange'});
      });

      it('should have its registered event handler called when the ui DOM event is triggered', function() {
        this.genericViewSubclass2Instance.ui.someUi.trigger('change');
        expect(this.genericViewSubclass2Instance.onSomeUiChange).to.be.calledOnce;
      });
    });

    it('the generic view class should have its prototype events hash untouched and in its original form', function() {
      expect(this.GenericView.prototype.events).to.eql({'change @ui.someUi' : 'onSomeUiChange'});
    });
  });
});

describe('Marionette.deprecate', function() {
  beforeEach(function() {
    this.sinon.spy(Marionette.deprecate, '_warn');
    this.sinon.stub(Marionette.deprecate, '_console', {
      warn: this.sinon.stub()
    });
    Marionette.deprecate._cache = {};
  });

  describe('Marionette.deprecate._warn', function() {
    beforeEach(function() {
      Marionette.deprecate._warn('foo');
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._console.warn)
        .to.have.been.calledOnce
        .and.calledOn(Marionette.deprecate._console)
        .and.calledWith('foo');
    });
  });

  describe('when calling with a message', function() {
    beforeEach(function() {
      Marionette.deprecate('foo');
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: foo');
    });
  });

  describe('when calling with an object', function() {
    beforeEach(function() {
      Marionette.deprecate({
        prev: 'foo',
        next: 'bar'
      });
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: foo is going to be removed in the future. Please use bar instead.');
    });
  });

  describe('when calling with an object with a url', function() {
    beforeEach(function() {
      Marionette.deprecate({
        prev: 'foo',
        next: 'bar',
        url: 'baz'
      });
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: foo is going to be removed in the future. Please use bar instead. See: baz');
    });
  });

  describe('when calling with a message and a falsy test', function() {
    beforeEach(function() {
      Marionette.deprecate('bar', false);
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: bar');
    });
  });

  describe('when calling with a message and a truthy test', function() {
    beforeEach(function() {
      Marionette.deprecate('Foo', true);
    });

    it('should not `console.warn` the message', function() {
      expect(Marionette.deprecate._warn).not.to.have.been.called;
    });
  });

  describe('when calling with the same message twice', function() {
    beforeEach(function() {
      Marionette.deprecate('baz');
      Marionette.deprecate('baz');
    });

    it('should `console.warn` the message', function() {
      expect(Marionette.deprecate._warn)
        .to.have.been.calledOnce
        .and.calledWith('Deprecation warning: baz');
    });
  });
});
