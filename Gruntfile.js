var path = require('path');
var unwrap = require('unwrap');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      core_banner:
        '// MarionetteJS (Backbone.Marionette)\n' +
        '// ----------------------------------\n' +
        '// v<%= pkg.version %>\n' +
        '//\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '//\n' +
        '// http://marionettejs.com\n' +
        '\n',
      banner:
        '<%= meta.core_banner %>\n' +
        '/*!\n' +
        ' * Includes BabySitter\n' +
        ' * https://github.com/marionettejs/backbone.babysitter/\n' +
        ' *\n' +
        ' * Includes Wreqr\n' +
        ' * https://github.com/marionettejs/backbone.wreqr/\n' +
        ' */\n\n\n'
    },
    assets: {
      babysitter:   'bower_components/backbone.babysitter/lib/backbone.babysitter.js',
      underscore:   'bower_components/underscore/underscore.js',
      backbone:     'bower_components/backbone/backbone.js',
      jquery:       'bower_components/jquery/dist/jquery.js',
      sinon:        'bower_components/sinonjs/sinon.js',
      jasmineSinon: 'bower_components/jasmine-sinon/lib/jasmine-sinon.js',
      wreqr:        'bower_components/backbone.wreqr/lib/backbone.wreqr.js',
    },

    clean: {
      lib: 'lib',
      tmp: 'tmp'
    },

    preprocess: {
      core_build: {
        src: 'src/build/marionette.core.js',
        dest: 'lib/core/backbone.marionette.js'
      },
      amd: {
        src: 'src/build/amd.core.js',
        dest: 'tmp/backbone.marionette.amd.js'
      },
      bundle: {
        src: 'src/build/marionette.bundle.js',
        dest: 'tmp/backbone.marionette.js'
      }
    },

    concat: {
      options: {
        banner: "<%= meta.core_banner %>"
      },
      core: {
        src: '<%= preprocess.bundle.dest %>',
        dest: 'lib/core/backbone.marionette.js'
      },
      bundle: {
        options: {
          banner: "<%= meta.banner %>"
        },
        src: '<%= preprocess.bundle.dest %>',
        dest: 'lib/backbone.marionette.js'
      },
      amd: {
        src: '<%= preprocess.amd.dest %>',
        dest: 'lib/core/amd/backbone.marionette.js'
      }
    },

    uglify : {
      amd : {
        options: {
          banner: '<%= meta.banner %>'
        },
        src : '<%= concat.amd.dest %>',
        dest : 'lib/core/amd/backbone.marionette.min.js',
      },
      bundle: {
        src : '<%= concat.bundle.dest %>',
        dest : 'lib/backbone.marionette.min.js',
        options : {
          banner: '<%= meta.banner %>',
          sourceMap : 'lib/backbone.marionette.map',
          sourceMappingURL : 'backbone.marionette.map',
          sourceMapPrefix : 2,
        }
      },
      core: {
        src : '<%= concat.core.dest %>',
        dest : 'lib/core/backbone.marionette.min.js',
        options : {
          banner: "<%= meta.core_bundle %>",
          sourceMap : 'lib/core/backbone.marionette.map',
          sourceMappingURL : '<%= uglify.bundle.options.sourceMappingURL %>',
          sourceMapPrefix : 1
        }
      }
    },

    jasmine : {
      options : {
        helpers : [
          '<%= assets.sinon %>',
          '<%= assets.jasmineSinon %>',
          'spec/javascripts/helpers/*.js'
        ],
        specs : 'spec/javascripts/**/*.spec.js',
        vendor : [
          '<%= assets.jquery %>',
          '<%= assets.underscore %>',
          '<%= assets.backbone %>',
          '<%= assets.babysitter %>',
          '<%= assets.wreqr %>',
        ],
        keepRunner: true
      },
      marionette : {
        src : [
          '<%= preprocess.bundle.dest %>',
          'spec/javascripts/support/marionette.support.js'
        ],
      }
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

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      marionette: {
        src: [ 'src/*.js' ]
      },

      specs: {
        options: {
          jshintrc: 'spec/.jshintrc'
        },

        files: {
          src: ['spec/javascripts/**.js']
        }
      }
    },

    watch: {
      marionette : {
        files : ['src/**/*.js', 'spec/**/*.js'],
        tasks : ['lint', 'jasmine:marionette']
      },
      server : {
        files : ['src/**/*.js', 'spec/**/*.js'],
        tasks : ['jasmine:marionette:build']
      }
    },

    connect: {
      server: {
        options: {
          port: 8888
        }
      }
    },

    lintspaces: {
      all: {
        src: [
            'src/*.js',
            'docs/*.md'
        ],
        options: {
            editorconfig: '.editorconfig'
        }
      }
    },

    unwrap: {
      babysitter: {
        src: './bower_components/backbone.babysitter/lib/backbone.babysitter.js',
        dest: './tmp/backbone.babysitter.bare.js'
      },
      wreqr: {
        src: './bower_components/backbone.wreqr/lib/backbone.wreqr.js',
        dest: './tmp/backbone.wreqr.bare.js'
      }
    }
  });

  grunt.registerMultiTask('unwrap', 'Unwrap UMD', function () {
    var done = this.async();
    var timesLeft = 0;

    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        timesLeft++;
        unwrap(path.resolve(__dirname, src), function (err, content) {
          if (err) return grunt.log.error(err);
          grunt.file.write(path.resolve(__dirname, file.dest), content);
          grunt.log.ok(file.dest + ' created.');
          timesLeft--;
          if (timesLeft <= 0) done();
        });
      });
    });
  });

  grunt.registerTask('verify-bower', function () {
    if (!grunt.file.isDir('./bower_components')) {
      grunt.fail.warn('Missing bower components. You should run `bower install` before.');
    }
  });

  grunt.registerTask('default', 'An alias task for running tests.', ['test']);

  grunt.registerTask('lint', 'Lints our sources', ['lintspaces', 'jshint']);

  grunt.registerTask('dev', 'Auto-lints while writing code.', ['lint', 'unwrap', 'preprocess:bundle', 'jasmine:marionette', 'watch:marionette']);

  grunt.registerTask('test', 'Run the unit tests.', ['verify-bower', 'lint', 'unwrap', 'preprocess:bundle', 'jasmine:marionette']);

  grunt.registerTask('build', 'Build all three versions of the library.', ['clean:lib', 'lint', 'unwrap', 'preprocess', 'jasmine:marionette', 'concat', 'uglify']);
};
