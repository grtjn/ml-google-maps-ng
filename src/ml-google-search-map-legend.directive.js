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
  .directive('mlGoogleSearchMapLegend', [function () {
    return {
      restrict: 'E',
      scope: {
        // model access
        facets: '=facets'
      },
      templateUrl: '/ml-google-maps-ng/ml-google-search-map-legend.html',
      link: function($scope, $element, $attrs) {
      }
    };
  }]);
}());
