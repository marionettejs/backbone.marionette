describe('view ui event trigger configuration', function() {
  'use strict';

  describe('@ui syntax within events and triggers', function() {
    var view, view2, view3, fooHandler, attackHandler, tapHandler, defendHandler;

    var View = Backbone.Marionette.ItemView.extend({
      ui: {
        foo: '.foo',
        bar: '#tap',
        bat: '.bat'
      },

      triggers: {
        'click @ui.foo': 'do:foo'
      },

      events: {
        'click @ui.bar': 'attack',
        'click div:not(@ui.bar)': 'tapper',
        'click @ui.bar, @ui.foo, @ui.bat': 'defend'
      },

      tapper: function() {
        tapHandler();
      },

      attack: function() {
        attackHandler();
      },

      defend: function() {
        defendHandler();
      },

      render: function() {
        this.$el.html('<button class="foo"></button><div id="tap"></div><div class="lap"></div><div class="bat"></div>');
      }
    });

    var View2 = View.extend({
      triggers: function() {
        return {
          'click @ui.foo': {
            event: 'do:foo',
            preventDefault: true,
            stopPropagation: false
          }
        };
      },

      events: function() {
        return {
          'click @ui.bar': function() {
            this.attack();
          }
        };
      }
    });

    var View3 = View2.extend({
      ui: function() {
        return {
          bar: '#tap'
        };
      }
    });

    beforeEach(function() {
      view = new View({
        model: new Backbone.Model()
      });

      view2 = new View2({
        model: new Backbone.Model()
      });

      view3 = new View3({
        model: new Backbone.Model()
      });

      view.render();
      view2.render();
      view3.render();

      fooHandler = jasmine.createSpy('do:foo event handler');
      attackHandler = jasmine.createSpy('attack handler');
      defendHandler = jasmine.createSpy('defend handler');
      tapHandler = jasmine.createSpy('tap handler');
      spyOn(view, 'attack').andCallThrough();
      view.on('do:foo', fooHandler);
      view2.on('do:foo', fooHandler);
    });

    it('should correctly trigger an event', function() {
      view.$('.foo').trigger('click');
      expect(fooHandler).toHaveBeenCalled();
    });

    it('should correctly trigger a complex event', function() {
      view.$('.lap').trigger('click');
      expect(tapHandler).toHaveBeenCalled();
    });

    it('should correctly call an event', function() {
      view.$('#tap').trigger('click');
      expect(attackHandler).toHaveBeenCalled();
    });

    it('should correctly call an event with a functional events hash', function() {
      view2.$('#tap').trigger('click');
      expect(attackHandler).toHaveBeenCalled();
    });

    it('should correctly call an event with a functional triggers hash', function() {
      view2.$('.foo').trigger('click');
      expect(fooHandler).toHaveBeenCalled();
    });

    it('should correctly call an event with a functional events hash and functional ui hash', function() {
      view3.$('#tap').trigger('click');
      expect(attackHandler).toHaveBeenCalled();
    });

    describe('when multiple hashes are specified', function() {
      it('should correctly call an event when when the first hash is triggered', function() {
        view.$('#tap').trigger('click');
        expect(defendHandler).toHaveBeenCalled();
      });

      it('should correctly call an event when when the second hash is triggered', function() {
        view.$('.foo').trigger('click');
        expect(defendHandler).toHaveBeenCalled();
      });

      it('should correctly call an event when when the third hash is triggered', function() {
        view.$('.bat').trigger('click');
        expect(defendHandler).toHaveBeenCalled();
      });
    });
  });
});
