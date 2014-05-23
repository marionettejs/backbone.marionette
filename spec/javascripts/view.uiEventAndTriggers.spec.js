describe('view ui event trigger configuration', function() {
  beforeEach(global.setup);
  afterEach(global.teardown);

  describe('@ui syntax within events and triggers', function() {
    var View, View2, View3, view, view2, view3, fooHandler, attackHandler, tapHandler, defendHandler;

    beforeEach(function() {
      View = Backbone.Marionette.ItemView.extend({
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

      View2 = View.extend({
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

      View3 = View2.extend({
        ui: function() {
          return {
            bar: '#tap'
          };
        }
      });

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

      fooHandler = this.sinon.stub();
      attackHandler = this.sinon.stub();
      defendHandler = this.sinon.stub();
      tapHandler = this.sinon.stub();
      this.sinon.spy(view, 'attack');
      view.on('do:foo', fooHandler);
      view2.on('do:foo', fooHandler);
    });

    it('should correctly trigger an event', function() {
      view.$('.foo').trigger('click');
      expect(fooHandler).to.have.been.called;
    });

    it('should correctly trigger a complex event', function() {
      view.$('.lap').trigger('click');
      expect(tapHandler).to.have.been.called;
    });

    it('should correctly call an event', function() {
      view.$('#tap').trigger('click');
      expect(attackHandler).to.have.been.called;
    });

    it('should correctly call an event with a functional events hash', function() {
      view2.$('#tap').trigger('click');
      expect(attackHandler).to.have.been.called;
    });

    it('should correctly call an event with a functional triggers hash', function() {
      view2.$('.foo').trigger('click');
      expect(fooHandler).to.have.been.called;
    });

    it('should correctly call an event with a functional events hash and functional ui hash', function() {
      view3.$('#tap').trigger('click');
      expect(attackHandler).to.have.been.called;
    });

    describe('when multiple hashes are specified', function() {
      it('should correctly call an event when when the first hash is triggered', function() {
        view.$('#tap').trigger('click');
        expect(defendHandler).to.have.been.called;
      });

      it('should correctly call an event when when the second hash is triggered', function() {
        view.$('.foo').trigger('click');
        expect(defendHandler).to.have.been.called;
      });

      it('should correctly call an event when when the third hash is triggered', function() {
        view.$('.bat').trigger('click');
        expect(defendHandler).to.have.been.called;
      });
    });
  });
});
