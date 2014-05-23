describe('composite view', function() {
  'use strict';

  beforeEach(global.setup);
  afterEach(global.teardown);

  // Models

  var Model = Backbone.Model.extend();

  var User = Backbone.Model.extend();

  var Node = Backbone.Model.extend({
    initialize: function() {
      var nodes = this.get('nodes');
      if (nodes) {
        this.nodes = new NodeCollection(nodes);
        this.unset('nodes');
      }
    }
  });

  // Collections

  var Collection = Backbone.Collection.extend({
    model: Model
  });

  var UserCollection = Backbone.Collection.extend({
    model: User
  });

  var NodeCollection = Backbone.Collection.extend({
    model: Node
  });

  // Views

  var TreeView = Backbone.Marionette.CompositeView.extend({
    tagName: 'ul',
    template: '#recursive-composite-template',

    initialize: function() {
      this.collection = this.model.nodes;
    }
  });

  describe('when a composite view has a template without a model', function() {
    var compositeView;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeViewNoModel = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template-no-model'
    });

    beforeEach(function() {
      this.loadFixtures('compositeTemplate-noModel.html');

      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});
      var collection = new Collection([m1, m2]);

      compositeView = new CompositeViewNoModel({
        collection: collection
      });

      compositeView.render();
    });

    it('should render the template', function() {
      expect(compositeView.$el).to.contain.$text('composite');
    });

    it('should render the collections items', function() {
      expect(compositeView.$el).to.contain.$text('bar');
      expect(compositeView.$el).to.contain.$text('baz');
    });
  });

  describe('when a composite view has a model and a template', function() {
    var compositeView;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template',

      onRender: function() {}
    });

    beforeEach(function() {
      this.loadFixtures('compositeTemplate.html');

      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});
      var collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.render();
    });

    it('should render the template with the model', function() {
      expect(compositeView.$el).to.contain.$text('composite bar');
    });

    it('should render the collections items', function() {
      expect(compositeView.$el).to.contain.$text('baz');
    });
  });

  describe('when a composite view triggers render in initialize', function() {
    var compositeView;

    var onShow;

    var EmptyView = Backbone.Marionette.ItemView.extend({
      template: '#emptyTemplate',
      tagName: 'hr',
      onShow: function() {
        onShow.push('EMPTY');
      }
    });

    var ChildView = Backbone.Marionette.ItemView.extend({
      template: '#collectionItemTemplate',
      tagName: 'span'
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      emptyView: EmptyView,
      template: '#collection-template',
      initialize: function() {
        this.render();
      },
      onRender: function() {}
    });

    beforeEach(function() {
      this.loadFixtures('collectionTemplate.html', 'collectionItemTemplate.html',
          'emptyTemplate.html');

      var m1 = new Model({foo: 'bar'});

      compositeView = new CompositeView({
        model: m1,
        collection: new Collection()
      });

      onShow = [];

      compositeView.trigger('show');
    });

    it('should call "onShowCallbacks.add"', function() {
      expect(onShow.length === 1).to.be.ok;
    });
  });

  describe('when rendering a composite view without a template', function() {
    var compositeView;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView
    });

    beforeEach(function() {
      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});
      var collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });
    });

    it('should throw an exception because there was no valid template', function() {
      expect(compositeView.render).to.throw('Cannot render the template since its false, null or undefined.');
    });
  });

  describe('when rendering a composite view', function() {
    var compositeView, order;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template',

      onRender: function() {}
    });

    beforeEach(function() {
      order = [];
      this.loadFixtures('compositeTemplate.html');

      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});
      var collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.on('render:template', function() {
        order.push(compositeView.renderedModelView);
      });

      compositeView.on('render:collection', function() {
        order.push(compositeView.collection);
      });

      compositeView.on('render', function() {
        order.push(compositeView);
      });

      this.sinon.spy(compositeView, 'trigger');
      this.sinon.spy(compositeView, 'onRender');

      compositeView.render();
    });

    it('should trigger a render event for the model view', function() {
      expect(compositeView.trigger).to.have.been.calledWith('render:template');
    });

    it('should trigger a before:render event for the collection', function() {
      expect(compositeView.trigger).to.have.been.calledWith('before:render:collection', compositeView);
    });

    it('should trigger a render event for the collection', function() {
      expect(compositeView.trigger).to.have.been.calledWith('render:collection', compositeView);
    });

    it('should trigger a render event for the composite view', function() {
      expect(compositeView.trigger).to.have.been.calledWith('render', compositeView);
    });

    it('should guarantee rendering of the model before rendering the collection', function() {
      expect(order[0]).to.equal(compositeView.renderedModelView);
      expect(order[1]).to.equal(compositeView.collection);
      expect(order[2]).to.equal(compositeView);
    });

    it('should call "onRender"', function() {
      expect(compositeView.onRender).to.have.been.called;
    });

    it('should only call "onRender" once', function() {
      expect(compositeView.onRender.callCount).to.equal(1);
    });
  });

  describe('when rendering a composite view twice', function() {
    var compositeView, compositeRenderSpy;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeModelView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template'
    });

    beforeEach(function() {
      this.loadFixtures('compositeTemplate.html');

      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});
      var collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeModelView({
        model: m1,
        collection: collection
      });

      this.sinon.spy(compositeView, 'render');
      this.sinon.spy(compositeView, 'destroyChildren');
      this.sinon.spy(Backbone.Marionette.Renderer, 'render');
      compositeRenderSpy = compositeView.render;

      compositeView.render();
      compositeView.render();
    });

    it('should re-render the template view', function() {
      expect(Backbone.Marionette.Renderer.render.callCount).to.equal(2);
    });

    it('should destroy all of the child collection child views', function() {
      expect(compositeView.destroyChildren).to.have.been.called;
      expect(compositeView.destroyChildren.callCount).to.equal(2);
    });

    it('should re-render the collections items', function() {
      expect(compositeRenderSpy.callCount).to.equal(2);
    });
  });

  describe('when rendering a composite view with an empty collection and then resetting the collection', function() {
    var compositeView;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template',

      onRender: function() {}
    });

    beforeEach(function() {
      this.loadFixtures('compositeRerender.html');

      var m1 = new Model({foo: 'bar'});
      var collection = new Collection();
      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.render();

      var m2 = new Model({foo: 'baz'});
      collection.reset([m2]);
    });

    it('should render the template with the model', function() {
      expect(compositeView.$el).to.contain.$text('composite bar');
    });

    it('should render the collections items', function() {
      expect(compositeView.$el).to.contain.$text('baz');
    });
  });

  describe('when rendering a composite view without a collection', function() {
    var compositeView;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template',

      onRender: function() {}
    });

    beforeEach(function() {
      this.loadFixtures('compositeRerender.html');

      var m1 = new Model({foo: 'bar'});
      compositeView = new CompositeView({
        model: m1
      });

      compositeView.render();
    });

    it('should render the template with the model', function() {
      expect(compositeView.$el).to.contain.$text('composite bar');
    });

    it('should not render the collections items', function() {
      expect(compositeView.$el).not.to.contain.$text('baz');
    });
  });

  describe('when rendering a composite with a collection', function() {
    var compositeView, collection;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template',

      onRender: function() {}
    });

    beforeEach(function() {
      this.loadFixtures('compositeRerender.html');

      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});

      collection = new Collection([m2]);

      compositeView = new CompositeView({
        model: m1,
        collection: collection
      });

      compositeView.render();

      this.sinon.spy(compositeView, '_renderRoot');
    });

    describe('and then resetting the collection', function() {
      beforeEach(function() {
        var m3 = new Model({foo: 'quux'});
        var m4 = new Model({foo: 'widget'});
        collection.reset([m3, m4]);
      });

      it('should not re-render the template with the model', function() {
        expect(compositeView._renderRoot).not.to.have.been.called;
      });

      it('should render the collections items', function() {
        expect(compositeView.$el).not.to.contain.$text('baz');
        expect(compositeView.$el).to.contain.$text('quux');
        expect(compositeView.$el).to.contain.$text('widget');
      });
    });

    describe('and then adding to the collection', function() {
      beforeEach(function() {
        var m3 = new Model({foo: 'quux'});
        collection.add(m3);
      });

      it('should not re-render the template with the model', function() {
        expect(compositeView._renderRoot).not.to.have.been.called;
      });

      it('should add to the collections items', function() {
        expect(compositeView.$el).to.contain.$text('bar');
        expect(compositeView.$el).to.contain.$text('baz');
        expect(compositeView.$el).to.contain.$text('quux');
      });
    });

    describe('and then removing from the collection', function() {
      beforeEach(function() {
        var model = collection.at(0);
        collection.remove(model);
      });

      it('should not re-render the template with the model', function() {
        expect(compositeView._renderRoot).not.to.have.been.called;
      });

      it('should remove from the collections items', function() {
        expect(compositeView.$el).not.to.contain.$text('baz');
      });
    });
  });

  describe('when working with a composite and recursive model', function() {
    var treeView;

    beforeEach(function() {
      this.loadFixtures('recursiveCompositeTemplate.html');

      var data = {
        name: 'level 1',
        nodes: [
          {
            name: 'level 2',
            nodes: [
              {
                name: 'level 3'
              }
            ]
          }
        ]
      };

      var node = new Node(data);
      treeView = new TreeView({
        model: node
      });

      treeView.render();
    });

    it('should render the template with the model', function() {
      expect(treeView.$el).to.contain.$text('level 1');
    });

    it('should render the collections items', function() {
      expect(treeView.$el).to.contain.$text('level 2');
    });

    it('should render all the levels of the nested object', function() {
      expect(treeView.$el).to.contain.$text('level 3');
    });
  });

  describe('when destroying a composite view', function() {
    var compositeView;

    var ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function() {
        this.$el.html(this.model.get('foo'));
      }
    });

    var CompositeModelView = Backbone.Marionette.CompositeView.extend({
      childView: ChildView,
      template: '#composite-template'
    });

    beforeEach(function() {
      this.loadFixtures('compositeTemplate.html');

      var m1 = new Model({foo: 'bar'});
      var m2 = new Model({foo: 'baz'});
      var collection = new Collection();
      collection.add(m2);

      compositeView = new CompositeModelView({
        model: m1,
        collection: collection
      });

      this.sinon.spy(CompositeModelView.prototype, 'destroy');

      compositeView.render();

      compositeView.destroy();
    });

    it('should delete the model view', function() {
      expect(compositeView.renderedModelView).to.be.undefined;
    });

    it('should destroy the collection of views', function() {
      expect(CompositeModelView.prototype.destroy.callCount).to.equal(1);
    });
  });

  describe('when rendering a composite view with no model, using a template to create a grid', function() {

    var gridView;

    // A Grid Row
    var GridRow = Backbone.Marionette.ItemView.extend({
      tagName: 'tr',
      template: '#row-template'
    });

    // The grid view
    var GridView = Backbone.Marionette.CompositeView.extend({
      tagName: 'table',
      template: '#grid-template',
      childView: GridRow,

      attachHtml: function(collectionView, itemView) {
        collectionView.$('tbody').append(itemView.el);
      }
    });

    beforeEach(function() {
      this.loadFixtures('gridTemplates.html');

      var userData = [
        {
          username: 'dbailey',
          fullname: 'Derick Bailey'
        },
        {
          username: 'jbob',
          fullname: 'Joe Bob'
        },
        {
          username: 'fbar',
          fullname: 'Foo Bar'
        }
      ];

      var userList = new UserCollection(userData);

      gridView = new GridView({
        tagName: 'table',
        collection: userList
      });

      gridView.render();
    });

    it('should render the table', function() {
      expect(gridView.$('th').length).not.to.equal(0);
    });

    it('should render the users', function() {
      var body = gridView.$('tbody');
      expect(body).to.contain.$text('dbailey');
      expect(body).to.contain.$text('jbob');
      expect(body).to.contain.$text('fbar');
    });
  });

  describe('when a composite view has a ui elements hash', function() {

    var called, gridView, headersModel;

    // A Grid Row
    var GridRow = Backbone.Marionette.ItemView.extend({
      tagName: 'tr',
      template: '#row-template'
    });

    // The grid view
    var GridView = Backbone.Marionette.CompositeView.extend({
      tagName: 'table',
      template: '#grid-template',
      childView: GridRow,

      attachHtml: function(collectionView, itemView) {
        collectionView.$('tbody').append(itemView.el);
      }
    });

    var GridViewWithUIBindings = GridView.extend({
      template: '#ui-binding-template',

      ui: {
        headersRow: 'thead tr',
        unfoundElement: '#unfound',
        itemRows: 'tbody tr'
      }
    });

    beforeEach(function() {
      this.loadFixtures('uiBindingTemplate.html');

      var userData = [
        {
          username: 'dbailey',
          fullname: 'Derick Bailey'
        },
        {
          username: 'jbob',
          fullname: 'Joe Bob'
        }
      ];

      headersModel = new Backbone.Model({
        userHeader: 'Username',
        nameHeader: 'Full name'
      });

      var userList = new UserCollection(userData);

      gridView = new GridViewWithUIBindings({
        tagName: 'table',
        model: headersModel,
        collection: userList
      });

      // We don't render the view here since we need more fine-tuned control on when the view is rendered,
      // specifically in the test that asserts the composite view template elements are accessible before
      // the collection is rendered.
    });

    describe('after the whole composite view finished rendering', function() {

      beforeEach(function() {
        gridView.render();
      });

      describe('accessing a ui element that belongs to the model template', function() {

        it('should return its jQuery selector if it can be found', function() {
          expect(gridView.ui.headersRow.find('th:first-child')).to.contain.$text('Username');
        });

        it('should return an empty jQuery object if it cannot be found', function() {
          expect(gridView.ui.unfoundElement.length).to.equal(0);
        });

        it('should return an up-to-date selector on subsequent renders', function() {
          // asserting state before subsequent render
          expect(gridView.ui.headersRow.find('th:first-child')).to.contain.$text('Username');

          headersModel.set('userHeader', 'User');
          gridView.render();

          expect(gridView.ui.headersRow.find('th:first-child')).to.contain.$text('User');
        });

      });

      describe('accessing a ui element that belongs to the collection', function() {

        // This test makes it clear that not allowing access to the collection elements is a design decision
        // and not a bug.
        it('should return an empty jQuery object', function() {
          expect(gridView.ui.itemRows.length).to.equal(0);
        });

      });

    });

    describe('after the model finished rendering, but before the collection rendered', function() {

      describe('accessing a ui element that belongs to the model template', function() {

        beforeEach(function() {

          gridView.onBeforeRender = function() {
            called = true;
          };
          this.sinon.spy(gridView, 'onBeforeRender');

          gridView.render();

        });

        // this test enforces that ui elements should be accessible as soon as their html was inserted
        // to the DOM
        it('should return its jQuery selector', function() {
          expect(gridView.onBeforeRender).to.have.been.called;
        });

        it('should set the username', function() {
          expect($(gridView.ui.headersRow).find('th:first-child').text()).to.equal('Username');
        });

      });

    });

  });

  describe('has a valid inheritance chain back to Marionette.CollectionView', function() {

    var constructor, compositeView;

    beforeEach(function() {
      constructor = this.sinon.spy(Marionette, 'CollectionView');
      compositeView = new Marionette.CompositeView();
    });

    it('calls the parent Marionette.CollectionViews constructor function on instantiation', function() {
      expect(constructor).to.have.been.called;
    });
  });
});
