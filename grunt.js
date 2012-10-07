/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '1.0.0-beta1',
      banner: '// Backbone.Marionette, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' + 
        '// Distributed under MIT license\n' + 
        '// http://github.com/marionettejs/backbone.marionette'
    },

    lint: {
      files: ['src/marionette.*.js']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/marionette.js'],
        dest: 'lib/backbone.marionette.js'
      },
      amd: {
        src: ['<banner:meta.banner>', 'src/amd.js'],
        dest: 'lib/amd/backbone.marionette.js'
      }
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:rig.build.dest>'],
        dest: 'lib/backbone.marionette.min.js'
      },
      amd: {
        src: ['<banner:meta.banner>', '<config:rig.amd.dest>'],
        dest: 'lib/amd/backbone.marionette.min.js'
      }
    },

    jasmine : {
      src : [
        'public/javascripts/jquery.js',
        'public/javascripts/json2.js',
        'public/javascripts/underscore.js',
        'public/javascripts/backbone.js',
        'public/javascripts/backbone.eventbinder.js',
        'public/javascripts/backbone.wreqr.js',
        'src/marionette.js',
        'spec/javascripts/support/marionette.support.js',
        'src/marionette.helpers.js',
        'src/marionette.triggermethod.js',
        'src/marionette.eventbinder.js',
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
        'src/marionette.callbacks.js',
        'src/marionette.eventaggregator.js'
      ],
      helpers : 'spec/javascripts/helpers/*.js',
      specs : 'spec/javascripts/**/*.spec.js'
    },

    'jasmine-server' : {
      browser : false
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        Backbone: true,
        _: true,
        Marionette: true,
        $: true,
        slice: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint rig min');

};
