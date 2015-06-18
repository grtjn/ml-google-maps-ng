(function () {
  'use strict';

  angular.module('mlGoogleMapsApp')
  
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
    
    .controller('HomeCtrl', [
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
