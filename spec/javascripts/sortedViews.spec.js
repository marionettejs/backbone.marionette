describe('collection/composite view sorting', function(){
  beforeEach(global.setup);
  afterEach(global.teardown);

  beforeEach(function() {
    // Shared View Definitions
    // -----------------------

    this.getCollectionChildren = function (el) {
      return el.children().map(function(i, v){return v.innerHTML; }).get().join();
    };

    this.ChildView = Backbone.Marionette.ItemView.extend({
      tagName: 'span',
      render: function(){
        this.$el.html(this.model.get('foo'));
        this.trigger('render');
      }
    });

    this.CollectionView = Backbone.Marionette.CollectionView.extend({
      childView: this.ChildView
    });

    this.CompositeView = Backbone.Marionette.CompositeView.extend({
      childView: this.ChildView,
      template: '#composite-template-no-model'
    });
  });

  describe('when working with collections with comparators', function(){
    beforeEach(function(){
      this.loadFixtures('compositeTemplate-noModel.html');

      this.collection = new Backbone.Collection([{foo: 'abar', foo2: 'wbar'}, {foo: 'bbar', foo2: 'abar'}, {foo: 'wbar', foo2: 'bbar'}]);
      this.collection.comparator = 'foo';

      this.collectionView = new this.CollectionView({
        childView: this.ChildView,
        collection: this.collection
      });
      this.collectionView.render();

      this.compositeView = new this.CompositeView({
        childView: this.ChildView,
        collection: this.collection,
      });
      this.compositeView.render();
    });

    describe('when adding a model', function(){
      beforeEach(function(){
        this.model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        this.collection.add(this.model);
      });

      it('should add the model to the list', function(){
        expect(_.size(this.collectionView.children)).to.equal(4);
      });

      it('should have the order in the dom', function(){
        expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,fbar,wbar');
        expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,fbar,wbar');
      });
    });

    describe('when adding a model with the \'at\' option', function(){
      beforeEach(function(){
        this.model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        this.collection.add(this.model, {at: 5});
      });

      it('should add the model to the list', function(){
        expect(_.size(this.collectionView.children)).to.equal(4);
      });

      it('should ignore the sorted order in the dom', function(){
        expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,wbar,fbar');
        expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,wbar,fbar');
      });

      describe('and adding another', function(){
        beforeEach(function(){
          this.model = new Backbone.Model({foo: 'dbar', foo2: 'sbar'});
          this.collection.add(this.model);
        });

        it('should render the sorted order in the dom', function(){
          expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
          expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
        });
      });
    });

    describe('when silently adding a model', function(){
      beforeEach(function(){
        this.model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        this.collection.add(this.model, {silent: true});
      });

      it('shouldn\'t add the model to the list', function(){
        expect(_.size(this.collectionView.children)).to.equal(3);
      });

      it('should have the order in the dom', function(){
        expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,wbar');
        expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,wbar');
      });

      describe('and then adding another', function () {
        beforeEach(function(){
          this.model = new Backbone.Model({foo: 'dbar', foo2: 'qbar'});
          this.collection.add(this.model);
        });

        it('should add both models to the list', function(){
          expect(_.size(this.collectionView.children)).to.equal(5);
        });

        it('should have the order in the dom', function(){
          expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
          expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,dbar,fbar,wbar');
        });
      });
    });

    describe('when removing a model', function(){
      beforeEach(function(){
        this.model = this.collection.at(1);
        this.collection.remove(this.model);
      });

      it('should have the order in the dom', function(){
        expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,wbar');
        expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,wbar');
      });

      describe('and then adding another', function(){
        beforeEach(function(){
          this.model = new Backbone.Model({foo: 'bbar'});
          this.sinon.spy(this.collectionView, 'render');
          this.collection.add(this.model);
        });

        it('should have the order in the dom', function(){
          expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,wbar');
          expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,wbar');
        });

        it('should not call render', function(){
          expect(this.collectionView.render.callCount).to.equal(0);
        });
      });
    });

    describe('when changing the comparator', function(){
      beforeEach(function(){
        this.collection.comparator = 'foo2';
      });

      describe('and triggering a sort', function(){
        beforeEach(function(){
          this.collection.sort();
        });

        it('should have the order in the dom', function(){
          expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('bbar,wbar,abar');
          expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('bbar,wbar,abar');
        });
      });

      describe('and adding a new child', function(){
        beforeEach(function(){
          this.model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
          this.collection.add(this.model);
        });

        it('should have the order in the dom', function(){
          expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('bbar,wbar,fbar,abar');
          expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('bbar,wbar,fbar,abar');
        });
      });
    });

    describe('when using \'{sort: false}\'', function(){
      beforeEach(function(){
        this.collection = new Backbone.Collection([{foo: 'abar', foo2: 'wbar'}, {foo: 'bbar', foo2: 'abar'}, {foo: 'wbar', foo2: 'bbar'}]);
        this.collection.comparator = 'foo';

        this.collectionView = new this.CollectionView({
          childView: this.ChildView,
          collection: this.collection,
          sort: false
        });
        this.collectionView.render();

        this.compositeView = new this.CompositeView({
          childView: this.ChildView,
          collection: this.collection,
          sort: false
        });
        this.compositeView.render();

        this.model = new Backbone.Model({foo: 'fbar', foo2: 'sbar'});
        this.collection.add(this.model);
      });

      describe('and adding a model', function(){
        it('should add the model to the list', function(){
          expect(_.size(this.collectionView.children)).to.equal(4);
        });

        it('should have the order in the dom', function(){
          expect(this.getCollectionChildren(this.collectionView.$el)).to.equal('abar,bbar,wbar,fbar');
          expect(this.getCollectionChildren(this.compositeView.$el)).to.equal('abar,bbar,wbar,fbar');
        });
      });
    });
  });
});
