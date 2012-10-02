/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.10.2',
      banner: '// Backbone.Marionette, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' + 
        '// Distributed under MIT license\n' + 
        '// http://github.com/derickbailey/backbone.marionette'
    },

    lint: {
      files: ['src/backbone.marionette.*.js']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/backbone.marionette.js'],
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
        'src/backbone.marionette.js',
        'src/async/async.js',
        'spec/javascripts/support/marionette.support.js',
        'src/backbone.marionette.eventbinder.js',
        'src/backbone.marionette.triggerevent.js',
        'src/backbone.marionette.view.js',
        'src/backbone.marionette.itemview.js',
        'src/backbone.marionette.collectionview.js',
        'src/backbone.marionette.compositeview.js',
        'src/backbone.marionette.region.js',
        'src/backbone.marionette.layout.js',
        'src/backbone.marionette.application.js',
        'src/backbone.marionette.approuter.js',
        'src/backbone.marionette.module.js',
        'src/backbone.marionette.templatecache.js',
        'src/backbone.marionette.renderer.js',
        'src/backbone.marionette.callbacks.js',
        'src/backbone.marionette.eventaggregator.js',
        'src/backbone.marionette.helpers.js'
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
