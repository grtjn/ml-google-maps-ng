(function () {
  'use strict';

  angular.module('mlGoogleMapsDemo')
  
    .factory('HomeModel', [function () {
      return {
        map: {
          center: {
            latitude: 45,
            longitude: -73
          },
          zoom: 8
        }
      };
    }])
    
    .controller('mlGoogleMapsDemo.HomeCtrl', [
      '$scope',
      '$location',
      'HomeModel',
      HomeCtrl
    ]);
  
  function HomeCtrl($scope, $location, model) {

    angular.extend($scope, {
      model: model
    });

  }
  
}());
