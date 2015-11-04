import gulp from 'gulp';
import header from 'gulp-header';
import preprocess from 'gulp-preprocess';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import unwrapper from 'gulp-unwrapper';

import banner from  './_banner';
import {name} from '../package.json';

// NOTE: This is the ES5 builder

const srcPath = './src/build/';
const buildPath = './lib/';

const unwrapConfig = [
  './node_modules/backbone.babysitter/lib/backbone.babysitter.js',
  './node_modules/backbone.radio/build/backbone.radio.js',
];

gulp.task('unwrap', function(){
  return gulp.src(unwrapConfig)
    .pipe(unwrapper())
    .pipe(gulp.dest('./tmp/'));
});

function buildLib(type, dest){
  return gulp.src(srcPath + type + '.js')
    .pipe(preprocess())
    .pipe(header(banner[type]))
    .pipe(rename(dest + name + '.js'))
    .pipe(gulp.dest(''))
    .pipe(uglify())
    .pipe(header(banner[type]))
    .pipe(rename(dest + name + '.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
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
