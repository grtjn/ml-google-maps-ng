(function(){
  'use strict';
  
  angular
    .module('mlGoogleMapsDemo', [
      'ui.router',
      'ui.bootstrap',
      'uiGmapgoogle-maps',
      'mlGoogleMapsDemo.Tpls'
    ])
    
    .config([
      '$locationProvider',
      '$urlRouterProvider',
      '$stateProvider',
      App
    ]);

  function App($locationProvider, $urlRouterProvider, $stateProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        reloadOnSearch: false,
        controller: 'mlGoogleMapsDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/home.html',
        resolve: {
        }
      });
      
  }
})();
