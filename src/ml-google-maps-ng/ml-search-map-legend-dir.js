(function () {

  'use strict';

  angular.module('ml.google-maps')
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
      templateUrl: 'ml-search-map-legend-dir.html',
      link: function($scope, $element, $attrs) {
      }
    };
  }]);
}());
