(function () {
  'use strict';

  angular.module('mlGoogleMapsDemo')
  
    .factory('HomeModel', ['$window', function ($window) {
      //var NL_CENTER = new $window.google.maps.LatLng(52.2129918, 5.2793703);
      var ADAM_CENTER = new $window.google.maps.LatLng(52.3881895, 4.8447237);

      var mapInitOptions = {
        center: ADAM_CENTER,//demojam: 38.9345564, -77.2136688),
        zoom: 10,
        mapTypeId: $window.google.maps.MapTypeId.ROADMAP
      };
      var mapOptions = {};
      angular.extend(mapOptions, mapInitOptions);
      
      return {
        searchMap: {
          map: null,
          initOptions: mapInitOptions,
          options: mapOptions,
          markers: [],
          selections: []
        },
      };
    }])
    
    .controller('mlGoogleMapsDemo.HomeCtrl', [
      '$scope',
      '$http',
      '$location',
      '$window',
      'HomeModel',
      HomeCtrl
    ]);
  
  function HomeCtrl($scope, $http, $location, $window, model) {
    
    $http
      .get('data/geo-facets.json')
      .then(function(response){
        model.search = response.data;
      });

    angular
      .extend($scope, {
        model: model,
        boundsChanged: function() {
        },
        resetMap: function() {
          angular.extend(model.searchMap.options, model.searchMap.initOptions);
          angular.forEach(model.searchMap.selections, function(overlay, index) {
            overlay.setMap(null);
          });
          model.searchMap.selections.length = 0;
        },
        showResult: function(uri) {
          $window.alert('You clicked ' + uri);
        }
      });

  }
  
}());
