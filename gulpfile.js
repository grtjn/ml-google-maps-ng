/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    html2Js = require('gulp-ng-html2js'),
    info = require('gulp-print'),
    clean = require('gulp-clean'),
    csslint = require('gulp-csslint'),
    util = require('gulp-util'),
    cssval = require('gulp-css-validator');

var customReporter = function(file) {
  util.log(util.colors.cyan(file.csslint.errorCount)+' errors in '+util.colors.magenta(file.path));

  file.csslint.results.forEach(function(result) {
    util.log(result.error.message+' on line '+result.error.line);
  });
};

gulp.task('clean', function () {
  return gulp.src([
      'index.html',
      'scripts/*.min.js',
      'styles/*.min.css'
    ], {read: false})
    .pipe(clean());
});

gulp.task('minify', ['clean'], function () {
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
    //.pipe(gulpif('*.css', cssval()))
    //.pipe(gulpif('*.css', csslint()))
    //.pipe(gulpif('*.css', csslint.reporter(customReporter)))
    .pipe(gulpif('*.css', less()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())

    .pipe(useref())
    .pipe(gulp.dest('./'))
    .pipe(info(function(filepath) {
      return 'written: ' + filepath;
    }))
  ;
});

gulp.task('templates', [], function() {
  return gulp.src([ './src/**/*.html' ])
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(html2Js({
      moduleName: 'ml.google-maps.tpls',
      prefix: '/ml-google-maps'
    }))
    .pipe(concat('ml-google-maps-ng-tpls.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['minify']);
