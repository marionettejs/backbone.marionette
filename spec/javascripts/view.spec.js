describe("base view", function(){
  "use strict";

  describe("when initializing a view", function(){
    var fooHandler;

    beforeEach(function(){
      fooHandler = jasmine.createSpy();

      var view = Backbone.Marionette.View.extend({
        initialize: function(){
          this.listenTo(this.model, "foo", fooHandler);
        }
      });

      var model = new Backbone.Model();

      new view({
        model: model
      });

      model.trigger("foo");
    });

    it("should allow event to be bound via event binder", function(){
      expect(fooHandler).toHaveBeenCalled();
    });
  });

  describe("when using listenTo for the 'close' event on itself, and closing the view", function(){
    var close;

    beforeEach(function(){
      close = jasmine.createSpy("close");

      var view = new Marionette.View();
      view.listenTo(view, "close", close);

      view.close();
    });

    it("should trigger the 'close' event", function(){
      expect(close).toHaveBeenCalled();
    });
  });

  describe("when closing a view", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.close();
    });

    it("should trigger the close event", function(){
      expect(close).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isClosed to true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when closing a view and returning false from the onBeforeClose method", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.onBeforeClose = function(){
        return false;
      };

      view.close();
    });

    it("should not trigger the close event", function(){
      expect(close).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should not set the view isClosed to true", function(){
      expect(view.isClosed).not.toBe(true);
    });
  });

  describe("when closing a view and returning undefined from the onBeforeClose method", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.onBeforeClose = function(){
        return undefined;
      };

      view.close();
    });

    it("should trigger the close event", function(){
      expect(close).toHaveBeenCalled();
    });

    it("should remove the view", function(){
      expect(view.remove).toHaveBeenCalled();
    });

    it("should set the view isClosed to true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when closing a view that is already closed", function(){
    var close, view;

    beforeEach(function(){
      view = new Marionette.View();
      view.close();

      spyOn(view, "remove").andCallThrough();
      close = jasmine.createSpy("close");
      view.on("close", close);

      view.close();
    });

    it("should not trigger the close event", function(){
      expect(close).not.toHaveBeenCalled();
    });

    it("should not remove the view", function(){
      expect(view.remove).not.toHaveBeenCalled();
    });

    it("should leave isClosed as true", function(){
      expect(view.isClosed).toBe(true);
    });
  });

  describe("when serializing a model", function(){
    var modelData = { foo: "bar" };
    var model;
    var view;

    beforeEach(function(){
      model = new Backbone.Model(modelData);
      view = new Marionette.View();
    });

    it("should return all attributes", function(){
      expect(view.serializeModel(model)).toEqual(modelData);
    });
  });


	describe("when retrieving view metadata", function(){
   var view1, view2;

   beforeEach(function(){
     view1 = new Marionette.View();
     view2 = new Marionette.View();
   });

   it("should initialize the data hash", function(){
     var data = view1.viewData('foo');
     expect(!!data).toBe(true);
   });

   it("should only create instance-scoped data", function(){
     var data1 = view1.viewData('foo');
     data1['test1'] = '1';
     var data2 = view2.viewData('foo');
     data2['test2'] = '2';
     expect(data1.test2).toBe(undefined);
     expect(data2.test1).toBe(undefined);
   });

   it("should return the same hash with multiple requests", function(){
     var data1 = view1.viewData('foo');
     data1['test1'] = '1';
     data1 = view1.viewData('foo');
     expect(data1.test1).toBe('1');
   });
 });

	describe("when using mixins", function() {
		var parent,
				Parent = Marionette.View.extend({
					events: {
						'change .parent': 'changeParent'
					},
					changeParent: function() {
						changeParentCount++;
					}
				}),
				MixinAsView = Marionette.View.extend({
					initialize: function() { mixinAsViewContext = this; mixinAsViewInitCount++; },
					events: {
						'change .foo': 'changeFoo'
					},
					changeFoo: function() {
						changeFooCount++;
					}
				}),
				MixinAsHash = {
					initialize: function() { mixinAsHashContext = this; mixinAsHashInitCount++; },
					events: {
						'change .bar': 'changeBar'
					},
					changeBar: function() {
						changeBarCount++;
					}
				},
				mixinAsViewContext,
				mixinAsHashContext,
				mixinAsViewInitCount,
				mixinAsHashInitCount,
				changeParentCount,
				changeFooCount,
				changeBarCount;

	  beforeEach(function(){
	    mixinAsViewContext = undefined;
	    mixinAsHashContext = undefined;
		  mixinAsViewInitCount = 0;
			mixinAsHashInitCount = 0;
      changeFooCount = 0;
      changeBarCount = 0;
      changeParentCount = 0;
	  	parent = new Parent();
	    parent.mixin(MixinAsView, MixinAsHash);
	  });
	
		it('should proxy mixin attributes to parent', function(){
			expect(!!parent.changeFoo).toBe(true);
			expect(!!parent.changeBar).toBe(true);
		});

		it('should initialize mixins with parent as "this"', function(){
			expect(mixinAsViewContext).toBe(parent);
			expect(mixinAsHashContext).toBe(parent);
		});

		it('should allow mixins to be registered multiple times', function(){
			var changeBazCount = 0,
					Mixin3 = {
						events: {
							'change .baz': 'changeBaz'
						},
						changeBaz: function() {
							changeBazCount++;
						},
						foo: 'bar'
					};
			parent.mixin(Mixin3);
			expect(mixinAsViewInitCount).toBe(1);
			expect(mixinAsHashInitCount).toBe(1);
			expect(parent.foo).toBe('bar');

			// ensure event bindings don't get duplicated
			var html = '<div>';
			_.each(['foo', 'bar', 'baz', 'parent'], function(clazz) {
				html += '<input type="text" class="' + clazz + '">';
			});
			html += '</div>';
			parent.$el.html(html);

			parent.$('.parent').trigger('change');
			parent.$('.foo').trigger('change');
			parent.$('.bar').trigger('change');
			parent.$('.baz').trigger('change');

			expect(changeFooCount).toBe(1);
			expect(changeBarCount).toBe(1);
			expect(changeParentCount).toBe(1);
			expect(changeBazCount).toBe(1);
		});
	});
});
