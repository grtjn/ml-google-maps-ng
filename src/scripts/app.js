(function(){
  'use strict';
  
  angular
    .module('mlGoogleMapsApp', [
      'ui.router',
      'ui.bootstrap',
      'uiGmapgoogle-maps'
    ])
    
    .config([
      '$locationProvider',
      '$routeProvider',
      '$stateProvider',
      mlGoogleMapsApp
    ]);

  function mlGoogleMapsApp($locationProvider, $routeProvider, $stateProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $stateProvider
      .state('home', {
        url: '/',
        reloadOnSearch: false,
        controller: 'HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/home.html',
        resolve: {
        }
      });
      
  }
})();
