(function(){
  'use strict';
  
  angular
    .module('mlGoogleMapsDemoApp', [
      'ui.router',
      'ui.bootstrap',
      'uiGmapgoogle-maps',
      'mlGoogleMapsDemoTpls'
    ])
    
    .config([
      '$locationProvider',
      '$urlRouterProvider',
      '$stateProvider',
      mlGoogleMapsApp
    ]);

  function mlGoogleMapsDemoApp($locationProvider, $urlRouterProvider, $stateProvider) {

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
