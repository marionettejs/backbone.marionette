import gulp from 'gulp';
import livereload from 'gulp-livereload';

import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import preset from 'babel-preset-es2015-rollup';

function bundle() {
  return rollup({
    entry: ['./test/setup/browser.js', './test/unit/**/*.js'],
    plugins: [
      multiEntry.default(),
      nodeResolve({ main: true }),
      commonjs(),
      nodeGlobals(),
      json(),
      babel({
        sourceMaps: true,
        presets: [ preset ],
        babelrc: false,
        exclude: 'node_modules/**'
      })
    ]
  }).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      sourceMap: true,
      moduleName: 'MnTests',
      dest: './tmp/__spec-build.js'
    });
  }).then(livereload.changed('./tmp/__spec-build.js'));
}

function browserWatch() {
  livereload.listen({port: 35729, host: 'localhost', start: true});
  gulp.watch(['src/**/*.js', 'test/**/*.js'], ['browser-bundle']);
}

gulp.task('browser-bundle', ['lint-src', 'lint-test'],   bundle);

gulp.task('test-browser', ['browser-bundle'], browserWatch);
