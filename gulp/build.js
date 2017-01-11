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

import banner from  './_banner';
import {name} from '../package.json';

const srcPath = 'src/';

function _generate(bundle){
  return bundle.generate({
    format: 'umd',
    moduleName: 'Marionette = global[\'Mn\']',
    sourceMap: true,
    banner: banner,
    globals: {
      'backbone': 'Backbone',
      'underscore': '_',
      'backbone.radio': 'Backbone.Radio'
    }
  });
}

function bundle(opts) {
  return rollup({
    entry: srcPath + name + '.js',
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
    return _generate(bundle);
  }).then(gen => {
    gen.code += '\n//# sourceMappingURL=' + gen.map.toUrl();
    return gen;
  });
}

function build(buildPath){
  return bundle().then(gen => {
    return file(name + '.js', gen.code, {src: true})
      .pipe(plumber())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(buildPath))
      .pipe(filter(['**', '!**/*.js.map']))
      .pipe(rename(name + '.min.js'))
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
