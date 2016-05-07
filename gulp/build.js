import gulp from 'gulp';
import plumber from 'gulp-plumber';
import file from 'gulp-file';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import runSequence from 'run-sequence';

import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import preset from 'babel-preset-es2015-rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import banner     from  './_banner';
import {name} from '../package.json';

const srcPath = 'src/';
const buildPath = 'lib/';

function _generate(bundle, opts){
  return bundle.generate({
    format: 'umd',
    moduleName: 'Marionette = global[\'Mn\']',
    sourceMap: true,
    banner: banner[opts.type],
    globals: {
      'backbone': 'Backbone',
      'underscore': '_',
      'backbone.babysitter': 'Backbone.ChildViewContainer',
      'backbone.radio': 'Backbone.Radio'
    }
  });
}

function bundle(opts) {
  return rollup({
    entry: srcPath + name + '.js',
    external: opts.external,
    plugins: opts.plugins
  }).then(bundle => {
    return _generate(bundle, opts);
  }).then(gen => {
    gen.code += '\n//# sourceMappingURL=' + gen.map.toUrl();
    return gen;
  });
}

function buildLib(opts) {
  return bundle(opts).then(gen => {
    return file(name + '.js', gen.code, {src: true})
      .pipe(plumber())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(opts.dest))
      .pipe(filter(['*', '!**/*.js.map']))
      .pipe(rename(name + '.min.js'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify({
        preserveComments: 'license'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(opts.dest));
  });
}

function buildCore(){
  return buildLib({
    type: 'core',
    dest: buildPath + 'core/',
    external: ['underscore', 'backbone', 'backbone.babysitter', 'backbone.radio'],
    plugins: [
      json(),
      babel({
        sourceMaps: true,
        presets: [ preset ],
        babelrc: false
      })
    ]
  });
}

function buildBundled(){
  return buildLib({
    type: 'bundled',
    dest: buildPath,
    external: ['underscore', 'backbone'],
    plugins: [
      nodeResolve(),
      commonjs({
        namedExports: {
          'backbone.babysitter': [ 'ChildViewContainer' ],
          'backbone.radio': ['Radio']
        }
      }),
      json(),
      babel({
        sourceMaps: true,
        presets: [ preset ],
        babelrc: false,
        exclude: 'node_modules/**'
      })
    ]
  });
}

gulp.task('build-core', ['lint-src'], buildCore);

gulp.task('build-bundled', ['lint-src'], buildBundled);

gulp.task('build', function(done) {
  runSequence(['build-core', 'build-bundled'], 'test-build', done);
});


