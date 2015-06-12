/* global describe, beforeEach, module, it, expect, inject */

describe('MLGoogleMaps', function () {
  'use strict';

  var factory, $httpBackend, $q, $location;

  beforeEach(module('ml.google-maps'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');

    factory = $injector.get('MLGoogleMaps', $q, $httpBackend);
  }));


});
