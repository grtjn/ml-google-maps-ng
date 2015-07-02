/*jshint node: true */

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    html2Js = require('gulp-ng-html2js'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    minifyHtml = require('gulp-minify-html'),
    path = require('path'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    info = require('gulp-print');

gulp.task('jshint', function() {
  return gulp.src([
      './gulpfile.js',
      './src/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('templates', ['jshint'], function() {
  return gulp.src([ './src/**/*.html' ])
    .pipe(info(function(filepath) {
      return 'processing: ' + filepath;
    }))
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(html2Js({
      moduleName: 'ml.google-maps.tpls',
      prefix: '/ml-google-maps-ng/'
    }))
    .pipe(concat('ml-google-maps-ng-tpls.js'))
    .pipe(gulp.dest('build'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
  ;
});

gulp.task('scripts', ['templates'], function() {
  return gulp.src([
      './src/ml-google-maps.js',
      './src/**/*.js',
      './build/**/*.js'
    ])
    .pipe(info(function(filepath) {
      return 'processing: ' + filepath;
    }))
    .pipe(concat('ml-google-maps-ng.js'))
    .pipe(gulp.dest('dist'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
    
    .pipe(rename('ml-google-maps-ng.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
  ;
});

gulp.task('styles', ['scripts'], function() {
  return gulp.src([
      './less/**/*.less'
    ])
    .pipe(info(function(filepath) {
      return 'processing: ' + filepath;
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('ml-google-maps-ng.css'))
    .pipe(gulp.dest('dist'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
    
    .pipe(rename('ml-google-maps-ng.min.css'))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(info(function(filepath) {
      return 'writing: ' + filepath;
    }))
  ;
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
    //process.exit(exitCode);
  });
});

gulp.task('default', ['styles']);
