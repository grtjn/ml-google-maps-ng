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
      '$urlRouterProvider',
      '$stateProvider',
      mlGoogleMapsApp
    ]);

  function mlGoogleMapsApp($locationProvider, $urlRouterProvider, $stateProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

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
