describe("view ui elements", function() {

  describe("when accessing a ui element from the hash", function() {

    var View = Backbone.Marionette.ItemView.extend({
      template: "#item-with-checkbox",

      ui: {
        checkbox: "#chk",
        unfoundElement: "#not_found"
      }
    });

    var view, chk, model;

    beforeEach(function() {
      loadFixtures("itemWithCheckbox.html");

      model = new Backbone.Model({
        done: false
      });

      view = new View({
        model: model
      });

      view.render();
    });


    it("should return its jQuery selector if it can be found", function(){
      expect(view.ui.checkbox.attr("type")).toEqual("checkbox");
    });

    it("should return an empty jQuery object if it cannot be found", function() {
      expect(view.ui.unfoundElement.length).toEqual(0);
    });

    it("should return an up-to-date selector on subsequent renders", function() {
      // asserting state before subsequent render
      expect(view.ui.checkbox.attr("checked")).toBeUndefined();

      // setting the model "done" attribute to true will cause the "checked" attribute
      // to be added to the checkbox element in the subsequent render.
      view.model.set('done', true);
      view.render();

      // since the ui elements selectors are refreshed after each render then the associated selector
      // should point to the newly rendered checkbox element that has the "checked" attribute.
      expect(view.ui.checkbox.attr("checked")).toBeDefined();
    });

  });

  describe("when the ui element is a function that returns a hash", function() {

    var View = Backbone.Marionette.ItemView.extend({
      template: "#item-with-checkbox",

      ui: function() {
        return {
          checkbox: "#chk",
          unfoundElement: "#not_found"
        };
      }
    });

    var view, chk, model;

    beforeEach(function() {
      loadFixtures("itemWithCheckbox.html");

      model = new Backbone.Model({
        done: false
      });

      view = new View({
        model: model
      });

      view.render();
    });


    it("should return its jQuery selector if it can be found", function(){
      expect(view.ui.checkbox.attr("type")).toEqual("checkbox");
    });

    it("should return an empty jQuery object if it cannot be found", function() {
      expect(view.ui.unfoundElement.length).toEqual(0);
    });

    it("should return an up-to-date selector on subsequent renders", function() {
      // asserting state before subsequent render
      expect(view.ui.checkbox.attr("checked")).toBeUndefined();

      // setting the model "done" attribute to true will cause the "checked" attribute
      // to be added to the checkbox element in the subsequent render.
      view.model.set('done', true);
      view.render();

      // since the ui elements selectors are refreshed after each render then the associated selector
      // should point to the newly rendered checkbox element that has the "checked" attribute.
      expect(view.ui.checkbox.attr("checked")).toBeDefined();
    });

  });

});


