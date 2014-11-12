describe("isNodeAttached", function() {
  'use strict';

  describe("document.documentElement", function() {
    it("should exist", function() {
      expect(document.documentElement).to.not.be.undefined;
    });
  });
});

describe("normalizeUIKeys", function () {
  'use strict';

  describe("When creating a generic ItemView class without a ui hash, and creating two generic view sublcasses with a ui hash", function () {
    beforeEach(function () {
      this.GenericItemView = Marionette.ItemView.extend({
        events: {"change @ui.someUi" : "onSomeUiChange"},
        onSomeUiChange: sinon.stub()
      });
      this.GenericItemViewSubclass1 = this.GenericItemView.extend({
        template: _.template("<div class='subclass-1-el'><div class='subclass-1-ui'></div></div>"),
        ui: {someUi: ".subclass-1-ui"}
      });
      this.GenericItemViewSubclass2 = this.GenericItemView.extend({
        template: _.template("<div class='subclass-2-el'><div class='subclass-2-ui'></div></div>"),
        ui: {someUi: ".subclass-2-ui"}
      });
      this.genericItemViewSubclass1Instance = new this.GenericItemViewSubclass1();
      this.genericItemViewSubclass2Instance = new this.GenericItemViewSubclass2();
      this.genericItemViewSubclass1Instance.render();
      this.genericItemViewSubclass2Instance.render();
    });

    describe("the 1st generic view subclass instance", function () {
      it("should have its events hash parsed correctly", function () {
        expect(this.genericItemViewSubclass1Instance.events).to.eql({"change .subclass-1-ui" : "onSomeUiChange"});
      });

      it("should have its registered event handler called when the ui DOM event is triggered", function () {
        this.genericItemViewSubclass1Instance.ui.someUi.trigger("change");
        expect(this.genericItemViewSubclass1Instance.onSomeUiChange).to.be.calledOnce;
      });
    });

    describe("the 2nd generic view subclass instance", function () {
      it("should have its events hash parsed correctly", function () {
        expect(this.genericItemViewSubclass2Instance.events).to.eql({"change .subclass-2-ui" : "onSomeUiChange"});
      });

      it("should have its registered event handler called when the ui DOM event is triggered", function () {
        this.genericItemViewSubclass2Instance.ui.someUi.trigger("change");
        expect(this.genericItemViewSubclass2Instance.onSomeUiChange).to.be.calledOnce;
      });
    });

    it("the generic item view class should have its prototype events hash untouched and in its original form", function () {
      expect(this.GenericItemView.prototype.events).to.eql({"change @ui.someUi" : "onSomeUiChange"});
    });
  });
});

describe('Marionette.deprecate', function() {
  beforeEach(function() {
    this.sinon.stub(Marionette.deprecate, '_warn');
    Marionette.deprecate._cache = {};
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
