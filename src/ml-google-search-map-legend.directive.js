(function () {

  'use strict';

  angular.module('ml.google-maps')
  .filter('hasBoxes', function() {
    return function(input,facet) {
      var out = [];
      angular.forEach(input, function(facet, name) {
        if (facet && facet.boxes) {
          facet.name = name;
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
