/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    path = require('path'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('jshint', function() {
  gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return gulp.src([
      './src/ml-google-maps.js',
      './src/**/*.js'
    ])
    .pipe(concat('ml-google-maps-ng.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('ml-google-maps-ng.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    singleRun: true,
    autoWatch: false
  }, function (exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('autotest', function() {
  karma.start({
    configFile: path.join(__dirname, './karma.conf.js'),
    autoWatch: true
  }, function (exitCode) {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('default', ['test', 'jshint', 'scripts']);
