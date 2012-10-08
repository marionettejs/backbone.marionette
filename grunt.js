/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      version: '<%= pkg.version %>',
      banner: '/*!\n' +
              ' * Backbone.Marionette, v<%= meta.version %>\n' +
              ' * Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
              ' * Distributed under MIT license\n' +
              ' * http://github.com/marionettejs/backbone.marionette\n' +
              '*/',
      banner_core :
        '<%= meta.banner %>\n' +
        '/*!\n' +
        ' * Includes Wreqr\n' +
        ' * https://github.com/marionettejs/backbone.wreqr/\n' +
        ' * Includes EventBinder\n' +
        ' * https://github.com/marionettejs/backbone.eventbinder\n' +
        ' */',
      banner_backbone_underscore :
        '<%= meta.banner_core %>\n' +
        '/*!\n' +
        ' * Includes Backbone\n' +
        ' * http://backbonejs.org/\n' +
        ' * Includes underscore\n' +
        ' * http://underscore.org/\n' +
        ' */',
      banner_backbone_underscore_jquery :
        '<%= meta.banner_backbone_underscore %>\n' +
        '/*!\n' +
        ' * Includes jQuery\n' +
        ' * http://www.jQuery.com/\n' +
        ' */'
    },

    lint: {
      files: ['src/marionette.*.js']
    },

    concat: {
      core : {
        src : [
          'public/javascripts/backbone.eventbinder.js',
          'public/javascripts/backbone.wreqr.js',
          'lib/backbone.marionette.js'
        ],
        dest : 'lib/bundles/marionette.core.js'
      },
      backbone_underscore : {
        src : [
          'public/javascripts/underscore.js',
          'public/javascripts/backbone.js',
          'public/javascripts/backbone.eventbinder.js',
          'public/javascripts/backbone.wreqr.js',
          'lib/backbone.marionette.js'
        ],
        dest : 'lib/bundles/marionette.backbone_underscore.js'
      },
      backbone_underscore_jquery : {
        src : [
          'public/javascripts/jquery.js',
          'public/javascripts/underscore.js',
          'public/javascripts/backbone.js',
          'public/javascripts/backbone.eventbinder.js',
          'public/javascripts/backbone.wreqr.js',
          'lib/backbone.marionette.js'
        ],
        dest : 'lib/bundles/marionette.backbone_underscore_jquery.js'
      }
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
        src: [
          '<banner:meta.banner>',
          '<config:rig.build.dest>'
        ],
        dest: 'lib/backbone.marionette.min.js'
      },
      bundle_core: {
        src: [
          '<banner:meta.banner_core>',
          '<config:concat.core.dest>'
        ],
        dest: 'lib/bundles/marionette.core.min.js'
      },
      bundle_backbone_underscore: {
        src: [
          '<banner:meta.banner_backbone_underscore>',
          '<config:concat.backbone_underscore.dest>'
        ],
        dest: 'lib/bundles/marionette.backbone_underscore.min.js'
      },
      bundle_backbone_underscore_jquery: {
        src: [
          '<banner:meta.banner_backbone_underscore_jquery>',
          '<config:concat.backbone_underscore_jquery.dest>'
        ],
        dest: 'lib/bundles/marionette.backbone_underscore_jquery.min.js'
      },
      amd: {
        src: [
          '<banner:meta.banner>',
          '<config:rig.amd.dest>'
        ],
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
  grunt.registerTask('default', 'lint rig concat min');

};
