import gulp       from 'gulp';
import header     from 'gulp-header';
import plumber    from 'gulp-plumber';
import file       from 'gulp-file';
import filter     from 'gulp-filter';
import rename     from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import tap        from 'gulp-tap';
import uglify     from 'gulp-uglify';
import unwrapper  from 'gulp-unwrapper';

import { rollup } from 'rollup';
import babel      from 'rollup-plugin-babel';
import json       from 'rollup-plugin-json';

import banner     from  './_banner';
import {name, version} from '../package.json';

const srcPath = 'src/';
const buildPath = 'lib/';

const unwrapConfig = [
  './node_modules/backbone.babysitter/lib/backbone.babysitter.js',
  './node_modules/backbone.radio/build/backbone.radio.js',
];

let unwrappedBundledLibs = '';

gulp.task('unwrap', function(){
  return gulp.src(unwrapConfig)
    .pipe(unwrapper())
    .pipe(tap(file => {
      // save the file contents in memory
      unwrappedBundledLibs += file.contents.toString();
    }));
});

const attachBundles = `

// Attach bundled libraries to expected local vars
Radio = Backbone.Radio;
ChildViewContainer = Backbone.ChildViewContainer;
`;

function _generate(bundle, type){
  let intro = '';

  // adds unwrapped  bundled libs
  if(type === 'bundled'){
    intro = unwrappedBundledLibs + attachBundles;
  }

  return bundle.generate({
    format: 'umd',
    moduleName: 'Marionette  = global.Mn',
    sourceMap: true,
    banner: banner[type],
    intro: intro,
    globals: {
      'backbone': 'Backbone',
      'underscore': '_',
      'backbone.babysitter': 'Backbone.ChildViewContainer',
      'backbone.radio': 'Backbone.Radio'
    }
  });
}

function bundle(type) {
  return rollup({
    entry: srcPath + name + '.js',
    external: ['underscore', 'backbone', 'backbone.babysitter', 'backbone.radio'],
    plugins: [
      json(),
      babel({
        sourceMaps: true
      })
    ]
  }).then(bundle => {
    return _generate(bundle, type);
  }).then(gen => {
    gen.code += '\n//# sourceMappingURL=' + gen.map.toUrl();
    return gen;
  });
}

function buildLib(type, dest) {
  return bundle(type).then(gen => {
    return file(name + '.js', gen.code, {src: true})
      .on('error', function(err) {
        console.log(err);
        this.emit('end');
      })
      .pipe(plumber())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .pipe(filter(['*', '!**/*.js.map']))
      .pipe(rename(name + '.min.js'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify({
        preserveComments: 'license'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest));
  });
}

function buildCore(){
  return buildLib('core', buildPath + 'core/');
}

function buildBundled(){
  return buildLib('bundled', buildPath);
}

gulp.task('build-core', ['lint-src'], buildCore);

gulp.task('build-bundled', ['lint-src', 'unwrap'], buildBundled);

gulp.task('build', ['build-core', 'build-bundled']);

