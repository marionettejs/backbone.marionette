describe("property view", function(){

    var PropertyView = Backbone.Marionette.PropertyView;

    var Model = new Backbone.Model({
        foo: "bar"
    });

    describe("when rendering", function(){
        var view = PropertyView.extend({
            property: "foo",
            model: Model
        });

        it("should output the configured property", function(){
            expect(new view().generateHtml()).toContain("bar");
        });
    });
});