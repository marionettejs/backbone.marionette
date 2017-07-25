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
import preset from 'babel-preset-es2015';

import banner from './_banner';
import pkg from '../package.json';

const srcPath = 'src/';

const rollupGlobals = {
  'backbone': 'Backbone',
  'underscore': '_',
  'backbone.radio': 'Backbone.Radio'
};

function makeESModule(bundle) {
  bundle.write({
    format: 'es',
    dest: pkg.module,
    sourceMap: true,
    banner: banner,
    globals: rollupGlobals
  });
}

function generateBundle(bundle) {
  return bundle.generate({
    format: 'umd',
    moduleName: 'Marionette',
    sourceMap: true,
    banner: banner,
    footer: 'this && this.Marionette && (this.Mn = this.Marionette);',
    globals: rollupGlobals
  });
}

function makeBundle(buildPath) {
  const buildFile = buildPath + pkg.name + '.js';

  return rollup({
    entry: srcPath + pkg.name + '.js',
    external: ['underscore', 'backbone', 'backbone.radio'],
    plugins: [
      json(),
      babel({
        sourceMaps: true,
        presets: [['es2015', {modules: false}]],
        babelrc: false
      })
    ]
  }).then(bundle => {
    // Only build the ES6 module if this is the main build
    if (buildFile === pkg.main) {
      makeESModule(bundle);
    }
    return generateBundle(bundle);
  }).then(gen => {
    gen.code += '\n//# sourceMappingURL=' + gen.map.toUrl();
    return gen;
  });
}

function build(buildPath) {
  return makeBundle(buildPath).then(gen => {
    return file(pkg.name + '.js', gen.code, {src: true})
      .pipe(plumber())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildPath))
      .pipe(filter(['**', '!**/*.js.map']))
      .pipe(rename(pkg.name + '.min.js'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify({
        preserveComments: 'license'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildPath));
  });
}

gulp.task('build-test', ['lint-test'], function() {
  return build('tmp/lib/');
});

gulp.task('build-lib', ['lint-src'], function() {
  return build('lib/');
});

gulp.task('build', function(done) {
  runSequence('build-lib', done);
});
