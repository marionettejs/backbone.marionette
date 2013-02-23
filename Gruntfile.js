/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      version: '<%= pkg.version %>',
      core_banner: 
              ' // Backbone.Marionette, v<%= meta.version %>\n' +
              ' // Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
              ' // Distributed under MIT license\n' +
              ' // http://github.com/marionettejs/backbone.marionette\n',
      banner :
        '<%= meta.core_banner %>\n\n' +
        '/*!\n' +
        ' * Includes BabySitter\n' +
        ' * https://github.com/marionettejs/backbone.babysitter/\n' +
        ' *\n' + 
        ' * Includes Wreqr\n' +
        ' * https://github.com/marionettejs/backbone.wreqr/\n' +
        ' */\n\n'
    },

    lint: {
      files: ['src/marionette.*.js']
    },

    preprocess: {
      core_build: {
        files : {
          'lib/core/backbone.marionette.js' : 'src/build/marionette.core.js'
        }
      },
      core_amd: {
        files : {
          'lib/core/amd/backbone.marionette.js' : 'src/build/amd.core.js'
        }
      },
    },

    concat : {
      build : {
        src : [
          'public/javascripts/backbone.babysitter.js',
          'public/javascripts/backbone.wreqr.js',
          'lib/core/backbone.marionette.js',
        ],
        dest : 'lib/backbone.marionette.js'
      }
    },

    uglify : {
      amd : {
        src : 'lib/core/amd/backbone.marionette.js',
        dest : 'lib/core/amd/backbone.marionette.min.js',
      },
      core : {
        src : 'lib/core/backbone.marionette.js',
        dest : 'lib/core/backbone.marionette.min.js',
        options : {
          sourceMap : 'lib/core/backbone.marionette.map',
          sourceMappingURL : 'backbone.marionette.map',
          sourceMapPrefix : 2,
        }
      },
      bundle : {
        src : 'lib/backbone.marionette.js',
        dest : 'lib/backbone.marionette.min.js',
        options : {
          sourceMap : 'lib/backbone.marionette.map',
          sourceMappingURL : 'backbone.marionette.map',
          sourceMapPrefix : 1
        }
      }
    },

    jasmine : {
      options : {
        helpers : 'spec/javascripts/helpers/*.js',
        specs : 'spec/javascripts/**/*.spec.js',
        vendor : [
          'public/javascripts/jquery.js',
          'public/javascripts/json2.js',
          'public/javascripts/underscore.js',
          'public/javascripts/backbone.js',
          'public/javascripts/backbone.babysitter.js',
          'public/javascripts/backbone.wreqr.js',
        ],
      },
      coverage : {
        src : '<%= jasmine.marionette.src %>',
        options : {
          template : require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'reports/coverage.json',
            report: 'reports/coverage'
          }
        }
      },
      marionette : {
        src : [
          'src/build/marionette.core.js',
          'spec/javascripts/support/marionette.support.js',
          'src/marionette.helpers.js',
          'src/marionette.createObject.js',
          'src/marionette.triggermethod.js',
          'src/marionette.bindEntityEvents.js',
          'src/marionette.controller.js',
          'src/marionette.domRefresh.js',
          'src/marionette.view.js',
          'src/marionette.itemview.js',
          'src/marionette.collectionview.js',
          'src/marionette.compositeview.js',
          'src/marionette.region.js',
          'src/marionette.layout.js',
          'src/marionette.application.js',
          'src/marionette.approuter.js',
          'src/marionette.module.js',
          'src/marionette.templatecache.js',
          'src/marionette.renderer.js',
          'src/marionette.callbacks.js'
        ],
      }
    },

    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      marionette : [ 'src/*.js' ]
    },
    plato: {
      marionette : {
        src : 'src/*.js',
        dest : 'reports',
        options : {
          jshint : grunt.file.readJSON('.jshintrc')
        }
      }
    },
    watch: {
      marionette : {
        files : ['src/*.js', 'spec/**/*.js'],
        tasks : ['jshint', 'jasmine:marionette']
      }
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-plato');

  grunt.registerTask('test', ['jshint', 'jasmine:marionette']);

  grunt.registerTask('dev', ['test', 'watch']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine:coverage', 'preprocess', 'concat', 'uglify']);

};
