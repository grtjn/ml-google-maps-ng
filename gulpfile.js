/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    html2Js = require('gulp-ng-html2js'),
    info = require('gulp-print'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function () {
  return gulp.src([
      'index.html',
      'scripts/*.min.js',
      'styles/*.min.css'
    ], {read: false})
    .pipe(info(function(filepath) {
      return 'deleting: ' + filepath;
    }))
    .pipe(clean());
});

gulp.task('templates', ['clean'], function() {
  return gulp.src([
      'src/**/*.html',
      '!src/index.html'
    ])
    .pipe(info(function(filepath) {
      return 'minifying: ' + filepath;
    }))
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(html2Js({
      moduleName: 'mlGoogleMapsDemoTpls',
      prefix: '/'
    }))
    .pipe(concat('main-tpls.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('scripts'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
  ;
});

gulp.task('minify', ['templates'], function () {
  var assets = useref.assets();

  return gulp.src([
      'src/*.html'
    ])
    .pipe(info(function(filepath) {
      return 'processing: ' + filepath;
    }))

    .pipe(assets)
    .pipe(info(function(filepath) {
      return 'minifying: ' + filepath;
    }))
    .pipe(gulpif('*.css', sourcemaps.init()))
    .pipe(gulpif('*.css', less()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.css', sourcemaps.write()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())

    .pipe(useref())
    .pipe(gulp.dest('./'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
  ;
});

gulp.task('default', ['minify']);
