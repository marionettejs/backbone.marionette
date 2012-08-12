/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.9.10',
      banner: '// Backbone.Marionette, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' + 
        '// Distributed under MIT license\n' + 
        '// http://github.com/derickbailey/backbone.marionette'
    },

    lint: {
      files: ['src/backbone.marionette.js']
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
        _: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint rig min');

};
