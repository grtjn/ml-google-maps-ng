(function(){
  'use strict';
  
  angular
    .module('mlGoogleMapsDemo', [
      'ui.router',
      'ui.bootstrap',
      'uiGmapgoogle-maps',
      'ml.google-maps',
      'hljs',
      'mlGoogleMapsDemo.Tpls'
    ])
    
    .config([
      '$locationProvider',
      '$urlRouterProvider',
      '$stateProvider',
      App
    ]);

  function App($locationProvider, $urlRouterProvider, $stateProvider) {

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'mlGoogleMapsDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/home.html',
        resolve: {
        }
      })
      .state('quickstart', {
        url: '/quickstart',
        controller: 'mlGoogleMapsDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/quickstart.html',
        resolve: {
        }
      })
    ;
      
  }
})();

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
      .success(function(response){
        model.search = response;
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
