describe("helpers", function () {
  'use strict';

  var _sut = Marionette;

  describe("when calling normalizeUIKeys", function () {
    it("given that the ui hash argument is a function, a parsed events hash should be returned", function () {
      var uiHash = function () {return {anyUiElement: ".any-ui-element"};};
      var eventsHash = {"focus @ui.anyUiElement": "onAnyUiElementFocus"};
      var resultEventsHash = _sut.normalizeUIKeys(eventsHash, uiHash);
      expect(resultEventsHash).to.eql({"focus .any-ui-element": "onAnyUiElementFocus"});
    });

    it("given that the events hash argument is a function, a parsed events hash should be returned", function () {
      var uiHash = {anyUiElement: ".any-ui-element"};
      var eventsHash = function () {return {"focus @ui.anyUiElement": "onAnyUiElementFocus"};};
      var resultEventsHash = _sut.normalizeUIKeys(eventsHash, uiHash);
      expect(resultEventsHash).to.eql({"focus .any-ui-element": "onAnyUiElementFocus"});
    });

    it("given that the events hash argument contains '@ui.', a parsed events hash should be returned", function () {
      var uiHash = {anyUiElement: ".any-ui-element"};
      var eventsHash = {"focus @ui.anyUiElement": "onAnyUiElementFocus"};
      var resultEventsHash = _sut.normalizeUIKeys(eventsHash, uiHash);
      expect(resultEventsHash).to.eql({"focus .any-ui-element": "onAnyUiElementFocus"});
    });

    it("a new parsed events hash, not a mutated one, should be returned", function () {
      var uiHash = {anyUiElement: ".any-ui-element"};
      var eventsHash = {"focus @ui.anyUiElement": "onAnyUiElementFocus"};
      var resultEventsHash = _sut.normalizeUIKeys(eventsHash, uiHash);
      expect(resultEventsHash).not.to.equal(eventsHash);
    });
  });
});