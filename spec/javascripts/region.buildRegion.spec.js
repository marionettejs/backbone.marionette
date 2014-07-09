describe('Region', function() {
  describe('.buildRegion', function() {
    beforeEach(function() {
      this.DefaultRegionClass = Marionette.Region.extend();

      this.fooSelector = '#foo-region';
      this.fooRegion   = new this.DefaultRegionClass({ el: this.fooSelector });

      this.barSelector = '#bar-region';
      this.BarRegion   = Marionette.Region.extend({ el: this.barSelector });
      this.barRegion   = new this.BarRegion();

      this.BazRegion = Marionette.Region.extend();
    });

    describe('with a selector string', function() {
      beforeEach(function() {
        this.region = Marionette.Region.buildRegion(this.fooSelector, this.DefaultRegionClass);
      });

      it('returns the region', function() {
        expect(this.region).to.deep.equal(this.fooRegion);
      });

      it('uses the default region class', function() {
        expect(this.region).to.be.an.instanceof(this.DefaultRegionClass);
      });

      it('uses the selector', function() {
        expect(this.region.el).to.equal(this.fooSelector);
      });
    });

    describe('with a region class', function() {
      describe('with `el` defined', function() {
        beforeEach(function() {
          this.region = Marionette.Region.buildRegion(this.BarRegion, this.DefaultRegionClass);
        });

        it('returns the region', function() {
          expect(this.region).to.deep.equal(this.barRegion);
        });

        it('uses the passed in region class', function() {
          expect(this.region).to.be.an.instanceof(this.BarRegion);
        });

        it('uses the defined el', function() {
          expect(this.region.el).to.equal(this.barSelector);
        });
      });

      describe('without `el` defined', function() {
        beforeEach(function() {
          this.BarRegion = Marionette.Region.extend();

          this.buildRegion = function() {
            Marionette.Region.buildRegion(this.BarRegion, this.DefaultRegionClass);
          }.bind(this);
        });

        it('throws a `NoElError`', function() {
          expect(this.buildRegion).to.throw('An "el" must be specified for a region.');
        });
      });
    });

    describe('with an object literal', function() {
      describe('with `selector` defined', function() {
        beforeEach(function() {
          this.definition = { selector: this.fooSelector };
          this.region = Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
        });

        it('returns the region', function() {
          expect(this.region).to.deep.equal(this.fooRegion);
        });

        it('uses the default region class', function() {
          expect(this.region).to.be.an.instanceof(this.DefaultRegionClass);
        });

        it('uses the selector', function() {
          expect(this.region.el).to.equal(this.fooSelector);
        });
      });

      describe('with `el` defined', function() {
        describe('when el is a selector string', function() {
          beforeEach(function() {
            this.definition = { el: this.fooSelector };
            this.region = Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
          });

          it('returns the region', function() {
            expect(this.region).to.deep.equal(this.fooRegion);
          });

          it('uses the default region class', function() {
            expect(this.region).to.be.an.instanceof(this.DefaultRegionClass);
          });

          it('uses the el', function() {
            expect(this.region.el).to.equal(this.fooSelector);
          });
        });

        describe('when el is an HTML node', function() {
          beforeEach(function() {
            this.el = $('<div id="baz-region">')[0];
            this.bazRegion = new this.DefaultRegionClass({ el: this.el });
            this.definition = { el: this.el };
            this.region = Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
          });

          it('returns the region', function() {
            expect(this.region).to.deep.equal(this.bazRegion);
          });

          it('uses the default region class', function() {
            expect(this.region).to.be.an.instanceof(this.DefaultRegionClass);
          });

          it('uses the el', function() {
            expect(this.region.el).to.equal(this.el);
          });
        });

        describe('when el is a jQuery object', function() {
          beforeEach(function() {
            this.el = $('<div id="baz-region">');
            this.bazRegion = new this.DefaultRegionClass({ el: this.el });
            this.definition = { el: this.el };
            this.region = Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
          });

          it('returns the region', function() {
            expect(this.region).to.deep.equal(this.bazRegion);
          });

          it('uses the default region class', function() {
            expect(this.region).to.be.an.instanceof(this.DefaultRegionClass);
          });

          it('uses the el', function() {
            expect(this.region.el).to.equal(this.el[0]);
          });
        });
      });

      describe('when el is an empty jQuery object', function() {
        beforeEach(function() {
          this.el = $('i-am-not-real');
          this.definition = { el: this.el };

          this.buildRegion = function() {
            Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
          }.bind(this);
        });

        it('throws a `NoElError`', function() {
          expect(this.buildRegion).to.throw('An "el" must be specified for a region.');
        });
      });

      describe('with `regionClass` defined', function() {
        beforeEach(function() {
          this.$el = $('<div id="baz-region">');
          this.el = this.$el[0];
        });

        describe('with `el` also defined', function() {
          beforeEach(function() {
            this.baseDefinition = { regionClass: this.BazRegion };
            this.region1Definition = _.defaults({ el: this.fooSelector }, this.baseDefinition);
            this.region2Definition = _.defaults({ el: this.el },          this.baseDefinition);
            this.region3Definition = _.defaults({ el: this.$el },         this.baseDefinition);

            this.baz1Region = new this.BazRegion({ el: this.fooSelector });
            this.baz2Region = new this.BazRegion({ el: this.el });
            this.baz3Region = new this.BazRegion({ el: this.$el });

            this.region1 = Marionette.Region.buildRegion(this.region1Definition, this.DefaultRegionClass);
            this.region2 = Marionette.Region.buildRegion(this.region2Definition, this.DefaultRegionClass);
            this.region3 = Marionette.Region.buildRegion(this.region3Definition, this.DefaultRegionClass);
          });

          it('returns the regions', function() {
            expect(this.region1).to.deep.equal(this.baz1Region);
            expect(this.region2).to.deep.equal(this.baz2Region);
            expect(this.region3).to.deep.equal(this.baz3Region);
          });

          it('uses the region class', function() {
            expect(this.region1).to.be.an.instanceof(this.BazRegion);
            expect(this.region2).to.be.an.instanceof(this.BazRegion);
            expect(this.region3).to.be.an.instanceof(this.BazRegion);
          });

          it('uses the el', function() {
            expect(this.region1.el).to.equal(this.fooSelector);
            expect(this.region2.el).to.equal(this.el);
            expect(this.region3.el).to.equal(this.el);
          });
        });

        describe('without `selector` or `el` defined on `regionConfig`', function() {
          describe('with `el` defined on `regionClass`', function() {
            beforeEach(function() {
              this.definition = { regionClass: this.BarRegion };
              this.region = Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
            });

            it('returns the region', function() {
              expect(this.region).to.deep.equal(this.barRegion);
            });

            it('uses the region class', function() {
              expect(this.region).to.be.an.instanceof(this.BarRegion);
            });
          });

          describe('without `el` defined on `regionClass`', function() {
            beforeEach(function() {
              this.definition = { regionClass: this.BazRegion };

              this.buildRegion = function() {
                Marionette.Region.buildRegion(this.definition, this.DefaultRegionClass);
              }.bind(this);
            });

            it('throws a `NoElError`', function() {
              expect(this.buildRegion).to.throw('An "el" must be specified for a region.');
            });
          });
        });
      });

      describe('with additional region options', function() {
        beforeEach(function() {
          this.definition = {
            el: this.fooSelector,
            regionClass: this.BazRegion,
            myRegionOption: 42,
            myOtherRegionOption: 'foobar'
          };

          this.region = Marionette.buildRegion(this.definition, this.DefaultRegionClass);
        });

        expect('it sets the region options', function() {
          expect(this.region.getOption('myRegionOption')).to.equal(42);
          expect(this.region.getOption('myOtherRegionOption')).to.equal('foobar');
        });
      });
    });

    describe('with a missing regionConfig', function() {
      it('throws an error', function() {
        expect(function() {
          Marionette.Region.buildRegion();
        }).to.throw(TypeError);
      });
    });

    describe('with an improper object literal', function() {
      beforeEach(function() {
        this.buildRegion = function() {
          Marionette.Region.buildRegion({});
        };
      });

      it('throws an error', function() {
        expect(this.buildRegion).
          to.throw('Improper region configuration type. Please refer ' +
            'to http://marionettejs.com/docs/marionette.region.html#region-configuration-types');
      });
    });
  });
});
