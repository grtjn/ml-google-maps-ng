(function () {
  'use strict';

  angular.module('ml.google-maps')
  .factory('GoogleMaps', ['$window', function($window) {
    return $window.google.maps;
  }]);

})();
