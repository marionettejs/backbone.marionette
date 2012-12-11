/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-jasmine-runner');

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
        '<%= meta.core_banner %>\n' +
        '/*!\n' +
        ' * Includes BabySitter\n' +
        ' * https://github.com/marionettejs/backbone.babysitter/\n' +
        ' * ' + 
        ' * Includes Wreqr\n' +
        ' * https://github.com/marionettejs/backbone.wreqr/\n' +
        ' * ' + 
        ' * Includes EventBinder\n' +
        ' * https://github.com/marionettejs/backbone.eventbinder/\n' +
        ' */'
    },

    lint: {
      files: ['src/marionette.*.js']
    },

    rig: {
      core_build: {
        src: ['<banner:meta.core_banner>', 'src/build/marionette.core.js'],
        dest: 'lib/core/backbone.marionette.js'
      },
      core_amd: {
        src: ['<banner:meta.core_banner>', 'src/build/amd.core.js'],
        dest: 'lib/core/amd/backbone.marionette.js'
      },
      build: {
        src: ['<banner:meta.banner>', 'src/build/marionette.js'],
        dest: 'lib/backbone.marionette.js'
      }
    },

    min: {
      core_standard: {
        src: [
          '<banner:meta.core_banner>',
          '<config:rig.core_build.dest>'
        ],
        dest: 'lib/core/backbone.marionette.min.js'
      },

      core_amd: {
        src: [
          '<banner:meta.core_banner>',
          '<config:rig.core_amd.dest>'
        ],
        dest: 'lib/core/amd/backbone.marionette.min.js'
      },

      standard: {
        src: [
          '<banner:meta.banner>',
          '<config:rig.build.dest>'
        ],
        dest: 'lib/backbone.marionette.min.js'
      }
    },

    jasmine : {
      src : [
        'public/javascripts/jquery.js',
        'public/javascripts/json2.js',
        'public/javascripts/underscore.js',
        'public/javascripts/backbone.js',
        'public/javascripts/backbone.babysitter.js',
        'public/javascripts/backbone.augment.js',
        'public/javascripts/backbone.eventbinder.js',
        'public/javascripts/backbone.wreqr.js',
        'src/build/marionette.core.js',
        'spec/javascripts/support/marionette.support.js',
        'src/marionette.helpers.js',
        'src/marionette.createObject.js',
        'src/marionette.triggermethod.js',
        'src/marionette.eventbinder.js',
        'src/marionette.bindEntityEvents.js',
        'src/marionette.eventaggregator.js',
        'src/marionette.controller.js',
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
