(function () {

  'use strict';

  angular.module('ml.google-maps')
  .filter('object2Array', function() {
    return function(input) {
      var out = [];
      for (var name in input) {
        input[name].__key = name;
        out.push(input[name]);
      }
      return out;
    };
  })
  .filter('hasBoxes', function() {
    return function(input,facet) {
      var out = [];
      angular.forEach(input, function(facet) {
        if (facet && facet.boxes) {
          out.push(facet);
        }
      });
      return out;
    };
  })
  .directive('mlSearchMapLegend', [function () {
    return {
      restrict: 'E',
      scope: {
        // model access
        facets: '=facets'
      },
      templateUrl: '/ml-google-maps-ng/ml-search-map-legend-dir.html',
      link: function($scope, $element, $attrs) {
      }
    };
  }]);
}());
