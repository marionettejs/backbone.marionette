describe("normalizeUIKeys", function () {
  'use strict';

  beforeEach(function () {
    this.uiHash = {anyUiElement: ".any-ui-element"};
    this.eventsHash = {"focus @ui.anyUiElement": "onAnyUiElementFocus"};
  });

  it("given that the events hash argument contains '@ui.', a parsed events hash should be returned", function () {
    expect(Marionette.normalizeUIKeys(this.eventsHash, this.uiHash)).to.eql({"focus .any-ui-element": "onAnyUiElementFocus"});
  });

  it("a new parsed events hash, not a mutated one, should be returned", function () {
    expect(Marionette.normalizeUIKeys(this.eventsHash, this.uiHash)).not.to.equal(this.eventsHash);
  });

  describe("When creating a generic ItemView class without a ui hash, and creating two generic view sublcasses with a ui hash", function () {
    beforeEach(function () {
      this.GenerItemView = Marionette.ItemView.extend({
        events: {"change @ui.someEl" : "onSomeElChange"}
      });
      this.GenerItemViewSubclass1 = this.GenerItemView.extend({template: false, ui: {someEl: ".subclass-1-el"}});
      this.GenerItemViewSubclass2 = this.GenerItemView.extend({template: false, ui: {someEl: ".subclass-2-el"}});
      this.generItemViewSubclass1Instance = new this.GenerItemViewSubclass1();
      this.generItemViewSubclass2Instance = new this.GenerItemViewSubclass2();
      this.generItemViewSubclass1Instance.render();
      this.generItemViewSubclass2Instance.render();
    });

    it("the 1st generic view subclass instance should have its events hash parsed correctly", function () {
      expect(this.generItemViewSubclass1Instance.events).to.eql({"change .subclass-1-el" : "onSomeElChange"});
    });

    it("the 2nd generic view subclass instance should have its events hash parsed correctly", function () {
      expect(this.generItemViewSubclass2Instance.events).to.eql({"change .subclass-2-el" : "onSomeElChange"});
    });

    it("the generic item view class should have its prototype events hash untouched and in its orignal form", function () {
      expect(this.GenerItemViewSubclass1.prototype.events).to.eql({"change @ui.someEl" : "onSomeElChange"});
    });
  });
});