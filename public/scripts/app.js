console.log('Sanity');

angular.module('twitch-up', ['ngRoute','ui.bootstrap']).config(config);

config.$inject = ['$routeProvider', '$locationProvider'];

function config ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/splash-page',
      controllerAs: 'rootCtrl',
      controller: 'RootController'
    }).when('/events/:id', {
      templateUrl: '/templates/event',
      controller: 'EventController',
      controllerAs: 'eventCtrl'
    });

    $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}
